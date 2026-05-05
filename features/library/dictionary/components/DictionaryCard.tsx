import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, BookOpen } from 'lucide-react';

interface DictionaryCardProps {
  id: string;
  title: string;
  definition?: string;
  status: 'published' | 'draft' | 'archived';
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function DictionaryCard({ 
  title, 
  definition, 
  status, 
  onClick, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: DictionaryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col h-[220px]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
          <BookOpen className="w-6 h-6 text-amber-600 group-hover:text-white" />
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-100 transition-all shadow-sm">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-100 transition-all shadow-sm">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-400 italic line-clamp-2 leading-relaxed">
          {definition || "Collection de vocabulaire thématique..."}
        </p>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dictionnaire</span>
        <div 
          onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
          className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm transition-colors cursor-pointer
            ${status === 'published' ? 'bg-emerald-500' : 'bg-slate-300'}`}
        />
      </div>
    </motion.div>
  );
}
