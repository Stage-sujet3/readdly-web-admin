import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative w-full h-[220px] bg-[#fcfaf5] border border-[#e8dcc5] shadow-[0_4px_10px_rgba(0,0,0,0.03)] rounded-sm flex flex-col p-6 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMenuOpen(false); }}
      onClick={onClick}
    >
      {/* Decorative top red line reminiscent of dictionary headers */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#6b1e1e]" />

      <div className="flex justify-between items-start min-h-0">
        <h3 className="text-3xl font-extrabold text-[#2a1810] pr-4 line-clamp-1 truncate" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h3>
        
        {/* Menu Button */}
        <div className="relative z-20 shrink-0">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className={`p-2 rounded-full transition-colors ${menuOpen || isHovered ? 'opacity-100 hover:bg-black/5' : 'opacity-0'}`}
          >
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>

          {/* Quick Actions Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30"
              >
                <div className="p-2 space-y-1">
                  <button onClick={(e) => { e.stopPropagation(); onToggleStatus(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${status === 'published' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    {status === 'published' ? 'Passer en brouillon' : 'Publier'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#6b1e1e] hover:bg-[#6b1e1e]/5 rounded-lg">
                    <Edit2 className="w-4 h-4" /> Éditer
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 mt-4 overflow-hidden">
         <p className="text-[#3a2010]/80 italic line-clamp-3 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
           {definition || 'Aucune définition fournie...'}
         </p>
      </div>

      {/* Footer / Status */}
      <div className="mt-auto pt-4 border-t border-[#e8dcc5]/60 flex justify-between items-center text-xs font-bold tracking-widest text-[#6b1e1e]/50 font-serif uppercase shrink-0">
        <span>Dict. Entry</span>
        <span className={`px-2 py-1 rounded-sm text-[10px] ${status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
      </div>
    </motion.div>
  );
}
