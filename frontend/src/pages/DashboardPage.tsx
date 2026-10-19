import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import TaskTable, { type Task, type TaskId, type TaskStatus } from '../components/TaskTable'
import { ApiError, request } from '../lib/api'

export default function DashboardPage() {
  const { logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string>()

  // 인증이 만료되면 로그아웃, 그 외 에러는 화면에 표시합니다.
  const run = useCallback(
    async <T,>(action: () => Promise<T>): Promise<T | undefined> => {
      try {
        return await action()
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) logout()
        else setError(e instanceof ApiError ? e.message : '요청에 실패했습니다.')
      }
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
        if (!active) return
        if (e instanceof ApiError && e.status === 401) logout()
        else setError(e instanceof ApiError ? e.message : '요청에 실패했습니다.')
      }
    })()
    return () => {
      active = false
    }
  }, [logout])

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const title = String(new FormData(form).get('title') ?? '').trim()
    if (!title) return setError('제목을 입력해주세요.')
    setError(undefined)

    const created = await run(() => request<Task>('/tasks', { method: 'POST', json: { title } }))
    if (created) {
      setTasks((prev) => [created, ...prev])
      form.reset()
    }
  }

  const handleStatusChange = async (id: TaskId, status: TaskStatus) => {
    setError(undefined)
    const updated = await run(() => request<Task>(`/tasks/${id}`, { method: 'PATCH', json: { status } }))
    if (updated) setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const handleDelete = async (id: TaskId) => {
    setError(undefined)
    const ok = await run(() => request<void>(`/tasks/${id}`, { method: 'DELETE' }).then(() => true))
    if (ok) setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>

      <form onSubmit={handleCreate} noValidate className="flex gap-2">
        <label htmlFor="new-task-title" className="sr-only">
          새 태스크 제목
        </label>
        <input
          id="new-task-title"
          name="title"
          placeholder="새 태스크 제목"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        >
          추가
        </button>
      </form>

      {error && (
        <p role="alert" className="error-message rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <TaskTable tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </div>
  )
}
