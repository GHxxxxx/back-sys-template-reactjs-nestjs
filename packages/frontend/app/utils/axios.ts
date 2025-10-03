import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3456', // 默认后端地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token 并添加到请求头
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做处理
    return response.data;
  },
  (error) => {
    // 统一处理错误响应
    if (error.response?.status === 401) {
      // token 过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // 返回错误信息
    return Promise.reject({
      message: error.response?.data?.message || '请求失败',
      status: error.response?.status,
    });
  }
);

export default apiClient;
