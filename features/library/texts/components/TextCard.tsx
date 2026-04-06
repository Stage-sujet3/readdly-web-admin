import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Globe, Archive, FileText, BookOpen } from 'lucide-react';
import { ContentStatus } from '../../types';

interface TextCardProps {
  id: string;
  title: string;
  coverImage?: string;
  status: ContentStatus;
  level: string;
  theme: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const paperColors: [string, string][] = [
  ['#fef3c7', '#fbbf24'], // amber/yellow
  ['#ecfdf5', '#10b981'], // emerald/green
  ['#eff6ff', '#3b82f6'], // blue
  ['#fdf2f8', '#ec4899'], // pink
  ['#f5f3ff', '#8b5cf6'], // purple
  ['#fafaf9', '#78716c'], // stone
];

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function TextCard({ id, title, coverImage, status, level, theme, onClick, onEdit, onDelete, onToggleStatus }: TextCardProps) {
  const [bgLight, bgDark] = paperColors[hashId(id) % paperColors.length];

  return (
    <motion.div
      whileHover={{ y: -15, scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ width: 140 }}
      onClick={onClick}
    >
      {/* ── DOCUMENT WRAPPER ── */}
      <div className="relative aspect-[3/4] rounded-tr-3xl rounded-bl-lg rounded-br-lg rounded-tl-sm shadow-[8px_10px_25px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col border border-slate-200"
        style={{ background: bgLight }}>
        
        {/* Binding/Edge decorative element */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/5 border-r border-black/5" />
        
        {/* Folded corner effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-black/10 rounded-bl-2xl shadow-inner pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 border-b border-l border-black/10 rounded-bl-2xl pointer-events-none" />

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-4 pt-10 text-slate-800">
          <div className="mb-auto">
            <FileText className="w-8 h-8 opacity-20 mb-3" style={{ color: bgDark }} />
            <h3 className="font-black text-xs uppercase tracking-wider leading-tight line-clamp-4 text-slate-700">
              {title}
            </h3>
          </div>

          <div className="mt-4 space-y-1.5 opacity-60">
            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-tighter">
              <span className={`w-1.5 h-1.5 rounded-full ${
                level === 'Facile' ? 'bg-emerald-500' : 
                level === 'Moyen' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              {level}
            </div>
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 truncate">
              # {theme}
            </div>
          </div>
        </div>

        {/* Realistic paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]" />
        
        {/* Bottom edge shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10" />
      </div>

      {/* ── FLOATING ACTION BUTTONS ── */}
      <div className="absolute -top-3 -right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-40 translate-x-1 group-hover:translate-x-0">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-1.5 bg-white text-[#5f6ad8] rounded-full shadow-lg hover:bg-indigo-50 border border-slate-100 transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
          className={`p-1.5 rounded-full shadow-lg border border-slate-100 transition-colors ${status === 'actif' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
          {status === 'actif' ? <Archive className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 border border-slate-100 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── STATUS BADGE ── */}
      {status !== 'actif' && (
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 border text-[9px] font-bold rounded-full shadow-sm uppercase tracking-wider z-20 whitespace-nowrap
          ${status === 'brouillon' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          {status === 'brouillon' ? 'Brouillon' : 'Inactif'}
        </div>
      )}
    </motion.div>
  );
}
