import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Image as ImageIcon, Upload, 
  FileText, Languages, BarChart, Tag, 
  ChevronLeft, ChevronRight, Maximize2, 
  ExternalLink, Loader2, BookOpen
} from 'lucide-react';
import { Story, Language, Level, Theme, ContentStatus } from '../../types';
import { fileToBase64 } from '@/utils/helpers';

interface StoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Story | null;
}

export function StoryFormModal({ isOpen, onClose, onSave, initialData }: StoryFormModalProps) {
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [content, setContent] = useState<string>(initialData?.content || ''); // This will store text or PDF URL/Base64
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || '');
  const [ageGroup, setAgeGroup] = useState<string>(initialData?.ageGroup || '6-8');
  const [level, setLevel] = useState<Level>(initialData?.level || 'Facile');
  const [theme, setTheme] = useState<Theme>(initialData?.theme || 'Animaux');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'brouillon');
  const [language, setLanguage] = useState<Language>(initialData?.language || 'Français');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(initialData?.content && initialData.content.startsWith('data:application/pdf') ? initialData.content : null);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setContent(initialData.content || '');
      setCoverImage(initialData.coverImage || '');
      setAgeGroup(initialData.ageGroup || '6-8');
      setLevel(initialData.level || 'Facile');
      setTheme(initialData.theme || 'Animaux');
      setStatus(initialData.status || 'brouillon');
      setLanguage(initialData.language || 'Français');
      if (initialData.content?.startsWith('data:application/pdf')) {
        setPdfPreview(initialData.content);
      }
    } else {
      setTitle('');
      setDescription('');
      setContent('');
      setCoverImage('');
      setAgeGroup('6-8');
      setLevel('Facile');
      setTheme('Animaux');
      setStatus('brouillon');
      setLanguage('Français');
      setPdfPreview(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;
  const isEdit = !!initialData;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setCoverImage(base64);
      } catch (error) {
        console.error("Failed to convert image to base64:", error);
      }
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        const base64 = await fileToBase64(file);
        setPdfFile(file);
        setPdfPreview(base64);
        setContent(base64); // Storing as base64 for now as per current pattern
      } catch (error) {
        console.error("Failed to convert PDF to base64:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      title, 
      description, 
      content, 
      coverImage, 
      ageGroup, 
      level, 
      theme, 
      status, 
      language,
      type: 'PDF' // Ensuring type is PDF
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:pl-[340px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div
          initial={{ y: 50, opacity: 0, rotateX: 10 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: 50, opacity: 0, rotateX: -10 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-5xl bg-[#faf8f5] rounded-2xl shadow-2xl overflow-hidden border border-[#e8e4db] max-h-[95vh] flex flex-col z-10"
        >
          {/* Sidebar / Decoration */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-b from-[#444fc0] via-[#5f6ad8] to-[#3a44a5] border-r border-black/10 flex flex-col items-center py-8 gap-12 z-20">
            <BookOpen className="w-8 h-8 text-white/40" />
            <div className="flex-1 flex flex-col gap-6">
               {[...Array(6)].map((_, i) => (
                <div key={i} className="w-8 h-1 bg-white/20 rounded-full" />
              ))}
            </div>
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>

          <div className="flex-1 flex flex-col pl-24 pr-10 py-10 min-h-0 relative">
            <div className="flex justify-between items-start mb-8 shrink-0">
              <div>
                <h2 className="text-4xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {isEdit ? `Modifier l'histoire` : `Nouvelle histoire`}
                </h2>
                <p className="text-slate-500 mt-1 font-medium italic">Configurez les détails et importez le PDF de l'histoire.</p>
              </div>
              <button type="button" onClick={onClose} className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="flex-1 flex flex-col min-h-0" onSubmit={handleSubmit}>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-8 pb-10">
                
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                        <FileText className="w-4 h-4" /> Titre de l'histoire
                      </label>
                      <input type="text" placeholder="Entrez un titre captivant..." className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 text-slate-800 placeholder-slate-300 font-bold transition-all shadow-sm text-xl font-serif" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                        Description courte
                      </label>
                      <textarea placeholder="De quoi parle cette histoire en quelques mots ?" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 text-slate-700 placeholder-slate-300 resize-none h-28 transition-all shadow-sm italic leading-relaxed text-lg" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                        <ImageIcon className="w-4 h-4" /> Couverture
                      </label>
                      <div 
                        onClick={() => coverInputRef.current?.click()}
                        className="relative aspect-[3/4] bg-white border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-[#5f6ad8] hover:bg-[#5f6ad8]/5 transition-all group shadow-sm"
                      >
                        {coverImage ? (
                          <div className="w-full h-full p-2">
                             <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover rounded-xl shadow-md" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Upload className="w-10 h-10 text-white" />
                             </div>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:scale-110 transition-transform shadow-sm">
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Cliquer pour <br/>importer</p>
                          </div>
                        )}
                        <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                      </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 w-full" />

                {/* Section 2: PDF Upload */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" /> Fichier PDF de l'histoire
                  </label>
                  <div 
                    onClick={() => pdfInputRef.current?.click()}
                    className={`relative w-full border-2 border-dashed rounded-2xl p-8 flex items-center justify-between transition-all cursor-pointer group shadow-sm
                      ${pdfPreview ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-[#5f6ad8] hover:bg-[#5f6ad8]/5'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm
                        ${pdfPreview ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${pdfPreview ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {pdfFile ? pdfFile.name : (isEdit && pdfPreview) ? "PDF déjà importé" : "Choisir un fichier PDF"}
                        </p>
                        <p className="text-sm font-medium text-slate-400">PDF uniquement • Max 10Mo</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold transition-all
                      ${pdfPreview ? 'bg-emerald-200/50 text-emerald-700' : 'bg-slate-100 text-slate-500 group-hover:bg-[#5f6ad8] group-hover:text-white'}`}>
                      {pdfPreview ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                      {pdfPreview ? "Remplacer" : "Importer"}
                    </div>
                    
                    <input type="file" ref={pdfInputRef} onChange={handlePdfChange} accept="application/pdf" className="hidden" />
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 w-full" />

                {/* Section 3: Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                      Âge cible
                    </label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 text-slate-700 font-bold transition-all shadow-sm cursor-pointer" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                      <option value="3-5">3-5 ans</option><option value="6-8">6-8 ans</option><option value="9-12">9-12 ans</option><option value="13+">13+ ans</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                      <BarChart className="w-4 h-4" /> Niveau
                    </label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 text-slate-700 font-bold transition-all shadow-sm cursor-pointer" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                      <option value="Facile">Facile</option><option value="Moyen">Moyen</option><option value="Difficile">Difficile</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                      <Tag className="w-4 h-4" /> Thème
                    </label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 text-slate-700 font-bold transition-all shadow-sm cursor-pointer" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                      <option value="Animaux">Animaux</option><option value="École">École</option><option value="Émotions">Émotions</option><option value="Famille">Famille</option><option value="Nature">Nature</option><option value="Aventure">Aventure</option><option value="Science">Science</option><option value="Histoire">Histoire</option><option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                      <Languages className="w-4 h-4" /> Langue
                    </label>
                    <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 text-slate-700 font-bold transition-all shadow-sm cursor-pointer" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                      <option value="Français">Français</option><option value="Anglais">Anglais</option><option value="Arabe">Arabe</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner
                      ${status === 'actif' ? 'bg-emerald-100 text-emerald-600' : status === 'inactif' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {status === 'actif' ? <Check className="w-6 h-6" /> : status === 'inactif' ? <X className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">Statut de l'histoire</p>
                      <p className="text-sm text-slate-500 font-medium">Déterminez la visibilité pour les utilisateurs.</p>
                    </div>
                  </div>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                    {(['brouillon', 'actif', 'inactif'] as ContentStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all
                          ${status === s 
                            ? (s === 'actif' ? 'bg-emerald-500 text-white shadow-md' : s === 'inactif' ? 'bg-red-500 text-white shadow-md' : 'bg-amber-500 text-white shadow-md')
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="shrink-0 pt-8 mt-4 border-t border-[#e8e4db] flex justify-end items-center gap-4">
                <button type="button" onClick={onClose} className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Annuler</button>
                <button type="submit" className="px-10 py-3.5 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3">
                  <Check className="w-6 h-6" /> 
                  <span>{isEdit ? "Mettre à jour" : "Créer l'histoire"}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function StoryViewModal({ isOpen, onClose, content }: { isOpen: boolean, onClose: () => void, content: Story | null }) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  if (!isOpen || !content) return null;

  // content.content stores the base64 or URL
  const pdfUrl = content.content;
  const isPdf = pdfUrl?.startsWith('data:application/pdf') || pdfUrl?.endsWith('.pdf');

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 md:pl-[340px] perspective-[2000px] ${isFullScreen ? 'p-0 md:pl-0' : ''}`}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />

        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className={`relative bg-slate-900 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-10 
            ${isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'}`}
        >
          {/* Reader Top Bar */}
          <div className="bg-slate-800/50 border-b border-white/5 px-6 py-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-[#5f6ad8] rounded-xl flex items-center justify-center shadow-lg">
                 <BookOpen className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-lg select-none">{content.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{content.theme}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{content.language}</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Maximize2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose} 
                className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Interface */}
          <div className="flex-1 relative bg-[#1c1c1c] flex flex-col pt-4 overflow-hidden">
             {loading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-slate-900/60 backdrop-blur-sm">
                 <Loader2 className="w-12 h-12 text-[#5f6ad8] animate-spin mb-4" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Préparation de votre livre...</p>
               </div>
             )}

             {isPdf ? (
               <div className="flex-1 flex flex-col overflow-hidden px-4 md:px-0">
                  <div className="flex-1 max-w-4xl mx-auto w-full relative shadow-2xl rounded-lg overflow-hidden border border-white/5">
                    <iframe 
                      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                      className="w-full h-full bg-white transition-opacity duration-500" 
                      onLoad={() => setLoading(false)}
                      title={content.title}
                    />
                  </div>
                  
                  {/* Interactive Controls (Simplified simulation of book experience) */}
                  {!loading && (
                    <div className="py-8 flex flex-col items-center gap-6 z-20">
                      <div className="flex items-center gap-12">
                        <button className="w-14 h-14 bg-white/5 hover:bg-[#5f6ad8] text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl border border-white/5">
                          <ChevronLeft className="w-8 h-8" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                          {[1, 2, 3, 4, 5].map((p) => (
                            <div key={p} className={`w-3 h-3 rounded-full transition-all duration-300 ${p === currentPage ? 'bg-[#5f6ad8] w-8' : 'bg-slate-700'}`} />
                          ))}
                        </div>

                        <button className="w-14 h-14 bg-white/5 hover:bg-[#5f6ad8] text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl border border-white/5">
                          <ChevronRight className="w-8 h-8" />
                        </button>
                      </div>
                      
                      <div className="px-6 py-2 bg-slate-800/80 rounded-full border border-white/5 shadow-2xl">
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Expérience de lecture optimisée</p>
                      </div>
                    </div>
                  )}
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6">
                    <X className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-4">Média non supporté</h3>
                  <p className="text-slate-500 max-w-sm font-medium italic leading-relaxed">
                    Cette histoire n'est pas au format PDF. Veuillez modifier l'histoire pour importer un fichier PDF valide.
                  </p>
                  <button onClick={onClose} className="mt-8 px-8 py-3 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    Retourner à la bibliothèque
                  </button>
               </div>
             )}
          </div>
          
          {/* Bottom Shadow Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
