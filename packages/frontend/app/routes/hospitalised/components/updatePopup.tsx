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
    id: number
    onSuccess: () => void
    children: React.ReactNode
}

export interface UpdatePopupHandle {
    open: () => void
    close: () => void
}

export const UpdatePopup = forwardRef<UpdatePopupHandle, UpdatePopupProps>(

    ({ id, onSuccess, children }, ref) => {

        const [isOpen, setIsOpen] = useState(false)
        const [dischargeTime, setDischargeTime] = useState('')
        const [notes, setNotes] = useState('')

        const handleDischarge = async () => {
            try {
                await hospitalisedApi.update(id, {
                    dischargeTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    notes,
                    status: 1 // 1 表示已出院
                })
                .then((res)=>{
                    console.log(res) 
                    if(res.data.code===200){
                        toast.success('出院办理成功')
                        setIsOpen(false)
                        onSuccess()
                    }else{
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

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                出院备注
                            </Label>
                            <Input
                                id="notes"
                                className="col-span-3"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleDischarge}>确认出院</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }
)