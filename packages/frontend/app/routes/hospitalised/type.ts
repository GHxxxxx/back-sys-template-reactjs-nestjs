interface HospitalisedItem {
  id: number
  patientName: string
  doctorName: string
  diagnosis: string
  treatment: string
  room: string
  bed: string
  status: number
  admissionTime: string
  dischargeTime: string | null
  price: string
  notes: string
}


const statusMap = {
  0: { label: '住院中', color: 'bg-blue-100 text-blue-800' },
  1: { label: '已出院', color: 'bg-green-100 text-green-800' }
}



export { type HospitalisedItem , statusMap }