"use client"

import React, { useEffect, useState } from 'react'

export function useDebounced<T>(value: T, delay = 350): T {
    const [debounced, setDebounced ] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Cleanup membatalkan timer lama tiap value berubah —
    // inilah yang membuat hanya ketikan terakhir yang lolos.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
