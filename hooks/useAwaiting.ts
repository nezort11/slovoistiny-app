import { useCallback, useState } from 'react';

export const useAwaiting = <T extends (...args: any[]) => any>(callback: T) => {
  const [isAwaiting, setIsAwaiting] = useState(false);

  const await_ = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      setIsAwaiting(true);
      try {
        return await callback(...args);
      } finally {
        setIsAwaiting(false);
      }
    },
    [callback],
  );

  const useAwaitingResult: [typeof await_, typeof isAwaiting] & {
    await: typeof await_;
    isAwaiting: typeof isAwaiting;
  } = [await_, isAwaiting] as any;
  useAwaitingResult.await = await_;
  useAwaitingResult.isAwaiting = isAwaiting;
  return useAwaitingResult;
}; 
