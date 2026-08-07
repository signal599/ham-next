"use client";

import { useState } from "react";
import { SearchQuery } from "@/lib/map-types";
import AddressAutocomplete from "./AddressAutocomplete";
import { formatGridSquare } from "@/lib/utils";

type TextInputType = "callsign" | "gridsquare" | "zipcode";
type InputType = TextInputType | "address";

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

// One entry per text input type, so a value typed for one type is kept while
// the user switches to another. point/address is not restored or retained.
function initialInputValues(
  query: SearchQuery | null,
): Record<TextInputType, string> {
  const values: Record<TextInputType, string> = {
    callsign: "",
    gridsquare: "",
    zipcode: "",
  };

  if (
    query &&
    (query.type === "callsign" ||
      query.type === "gridsquare" ||
      query.type === "zipcode")
  ) {
    values[query.type] = query.value;
  }

  return values;
}

export default function SearchForm({ initialQuery, onSearch }: Props) {
  const [inputType, setInputType] = useState<InputType>(
    initialInputType(initialQuery),
  );
  const [inputValues, setInputValues] = useState(
    initialInputValues(initialQuery),
  );
  const [error, setError] = useState<string | null>(null);

  const inputValue = inputType === "address" ? "" : inputValues[inputType];

  function handleInputChange(value: string) {
    if (inputType === "address") return;

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
          value = formatGridSquare(value)
        }
        break;

      case "zipcode":
        value = value.substring(0, 5).replace(/\D/g, '');
        break;
    }

    setInputValues((prev) => ({ ...prev, [inputType]: value }));
  }

  function handleTypeChange(type: InputType) {
    setInputType(type);
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
      className="flex flex-col gap-4 bg-white w-full max-w-md"
    >
      {/* Input type selector */}
      <fieldset>
        <legend className="text-sm font-medium text-gray-700 mb-2">
          Search by
        </legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {INPUT_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-1.5 py-2 cursor-pointer text-sm"
            >
              <input
                type="radio"
                name="inputType"
                value={value}
                checked={inputType === value}
                onChange={() => handleTypeChange(value)}
                className="w-4 h-4 accent-blue-600"
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
            className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2.5 sm:py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            inputMode={inputType === "zipcode" ? "numeric" : "text"}
            autoCapitalize={inputType === "callsign" ? "characters" : "off"}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-sm font-medium px-5 sm:px-4 py-2.5 sm:py-2 rounded transition-colors"
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
