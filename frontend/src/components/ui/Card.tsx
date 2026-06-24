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
          'bg-card border border-edge rounded-[5px] p-5',
          onClick ? 'cursor-pointer hover:border-edge-s transition-colors' : '',
          className,
        ].join(' ')}
        onClick={onClick}
        {...props}
      >
        {title && (
          <h3 className="font-serif text-[15px] font-bold tracking-[-0.01em] text-ink mb-3">
            {title}
          </h3>
        )}
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'