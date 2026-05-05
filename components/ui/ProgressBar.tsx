import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  status?: 'loading' | 'success' | 'error';
  colorClass?: string;
}

export function ProgressBar({ 
  progress, 
  label, 
  status = 'loading',
  colorClass = 'bg-[#5f6ad8]'
}: ProgressBarProps) {
  // Add a slight animation to the progress value
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-red-500';
      default: return colorClass;
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
          <span className="text-xs font-bold text-[#1a2a4a] tabular-nums">{Math.round(displayProgress)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full rounded-full ${getStatusColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
