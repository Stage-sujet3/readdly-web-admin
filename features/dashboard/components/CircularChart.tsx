"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CircularChartProps {
  data: Array<{ name: string; value: number; color: string }>
  title: string
  subtitle?: string
  size?: number
}

export function CircularChart({ data, title, subtitle, size = 300 }: CircularChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  const renderCustomizedLabel = ({ cx, cy }: any) => {
    return (
      <text 
        x={cx} 
        y={cy} 
        fill="#1a2a4a" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="text-lg font-bold"
      >
        {total}
      </text>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-premium"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>
      
      <div className="flex justify-center" style={{ width: size, height: size, minWidth: 200, minHeight: 200 }}>
        <ResponsiveContainer width={size} height={size} minWidth={200} minHeight={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={size * 0.35}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
              formatter={(value: any) => [`${value} utilisateurs`, 'Total']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mt-6">
        {data.map((item, index) => (
          <motion.div 
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-semibold text-slate-700">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
