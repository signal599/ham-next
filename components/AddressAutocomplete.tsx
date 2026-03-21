'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

interface Props {
  onPlaceSelect: (lat: number, lng: number) => void
}

export default function AddressAutocomplete({ onPlaceSelect }: Props) {
  const placesLib = useMapsLibrary('places')

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null)
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null)

  const [inputValue, setInputValue] = useState('')
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const attributionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!placesLib || !attributionRef.current) return
    setAutocompleteService(new placesLib.AutocompleteService())
    setPlacesService(new placesLib.PlacesService(attributionRef.current))
    setSessionToken(new placesLib.AutocompleteSessionToken())
  }, [placesLib])

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!autocompleteService || !sessionToken || input.length < 3) {
        setPredictions([])
        return
      }
      autocompleteService.getPlacePredictions(
        {
          input,
          sessionToken,
          componentRestrictions: { country: 'us' },
        },
        (results, status) => {
          if (status === placesLib?.PlacesServiceStatus.OK && results) {
            setPredictions(results)
          } else {
            setPredictions([])
          }
        }
      )
    },
    [autocompleteService, sessionToken, placesLib]
  )

  function handleInput(value: string) {
    setInputValue(value)
    setError(null)
    fetchPredictions(value)
    setShowSuggestions(true)
  }

  function handleSelect(prediction: google.maps.places.AutocompletePrediction) {
    if (!placesLib || !placesService || !sessionToken) return

    setInputValue(prediction.description)
    setPredictions([])
    setShowSuggestions(false)

    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['geometry'],
        sessionToken,
      },
      (place, status) => {
        if (
          status === placesLib.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          onPlaceSelect(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          )
          // Refresh session token using placesLib, not global google namespace
          setSessionToken(new placesLib.AutocompleteSessionToken())
        } else {
          setError('Could not get location for that address.')
        }
      }
    )
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={e => handleInput(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Enter a street address"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoCorrect="off"
        spellCheck={false}
      />

      {showSuggestions && predictions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
          {predictions.map(prediction => (
            <li
              key={prediction.place_id}
              onMouseDown={() => handleSelect(prediction)}
              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      <div ref={attributionRef} className="hidden" />
    </div>
  )
}
