import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as cors from 'cors';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.grard';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from './management/qutpatient/appointment.module'; //门诊管理模块

@Module({
  imports: [AuthModule, AppointmentModule, TypeOrmModule.forRoot({
    type: 'mysql', // 数据库类型
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'web',
    synchronize: true,
    retryDelay: 500, //重试连接数据库间隔
    retryAttempts: 10,//重试连接数据库的次数
    // entities: [Staticmsg],
    autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
  }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),


  ],
  controllers: [AppController],
  // 注册为全局守卫
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }],
})
// export class AppModule { }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const corsOptions = {
      origin: '*', // 允许所有来源访问，出于安全考虑，你可能希望限制这个值  
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    };

    consumer.apply(cors(corsOptions)).forRoutes('*'); // 对所有路由应用 CORS 中间件  
  }
}