import { useEffect, useRef, useState } from 'react'
import { STATUS_LABEL, STATUS_STYLE, TASK_STATUSES, type TaskStatus } from '../lib/taskStatus'

export type { TaskStatus }
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

// 상태 배지를 누르면 선택 가능한 상태 목록이 열립니다.
function StatusMenu({ status, onSelect }: { status: TaskStatus; onSelect: (status: TaskStatus) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        data-testid={`status-${status}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`rounded-full px-2 py-0.5 text-xs font-medium focus:ring-2 focus:ring-indigo-300 focus:outline-none ${STATUS_STYLE[status]}`}
      >
        {STATUS_LABEL[status]}
      </button>
      {open && (
        <ul role="menu" className="absolute left-0 z-10 mt-1 w-28 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {TASK_STATUSES.map((s) => (
            <li key={s} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  if (s !== status) onSelect(s)
                }}
                className="block w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
              >
                {STATUS_LABEL[s]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function TaskTable({ tasks, onStatusChange, onDelete }: TaskTableProps) {
  if (tasks.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">태스크가 없습니다.</p>
  }

  return (
    <div className="rounded-lg border border-gray-200">
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
            <tr key={task.id} className="task-item">
              <td className="px-4 py-2 font-medium text-gray-900">{task.title}</td>
              <td className="px-4 py-2 text-gray-600">{task.description}</td>
              <td className="px-4 py-2">
                <StatusMenu status={task.status} onSelect={(status) => onStatusChange(task.id, status)} />
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  type="button"
                  data-testid="delete-task"
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
