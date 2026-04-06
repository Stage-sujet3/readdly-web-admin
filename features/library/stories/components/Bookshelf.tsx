import React, { ReactNode } from 'react';

interface BookshelfProps {
  title: string;
  children: ReactNode;
  theme?: 'library' | 'glass';
}

export function Bookshelf({ title, children, theme = 'library' }: BookshelfProps) {
  const isDraft = theme === 'glass';

  return (
    <div className="mb-12">
      {/* Title */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <span className="w-1.5 h-7 bg-gradient-to-b from-[#5f6ad8] to-[#444fc0] rounded-full" />
        <h3 className="text-lg font-bold text-slate-700 tracking-tight">{title}</h3>
      </div>

      {/* Shelf container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: isDraft
            ? 'rgba(241,243,253,0.9)'
            : 'linear-gradient(180deg, #f4f6fe 0%, #eef0fc 100%)',
          boxShadow: '0 2px 20px rgba(68,79,192,0.08), 0 0 0 1px rgba(165,180,252,0.2)',
          minHeight: '220px',
        }}
      >
        {/* Books row */}
        <div className="px-10 pt-8 pb-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-end gap-6 pb-[26px]" style={{ minHeight: '200px' }}>
            {children}
          </div>
        </div>

        {/* Wooden shelf plank */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            height: 22,
            background: isDraft
              ? 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)'
              : 'linear-gradient(180deg, #c8955c 0%, #a87040 50%, #8a5a2e 100%)',
            boxShadow: isDraft
              ? '0 -1px 0 rgba(148,163,184,0.4), 0 4px 12px rgba(0,0,0,0.08)'
              : '0 -1px 0 rgba(220,160,80,0.5), 0 6px 18px rgba(0,0,0,0.18)',
          }}
        >
          {/* Grain lines */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,0,0,0.3) 60px, rgba(0,0,0,0.3) 61px)',
            }}
          />
          {/* Bottom shadow edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[6px]"
            style={{ background: isDraft ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.22)' }} />
        </div>
      </div>
    </div>
  );
}
