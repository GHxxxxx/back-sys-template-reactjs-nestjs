import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "./constants"
import { JwtAuthStrategy } from "./jwt-auth.strategy"


@Module({
  imports: [TypeOrmModule.forFeature([user]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn }
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy]
})
export class AuthModule { }
