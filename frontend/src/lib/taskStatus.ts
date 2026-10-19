export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: '대기중',
  in_progress: '진행중',
  completed: '완료',
}

export const STATUS_STYLE: Record<TaskStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
}
