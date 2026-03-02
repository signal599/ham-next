"use client";

import { useState, useId } from "react";

interface SearchFormProps {
  onSearch: (type: string, value: string) => void;
}

export default function MapForm({ onSearch }: SearchFormProps) {
  const [inputValue, setInputValue] = useState("");
  // Track the internal value ('c', 'g', etc.) for the logic,
  // but keep a label for the UI.
  const [selectedType, setSelectedType] = useState("c");

  const textId = useId();

  // Mapping for the UI labels based on selection
  const labels: Record<string, string> = {
    c: "Callsign",
    g: "Gridsquare",
    z: "Zip code",
    a: "Street address",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(selectedType, inputValue);
    }
  };

  const RadioItem = ({ label, value }: { label: string; value: string }) => {
    const id = useId();
    return (
      <div className="form-control">
        <label
          htmlFor={id}
          className="label cursor-pointer justify-start gap-3 py-1"
        >
          <input
            id={id}
            type="radio"
            name="query_type"
            value={value} // Your addition
            className="radio radio-primary radio-sm"
            checked={selectedType === value}
            onChange={() => {
              setSelectedType(value);
              setInputValue(""); // Optional: clear input when switching types
            }}
          />
          <span className="label-text text-base">{label}</span>
        </label>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 p-6 bg-base-100 rounded-xl border border-base-200"
    >
      {/* Left Column: Radio Options */}
      <div className="flex flex-col justify-start">
        <RadioItem label="Callsign" value="c" />
        <RadioItem label="Gridsquare" value="g" />
        <RadioItem label="Zip code" value="z" />
        <RadioItem label="Street address" value="a" />
      </div>

      {/* Right Column: Text Input and Submit */}
      <div className="flex flex-col gap-6">
        {/* The Input Stack */}
        <div className="form-control w-full max-w-lg">
          {/* 1. The Label */}
          <label htmlFor={textId} className="label py-1">
            <span className="label-text font-bold text-lg text-base-content">
              {labels[selectedType]}
            </span>
          </label>

          {/* 2. The Input */}
          <input
            id={textId}
            type="text"
            placeholder={`Enter ${labels[selectedType].toLowerCase()}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input input-bordered w-full focus:input-primary"
          />

          {/* 3. The Description (Span) */}
          <label className="label py-1">
            <span className="label-text-alt text-gray-500">
              Enter a {labels[selectedType].toLowerCase()}.
            </span>
          </label>
        </div>

        {/* 4. The Button (placed below the form-control) */}
        <button type="submit" className="btn btn-primary w-fit px-10">
          Show the map
        </button>
      </div>
    </form>
  );
}
