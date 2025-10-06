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
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination"
import { toast } from "sonner"
import { hospitalisedApi } from "../../lib/api"
import { useEffect, useState, useRef } from "react"
import { type HospitalisedItem, statusMap } from "./type"
import { UpdatePopup, type UpdatePopupHandle } from './components/updatePopup';
import { AddPopup , type AddPopupHandle } from "./components/addPopup"


export default function HospitalisedList() {
  //表格数据
  const [appointments, setAppointments] = useState<HospitalisedItem[]>([])
  //数据更新
  const [isUpdate, setIsUpdate] = useState(1)
  //搜索
  const [searchTerm, setSearchTerm] = useState("")
  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    const params = {
      page: pagination.page, // 确保转换为数字
      pageSize: pagination.pageSize, // 确保转换为数字
      doctorName: searchTerm,
      patientName: searchTerm,
    }

    hospitalisedApi.findAll(params).then(res => {
      if (res.data.code == 200) {
        toast.success(res.data.message)
        setAppointments(res.data.data.list)
        setPagination({
          page: Number(res.data.data.page) || 1,
          pageSize: Number(res.data.data.pageSize) || 10,
          total: Number(res.data.data.total) || 0,
          totalPages: Math.ceil(Number(res.data.data.total) / Number(res.data.data.pageSize)) || 1
        })
      } else {
        toast.error(res.data.message || '获取住院列表失败')
      }
    }).catch(error => {
      console.error('获取住院列表失败:', error)
      toast.error('获取住院列表失败')
    })
  }, [pagination.page, isUpdate, searchTerm])

  // 处理分页变化
  const handlePageChange = (page: number) => {
    console.log('切换到第', page, '页')
    setPagination(prev => ({
      ...prev,
      page: Number(page) || 1
    }))
  }
  //刷新
  const refreshData = () => {
    setIsUpdate(Number(isUpdate) + 1)
  }


  //修改
  const popupRef = useRef<UpdatePopupHandle>(null)
  const openPopup = () => popupRef.current?.open()
  const handleDischarge = (id: number) => {
    openPopup()
    setSelectedId(id)
  }


  //新增
  const addpopupRef = useRef<UpdatePopupHandle>(null)
  const openAddPopup = () => addpopupRef.current?.open()




  const [selectedId, setSelectedId] = useState<number>(0)
  return (
    <>

      <AddPopup
        ref={addpopupRef}
        onSuccess={refreshData} />

      <UpdatePopup
        ref={popupRef}
        id={selectedId}
        onSuccess={refreshData}
        children={""}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">住院管理</h2>
            <p className="text-muted-foreground">
              管理住院人员的入住和出院记录
            </p>
          </div>
          <div>
            <Button onClick={openAddPopup}>
              <PlusIcon className="mr-2 h-4 w-4" />
              新建住院
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>住院列表</CardTitle>
            <CardDescription>
              管理所有入住和出院记录
            </CardDescription>
          </CardHeader>
          <CardContent>
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
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>病人</TableHead>
                  <TableHead>医生</TableHead>
                  <TableHead>诊断</TableHead>
                  <TableHead>治疗</TableHead>
                  <TableHead>房间</TableHead>
                  <TableHead>床位</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>入院时间</TableHead>
                  <TableHead>出院时间</TableHead>
                  <TableHead>费用</TableHead>
                  <TableHead>出院备注</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.patientName}</TableCell>
                    <TableCell>{item.doctorName}</TableCell>
                    <TableCell>{item.diagnosis}</TableCell>
                    <TableCell>{item.treatment}</TableCell>
                    <TableCell>{item.room}</TableCell>
                    <TableCell>{item.bed}</TableCell>
                    <TableCell>
                      <Badge className={statusMap[item.status as 0 | 1].color}>
                        {statusMap[item.status as 0 | 1].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.admissionTime), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                    </TableCell>
                    <TableCell>
                      {item.dischargeTime ? format(new Date(item.dischargeTime), "yyyy-MM-dd HH:mm", { locale: zhCN }) : '-'}
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                          {item.status === 0 && (
                            <div>
                              <DropdownMenuItem onClick={() => handleDischarge(item.id)}>办理出院</DropdownMenuItem>
                            </div>
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
                      onClick={() => handlePageChange(Math.max(1, Number(pagination.page) - 1))}
                      className={pagination.total === 0 || pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* 确保至少显示1页 */}
                  {pagination.totalPages > 0 && Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    // 总页数小于等于5时显示所有页码
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    }
                    // 当前页在前3页时显示1-5页
                    else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    }
                    // 当前页在最后3页时显示最后5页
                    else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    }
                    // 其他情况显示当前页为中心的5页
                    else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pageNum === pagination.page}
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
                      className={pagination.total === 0 || pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}