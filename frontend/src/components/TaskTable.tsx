export type TaskStatus = 'pending' | 'completed'

export type TaskId = string | number

export type Task = {
  id: TaskId
  title: string
  description?: string | null
  status: TaskStatus
}

type TaskTableProps = {
  tasks: Task[]
  onStatusChange: (id: TaskId, status: TaskStatus) => void
  onDelete: (id: TaskId) => void
}

const STATUS_STYLE: Record<TaskStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: '대기',
  completed: '완료',
}

const nextStatus = (status: TaskStatus): TaskStatus => (status === 'pending' ? 'completed' : 'pending')

export default function TaskTable({ tasks, onStatusChange, onDelete }: TaskTableProps) {
  if (tasks.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">태스크가 없습니다.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">제목</th>
            <th scope="col" className="px-4 py-2 font-medium">설명</th>
            <th scope="col" className="px-4 py-2 font-medium">상태</th>
            <th scope="col" className="px-4 py-2 font-medium">
              <span className="sr-only">작업</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-4 py-2 font-medium text-gray-900">
                <span aria-label={task.title}>{task.title}</span>
              </td>
              <td className="px-4 py-2 text-gray-600">{task.description}</td>
              <td className="px-4 py-2">
                <span
                  aria-label={task.status}
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[task.status]}`}
                >
                  {STATUS_LABEL[task.status]}
                </span>
              </td>
              <td className="flex justify-end gap-2 px-4 py-2">
                <button
                  type="button"
                  onClick={() => onStatusChange(task.id, nextStatus(task.status))}
                  className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                >
                  상태 변경
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-200 focus:outline-none"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
