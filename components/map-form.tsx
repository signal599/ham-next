"use client";
import { useRouter } from "next/navigation";
import { useState, useId } from "react";

interface MapFormProps {
  initialType: string;
  initialQuery: string;
}

export default function MapForm({ initialType, initialQuery }: MapFormProps) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const textId = useId();

  // Mapping for the UI labels based on selection
  const labels: Record<string, string> = {
    c: "Callsign",
    g: "Gridsquare",
    z: "Zip code",
    a: "Street address",
  };

  const router = useRouter();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get("query_type");
    const q = formData.get("query");

    if (type === 'c') {
      router.push(`/map/${q}`);
    }
    else {
      router.push(`/map/${type}/${q}`);
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
              console.log(value);
              setSelectedType(value);
              setInputValue("");
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
      <div className="flex flex-col justify-start">
        <RadioItem label="Callsign" value="c" />
        <RadioItem label="Gridsquare" value="g" />
        <RadioItem label="Zip code" value="z" />
        <RadioItem label="Street address" value="a" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="form-control w-full max-w-lg">
          <label htmlFor={textId} className="label py-1">
            <span className="label-text font-bold text-lg text-base-content">
              {labels[selectedType]}
            </span>
          </label>

          <input
            id={textId}
            name="query"
            type="text"
            placeholder={`Enter ${labels[selectedType]}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input input-bordered w-full focus:input-primary"
          />
        </div>

        <button type="submit" className="btn btn-primary w-fit px-10">
          Show the map
        </button>
      </div>
    </form>
  );
}
