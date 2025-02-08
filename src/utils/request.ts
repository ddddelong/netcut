import axios from "axios";

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 通用错误处理函数
const handleError = (error: Error | AxiosError): never => {
  if (axios.isAxiosError(error)) {
    console.error("Request failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  } else {
    console.error("An error occurred:", error);
  }
  throw error;
};

// 通用请求包装函数
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error);
    }
    throw error;
  }
}

// 便捷方法
const http = {
  get: <T = any>(
    url: string,
    config?: Omit<AxiosRequestConfig, "url" | "method">,
  ) => request<T>({ ...config, method: "get", url }),

  post: <T = any>(
    url: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, "url" | "method" | "data">,
  ) => request<T>({ ...config, method: "post", url, data }),

  put: <T = any>(
    url: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, "url" | "method" | "data">,
  ) => request<T>({ ...config, method: "put", url, data }),

  delete: <T = any>(
    url: string,
    config?: Omit<AxiosRequestConfig, "url" | "method">,
  ) => request<T>({ ...config, method: "delete", url }),
};

export { http };
