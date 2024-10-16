import { useCallback, useState } from "react";

export const useIsAwaiting = <T extends (...args: any[]) => any>(
  callback: T
) => {
  const [isAwaiting, setIsAwaiting] = useState(false);

  const wait = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      setIsAwaiting(true);
      try {
        return await callback(...args);
      } finally {
        setIsAwaiting(false);
      }
    },
    []
  );

  return { wait, isAwaiting };
};
