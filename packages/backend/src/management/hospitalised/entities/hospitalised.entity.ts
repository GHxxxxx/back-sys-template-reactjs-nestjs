import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('hospitalised')
export class Hospitalised {
    @PrimaryGeneratedColumn()
    id: number; // 住院ID

    @Column()
    patientName: string; // 病人姓名

    @Column()
    doctorName: string; // 医生姓名

    @Column({ type: 'datetime' })
    admissionTime: Date; // 入院时间

    @Column({ nullable: true })
    dischargeTime: string; // 出院时间

    @Column({ type: 'text', nullable: true })
    diagnosis: string; // 诊断

    @Column({ type: 'text', nullable: true })
    treatment: string; // 治疗

    @Column({ type: 'text', nullable: true })
    price: string; // 费用

    @Column({ type: 'text', nullable: true })
    room: string; // 房间

    @Column({ type: 'text', nullable: true })
    bed: string; // 床号

    //住院状态：0-未出院，1-已出院
    @Column({ type: 'int', default: 0 })
    status: number;

    @Column({ type: 'text', nullable: true })
    notes: string; // 备注
}
