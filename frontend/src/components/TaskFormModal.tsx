import { useId, useState, type FormEvent } from 'react'
import FormField from './FormField'
import Modal from './Modal'

export type TaskInput = { title: string; description?: string }

type TaskFormModalProps = {
  onSubmit: (task: TaskInput) => void
  onClose: () => void
  /** 서버 등 외부에서 내려온 에러 메시지 */
  error?: string
}

export default function TaskFormModal({ onSubmit, onClose, error }: TaskFormModalProps) {
  const descriptionId = useId()
  const [titleError, setTitleError] = useState<string>()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = String(data.get('taskTitle') ?? '').trim()
    const description = String(data.get('taskDescription') ?? '').trim()

    if (!title) return setTitleError('제목을 입력해주세요.')
    setTitleError(undefined)
    onSubmit({ title, ...(description && { description }) })
  }

  return (
    <Modal title="새 태스크 추가" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {error && (
          <p role="alert" className="error-message rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <FormField label="제목" name="taskTitle" autoFocus error={titleError} />
        <div className="flex flex-col gap-1">
          <label htmlFor={descriptionId} className="text-sm font-medium text-gray-700">
            설명
          </label>
          <textarea
            id={descriptionId}
            name="taskDescription"
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          >
            추가
          </button>
        </div>
      </form>
    </Modal>
  )
}
