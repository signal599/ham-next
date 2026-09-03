'use client'

import { useState, useEffect, useCallback, useId, useRef } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { MathLib, roundPoint } from '@/lib/utils'
import { LatLng } from '@/lib/map-types'

interface Props {
  onPlaceSelect: (lat: number, lng: number) => void
}

// Every keystroke used to cost an autocomplete request. Last month that was
// 5,578 requests for 576 addresses actually chosen, so both of these exist to
// keep the Places API bill down rather than to change what the user sees.

// Long enough to swallow a burst of typing, short enough that the list still
// feels like it is keeping up.
const DEBOUNCE_MS = 350

// Three characters can't pick out a street address, and more than half of all
// sessions are abandoned before a suggestion is chosen — those give up around
// the third or fourth character, having already spent a request or two.
const MIN_INPUT_LENGTH = 5

export default function AddressAutocomplete({ onPlaceSelect }: Props) {
  const placesLib = useMapsLibrary('places')

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null)
  const [predictions, setPredictions] =
    useState<google.maps.places.PlacePrediction[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Index of the option the keyboard is on, or -1 for none. Drives
  // aria-activedescendant rather than real focus, which stays in the input.
  const [activeIndex, setActiveIndex] = useState(-1)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Bumped for every request started or cancelled, so a slow reply can be
  // recognised as stale and dropped instead of replacing newer predictions.
  const requestSeq = useRef(0)

  const inputId = useId()
  const listId = useId()
  const optionId = (i: number) => `${listId}-option-${i}`

  const isOpen = showSuggestions && predictions.length > 0

  // Initialize session token once places library is ready
  useEffect(() => {
    if (!placesLib) return
    setSessionToken(new placesLib.AutocompleteSessionToken())
  }, [placesLib])

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (!placesLib || !sessionToken || input.length < MIN_INPUT_LENGTH) {
        setPredictions([])
        return
      }

      const seq = ++requestSeq.current

      const request: google.maps.places.AutocompleteRequest = {
        input,
        sessionToken,
        includedRegionCodes: ['us'],
        // Only the kinds of result this map can center on. Narrowing them means
        // a usable suggestion appears sooner, so there is less to type.
        includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
      }

      try {
        const { suggestions } =
          await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

        if (seq !== requestSeq.current) return

        setPredictions(
          suggestions
            .map(s => s.placePrediction)
            .filter((p): p is google.maps.places.PlacePrediction => p !== null)
        )
      } catch {
        if (seq !== requestSeq.current) return
        // Deliberately silent: the user is still mid-word, and an alert for a
        // lookup they haven't finished asking for would only be in the way.
        // A failure to geocode the address they do pick is reported below.
        setPredictions([])
      }
    },
    [placesLib, sessionToken]
  )

  const cancelPendingFetch = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = null
    // Also disowns any request already in flight.
    requestSeq.current++
  }, [])

  // A pending request outliving the component would settle against a token
  // that no longer belongs to anything.
  useEffect(() => cancelPendingFetch, [cancelPendingFetch])

  function handleInput(value: string) {
    setInputValue(value)
    setError(null)
    setShowSuggestions(true)
    setActiveIndex(-1)

    cancelPendingFetch()

    // Nothing to wait for below the threshold — clear the list now rather than
    // leaving stale suggestions under a shortened input.
    if (value.length < MIN_INPUT_LENGTH) {
      setPredictions([])
      return
    }

    debounceTimer.current = setTimeout(() => fetchPredictions(value), DEBOUNCE_MS)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }

    // The Go button isn't rendered for an address search, so the form has no
    // submit button and the browser won't submit it implicitly. Enter has to be
    // handled here or it does nothing at all.
    if (e.key === 'Enter') {
      e.preventDefault()

      if (isOpen && activeIndex >= 0) {
        handleSelect(predictions[activeIndex])
      } else {
        setError('Select an address from the list of suggestions.')
      }
      return
    }

    if (!isOpen) {
      if (e.key === 'ArrowDown' && predictions.length > 0) {
        e.preventDefault()
        setShowSuggestions(true)
        setActiveIndex(0)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => (i + 1) % predictions.length)
        break

      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => (i <= 0 ? predictions.length - 1 : i - 1))
        break

      case 'Tab':
        setShowSuggestions(false)
        break
    }
  }

  async function handleSelect(prediction: google.maps.places.PlacePrediction) {
    if (!placesLib) return

    // The search is over. A queued request would not only be wasted, it would
    // run against the replacement session token below and open a session that
    // never completes.
    cancelPendingFetch()

    setInputValue(prediction.text.toString())
    setPredictions([])
    setShowSuggestions(false)
    setActiveIndex(-1)

    try {
      const place = prediction.toPlace()
      await place.fetchFields({ fields: ['location'] })

      if (place.location) {
        const point: LatLng = roundPoint({lat: place.location.lat(), lng: place.location.lng()})
        onPlaceSelect(point.lat, point.lng);
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
      <label htmlFor={inputId} className="sr-only">
        Enter a street address
      </label>
      <input
        id={inputId}
        type="text"
        value={inputValue}
        onChange={e => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Enter a street address"
        className="w-full border border-gray-300 rounded px-3 py-2.5 sm:py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto"
        >
          {predictions.map((prediction, i) => (
            <li
              key={i}
              id={optionId(i)}
              role="option"
              aria-selected={i === activeIndex}
              // Suppress the default mousedown so the input keeps focus and the
              // blur handler doesn't close the list before the click lands.
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSelect(prediction)}
              className={`px-3 py-3 sm:py-2 text-base sm:text-sm cursor-pointer ${
                i === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
              }`}
            >
              {prediction.text.toString()}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
