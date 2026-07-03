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

    if (s && z) return "Specify either State or Zip, not both.";
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

          <div className="form-control">
            <label className="label" htmlFor="state">
              <span className="label-text">State</span>
              <span className="label-text-alt text-base-content/50">Optional</span>
            </label>
            <input
              id="state"
              type="text"
              className="input input-bordered w-32 uppercase"
              value={state}
              onChange={(e) => { setState(e.target.value); setZip(""); }}
              placeholder="e.g. NH"
              maxLength={2}
            />
            {stateIsWhole && (
              <p className="text-warning text-sm mt-1">
                ** will export the entire country. Make sure this is intentional.
              </p>
            )}
            <p className="text-xs text-base-content/50 mt-1">
              Two-letter abbreviation, or <strong>**</strong> to export the whole country.
            </p>
          </div>

          <div className="divider my-0 text-xs text-base-content/40">or</div>

          <div className="form-control">
            <label className="label" htmlFor="zip">
              <span className="label-text">Zip Code</span>
              <span className="label-text-alt text-base-content/50">Optional</span>
            </label>
            <input
              id="zip"
              type="text"
              className="input input-bordered w-36"
              value={zip}
              onChange={(e) => { setZip(e.target.value); setState(""); }}
              placeholder="e.g. 03086"
              maxLength={5}
              inputMode="numeric"
            />
          </div>

          <div className="divider my-0" />

          <div className="flex gap-6">
            <div className="form-control">
              <label className="label" htmlFor="delimiter">
                <span className="label-text">Delimiter</span>
              </label>
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

            <div className="form-control">
              <label className="label" htmlFor="enclosure">
                <span className="label-text">Enclosure</span>
              </label>
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
