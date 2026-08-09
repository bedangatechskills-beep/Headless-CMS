import { useEffect, useState } from "react";
import { api } from "./api.js";

// Standardizes the fetch lifecycle every page needs:
//   data === null  → still loading
//   error !== ""   → something went wrong
export function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError("");
    api(path)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true; // ignore late responses after navigating away
    };
  }, [path]);

  return { data, error };
}