"use client";

import { useState } from "react";
import { SearchQuery } from "@/lib/map-types";
import AddressAutocomplete from "./AddressAutocomplete";

type InputType = "callsign" | "gridsquare" | "zipcode" | "address";

interface Props {
  initialQuery: SearchQuery | null;
  onSearch: (query: SearchQuery) => void;
}

const INPUT_TYPES: { value: InputType; label: string }[] = [
  { value: "callsign", label: "Callsign" },
  { value: "gridsquare", label: "Gridsquare" },
  { value: "zipcode", label: "Zip code" },
  { value: "address", label: "Street address" },
];

function initialInputType(query: SearchQuery | null): InputType {
  if (!query) return "callsign";
  if (query.type === "point") return "address";
  return query.type;
}

function initialInputValue(query: SearchQuery | null): string {
  if (!query) return "";
  if (query.type === "callsign") return query.value;
  if (query.type === "gridsquare") return query.value;
  if (query.type === "zipcode") return query.value;
  return ""; // point/address — don't try to restore
}

export default function SearchForm({ initialQuery, onSearch }: Props) {
  const [inputType, setInputType] = useState<InputType>(
    initialInputType(initialQuery),
  );
  const [inputValue, setInputValue] = useState(initialInputValue(initialQuery));
  const [error, setError] = useState<string | null>(null);

  function handleInputChange(value: string) {
    if (inputType === "callsign") {
      value = value
        .substring(0, 10)
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, "");
    }

    switch (inputType) {
      case "callsign":
        value = value
          .substring(0, 10)
          .toUpperCase()
          .replace(/[^0-9A-Z]/g, "");
        break;

      case "gridsquare":
        value = value
          .substring(0, 6)
          .toUpperCase()
          .replace(/[^0-9A-Z]/g, "");

        if (value.length > 4) {
          value = `${value.substring(0, 4)}${value.substring(4, 6).toLowerCase()}`;
        }
        break;

      case "zipcode":
        value = value.substring(0, 5).replace(/\D/g, '');
        break;
    }

    setInputValue(value);
  }

  function handleTypeChange(type: InputType) {
    setInputType(type);
    setInputValue("");
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = inputValue.trim();

    if (inputType === "address") {
      // Address is handled on suggestion select, not on submit
      setError("Please select an address from the suggestions.");
      return;
    }

    if (!value) {
      setError("Please enter a value.");
      return;
    }

    if (inputType === "callsign") {
      if (!/^[a-zA-Z0-9]{3,7}$/.test(value)) {
        setError("Enter a valid callsign.");
        return;
      }
      onSearch({ type: "callsign", value: value.toUpperCase() });
      return;
    }

    if (inputType === "gridsquare") {
      if (!/^[a-rA-R]{2}[0-9]{2}([a-xA-X]{2})?$/.test(value)) {
        setError("Enter a valid gridsquare.");
        return;
      }
      onSearch({ type: "gridsquare", value: value.toLowerCase() });
      return;
    }

    if (inputType === "zipcode") {
      if (!/^\d{5}$/.test(value)) {
        setError("Enter a valid 5-digit zip code.");
        return;
      }
      onSearch({ type: "zipcode", value });
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow w-full max-w-md"
    >
      {/* Input type selector */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">
          Search by
        </legend>
        <div className="flex flex-wrap gap-4">
          {INPUT_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-1.5 cursor-pointer text-sm"
            >
              <input
                type="radio"
                name="inputType"
                value={value}
                checked={inputType === value}
                onChange={() => handleTypeChange(value)}
                className="accent-blue-600"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Text inputs for callsign / gridsquare / zipcode */}
      {inputType !== "address" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              inputType === "callsign"
                ? "Enter a callsign"
                : inputType === "gridsquare"
                  ? "Enter a six character grid subsquare"
                  : "Enter a five digit zip code"
            }
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoCapitalize={inputType === "callsign" ? "characters" : "off"}
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            Go
          </button>
        </div>
      )}

      {/* Address autocomplete input */}
      {inputType === "address" && (
        <AddressAutocomplete
          onPlaceSelect={(lat, lng) => onSearch({ type: "point", lat, lng })}
        />
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
