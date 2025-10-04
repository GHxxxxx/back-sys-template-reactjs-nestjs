// API 基础配置
import request from '../../utils/axios';
import type { AxiosResponse } from 'axios';

// 挂号相关API
export const appointmentApi = {
  // 获取挂号列表（支持分页和搜索）
  getAppointments: async (params?: { 
    page?: number; 
    pageSize?: number; 
    search?: string;
  }) => {
    const response: AxiosResponse<ApiResponse<Appointment[]>> = await request.get('/appointments', { params });
    return response.data;
  },
  
  // 创建挂号
  createAppointment: async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.post('/appointments', data);
    return response.data;
  },
  
  // 获取单个挂号详情
  getAppointment: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.get(`/appointments/${id}`);
    return response.data;
  },
  
  // 添加：根据ID获取单个挂号详情
  getAppointmentById: async (id: number) => {
    const response: AxiosResponse<Appointment> = await request.get(`/appointments/${id}`);
    return response.data;
  },
  
  // 更新挂号
  updateAppointment: async (id: number, data: Partial<Appointment>) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}`, data);
    return response.data;
  },
  
  // 删除挂号
  deleteAppointment: async (id: number) => {
    const response: AxiosResponse<ApiResponse<null>> = await request.delete(`/appointments/${id}`);
    return response.data;
  },
  
  // 根据身份证号查询挂号
  getAppointmentsByPatientIdCard: async (idCard: string) => {
    const response: AxiosResponse<ApiResponse<Appointment[]>> = await request.get(`/appointments/patient/${idCard}`);
    return response.data;
  },
  
  // 确认挂号
  confirmAppointment: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/confirm`);
    return response.data;
  },
  
  // 取消挂号
  cancelAppointment: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/cancel`);
    return response.data;
  },
  
  // 开始分诊
  startTriage: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/start-triage`);
    return response.data;
  },
  
  // 完成分诊
  completeTriage: async (id: number, data: Partial<Appointment>) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/complete-triage`, data);
    return response.data;
  },
  
  // 跳过分诊
  skipTriage: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/skip-triage`);
    return response.data;
  },
  
  // 开始就诊
  startVisit: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/start-visit`);
    return response.data;
  },
  
  // 完成就诊
  completeVisit: async (id: number, data: Partial<Appointment>) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/complete-visit`, data);
    return response.data;
  },
  
  // 标记为错过就诊
  missVisit: async (id: number) => {
    const response: AxiosResponse<ApiResponse<Appointment>> = await request.patch(`/appointments/${id}/miss-visit`);
    return response.data;
  },
};

// 统一响应格式
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

// 挂号类型定义
export type Appointment = {
  id: number;
  patientName: string;
  patientIdCard: string;
  doctorId: number;
  departmentId: number;
  appointmentTime: string;
  phone: string;
  description: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  triageStatus: 'pending' | 'in_progress' | 'completed' | 'skipped';
  visitStatus: 'pending' | 'in_progress' | 'completed' | 'missed';
  roomId: number | null;
  priority: number | null;
  triageNotes: string | null;
  visitStartTime: string | null;
  visitEndTime: string | null;
  diagnosis: string | null;
  prescription: string | null;
  createdAt: string;
  updatedAt: string;
};