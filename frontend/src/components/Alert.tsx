import type { ReactNode } from 'react'

interface AlertProps {
  variant: 'error' | 'success'
  children: ReactNode
}

export function Alert({ variant, children }: AlertProps) {
  return (
    <div
      className={`alert alert--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}
