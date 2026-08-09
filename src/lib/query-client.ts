import { QueryClient } from "@tanstack/react-query";


export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: (failureCount, error) => {
                const status = (error as { response?: { status?: number } })?.response
                    ?.status;
                if (status && status >= 400 && status < 500) return false;
                return failureCount < 2;
                },
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
            },
        },
    });
}