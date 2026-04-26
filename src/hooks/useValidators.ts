import { useEffect, useState } from "react";
import { Validator } from "@/src/lib/validators";

const REFRESH_INTERVAL = 10_000;

export function useValidators(initialData: Validator[] = []) {
  const [data, setData] = useState<Validator[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchValidators = async () => {
      try {
        const response = await fetch("/api/validators", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        if (!isActive) return;

        setData(Array.isArray(json) ? json : []);
        setError(null);
      } catch (err) {
        if (!isActive) return;

        setError("Failed to fetch validators");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchValidators();

    const intervalId = setInterval(fetchValidators, REFRESH_INTERVAL);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, []);

  return { data, loading, error };
}