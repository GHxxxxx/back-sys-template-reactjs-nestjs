import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { hospitalisedApi } from "@/lib/api"
import { forwardRef, useImperativeHandle } from "react"
import { format } from 'date-fns';
interface UpdatePopupProps {
    onSuccess: () => void
    children: React.ReactNode
}

export interface AddPopupHandle {
    open: () => void
    close: () => void
}

export const AddPopup = forwardRef<UpdatePopupHandle, UpdatePopupProps>(

    ({ onSuccess, children }, ref) => {

        const [isOpen, setIsOpen] = useState(false)// 弹窗是否打开
        const [patientName, setPatienName] = useState("")// 病人姓名
        const [doctorName, setDoctorName] = useState("")// 医生姓名
        const [admissionTime, setAdmissionTime] = useState("")// 入院时间
        const [diagnosis, setDiagnosis] = useState("")// 诊断
        const [treatment, setTreatment] = useState("")// 治疗
        const [room, setRoom] = useState("")// 房间
        const [bed, setBed] = useState("")// 床号

        const handleDischarge = async () => {
            try {
                await hospitalisedApi.create({
                    data: {
                        patientName,
                        doctorName,
                        diagnosis,
                        treatment,
                        room,
                        bed,
                        admissionTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        status: 0 // 1 表示已出院 
                    }
                })
                    .then((res) => {
                        console.log(res)
                        if (res.data.code === 200) {
                            toast.success('出院办理成功')
                            setIsOpen(false)
                            onSuccess()
                        } else {
                            toast.error('出院办理失败')
                        }

                    })
            } catch (error) {
                toast.error('出院办理失败')
                console.error('出院办理失败:', error)
            }
        }

        useImperativeHandle(ref, () => ({
            open: () => setIsOpen(true),
            close: () => setIsOpen(false)
        }))


        return (
            <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}  >
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>办理出院</DialogTitle>
                        <DialogDescription>
                            请填写出院相关信息
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="patientName" className="text-right">
                                    病人姓名
                                </Label>
                                <Input
                                    id="patientName"
                                    className="col-span-3"
                                    value={patientName}
                                    onChange={(e) => setPatienName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="doctorName" className="text-right">
                                    医生姓名
                                </Label>
                                <Input
                                    id="doctorName"
                                    className="col-span-3"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="diagnosis" className="text-right">
                                    诊断
                                </Label>
                                <Input
                                    id="diagnosis"
                                    className="col-span-3"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                />

                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="treatment" className="text-right">
                                    治疗
                                </Label>
                                <Input
                                    id="treatment"
                                    className="col-span-3"
                                    value={treatment}
                                    onChange={(e) => setTreatment(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="room" className="text-right">
                                    房间
                                </Label>
                                <Input
                                    id="room"
                                    className="col-span-3"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="bed" className="text-right">
                                    床号
                                </Label>
                                <Input
                                    id="bed"
                                    className="col-span-3"
                                    value={bed}
                                    onChange={(e) => setBed(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleDischarge}>创建</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }
)