import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import ConfirmDialog from '../components/ConfirmDialog'
import TaskFormModal, { type TaskInput } from '../components/TaskFormModal'
import TaskTable, { type Task, type TaskId, type TaskStatus } from '../components/TaskTable'
import { ApiError, request } from '../lib/api'

export default function DashboardPage() {
  const { logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string>()
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string>()
  const [deletingId, setDeletingId] = useState<TaskId | null>(null)

  // 인증이 만료되면 로그아웃하고, 그 외 에러는 메시지로 변환합니다.
  const handleError = useCallback(
    (e: unknown): string | undefined => {
      if (e instanceof ApiError && e.status === 401) return void logout()
      return e instanceof ApiError ? e.message : '요청에 실패했습니다.'
    },
    [logout],
  )

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const rows = await request<Task[]>('/tasks')
        if (active) setTasks(rows)
      } catch (e) {
        if (active) setError(handleError(e))
      }
    })()
    return () => {
      active = false
    }
  }, [handleError])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setFormError(undefined)
  }, [])

  const handleCreate = async (input: TaskInput) => {
    try {
      const created = await request<Task>('/tasks', { method: 'POST', json: input })
      setTasks((prev) => [created, ...prev])
      closeForm()
    } catch (e) {
      setFormError(handleError(e))
    }
  }

  const handleStatusChange = async (id: TaskId, status: TaskStatus) => {
    setError(undefined)
    try {
      const updated = await request<Task>(`/tasks/${id}`, { method: 'PATCH', json: { status } })
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError(handleError(e))
    }
  }

  const handleDeleteConfirmed = async () => {
    if (deletingId === null) return
    const id = deletingId
    setDeletingId(null)
    setError(undefined)
    try {
      await request<void>(`/tasks/${id}`, { method: 'DELETE' })
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError(handleError(e))
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        >
          새 태스크 추가
        </button>
      </div>

      {error && (
        <p role="alert" className="error-message rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <TaskTable tasks={tasks} onStatusChange={handleStatusChange} onDelete={setDeletingId} />

      {formOpen && <TaskFormModal onSubmit={handleCreate} onClose={closeForm} error={formError} />}
      {deletingId !== null && (
        <ConfirmDialog
          title="태스크 삭제"
          message="이 태스크를 삭제할까요? 삭제한 태스크는 복구할 수 없습니다."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
