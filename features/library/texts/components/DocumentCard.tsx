import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, MoreVertical, FileText, ToggleLeft, ToggleRight } from 'lucide-react';

interface DocumentCardProps {
  id: string;
  title: string;
  coverImage?: string;
  status: 'actif' | 'brouillon' | 'inactif';
  language?: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus?: () => void;
}

export function DocumentCard({ 
  id,
  title, 
  coverImage, 
  status, 
  language,
  onClick, 
  onEdit, 
  onDelete,
  onToggleStatus
}: DocumentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = status === 'actif';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative w-full h-[280px] bg-[#fffdf5] border border-slate-200 shadow-[2px_4px_12px_rgba(0,0,0,0.06)] flex flex-col p-6 cursor-pointer overflow-hidden font-mono"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMenuOpen(false); }}
      onClick={onClick}
    >
      {/* Paper fold effects */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-slate-200/50 to-transparent shadow-[-2px_2px_4px_rgba(0,0,0,0.02)] border-b border-l border-slate-200/50" />
      <div className="absolute inset-x-0 top-16 h-px bg-slate-200/50 pointer-events-none" />

      {/* Official Stamp - seulement si actif */}
      {isActive && (
        <div className="absolute -right-4 top-20 border-2 border-red-700/60 rounded-full w-24 h-24 flex items-center justify-center transform -rotate-12 bg-transparent pointer-events-none shadow-sm z-0">
          <div className="border border-red-700/40 rounded-full w-20 h-20 flex items-center justify-center">
             <span className="text-red-700/60 font-bold text-[10px] uppercase tracking-widest text-center" style={{ fontFamily: 'Georgia, serif' }}>Approuvé</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start z-20">
        <div className="bg-slate-100 p-2 border border-slate-200">
           <FileText className="w-5 h-5 text-slate-500" />
        </div>
        
        {/* Language Badge */}
        {language && (
          <div className="bg-[#5f6ad8]/10 text-[#5f6ad8] px-2 py-1 rounded-full text-xs font-medium border border-[#5f6ad8]/20">
            {language}
          </div>
        )}
        
        {/* Menu Button */}
        <div className="relative z-30 shrink-0">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className={`p-1.5 transition-colors ${menuOpen || isHovered ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Quick Actions Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white border-2 border-slate-800 shadow-[4px_4px_0_rgba(0,0,0,0.1)] z-40"
              >
                <div className="flex flex-col text-sm">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(); setMenuOpen(false); }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-100 border-b border-slate-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Éditer
                  </button>
                  {onToggleStatus && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleStatus(); setMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 border-b border-slate-200 transition-colors"
                    >
                      {isActive 
                        ? <><ToggleLeft className="w-4 h-4" /> Désactiver</> 
                        : <><ToggleRight className="w-4 h-4 text-green-600" /> Activer</>
                      }
                    </button>
                  )}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onDelete(); 
                      setMenuOpen(false);
                    }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 mt-6 z-10 flex flex-col">
         <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold border-b border-slate-200 inline-block w-fit">Sujet :</div>
         <h3 className="text-xl font-bold text-slate-800 line-clamp-3 leading-snug">
           {title}
         </h3>
         
         {coverImage ? (
           <div className="mt-4 w-full h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
             <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
           </div>
         ) : (
           <div className="mt-4 flex-1 flex flex-col gap-2 opacity-30 pointer-events-none">
             <div className="h-2 w-full bg-slate-300 rounded-sm"></div>
             <div className="h-2 w-3/4 bg-slate-300 rounded-sm"></div>
             <div className="h-2 w-5/6 bg-slate-300 rounded-sm"></div>
           </div>
         )}
      </div>

      {/* Footer / Status */}
      <div className="mt-auto pt-4 flex justify-between items-end border-t border-slate-200 border-dashed z-10">
        <div className="flex flex-col">
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Dossier N°</span>
           <span className="text-xs text-slate-800 font-bold tracking-widest">TXT-{id.substring(0, 4)}</span>
        </div>
        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
          isActive 
            ? 'border-green-300 text-green-700 bg-green-50' 
            : status === 'inactif'
              ? 'border-red-200 text-red-600 bg-red-50'
              : 'border-slate-300 text-slate-500 bg-slate-50'
        }`}>
          {isActive ? 'Validé' : status === 'inactif' ? 'Inactif' : 'Brouillon'}
        </span>
      </div>
    </motion.div>
  );
}
