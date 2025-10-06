import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalisedController } from './hospitalised.controller';
import { HospitalisedService } from './hospitalised.service';
import { Hospitalised } from './entities/hospitalised.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospitalised])],
  controllers: [HospitalisedController],
  providers: [HospitalisedService],
  exports: [HospitalisedService], // 如果需要被其他模块使用
})
export class HospitalisedModule {}