"use client";

import MapForm from "@/components/map-form";

export default function Page() {
  function handleSubmit() {}

  return (
    <>
      <h1>Amateur Radio License Map</h1>
      <MapForm onSearch={handleSubmit} />
    </>
  );
}
