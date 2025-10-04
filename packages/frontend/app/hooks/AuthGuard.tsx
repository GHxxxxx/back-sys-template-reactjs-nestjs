import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

// 检查是否有有效的 token
const isAuthenticated = () => {
  // 在服务端渲染环境中返回 false，避免访问浏览器 API
  if (typeof window === 'undefined') return false;
  // 从 localStorage 获取 access_token
  const token = localStorage.getItem('access_token');
  // 返回 token 是否存在
  return !!token;
};

// 路由守卫组件
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // 使用 useNavigate hook 进行编程式导航
  const navigate = useNavigate();
  // 使用 useLocation hook 获取当前路径信息
  const location = useLocation();

  useEffect(() => {
    // 允许访问的公共页面路径
    const publicPaths = ['/login', '/404'];
    
    // 如果没有认证且当前路径不是公共页面，则跳转到登录页面
    if (!isAuthenticated() && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [navigate, location]); // 依赖项：当 navigate 或 location 变化时重新执行

  // 直接返回子组件，不进行条件渲染
  return children;
};

export default AuthGuard;
