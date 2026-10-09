import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: ReactNode
}

export function Button({
  loading = false,
  disabled,
  children,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className="button"
      disabled={disabled || loading}
      aria-busy={loading}
      {...buttonProps}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  )
}
