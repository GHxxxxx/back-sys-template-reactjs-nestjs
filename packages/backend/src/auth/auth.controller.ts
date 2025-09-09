import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from 'src/common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  // 注册
  @Public()
  @Post("/signup")
  // @Public()
  signup(@Body() signupData: CreateAuthDto) {
    return this.authService.signup(signupData)
  }

  // 登录
  @Public()
  @Post("/login")
  login(@Body() loginData: CreateAuthDto) {
    return this.authService.login(loginData)
  }

  
}

  
