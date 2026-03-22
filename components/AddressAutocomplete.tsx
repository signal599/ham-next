'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

interface Props {
  onPlaceSelect: (lat: number, lng: number) => void
}

export default function AddressAutocomplete({ onPlaceSelect }: Props) {
  const placesLib = useMapsLibrary('places')

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null)
  const [predictions, setPredictions] =
    useState<google.maps.places.PlacePrediction[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize session token once places library is ready
  useEffect(() => {
    if (!placesLib) return
    setSessionToken(new placesLib.AutocompleteSessionToken())
  }, [placesLib])

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (!placesLib || !sessionToken || input.length < 3) {
        setPredictions([])
        return
      }
      const request: google.maps.places.AutocompleteRequest = {
        input,
        sessionToken,
        includedRegionCodes: ['us'],
      }
      const { suggestions } =
        await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      setPredictions(
        suggestions
          .map(s => s.placePrediction)
          .filter((p): p is google.maps.places.PlacePrediction => p !== null)
      )
    },
    [placesLib, sessionToken]
  )

  function handleInput(value: string) {
    setInputValue(value)
    setError(null)
    setShowSuggestions(true)
    fetchPredictions(value)
  }

  async function handleSelect(prediction: google.maps.places.PlacePrediction) {
    if (!placesLib) return

    setInputValue(prediction.text.toString())
    setPredictions([])
    setShowSuggestions(false)

    try {
      const place = prediction.toPlace()
      await place.fetchFields({ fields: ['location'] })

      if (place.location) {
        onPlaceSelect(place.location.lat(), place.location.lng())
        // Refresh session token after completed selection
        setSessionToken(new placesLib.AutocompleteSessionToken())
      } else {
        setError('Could not get location for that address.')
      }
    } catch {
      setError('Address lookup failed. Please try again.')
    }
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
          {predictions.map((prediction, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(prediction)}
              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
            >
              {prediction.text.toString()}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}
