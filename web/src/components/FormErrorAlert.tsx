"use client";

import { useEffect, useRef } from "react";

type Props = {
  message: string | null;
};

export function FormErrorAlert({ message }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (message) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [message]);

  if (!message) return null;

  return (
    <p ref={ref} className="alert-error" role="alert">
      {message}
    </p>
  );
}
