"use client"

import { makeQueryClient } from "@/lib/query-client"
import { useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export function QueryProvider({children} : {children: React.ReactNode}) {
      // useState memastikan QueryClient dibuat sekali per komponen,
      // bukan tiap render. Jangan buat di luar komponen — di server,
      // instance itu akan dibagi antar request user yang berbeda.

    const [queryClient] = useState(makeQueryClient);

    return (

    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    )

}