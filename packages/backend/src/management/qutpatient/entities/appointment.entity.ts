import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 添加预约状态枚举
export enum AppointmentStatus {
  PENDING = 'pending', // 预约状态：待确认
  CONFIRMED = 'confirmed', // 预约状态：已确认
  CANCELLED = 'cancelled', // 预约状态：已取消
}

// 添加分诊状态枚举
export enum TriageStatus {
  PENDING = 'pending',        // 待分诊
  IN_PROGRESS = 'in_progress', // 分诊中
  COMPLETED = 'completed',    // 分诊完成
  SKIPPED = 'skipped',        // 跳过分诊
}

// 添加就诊状态枚举
export enum VisitStatus {
  PENDING = 'pending',        // 待就诊
  IN_PROGRESS = 'in_progress', // 就诊中
  COMPLETED = 'completed',    // 就诊完成
  MISSED = 'missed',          // 错过就诊
}


@Entity('appointments')
export class Appointment {

  @PrimaryGeneratedColumn()
  id: number;// 预约ID

  
  @Column()
  patientName: string; // 预约病人姓名

  @Column()
  patientIdCard: string; // 预约病人身份证号

  @Column()
  doctorId: number;  // 预约医生ID

  @Column()
  departmentId: number; // 预约科室ID

  @Column({ type: 'datetime' })
  appointmentTime: Date; // 预约时间

  @Column({ type: 'varchar', length: 20 })
  phone: string; // 预约病人电话

  @Column({ type: 'text', nullable: true })
  description: string; // 预约描述

  @Column({ 
    type: 'enum',
     enum: AppointmentStatus,
    default: AppointmentStatus.PENDING
 })
  status: AppointmentStatus; // 预约状态

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // 预约创建时间

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;// 预约更新时间


  // 添加分诊相关字段
  @Column({ 
    type: 'enum', 
    enum: TriageStatus, 
    default: TriageStatus.PENDING 
  })
  triageStatus: TriageStatus;

  @Column({ type: 'int', nullable: true })
  roomId: number; // 诊室ID

  @Column({ type: 'int', nullable: true })
  priority: number; // 优先级 (1-最高, 5-最低)

  @Column({ type: 'text', nullable: true })
  triageNotes: string; // 分诊备注

  // 添加就诊相关字段
  @Column({ 
    type: 'enum', 
    enum: VisitStatus, 
    default: VisitStatus.PENDING 
  })
  visitStatus: VisitStatus;

  @Column({ type: 'datetime', nullable: true })
  visitStartTime: Date; // 就诊开始时间

  @Column({ type: 'datetime', nullable: true })
  visitEndTime: Date; // 就诊结束时间

  @Column({ type: 'text', nullable: true })
  diagnosis: string; // 诊断结果

  @Column({ type: 'text', nullable: true })
  prescription: string; // 处方 


  
}