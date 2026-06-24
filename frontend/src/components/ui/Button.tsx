import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-forest/10 border border-forest/25 text-forest hover:bg-forest/15 focus:ring-forest/40',
  secondary:
    'bg-card2 border border-edge text-ink-muted hover:border-edge-s hover:text-ink focus:ring-edge',
  danger:
    'bg-red-900/20 border border-red-800/40 text-red-400 hover:bg-red-900/30 focus:ring-red-800/40',
  ghost:
    'bg-transparent border border-transparent text-ink-muted hover:text-ink hover:bg-white/[.03] focus:ring-edge',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-[6px] text-[11px]',
  md: 'px-4 py-[9px] text-[9.5px]',
  lg: 'px-6 py-[11px] text-[10.5px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-[4px] font-mono tracking-[0.07em] uppercase',
          'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'