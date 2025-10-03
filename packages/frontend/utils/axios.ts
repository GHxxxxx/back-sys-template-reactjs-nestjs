import axios from 'axios';

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// 创建一个 Axios 实例  

const request: AxiosInstance = axios.create({

  baseURL: 'http://127.0.0.1:3456', // 设置你的 API 基础路径  

  timeout: 5000, // 设置请求超时时间  

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

  (error) => {

    // 对响应错误做点什么  

    // 例如，如果需要的话，可以统一处理错误

    return Promise.reject(error);

  }

);

export default request;
