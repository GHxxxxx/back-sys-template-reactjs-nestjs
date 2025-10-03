import  request from '../utils/axios';

export const login = (username: string, password: string) => {
  return request.post('/auth/login', { username, password });

}
