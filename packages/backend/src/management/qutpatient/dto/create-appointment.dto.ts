import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { TriageStatus, VisitStatus } from '../entities/appointment.entity';
// 添加 Swagger 相关注入
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: '患者姓名', example: '张三' })
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiProperty({ description: '患者身份证号', example: '110101199001011234' })
  @IsString()
  @IsNotEmpty()
  patientIdCard: string;

  @ApiProperty({ description: '医生ID', example: 1 })
  @IsNumber()
  doctorId: number;

  @ApiProperty({ description: '科室ID', example: 1 })
  @IsNumber()
  departmentId: number;

  @ApiProperty({ description: '预约时间', example: '2025-10-05T09:00:00Z' })
  @IsDateString()
  appointmentTime: string;

  @ApiProperty({ description: '联系电话', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: '病情描述', example: '头疼发热' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: '挂号状态', 
    enum: AppointmentStatus, 
    example: AppointmentStatus.PENDING 
  })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  // 添加分诊相关字段
  @ApiPropertyOptional({ 
    description: '分诊状态', 
    enum: TriageStatus, 
    example: TriageStatus.PENDING 
  })
  @IsEnum(TriageStatus)
  @IsOptional()
  triageStatus?: TriageStatus;

  @ApiPropertyOptional({ description: '诊室ID', example: 1 })
  @IsNumber()
  @IsOptional()
  roomId?: number;

  @ApiPropertyOptional({ description: '优先级 (1-5)', example: 3 })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ description: '分诊备注', example: '患者症状较重，需要优先处理' })
  @IsString()
  @IsOptional()
  triageNotes?: string;

  // 添加就诊相关字段
  @ApiPropertyOptional({ 
    description: '就诊状态', 
    enum: VisitStatus, 
    example: VisitStatus.PENDING 
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