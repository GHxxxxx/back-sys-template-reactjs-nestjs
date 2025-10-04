import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 定义用户信息类型
export interface UserInfo {
  id?: number
  name?: string
  email?: string
  avatar?: string
  username?: string
  access_token?: string
}

// 定义用户状态类型
interface UserState {
  userInfo: UserInfo | null
  isAuthenticated: boolean
}

// 定义用户操作类型
interface UserActions {
  setUserInfo: (userInfo: UserInfo) => void
  clearUserInfo: () => void
  logout: () => void
}

// 创建状态存储
const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      // 初始状态
      userInfo: null,
      isAuthenticated: false,
      
      // 操作函数
      setUserInfo: (userInfo) => set({ 
        userInfo, 
        isAuthenticated: !!userInfo?.access_token 
      }),
      clearUserInfo: () => set({ 
        userInfo: null, 
        isAuthenticated: false 
      }),
      logout: () => {
        // 清除本地存储
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user_info')
        }
        set({ 
          userInfo: null, 
          isAuthenticated: false 
        })
      }
    }),
    {
      name: 'user-storage', // localStorage 中的键名
    }
  )
)

// 组合式导出 - 分离状态和操作
export const useUserState = () => useUserStore((state) => ({
  userInfo: state.userInfo,
  isAuthenticated: state.isAuthenticated
}))

export const useUserActions = () => useUserStore((state) => ({
  setUserInfo: state.setUserInfo,
  clearUserInfo: state.clearUserInfo,
  logout: state.logout
}))

// 也可以按需导出单个状态和操作
export const useUserInfo = () => useUserStore((state) => state.userInfo)
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated)
export const useSetUserInfo = () => useUserStore((state) => state.setUserInfo)
export const useLogout = () => useUserStore((state) => state.logout)

export default useUserStore