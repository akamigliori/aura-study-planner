import { useMemo, useState } from 'react'

interface DonutChartProps {
  data: { label: string; value: number; color: string }[]
  size?: number
  strokeWidth?: number
  title?: string
}

export function DonutChart({ data, size = 200, strokeWidth = 24, title }: DonutChartProps) {
  const [hoveredItem, setHoveredItem] = useState<{ label: string; value: number; color: string } | null>(null)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const center = size / 2

  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data])

  let currentOffset = 0

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {data.map((item, index) => {
          if (item.value === 0) return null
          
          const percentage = item.value / total
          const strokeDasharray = `${circumference * percentage} ${circumference}`
          const strokeDashoffset = -currentOffset
          
          currentOffset += circumference * percentage

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80"
              style={{ pointerEvents: 'stroke' }}
              strokeLinecap="round"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <title>{item.label}: {item.value}</title>
            </circle>
          )
        })}
      </svg>
      {/* Inner Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {hoveredItem ? (
          <>
            <span 
              className="text-sm font-bold truncate w-full" 
              style={{ color: hoveredItem.color }}
            >
              {hoveredItem.label}
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {hoveredItem.value} {hoveredItem.value === 1 ? 'item' : 'itens'}
            </span>
          </>
        ) : (
          <>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{total}</span>
            {title && <span className="text-xs text-gray-500 uppercase font-medium">{title}</span>}
          </>
        )}
      </div>
    </div>
  )
}
