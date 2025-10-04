import {
  Controller,      // 控制器装饰器
  Get,            // GET请求装饰器
  Post,           // POST请求装饰器
  Body,           // 获取请求体数据装饰器
  Patch,          // PATCH请求装饰器
  Param,          // 获取路径参数装饰器
  Delete,         // DELETE请求装饰器
  ParseIntPipe,   // 整数解析管道
  Query,          // 获取查询参数装饰器
} from '@nestjs/common';
// 导入服务和DTO类
import { AppointmentService, PaginationResult } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
// 定义控制器路由前缀为'/appointments'
@Controller('appointments')
export class AppointmentController {
    // 构造函数，注入AppointmentService
  constructor(private readonly appointmentService: AppointmentService) {}

 // 处理POST /appointments 请求，创建新的挂号记录
  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const data = await this.appointmentService.create(createAppointmentDto);
      return { message: '创建成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '创建失败', data: null, code: 400 };
    }
  }

  // 获取所有挂号记录
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('triageStatus') triageStatus?: string,
    @Query('visitStatus') visitStatus?: string,
  ) {
    try {
      const result: PaginationResult<Appointment> = await this.appointmentService.findAll(page, pageSize, search, status, triageStatus, visitStatus);
      return { 
        message: '获取成功', 
        data: result.data, 
        code: 200,
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        }
      };
    } catch (error) {
      return { message: error.message || '获取失败', data: null, code: 400 };
    }
  }
  // 获取单个挂号记录
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.findOne(id);
      return { message: '获取成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '获取失败', data: null, code: 400 };
    }
  }
  // 更新挂号记录
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      const data = await this.appointmentService.update(id, updateAppointmentDto);
      return { message: '更新成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '更新失败', data: null, code: 400 };
    }
  }
  // 删除挂号记录
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.appointmentService.remove(id);
      return { message: '删除成功', data: null, code: 200 };
    } catch (error) {
      return { message: error.message || '删除失败', data: null, code: 400 };
    }
  }
  // 根据患者身份证号查询挂号记录
  @Get('patient/:idCard')
  async findByPatientIdCard(@Param('idCard') idCard: string) {
    try {
      const data = await this.appointmentService.findByPatientIdCard(idCard);
      return { message: '获取成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '获取失败', data: null, code: 400 };
    }
  }
  // 根据医生ID查询挂号记录
  @Patch(':id/confirm')
  async confirmAppointment(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.confirmAppointment(id);
      return { message: '确认成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '确认失败', data: null, code: 400 };
    }
  }
  // 取消挂号记录
  @Patch(':id/cancel')
  async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.cancelAppointment(id);
      return { message: '取消成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '取消失败', data: null, code: 400 };
    }
  }

  // 分诊相关接口
  @Patch(':id/start-triage')
  async startTriage(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.startTriage(id);
      return { message: '开始分诊成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '开始分诊失败', data: null, code: 400 };
    }
  }

  @Patch(':id/complete-triage')
  async completeTriage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      const data = await this.appointmentService.completeTriage(id, updateAppointmentDto);
      return { message: '完成分诊成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '完成分诊失败', data: null, code: 400 };
    }
  }
  
  @Patch(':id/skip-triage')
  async skipTriage(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.skipTriage(id);
      return { message: '跳过分诊成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '跳过分诊失败', data: null, code: 400 };
    }
  }

  // 就诊相关接口
  @Patch(':id/start-visit')
  async startVisit(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.startVisit(id);
      return { message: '开始就诊成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '开始就诊失败', data: null, code: 400 };
    }
  }

  @Patch(':id/complete-visit')
  async completeVisit(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    try {
      const data = await this.appointmentService.completeVisit(id, updateAppointmentDto);
      return { message: '完成就诊成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '完成就诊失败', data: null, code: 400 };
    }
  }

  @Patch(':id/miss-visit')
  async missVisit(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentService.missVisit(id);
      return { message: '标记错过就诊成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '标记错过就诊失败', data: null, code: 400 };
    }
  }
}