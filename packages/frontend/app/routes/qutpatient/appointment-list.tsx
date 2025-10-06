"use client"

import * as React from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import {
  CalendarIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MoreHorizontalIcon
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination"
import { appointmentApi, type Appointment } from "../../lib/api"
import { statusMap, triageStatusMap, visitStatusMap } from "./data"

export function AppointmentList() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [triageFilter, setTriageFilter] = React.useState<string>("all")
  const [visitFilter, setVisitFilter] = React.useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = React.useState(false)
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null)
  // 分页状态
  const [pagination, setPagination] = React.useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 表单数据
  const [formData, setFormData] = React.useState({
    patientName: "",
    patientIdCard: "",
    phone: "",
    description: ""
  })

  // 获取挂号列表
  const fetchAppointments = React.useCallback(async () => {
    try {
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize
      }

      if (searchTerm) params.search = searchTerm
      if (statusFilter !== "all") params.status = statusFilter
      if (triageFilter !== "all") params.triageStatus = triageFilter
      if (visitFilter !== "all") params.visitStatus = visitFilter

      const result = await appointmentApi.getAppointments(params)

      if (result.code === 200) {
        setAppointments(result.data)
        if (result.pagination) {
          setPagination({
            page: result.pagination.page,
            pageSize: result.pagination.pageSize,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages
          })
        }
      } else {
        toast.error(result.message || '获取挂号列表失败')
      }
    } catch (error) {
      console.error('获取挂号列表失败:', error)
      toast.error('获取挂号列表失败')
    }
  }, [pagination.page, pagination.pageSize, searchTerm, statusFilter, triageFilter, visitFilter])

  // 初始化获取数据
  React.useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  // 处理创建挂号
  const handleCreateAppointment = async () => {
    try {
      // 表单验证
      if (!formData.patientName.trim()) {
        toast.error("患者姓名不能为空")
        return
      }

      if (!formData.patientIdCard.trim()) {
        toast.error("身份证号不能为空")
        return
      }

      if (!formData.phone.trim()) {
        toast.error("联系电话不能为空")
        return
      }

      const newAppointment = {
        patientName: formData.patientName,
        patientIdCard: formData.patientIdCard,
        phone: formData.phone,
        description: formData.description,
        doctorId: 1,
        departmentId: 1,
        appointmentTime: new Date().toISOString(),
        status: 'pending' as const,
        triageStatus: 'pending' as const,
        visitStatus: 'pending' as const,
        roomId: null,
        priority: null,
        triageNotes: null,
        visitStartTime: null,
        visitEndTime: null,
        diagnosis: null,
        prescription: null,
      }

      const result = await appointmentApi.createAppointment(newAppointment)

      if (result.code === 200) {
        toast.success("挂号创建成功")
        setIsCreateDialogOpen(false)
        // 重置表单
        setFormData({
          patientName: "",
          patientIdCard: "",
          phone: "",
          description: ""
        })
        // 重新获取数据
        fetchAppointments()
      } else {
        toast.error(result.message || '创建挂号失败')
      }
    } catch (error) {
      console.error('创建挂号失败:', error)
      toast.error('创建挂号失败')
    }
  }

  // 处理确认挂号
  const handleConfirmAppointment = async (id: number) => {
    try {
      const result = await appointmentApi.confirmAppointment(id)

      if (result.code === 200) {
        toast.success("挂号已确认")
        fetchAppointments()
      } else {
        toast.error(result.message || '确认挂号失败')
      }
    } catch (error) {
      console.error('确认挂号失败:', error)
      toast.error('确认挂号失败')
    }
  }

  // 处理取消挂号
  const handleCancelAppointment = async (id: number) => {
    try {
      const result = await appointmentApi.cancelAppointment(id)

      if (result.code === 200) {
        toast.success("挂号已取消")
        fetchAppointments()
      } else {
        toast.error(result.message || '取消挂号失败')
      }
    } catch (error) {
      console.error('取消挂号失败:', error)
      toast.error('取消挂号失败')
    }
  }

  // 处理开始分诊
  const handleStartTriage = async (id: number) => {
    try {
      const result = await appointmentApi.startTriage(id)

      if (result.code === 200) {
        toast.success("开始分诊")
        fetchAppointments()
      } else {
        toast.error(result.message || '开始分诊失败')
      }
    } catch (error) {
      console.error('开始分诊失败:', error)
      toast.error('开始分诊失败')
    }
  }

  // 处理完成分诊
  const handleCompleteTriage = async () => {
    if (!selectedAppointment) return

    try {
      const result = await appointmentApi.completeTriage(selectedAppointment.id, {
        roomId: 3,
        priority: 2,
        triageNotes: "分诊完成"
      })

      if (result.code === 200) {
        toast.success("分诊完成")
        setIsActionDialogOpen(false)
        fetchAppointments()
      } else {
        toast.error(result.message || '完成分诊失败')
      }
    } catch (error) {
      console.error('完成分诊失败:', error)
      toast.error('完成分诊失败')
    }
  }

  // 处理跳过分诊
  const handleSkipTriage = async (id: number) => {
    try {
      const result = await appointmentApi.skipTriage(id)

      if (result.code === 200) {
        toast.success("已跳过分诊")
        fetchAppointments()
      } else {
        toast.error(result.message || '跳过分诊失败')
      }
    } catch (error) {
      console.error('跳过分诊失败:', error)
      toast.error('跳过分诊失败')
    }
  }

  // 处理开始就诊
  const handleStartVisit = async (id: number) => {
    try {
      const result = await appointmentApi.startVisit(id)

      if (result.code === 200) {
        toast.success("开始就诊")
        fetchAppointments()
      } else {
        toast.error(result.message || '开始就诊失败')
      }
    } catch (error) {
      console.error('开始就诊失败:', error)
      toast.error('开始就诊失败')
    }
  }

  // 处理完成就诊
  const handleCompleteVisit = async () => {
    if (!selectedAppointment) return

    try {
      const result = await appointmentApi.completeVisit(selectedAppointment.id, {
        diagnosis: "感冒",
        prescription: "阿莫西林胶囊 3次/日 5天"
      })

      if (result.code === 200) {
        toast.success("就诊完成")
        setIsActionDialogOpen(false)
        fetchAppointments()
      } else {
        toast.error(result.message || '完成就诊失败')
      }
    } catch (error) {
      console.error('完成就诊失败:', error)
      toast.error('完成就诊失败')
    }
  }

  // 处理错过就诊
  const handleMissVisit = async (id: number) => {
    try {
      const result = await appointmentApi.missVisit(id)

      if (result.code === 200) {
        toast.success("标记为错过就诊")
        fetchAppointments()
      } else {
        toast.error(result.message || '标记错过就诊失败')
      }
    } catch (error) {
      console.error('标记错过就诊失败:', error)
      toast.error('标记错过就诊失败')
    }
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">挂号管理</h2>
          <p className="text-muted-foreground">
            管理患者的挂号、分诊和就诊信息
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild className="hover:cursor-pointer">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              新建挂号
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>创建挂号</DialogTitle>
              <DialogDescription>
                填写患者信息创建新的挂号记录
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientName" className="text-right">
                  患者姓名
                </Label>
                <Input
                  id="patientName"
                  className="col-span-3"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="idCard" className="text-right">
                  身份证号
                </Label>
                <Input
                  id="idCard"
                  className="col-span-3"
                  value={formData.patientIdCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientIdCard: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  联系电话
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  病情描述
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateAppointment}>创建</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>挂号列表</CardTitle>
          <CardDescription>
            管理所有挂号记录，可以进行分诊和就诊操作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索患者姓名..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="挂号状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待确认</SelectItem>
                <SelectItem value="confirmed">已确认</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
            <Select value={triageFilter} onValueChange={setTriageFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="分诊状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分诊</SelectItem>
                <SelectItem value="pending">待分诊</SelectItem>
                <SelectItem value="in_progress">分诊中</SelectItem>
                <SelectItem value="completed">分诊完成</SelectItem>
                <SelectItem value="skipped">跳过分诊</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visitFilter} onValueChange={setVisitFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="就诊状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部就诊</SelectItem>
                <SelectItem value="pending">待就诊</SelectItem>
                <SelectItem value="in_progress">就诊中</SelectItem>
                <SelectItem value="completed">就诊完成</SelectItem>
                <SelectItem value="missed">错过就诊</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>患者姓名</TableHead>
                <TableHead>身份证号</TableHead>
                <TableHead>预约时间</TableHead>
                <TableHead>挂号状态</TableHead>
                <TableHead>分诊状态</TableHead>
                <TableHead>就诊状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} >
                  <TableCell>
                    <div className="font-medium">{appointment.patientName}</div>
                  </TableCell>
                  <TableCell>
                    {appointment.patientIdCard}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(appointment.appointmentTime), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusMap[appointment.status].color}>
                      {statusMap[appointment.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={triageStatusMap[appointment.triageStatus].color}>
                      {triageStatusMap[appointment.triageStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={visitStatusMap[appointment.visitStatus].color}>
                      {visitStatusMap[appointment.visitStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">打开菜单</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        {appointment.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleConfirmAppointment(appointment.id)}>
                              <CheckCircleIcon className="mr-2 h-4 w-4" />
                              确认挂号
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCancelAppointment(appointment.id)}>
                              <XCircleIcon className="mr-2 h-4 w-4" />
                              取消挂号
                            </DropdownMenuItem>
                          </>
                        )}
                        {appointment.status === "confirmed" && appointment.triageStatus === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleStartTriage(appointment.id)}>
                              <UserIcon className="mr-2 h-4 w-4" />
                              开始分诊
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSkipTriage(appointment.id)}>
                              跳过分诊
                            </DropdownMenuItem>
                          </>
                        )}
                        {appointment.status === "confirmed" && appointment.triageStatus === "completed" && appointment.visitStatus === "pending" && (
                          <DropdownMenuItem onClick={() => handleStartVisit(appointment.id)}>
                            <ClockIcon className="mr-2 h-4 w-4" />
                            开始就诊
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "confirmed" && appointment.triageStatus === "in_progress" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setIsActionDialogOpen(true)
                            }}
                          >
                            完成分诊
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "confirmed" && appointment.visitStatus === "in_progress" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setIsActionDialogOpen(true)
                            }}
                          >
                            完成就诊
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "confirmed" && appointment.visitStatus === "pending" && (
                          <DropdownMenuItem onClick={() => handleMissVisit(appointment.id)}>
                            错过就诊
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 分页组件 */}
          <div className="flex items-center justify-between mt-4">
            <div className="w-full text-sm text-muted-foreground">
              共 {pagination.total} 条记录，第 {pagination.page} 页，共 {pagination.totalPages} 页
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    className={pagination.total === 0 || Number(pagination.page) === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={ Number(pageNum) === Number(pagination.page) } 
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(Number(pagination.totalPages), Number(pagination.page) + 1))}
                    className={pagination.total === 0 || Number(pagination.page) === Number(pagination.totalPages) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* 分诊/就诊操作对话框 */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          {selectedAppointment?.triageStatus === "in_progress" ? (
            <>
              <DialogHeader>
                <DialogTitle>完成分诊</DialogTitle>
                <DialogDescription>
                  为患者 {selectedAppointment?.patientName} 完成分诊操作
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roomId" className="text-right">
                    诊室
                  </Label>
                  <Input id="roomId" defaultValue="3" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    优先级
                  </Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - 最高</SelectItem>
                      <SelectItem value="2">2 - 高</SelectItem>
                      <SelectItem value="3">3 - 中</SelectItem>
                      <SelectItem value="4">4 - 低</SelectItem>
                      <SelectItem value="5">5 - 最低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="triageNotes" className="text-right">
                    备注
                  </Label>
                  <Textarea id="triageNotes" defaultValue="症状较重，需要优先处理" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCompleteTriage}>完成分诊</Button>
              </div>
            </>
          ) : selectedAppointment?.visitStatus === "in_progress" ? (
            <>
              <DialogHeader>
                <DialogTitle>完成就诊</DialogTitle>
                <DialogDescription>
                  为患者 {selectedAppointment?.patientName} 完成就诊操作
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diagnosis" className="text-right">
                    诊断结果
                  </Label>
                  <Textarea id="diagnosis" defaultValue="感冒" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prescription" className="text-right">
                    处方
                  </Label>
                  <Textarea id="prescription" defaultValue="阿莫西林胶囊 3次/日 5天" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCompleteVisit}>完成就诊</Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}