// 导入nestjs核心模块和typeorm相关模块
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

// 导入实体类和DTO类
import { Appointment, AppointmentStatus , TriageStatus, VisitStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

// 定义分页结果接口，用于返回分页查询结果
export interface PaginationResult<T> {
  data: T[];           // 当前页数据
  page: number;        // 当前页码
  pageSize: number;    // 每页条数
  total: number;       // 总条数
  totalPages: number;  // 总页数
}

// 标记为可注入的服务
@Injectable()
export class AppointmentService {
  // 构造函数，注入Appointment实体的Repository
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // 创建新的挂号记录
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // 根据DTO创建实体实例
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    // 保存到数据库并返回结果
    return this.appointmentRepository.save(appointment);
  }

  // 查询所有挂号记录，支持分页和搜索
  // 修改findAll方法以支持分页和多种过滤条件
  async findAll(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    status?: string,
    triageStatus?: string,
    visitStatus?: string
  ): Promise<PaginationResult<Appointment>> {
    const skip = (page - 1) * pageSize;
    
    // 构建查询条件
    const where: any = {};
    
    // 患者姓名模糊搜索
    if (search) {
      where.patientName = Like(`%${search}%`);
    }
    
    // 挂号状态过滤
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // 分诊状态过滤
    if (triageStatus && triageStatus !== 'all') {
      where.triageStatus = triageStatus;
    }
    
    // 就诊状态过滤
    if (visitStatus && visitStatus !== 'all') {
      where.visitStatus = visitStatus;
    }
    
    const [data, total] = await this.appointmentRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: {
        createdAt: 'DESC'
      }
    });
    
    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  // 根据ID查询单个挂号记录
  async findOne(id: number): Promise<Appointment> {
    // 根据ID查询记录
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    // 如果未找到记录，抛出404异常
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    // 返回查询结果
    return appointment;
  }

  // 更新挂号记录
  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    // 先查询要更新的记录
    const appointment = await this.findOne(id);
    // 将DTO中的属性复制到实体对象中
    Object.assign(appointment, updateAppointmentDto);
    // 保存更新后的记录并返回
    return this.appointmentRepository.save(appointment);
  }

  // 删除挂号记录
  async remove(id: number): Promise<void> {
    // 先查询要删除的记录
    const appointment = await this.findOne(id);
    // 从数据库中删除记录
    await this.appointmentRepository.remove(appointment);
  }

  // 根据患者身份证号查询挂号记录
  async findByPatientIdCard(idCard: string): Promise<Appointment[]> {
    // 根据身份证号查询所有相关记录
    return this.appointmentRepository.find({ where: { patientIdCard: idCard } });
  }

  // 确认挂号
  async confirmAppointment(id: number): Promise<Appointment> {
    // 查询要确认的挂号记录
    const appointment = await this.findOne(id);
    // 更新状态为已确认
    appointment.status = AppointmentStatus.CONFIRMED;
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 取消挂号
  async cancelAppointment(id: number): Promise<Appointment> {
    // 查询要取消的挂号记录
    const appointment = await this.findOne(id);
    // 更新状态为已取消
    appointment.status = AppointmentStatus.CANCELLED;
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 开始分诊
  async startTriage(id: number): Promise<Appointment> {
    // 查询要分诊的挂号记录
    const appointment = await this.findOne(id);
    // 更新分诊状态为进行中
    appointment.triageStatus = TriageStatus.IN_PROGRESS;
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 完成分诊
  async completeTriage(
    id: number,                    // 挂号记录ID
    updateAppointmentDto: UpdateAppointmentDto // 更新数据DTO
  ): Promise<Appointment> {
    // 查询要完成分诊的挂号记录
    const appointment = await this.findOne(id);
    // 更新分诊状态为已完成
    appointment.triageStatus = TriageStatus.COMPLETED;
    // 将DTO中的属性复制到实体对象中
    Object.assign(appointment, updateAppointmentDto);
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 跳过分诊
  async skipTriage(id: number): Promise<Appointment> {
    // 查询要跳过分诊的挂号记录
    const appointment = await this.findOne(id);
    // 更新分诊状态为已跳过
    appointment.triageStatus = TriageStatus.SKIPPED;
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 获取待分诊的挂号记录
  async getPendingTriage(): Promise<Appointment[]> {
    // 查询所有分诊状态为待分诊的记录
    return this.appointmentRepository.find({ 
      where: { 
        triageStatus: TriageStatus.PENDING 
      } 
    });
  }

  // 开始就诊
  async startVisit(id: number): Promise<Appointment> {
    // 查询要开始就诊的挂号记录
    const appointment = await this.findOne(id);
    // 更新就诊状态为进行中
    appointment.visitStatus = VisitStatus.IN_PROGRESS;
    // 设置就诊开始时间
    appointment.visitStartTime = new Date();
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 完成就诊
  async completeVisit(
    id: number,                    // 挂号记录ID
    updateAppointmentDto: UpdateAppointmentDto // 更新数据DTO
  ): Promise<Appointment> {
    // 查询要完成就诊的挂号记录
    const appointment = await this.findOne(id);
    // 更新就诊状态为已完成
    appointment.visitStatus = VisitStatus.COMPLETED;
    // 设置就诊结束时间
    appointment.visitEndTime = new Date();
    // 将DTO中的属性复制到实体对象中
    Object.assign(appointment, updateAppointmentDto);
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 标记为错过就诊
  async missVisit(id: number): Promise<Appointment> {
    // 查询要标记的挂号记录
    const appointment = await this.findOne(id);
    // 更新就诊状态为已错过
    appointment.visitStatus = VisitStatus.MISSED;
    // 保存并返回更新后的记录
    return this.appointmentRepository.save(appointment);
  }

  // 获取待就诊的挂号记录（已完成分诊但未就诊的记录）
  async getPendingVisit(): Promise<Appointment[]> {
    // 查询所有就诊状态为待就诊且分诊状态为已完成的记录
    return this.appointmentRepository.find({ 
      where: { 
        visitStatus: VisitStatus.PENDING,
        triageStatus: TriageStatus.COMPLETED
      } 
    });
  }
}