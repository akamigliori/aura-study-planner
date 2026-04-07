import React from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group">
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 w-[200%] -translate-x-[50%] group-hover:translate-x-0" />
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{subtitle}</span>
        )}
      </div>
    </div>
  )
}
