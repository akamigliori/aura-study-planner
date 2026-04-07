import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  children: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, children, className = '', onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={[
          'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
          'dark:border-gray-700 dark:bg-gray-800',
          onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
          className,
        ].join(' ')}
        onClick={onClick}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
