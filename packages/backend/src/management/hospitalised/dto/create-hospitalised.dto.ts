export class CreateHospitalisedDto {
  patientName: string;
  doctorName: string;
  admissionTime: Date;
  diagnosis?: string;
  treatment?: string;
  room?: string;
  bed?: string;
  notes?: string;
}
