"use client";

import { useEffect, useState } from "react";

/** Renders the current year on the client to keep prerendering deterministic. */
export default function CopyrightYear() {
  const [year, setYear] = useState<string>("2026");
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  return <>{year}</>;
}
