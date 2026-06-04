"use client";

import { useCallback, useState } from "react";

const DEFAULT_MS = 320;

export function useFadeTransition(durationMs = DEFAULT_MS) {
  const [visible, setVisible] = useState(true);

  const run = useCallback(
    async (action: () => Promise<void> | void) => {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, durationMs));
      await action();
      setVisible(true);
    },
    [durationMs]
  );

  return { visible, run };
}
