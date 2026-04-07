import { forwardRef } from 'react'

export interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, initials, size = 'md' }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-full overflow-hidden',
          'bg-gray-200 dark:bg-gray-700 flex-shrink-0',
          sizeClasses[size],
        ].join(' ')}
      >
        {src ? (
          <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {initials || '?'}
          </span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
