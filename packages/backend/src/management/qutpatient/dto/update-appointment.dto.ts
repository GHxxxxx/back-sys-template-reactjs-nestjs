import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TriageStatus, VisitStatus } from '../entities/appointment.entity';
import { IsEnum, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';


// export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  // 分诊相关字段
  @ApiPropertyOptional({ 
    description: '分诊状态', 
    enum: TriageStatus 
  })
  @IsEnum(TriageStatus)
  @IsOptional()
  triageStatus?: TriageStatus;

  @ApiPropertyOptional({ description: '诊室ID' })
  @IsNumber()
  @IsOptional()
  roomId?: number;

  @ApiPropertyOptional({ description: '优先级 (1-5)' })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: '分诊备注' })
  @IsString()
  @IsOptional()
  triageNotes?: string;

  // 就诊相关字段
  @ApiPropertyOptional({ 
    description: '就诊状态', 
    enum: VisitStatus 
  })
  @IsEnum(VisitStatus)
  @IsOptional()
  visitStatus?: VisitStatus;

  @ApiPropertyOptional({ description: '就诊开始时间' })
  @IsDateString()
  @IsOptional()
  visitStartTime?: string;

  @ApiPropertyOptional({ description: '就诊结束时间' })
  @IsDateString()
  @IsOptional()
  visitEndTime?: string;

  @ApiPropertyOptional({ description: '诊断结果' })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({ description: '处方' })
  @IsString()
  @IsOptional()
  prescription?: string;
}