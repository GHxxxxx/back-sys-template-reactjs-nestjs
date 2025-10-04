import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 添加 Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('医院挂号系统 API')
    .setDescription('医院挂号系统的 API 接口文档')
    .setVersion('1.0')
    .addTag('appointments', '挂号相关接口')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3456);
}
bootstrap();
