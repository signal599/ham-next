"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    params.get("error") === "invalid"
      ? "That login link is invalid or has expired. Please request a new one."
      : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Check your email</h2>
          <p className="text-sm">
            We sent a login link to <strong>{email}</strong>.<br />
            It expires in 15 minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-sm">
      <div className="card-body">
        <h2 className="card-title">Sign in</h2>
        <p className="text-sm">Enter your email and we&rsquo;ll send you a magic link.</p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email address</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
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
              "Send login link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
