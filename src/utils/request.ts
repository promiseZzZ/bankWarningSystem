import axios from "axios";
import { useUserStore } from "../store/user";
import type {AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"; // 明确导入类型

// 创建axios实例
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 50000
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => { // 使用内部配置类型
      const userStore = useUserStore();
      if (userStore.token) {
        // 类型安全的 headers 处理
        config.headers = config.headers || {};
        config.headers.Authorization = userStore.token; // 推荐携带 Bearer 前缀
      }
      return config;
    },
    (err: AxiosError) => Promise.reject(err)
  );

// 响应拦截器（示例）
axiosInstance.interceptors.response.use(
  (response) => response,
  (err: AxiosError) => {
    // 这里可以处理 401 等认证错误
    return Promise.reject(err);
  }
);