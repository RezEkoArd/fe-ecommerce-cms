import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth";

type ApiEnvelope<T> = {
    code: number;
    message: string;
    data?: T;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean};

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
    queue.forEach((cb => cb(token)));
    queue = [];
}

const refreshClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
    withCredentials: true,
})

async function requestNewToken() {
    const res = 
        await refreshClient.post<ApiEnvelope<{ access_token: string }>>(
      "/auth/refresh",
    );
    const token = res.data.data?.access_token;
    if (!token) {
        throw new Error("Refresh tidak mengembalikan access_token");
    }
    return token
}

// Endpoint auth punya makna 401 sendiri, jadi dikecualikan dari auto-refresh.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

function isAuthEndpoint(url: string | undefined) {
  return !!url && AUTH_ENDPOINTS.some((path) => url.includes(path));
}

// --- Response: unwrap envelope + auto-refresh saat 401 ---

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    // Kembalikan isi `data` saja supaya tipe di seluruh app bersih.
    return response.data?.data as never;
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const original = error.config as RetriableConfig | undefined;

    // Bukan 401, tidak ada config, atau sudah pernah di-retry → teruskan errornya.
    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    // Endpoint auth tidak boleh memicu refresh.
    // 401 di /auth/login artinya kredensial salah — bukan sesi kedaluwarsa.
    // 401 di /auth/refresh artinya sesi memang habis.
    if (isAuthEndpoint(original.url)) {
      return Promise.reject(error);
    }

    // Sudah ada refresh berjalan → antre, jangan tembak ulang.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) =>
          token ? resolve(apiClient(original)) : reject(error),
        );
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const token = await requestNewToken();
      setAccessToken(token);
      flushQueue(token);
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(null);
      clearAccessToken();
      // Redirect ditangani pemanggil (hook/komponen) lewat router Next,
      // bukan window.location — supaya tidak me-reload seluruh aplikasi.
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Ambil pesan error yang aman ditampilkan ke user.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as ApiEnvelope<unknown> | undefined)
      ?.message;
    if (message) return message;
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}
