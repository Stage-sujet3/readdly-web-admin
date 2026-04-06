import React from 'react';
import { BookOpen, BookMarked, FileText, Library } from 'lucide-react';

// Muted, soft book spines — calm and eye-friendly, harmonized with indigo theme
const BookSpines = () => {
  const books = [
    { w: 18, color: 'rgba(255,255,255,0.25)', h: 82 }, { w: 26, color: 'rgba(199,210,254,0.35)', h: 90 },
    { w: 14, color: 'rgba(255,255,255,0.18)', h: 72 }, { w: 22, color: 'rgba(224,231,255,0.28)', h: 94 },
    { w: 16, color: 'rgba(165,180,252,0.4)', h: 78 }, { w: 30, color: 'rgba(255,255,255,0.2)', h: 86 },
    { w: 12, color: 'rgba(199,210,254,0.45)', h: 68 }, { w: 24, color: 'rgba(255,255,255,0.15)', h: 92 },
    { w: 18, color: 'rgba(224,231,255,0.3)', h: 76 }, { w: 20, color: 'rgba(165,180,252,0.35)', h: 88 },
    { w: 14, color: 'rgba(255,255,255,0.22)', h: 74 }, { w: 26, color: 'rgba(199,210,254,0.4)', h: 96 },
    { w: 16, color: 'rgba(224,231,255,0.25)', h: 80 }, { w: 22, color: 'rgba(255,255,255,0.18)', h: 90 },
    { w: 12, color: 'rgba(165,180,252,0.5)', h: 66 }, { w: 28, color: 'rgba(199,210,254,0.3)', h: 93 },
    { w: 18, color: 'rgba(255,255,255,0.28)', h: 81 }, { w: 20, color: 'rgba(224,231,255,0.35)', h: 85 },
    { w: 14, color: 'rgba(165,180,252,0.42)', h: 71 }, { w: 24, color: 'rgba(255,255,255,0.2)', h: 89 },
    { w: 16, color: 'rgba(199,210,254,0.38)', h: 77 }, { w: 18, color: 'rgba(255,255,255,0.25)', h: 84 },
    { w: 22, color: 'rgba(165,180,252,0.45)', h: 91 }, { w: 12, color: 'rgba(224,231,255,0.3)', h: 69 },
    { w: 28, color: 'rgba(255,255,255,0.22)', h: 95 }, { w: 16, color: 'rgba(199,210,254,0.35)', h: 79 },
    { w: 20, color: 'rgba(165,180,252,0.4)', h: 87 }, { w: 14, color: 'rgba(255,255,255,0.18)', h: 73 },
  ];
  return (
    <div className="flex items-end gap-[2px] h-full">
      {books.map((b, i) => (
        <div key={i} style={{ width: b.w, height: b.h, backgroundColor: b.color }}
          className="rounded-t-[1px] flex-shrink-0 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/30" />
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-black/10" />
        </div>
      ))}
    </div>
  );
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full bg-[#edeffa]">

      {/* ── CLEAN LIBRARY HEADER ── */}
      <div className="relative mx-6 mt-6 mb-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">

        {/* Left bold indigo accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#5f6ad8] to-[#444fc0]" />

        {/* Very subtle dot pattern on the right */}
        <div className="absolute right-0 inset-y-0 w-80 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #5f6ad8 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

        {/* Book silhouettes row — on the right, very soft */}
        <div className="absolute right-20 bottom-0 flex items-end gap-[3px] h-[70px] opacity-[0.08]">
          {[22,16,28,14,20,26,12,18,24,16,20,14,30,18,12,22].map((h, i) => (
            <div key={i} style={{ width: i % 3 === 0 ? 14 : i % 2 === 0 ? 18 : 12, height: h, backgroundColor: '#444fc0' }}
              className="rounded-t-[1px] flex-shrink-0" />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-between px-10 py-6 pl-12">

          {/* Left: Icon + Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #eef0fc, #e0e4fa)', border: '1px solid rgba(95,106,216,0.15)' }}>
              <Library className="w-6 h-6 text-[#5f6ad8]" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#5f6ad8] mb-0.5">
                Administration • Contenu
              </p>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}>
                La Bibliothèque
              </h1>
              <p className="text-sm text-slate-400 mt-0.5 font-medium">
                Gérez vos histoires, mots et textes éducatifs
              </p>
            </div>
          </div>

          {/* Right: Category pills */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { icon: BookOpen, label: 'Histoires' },
              { icon: BookMarked, label: 'Dictionnaire' },
              { icon: FileText, label: 'Textes' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-default"
                style={{ background: '#f0f2fc', border: '1px solid rgba(95,106,216,0.15)' }}>
                <Icon className="w-4 h-4 text-[#5f6ad8]" />
                <span className="text-sm font-semibold text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8">
        {children}
      </div>
    </div>

  );
}
