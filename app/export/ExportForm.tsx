"use client";

import { useState } from "react";

export default function ExportForm() {
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [enclosure, setEnclosure] = useState('"');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const stateIsWhole = state.trim().toUpperCase() === "**";

  function validate(): string | null {
    const s = state.trim().toUpperCase();
    const z = zip.trim();

    if (s && z) return "Specify either State or Zip but not both.";
    if (!s && !z) return "Either State or Zip is required.";
    if (s && !/^([A-Z]{2}|\*\*)$/.test(s)) return "State must be a two-letter abbreviation (e.g. NH) or ** for the whole country.";
    if (z && !/^\d{5}$/.test(z)) return "Zip must be exactly 5 digits.";
    if (!delimiter || delimiter.length !== 1) return "Delimiter must be a single character.";
    if (!enclosure || enclosure.length !== 1) return "Enclosure must be a single character.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: state.trim().toUpperCase() || null,
          zip: zip.trim() || null,
          delimiter,
          enclosure,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Request queued</h2>
          <p>
            Your export request has been queued. Check your email in the next
            30 minutes or so for a download link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label htmlFor="state" className="text-sm font-medium">State</label>
            <input
              id="state"
              type="text"
              className="input input-bordered w-32 uppercase"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. NH"
              maxLength={2}
            />
            {stateIsWhole && (
              <p className="text-warning text-sm">
                ** will export the entire country. Make sure this is intentional.
              </p>
            )}
            <p className="text-xs text-base-content/50">
              Two-letter abbreviation, or <strong>**</strong> to export the whole country.
            </p>
          </div>

          <p className="text-sm text-base-content/60">
            Enter either a state or zip code, but not both.
          </p>

          <div className="flex flex-col gap-1">
            <label htmlFor="zip" className="text-sm font-medium">Zip Code</label>
            <input
              id="zip"
              type="text"
              className="input input-bordered w-36"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 03086"
              maxLength={5}
              inputMode="numeric"
            />
            <p className="text-xs text-base-content/50">Five digit zip code.</p>
          </div>

          <div className="divider my-0" />

          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="delimiter" className="text-sm font-medium">Delimiter</label>
              <input
                id="delimiter"
                type="text"
                className="input input-bordered w-20"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value.slice(-1))}
                maxLength={1}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="enclosure" className="text-sm font-medium">Enclosure</label>
              <input
                id="enclosure"
                type="text"
                className="input input-bordered w-20"
                value={enclosure}
                onChange={(e) => setEnclosure(e.target.value.slice(-1))}
                maxLength={1}
                required
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="alert alert-error text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Request export"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
