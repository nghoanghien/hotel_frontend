import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

let accessToken: string | null = null;
let isRefreshing = false;
let isRestoring = false;
let restorePromise: Promise<boolean> | null = null;
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

// Try to restore accessToken from refreshToken (for page refresh)
export const restoreAccessToken = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  
  // If already restoring, wait for the existing promise
  if (isRestoring && restorePromise) {
    console.log("[restoreAccessToken] Already restoring, waiting for existing promise...");
    return restorePromise;
  }
  
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;
  
  isRestoring = true;
  restorePromise = (async () => {
    try {
      const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
        `${process.env.NEXT_PUBLIC_API_URL || "/api"}/Auth/refresh-token`,
        { refreshToken },
        { withCredentials: true }
      );

      console.log("[restoreAccessToken] API response:", res.data);

      if (res.data.success && res.data.data.accessToken) {
        setAccessToken(res.data.data.accessToken);
        console.log("[restoreAccessToken] Set new accessToken");
        
        // Update refresh token if backend returns a new one (rotation)
        if (res.data.data.refreshToken) {
          localStorage.setItem("refresh_token", res.data.data.refreshToken);
          console.log("[restoreAccessToken] Updated refresh_token in localStorage");
        } else {
          console.warn("[restoreAccessToken] No new refreshToken returned - token may be one-time use!");
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to restore access token:", error);
      localStorage.removeItem("refresh_token");
      return false;
    } finally {
      isRestoring = false;
      restorePromise = null;
    }
  })();
  
  return restorePromise;
};

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
        // Get refreshToken from localStorage
        const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Send refreshToken in request body
        const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${process.env.NEXT_PUBLIC_API_URL || "/api"}/Auth/refresh-token`,
          { refreshToken }, // Send actual refresh token
          { withCredentials: true } // Keep for cookie support
        );

        if (res.data.success && res.data.data.accessToken) {
          const newToken = res.data.data.accessToken;
          setAccessToken(newToken);

          // Update refresh token if backend returns a new one
          if (res.data.data.refreshToken && typeof window !== "undefined") {
            localStorage.setItem("refresh_token", res.data.data.refreshToken);
          }

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
        // Clear refresh token on failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("refresh_token");
        }
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