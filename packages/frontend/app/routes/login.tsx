import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { login } from "../../api/auth";
import { toast } from "sonner"
import { useNavigate } from "react-router";
export default function Login() {
  const navigate = useNavigate();
  const handleSubmit =  ( event: React.FormEvent) => {
    event.preventDefault();

    // 获取表单数据
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    login(username, password).then((res) => {
      if (res.data.code === 200) {
         toast.success('登录成功');
        if (typeof window !== 'undefined' && res.data.data?.access_token) {
          // 存储token
          localStorage.setItem('access_token', res.data.data?.access_token);
          // 存储用户信息
          localStorage.setItem('user_info', JSON.stringify(res.data.data));
          // 跳转到首页
          navigate('/');
        }
      }else{
        toast.error('登录失败');
      } 
    })
  }


  return (
    <div className="min-h-screen flex items-center justify-center dark-bg" >
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">登录</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            请输入您的账号和密码
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                账号
              </Label>
              <Input
                id="email"
                name="email"
                required
                className="mt-1"
                placeholder="请输入您的账号"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密码
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                placeholder="请输入您的密码"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
          </div>

          <div>
            <Button
              type="submit"
              className="
              hover:cursor-pointer
              w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              登录
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}