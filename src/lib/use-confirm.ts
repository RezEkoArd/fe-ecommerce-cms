"use client";

import { useState } from "react";

export function useConfirm<T>() {
  const [target, setTarget] = useState<T | null>(null);

  return {
    target,
    isOpen: target !== null,
    ask: (item: T) => setTarget(item),
    close: () => setTarget(null),
    setOpen: (open: boolean) => {
      if (!open) setTarget(null);
    },
  };
}
