
"use client"
import axios from 'axios';

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 将 token 获取移到函数中，避免在模块初始化时执行
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// 只在浏览器环境中设置默认 Authorization 头
if (typeof window !== 'undefined') {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
}


// 创建一个 Axios 实例  
const request: AxiosInstance = axios.create({




  baseURL: 'http://127.0.0.1:3456', // 设置你的 API 基础路径  
  timeout: 5000, // 设置请求超时时间  
  headers: {

    'Content-Type': 'application/json', // 设置默认请求头

  }

});





// 请求拦截器  
request.interceptors.request.use(

  (config: InternalAxiosRequestConfig) => {





    // 在发送请求之前做些什么  
    // 例如添加请求头、身份验证等  
    config.data = JSON.stringify(config.data);

    // 设置请求头，表明请求体是 JSON 格式

    config.headers['Content-Type'] = 'application/json';

    return config;

  },

  (error) => {



    // 对请求错误做些什么  
    return Promise.reject(error);

  }

);



// 响应拦截器  
request.interceptors.response.use(

  (response: AxiosResponse) => {



    // 对响应数据做点什么  
    return response;

  },







  (error: AxiosError) => {
    // 对响应错误做点什么  
    // 401 错误由路由守卫处理，不在这里跳转
    return Promise.reject(error);

  }

);

export default request;
