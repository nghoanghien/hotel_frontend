import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = "Bearer " + token;
            }
            return http(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // IMPORTANT: This Frontend implementation relies on the Backend supporting HttpOnly Cookies for Refresh Tokens.
        // If the Backend does not support this (i.e., returns refreshToken only in the JSON body), you must:
        // 1. Modify `useLogin` to store the refreshToken in `localStorage`.
        // 2. Modify this interceptor to retrieve `localStorage.getItem('refresh_token')` and send it in the request body below.

        // Backend expects RefreshToken in body if not in cookie, but we prefer cookie.
        // We send empty object or simplified DTO to trigger the prioritized Cookie check we added.
        const res = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${process.env.NEXT_PUBLIC_API_URL || "/api"}/auth/refresh-token`,
          { refreshToken: "" }, // Send empty to force cookie check
          { withCredentials: true } // Crucial for sending the HttpOnly cookie
        );

        if (res.data.success && res.data.data.accessToken) {
          const newToken = res.data.data.accessToken;
          setAccessToken(newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          return http(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        // Optional: Redirect to login or let the app handle the failure
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Extract error message from backend response if available
    if (error.response?.data && (error.response.data as any).message) {
      error.message = (error.response.data as any).message;
    }

    return Promise.reject(error);
  }
);