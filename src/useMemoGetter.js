import { useRef, useCallback } from "react";

export default function useMemoGetter(getter) {
  const memoMap = useRef({});

  return useCallback(
    (key, ...params) => {
      let memo = memoMap.current[key];
      if (!memo) {
        memo = getter(key, ...params);
      }
      memoMap.current[key] = memo;
      return memo;
    },
    [getter]
  );
}
