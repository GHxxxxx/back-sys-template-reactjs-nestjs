  // 状态映射
  const statusMap = {
    pending: { label: "待确认", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "已确认", color: "bg-green-100 text-green-800" },
    cancelled: { label: "已取消", color: "bg-red-100 text-red-800" }
  }

  const triageStatusMap = {
    pending: { label: "待分诊", color: "bg-yellow-100 text-yellow-800" },
    in_progress: { label: "分诊中", color: "bg-blue-100 text-blue-800" },
    completed: { label: "分诊完成", color: "bg-green-100 text-green-800" },
    skipped: { label: "跳过分诊", color: "bg-gray-100 text-gray-800" }
  }

  const visitStatusMap = {
    pending: { label: "待就诊", color: "bg-yellow-100 text-yellow-800" },
    in_progress: { label: "就诊中", color: "bg-blue-100 text-blue-800" },
    completed: { label: "就诊完成", color: "bg-green-100 text-green-800" },
    missed: { label: "错过就诊", color: "bg-red-100 text-red-800" }
  }


  export { statusMap, triageStatusMap, visitStatusMap }