import React from 'react';
import Image from 'next/image';
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
  isNew?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function TextCard({ id, title, coverImage, status, level, theme, isNew, onClick, onEdit, onDelete, onToggleStatus }: TextCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      className={`group relative bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col overflow-hidden ${isNew ? 'animate-[pulse_2s_ease-in-out_infinite] border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : ''}`}
      onClick={onClick}
    >
      {/* Cover Image Banner */}
      <div className="relative w-full aspect-[21/9] bg-indigo-50 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <Image src={coverImage} alt="Cover" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 group-hover:from-indigo-100 group-hover:to-indigo-50 transition-colors duration-500">
            <FileText className="w-12 h-12 text-indigo-300 mb-2 group-hover:text-indigo-500 transition-colors" />
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Sans image</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <div 
            onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shadow-lg backdrop-blur-md ${status === 'actif' ? 'bg-emerald-500/90' : 'bg-slate-800/60'}`}
          >
            <motion.div 
              animate={{ x: status === 'actif' ? 24 : 0 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </div>
        </div>

        {/* Level Badges in bottom left of image */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-1.5 h-4 rounded-full ${
              (level === 'Facile' && i === 1) || (level === 'Moyen' && i <= 2) || (level === 'Difficile') ? 'bg-amber-400' : 'bg-slate-200'
            }`} />
          ))}
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm ${isNew ? 'text-yellow-700 bg-yellow-100' : 'text-indigo-600 bg-indigo-50'}`}>
            {theme}
          </span>
          {isNew && (
            <span className="text-[10px] font-black text-white bg-yellow-400 uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
              ⭐ Nouveau
            </span>
          )}
        </div>
        
        <h3 className={`text-xl font-black leading-tight line-clamp-2 transition-colors mb-4 ${isNew ? 'text-yellow-700 group-hover:text-yellow-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
          {title}
        </h3>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {status}
          </span>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Edit2 className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
