"use client";

import { useCallback, useState } from "react";

const DEFAULT_MS = 320;

export function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

export function useFadeTransition(durationMs = DEFAULT_MS) {
  const [visible, setVisible] = useState(true);

  const run = useCallback(
    async (action: () => Promise<void> | void) => {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, durationMs));
      await action();
      scrollPageToTop();
      setVisible(true);
    },
    [durationMs]
  );

  return { visible, run };
}
