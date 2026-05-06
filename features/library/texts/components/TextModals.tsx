import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, Loader2 } from 'lucide-react';
import { EducationalText, Language, Level, Theme } from '../../types';

interface TextFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: EducationalText | null;
}

export function TextFormModal({ isOpen, onClose, onSave, initialData }: TextFormModalProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [language, setLanguage] = useState<string>('Français');
  const [status, setStatus] = useState<string>('brouillon');
  const [level, setLevel] = useState<Level>('Facile');
  const [theme, setTheme] = useState<Theme>('Général');
  const [ageGroup, setAgeGroup] = useState<string>('6-8');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setLanguage(initialData.language || 'Français');
      setStatus(initialData.status || 'brouillon');
      setLevel(initialData.level || 'Facile');
      setTheme(initialData.theme || 'Général');
      setAgeGroup(initialData.ageGroup || '6-8');
    } else {
      setTitle('');
      setContent('');
      setLanguage('Français');
      setStatus('brouillon');
      setLevel('Facile');
      setTheme('Général');
      setAgeGroup('6-8');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;
  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ title, content, language, status, level, theme, ageGroup });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 md:pl-[340px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
        <motion.div
           initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
           className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[3rem] shadow-2xl flex flex-col border border-slate-200 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-200">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {isEdit ? 'Modifier le Texte' : 'Nouveau Texte Éducatif'}
                </h2>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Éditeur de contenu pédagogique</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 flex min-h-0">
            {/* Left Sidebar - Meta */}
            <div className="w-80 bg-slate-50/50 border-r border-slate-100 p-10 space-y-10 overflow-y-auto custom-scrollbar">
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Configuration</label>
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                         <span className="text-[9px] font-bold text-slate-500 ml-1">Langue</span>
                         <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm shadow-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
                           <option value="Français">Français</option><option value="Anglais">Anglais</option><option value="Arabe">Arabe</option>
                         </select>
                       </div>
                       <div className="space-y-1.5">
                         <span className="text-[9px] font-bold text-slate-500 ml-1">Niveau</span>
                         <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm shadow-sm" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                           <option value="Facile">Facile</option><option value="Moyen">Moyen</option><option value="Difficile">Difficile</option>
                         </select>
                       </div>
                       <div className="space-y-1.5">
                         <span className="text-[9px] font-bold text-slate-500 ml-1">Thème</span>
                         <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm shadow-sm" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                           <option value="Général">Général</option><option value="Animaux">Animaux</option><option value="École">École</option><option value="Émotions">Émotions</option><option value="Famille">Famille</option><option value="Nature">Nature</option><option value="Aventure">Aventure</option><option value="Science">Science</option><option value="Histoire">Histoire</option><option value="Sports">Sports</option><option value="Espace">Espace</option><option value="Alimentation">Alimentation</option><option value="Voyage">Voyage</option><option value="Technologie">Technologie</option><option value="Autre">Autre</option>
                         </select>
                       </div>
                       <div className="space-y-1.5">
                         <span className="text-[9px] font-bold text-slate-500 ml-1">Tranche d'âge</span>
                         <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm shadow-sm" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                           <option value="3-5">3-5 ans</option><option value="6-8">6-8 ans</option><option value="9-12">9-12 ans</option><option value="13+">13+ ans</option>
                         </select>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut de publication</label>
                    <div className="flex flex-col gap-2">
                      {(['brouillon', 'actif', 'inactif'] as const).map((s) => (
                        <button key={s} type="button" onClick={() => setStatus(s)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${status === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200'}`}>
                          <div className={`w-2 h-2 rounded-full ${status === s ? 'bg-white' : 'bg-slate-300'}`} />
                          {s}
                        </button>
                      ))}
                    </div>
                 </div>
               </div>

               <div className="pt-10 border-t border-slate-100">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                    Enregistrer
                  </button>
               </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col p-12 gap-8 overflow-hidden">
               <div className="space-y-2">
                  <label className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Titre de la leçon</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Le voyage de l'eau..." 
                    className="w-full bg-slate-50 border-b-2 border-slate-100 px-0 py-4 outline-none focus:border-indigo-500 text-slate-800 font-black text-4xl transition-all placeholder:text-slate-200" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                  />
               </div>

               <div className="flex-1 flex flex-col min-h-0">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 mb-4">Contenu didactique</label>
                  <textarea 
                    placeholder="Écrivez le savoir ici..." 
                    className="flex-1 w-full bg-slate-50/30 border border-slate-100 rounded-[2.5rem] px-10 py-10 outline-none focus:bg-white focus:border-indigo-500 text-slate-700 font-medium text-lg leading-relaxed resize-none custom-scrollbar shadow-inner" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                  />
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function TextViewModal({ isOpen, onClose, content }: { isOpen: boolean, onClose: () => void, content: EducationalText | null }) {
  if (!isOpen || !content) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 md:pl-[340px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
        
        <motion.div
           initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
           className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-2xl flex flex-col border border-slate-200 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-200">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{content.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{content.theme}</span>
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{content.level}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
             <div className="max-w-3xl mx-auto">
                <p className="text-slate-700 text-xl leading-relaxed font-medium whitespace-pre-wrap italic opacity-80 border-l-4 border-indigo-100 pl-8">
                  {content.content}
                </p>
             </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-center">
             <button onClick={onClose} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-800 hover:text-white transition-all shadow-sm">
               Fermer la lecture
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
