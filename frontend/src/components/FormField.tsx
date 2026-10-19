import { useId, type InputHTMLAttributes } from 'react'

type FormFieldProps = {
  label: string
  error?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

// label-input 연결(htmlFor)과 에러 표시를 한 곳에서 처리해 모든 폼의 에러 상태를 통일합니다.
export default function FormField({ label, error, className = '', ...inputProps }: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
        } ${className}`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
