import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Globe, Archive } from 'lucide-react';
import { ContentStatus } from '../../types';

interface BookCardProps {
  id: string;
  title: string;
  coverImage?: string;
  status: ContentStatus;
  variant: 'story' | 'dictionary' | 'text';
  isNew?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

// Each story gets a unique cover color based on its id
const coverColors: [string, string][] = [
  ['#4338ca', '#3730a3'], // indigo
  ['#0891b2', '#0e7490'], // cyan
  ['#dc2626', '#b91c1c'], // red
  ['#16a34a', '#15803d'], // green
  ['#d97706', '#b45309'], // amber
  ['#7c3aed', '#6d28d9'], // purple
  ['#be185d', '#9d174d'], // pink
  ['#0f766e', '#0d6b63'], // teal
  ['#1d4ed8', '#1e40af'], // blue
  ['#65a30d', '#4d7c0f'], // lime
];

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function BookCard({ id, title, coverImage, status, variant, isNew, onClick, onEdit, onDelete, onToggleStatus }: BookCardProps) {
  const [c1, c2] = coverColors[hashId(id) % coverColors.length];

  return (
    <motion.div
      whileHover={{ y: -18, rotateY: -5, transition: { type: 'spring', stiffness: 280, damping: 20 } }}
      className="group relative flex-shrink-0 cursor-pointer"
      style={{ width: 120, perspective: '800px' }}
      onClick={onClick}
    >
      {/* ── 3D BOOK WRAPPER ── */}
      <div 
        className={`relative w-[120px] h-[172px] transition-all duration-300 ${isNew ? 'animate-pulse' : ''}`}
        style={{ 
          transformStyle: 'preserve-3d', 
          boxShadow: isNew ? '0 0 20px 5px rgba(250,204,21,0.6)' : 'none',
          borderRadius: '4px 6px 6px 4px'
        }}
      >

        {/* ── FRONT COVER ── */}
        <div className="absolute inset-0 rounded-r-md flex flex-col overflow-hidden shadow-[4px_6px_20px_rgba(0,0,0,0.25)]"
          style={{ background: `linear-gradient(160deg, ${c1}, ${c2})` }}>

          {/* Binding crease */}
          <div className="absolute left-0 top-0 bottom-0 w-4 z-10"
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)' }} />
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/15 z-10" />

          {/* Cover image or design */}
          {coverImage ? (
            <>
              <img src={coverImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.8) 100%)' }} />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
              {/* Decorative book design */}
              <div className="w-full border-t border-b border-white/25 py-2 text-center my-auto mx-3">
                <p className="text-white/90 font-bold text-[11px] uppercase tracking-widest leading-tight"
                  style={{ fontFamily: 'Georgia, serif' }}>
                  {title.substring(0, 20)}
                </p>
              </div>
              {/* Decorative lines */}
              <div className="absolute bottom-5 left-4 right-4 flex flex-col gap-1">
                <div className="h-px bg-white/20" />
                <div className="h-px bg-white/10" />
              </div>
            </div>
          )}

          {/* Title for image covers */}
          {coverImage && (
            <div className="absolute inset-x-0 bottom-0 z-20 p-3">
              <p className="text-white font-bold text-[11px] leading-snug drop-shadow"
                style={{ fontFamily: 'Georgia, serif' }}>
                {title}
              </p>
            </div>
          )}

          {/* Hardcover bevel (inset border) */}
          <div className="absolute inset-0 rounded-r-md pointer-events-none z-10"
            style={{ boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)' }} />

          {/* Top sheen */}
          <div className="absolute inset-x-0 top-0 h-8 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
        </div>

        {/* ── PAGES EDGE (right side) ── */}
        <div className="absolute top-1 -right-[6px] bottom-1 flex flex-col overflow-hidden"
          style={{ width: 7, background: 'linear-gradient(90deg, #f0ece0 0%, #faf8f2 60%, #e8e4d8 100%)', borderRadius: '0 2px 2px 0', boxShadow: '2px 0 4px rgba(0,0,0,0.12)' }}>
          {[...Array(22)].map((_, i) => (
            <div key={i} className="flex-1 border-b border-[#d4cfc0]/40" />
          ))}
        </div>

        {/* ── TOP COVER EDGE ── */}
        <div className="absolute top-0 left-0 right-0 h-[5px] z-20 rounded-t-sm overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${c2} 0%, ${c1} 50%, ${c2} 100%)`, boxShadow: '0 -1px 3px rgba(0,0,0,0.2)', transform: 'translateY(-4px) scaleX(0.98)' }}>
          <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.4), transparent 20%, transparent 80%, rgba(0,0,0,0.4))' }} />
        </div>

        {/* ── BOOK SHADOW ── */}
        <div className="absolute -bottom-3 left-2 right-2 h-4 -z-10 rounded-full opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)', filter: 'blur(4px)' }} />
        {/* ── NEW STATUS BADGE ── */}
        {isNew && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-yellow-400 border border-yellow-500 text-white text-[9px] font-black rounded-full shadow-lg uppercase tracking-widest z-50 whitespace-nowrap">
            ⭐ Nouveau
          </div>
        )}
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
