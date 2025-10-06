import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Like } from 'typeorm';
import { Hospitalised } from './entities/hospitalised.entity';
import { CreateHospitalisedDto } from './dto/create-hospitalised.dto';
@Injectable()
export class HospitalisedService {
  constructor(
    @InjectRepository(Hospitalised)
    private hospitalisedRepository: Repository<Hospitalised>,
  ) { }

  async create(createDto: CreateHospitalisedDto) {
    const record = this.hospitalisedRepository.create({
      ...createDto,
      status: 0, // 默认未出院
      price: '0' // 初始费用为0
    });
    return this.hospitalisedRepository.save(record);
  }

async findAll(page: number = 1, pageSize: number = 10, doctorName?: string, patientName?: string) {
    console.log('接收到的查询参数:', { doctorName, patientName }); // 调试日志
  const where: any = {};

  if (patientName) {
    where.patientName = Like(`%${patientName}%`);
  }

  const [data, total] = await this.hospitalisedRepository.findAndCount({
    where,
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
    order: { admissionTime: 'DESC' },
  });
  return { data, total };
}

  async findOne(id: number) {
    return this.hospitalisedRepository.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Hospitalised>) {
    if (updateData.status === 1) {
      const record = await this.findOne(id);
      if (!record) throw new Error('记录不存在');

      const dischargeTime = new Date();
      const admissionTime = new Date(record.admissionTime);
      const days = Math.ceil((dischargeTime.getTime() - admissionTime.getTime()) / (1000 * 60 * 60 * 24));
      updateData.price = (days * 100).toString();
      updateData.dischargeTime = dischargeTime.toISOString();
    }

    await this.hospitalisedRepository.update(id, updateData);
    return this.hospitalisedRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return this.hospitalisedRepository.delete(id);
  }

  async discharge(id: number) {
    const record = await this.findOne(id);
    if (!record) throw new Error('记录不存在');

    // 计算住院天数
    const dischargeTime = new Date();
    const admissionTime = new Date(record.admissionTime);
    const days = Math.ceil((dischargeTime.getTime() - admissionTime.getTime()) / (1000 * 60 * 60 * 24));
    const price = (days * 100).toString();

    return this.update(id, {
      dischargeTime: dischargeTime.toISOString(),
      price,
      status: 1 // 已出院
    });
  }
}
