import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "../../api/auth"

export default function Login() {

  const handleSubmit =  ( username:string, password:string) => {
    login(username, password).then((res) => {
      console.log(res) 
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
        <form className="mt-8 space-y-6">
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
              onClick={() => handleSubmit("admin", "123456")}
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