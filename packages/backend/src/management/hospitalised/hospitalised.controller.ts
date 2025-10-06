import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HospitalisedService } from './hospitalised.service';
import { CreateHospitalisedDto } from './dto/create-hospitalised.dto';
import { Hospitalised } from './entities/hospitalised.entity';
@Controller('hospitalised')
export class HospitalisedController {
  constructor(private readonly service: HospitalisedService) { }

  @Post()
  async create(@Body() createDto: CreateHospitalisedDto) {
    try {
      const data = await this.service.create(createDto);
      return { message: '创建成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '创建失败', code: 400 };
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('doctorName') doctorName?: string,
    @Query('patientName') patientName?: string
  ) {
    try {
      const { data, total } = await this.service.findAll(
        page,
        pageSize,
        doctorName,
        patientName
      );
      return {
        message: '查询成功',
        data: {
          list: data,
          total,
          page,
          pageSize,
          totalPage: Math.ceil(total / pageSize)
        },
        code: 200
      };
    } catch (error) {
      return { message: error.message || '查询失败', code: 400 };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.service.findOne(+id);
      return { message: '查询成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '查询失败', code: 400 };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Hospitalised>
  ) {
    try {
      const data = await this.service.update(+id, updateData);
      return { message: '更新成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '更新失败', code: 400 };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.service.remove(+id);
      return { message: '删除成功', code: 200 };
    } catch (error) {
      return { message: error.message || '删除失败', code: 400 };
    }
  }

  @Post(':id/discharge')
  async discharge(@Param('id') id: string) {
    try {
      const data = await this.service.discharge(+id);
      return { message: '出院成功', data, code: 200 };
    } catch (error) {
      return { message: error.message || '出院失败', code: 400 };
    }
  }
}
