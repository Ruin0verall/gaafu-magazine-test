import { useState, useEffect } from "react";

interface UseApiOptions<T> {
  initialData?: T;
  maxRetries?: number;
  retryDelay?: number;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const { initialData, maxRetries = 3, retryDelay = 1000 } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
          setIsLoading(false);
          setRetryCount(0);
        }
      } catch (err) {
        console.error("API Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("An error occurred"));

          if (retryCount < maxRetries) {
            retryTimeout = setTimeout(() => {
              setRetryCount((prev) => prev + 1);
              fetchData();
            }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
          } else {
            setIsLoading(false);
          }
        }
      }
    };

    setIsLoading(true);
    fetchData();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [...dependencies]);

  return { data, isLoading, error, retryCount };
}

export default useApi;
