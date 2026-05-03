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
  onSave: (data: any, isFormData?: boolean) => void;
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

  const [isUploading, setIsUploading] = useState(false);

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
      setPdfFile(null);
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
      } catch (error) {
        console.error("Failed to convert PDF to base64:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      if (pdfFile) {
        // Mode PDF : on retourne un FormData
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('coverImage', coverImage);
        formData.append('ageGroup', ageGroup);
        formData.append('level', level);
        formData.append('theme', theme);
        formData.append('status', status);
        formData.append('language', language);
        
        await onSave(formData, true); // true = isFormData
      } else {
        // Mode classique
        await onSave({ 
          title, 
          description, 
          content, 
          coverImage, 
          ageGroup, 
          level, 
          theme, 
          status, 
          language,
          type: 'TEXT'
        }, false);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
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
                <button type="button" onClick={onClose} disabled={isUploading} className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-50">Annuler</button>
                <button type="submit" disabled={isUploading} className="px-10 py-3.5 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 disabled:opacity-70 disabled:hover:-translate-y-0">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                  <span>{isUploading ? "Extraction en cours..." : isEdit ? "Mettre à jour" : "Créer l'histoire"}</span>
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');

  const WORDS_PER_PAGE = 220;

  // Detect if text is Arabic
  const isArabic = React.useMemo(() => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(content?.content || '');
  }, [content?.content]);

  const pages = React.useMemo(() => {
    if (!content?.content) return ["Le contenu de l'histoire est vide ou indisponible."];
    const words = content.content.split(/\s+/).filter(Boolean);
    const result: string[] = [];
    for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
      result.push(words.slice(i, i + WORDS_PER_PAGE).join(' '));
    }
    return result.length > 0 ? result : ["Le contenu de l'histoire est vide ou indisponible."];
  }, [content?.content]);

  const totalPages = pages.length;
  const progress = totalPages > 1 ? (currentPage / (totalPages - 1)) * 100 : 100;

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      const timer = setTimeout(() => setLoading(false), 450);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [isOpen]);

  if (!isOpen || !content) return null;

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setFlipDirection('right');
      setCurrentPage(p => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setFlipDirection('left');
      setCurrentPage(p => p - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') goNext();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'Escape') onClose();
  };

  // ── Theme palette (matches dashboard) ──
  const C = {
    primary:     '#5f6ad8',
    primaryDark: '#444fc0',
    primaryDeep: '#3a44a5',
    bg:          '#0f172a',   // deepest dark
    navy:        '#1a2a4a',   // dashboard dark bg
    navyAlt:     '#162035',
    surface:     '#1f2b4a',   // card surface
    surfaceAlt:  '#253252',
    border:      'rgba(95,106,216,0.18)',
    borderSoft:  'rgba(255,255,255,0.06)',
    textPrimary: '#e8eaf8',
    textMuted:   'rgba(200,205,240,0.55)',
    glow:        'rgba(95,106,216,0.25)',
  };

  // Arabic font stack
  const arabicFontStack = '"Scheherazade New", "Amiri", "Noto Naskh Arabic", "Noto Sans Arabic", "Arabic Typesetting", system-ui, sans-serif';
  const latinFontStack  = 'Georgia, "Times New Roman", serif';

  const fontFamily   = isArabic ? arabicFontStack : latinFontStack;
  const textDir      = isArabic ? 'rtl' : 'ltr';
  const textAlign    = isArabic ? 'right' : 'justify';
  const textIndent   = isArabic ? '0'     : '2em';

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center ${isFullScreen ? '' : 'p-3 md:p-5 md:pl-[320px]'}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: 'rgba(10,14,30,0.92)', backdropFilter: 'blur(12px)' }}
        />

        {/* Ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '700px', height: '500px',
            background: `radial-gradient(ellipse, ${C.glow} 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />

        {/* ═══ MAIN MODAL ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.94 }}
          transition={{ type: 'spring', damping: 26, stiffness: 200 }}
          className="relative z-10 flex flex-col"
          style={{
            width:  isFullScreen ? '100vw' : 'min(94vw, 880px)',
            height: isFullScreen ? '100vh' : 'min(92vh, 700px)',
          }}
        >
          {/* Loading overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                style={{
                  background: C.navy,
                  borderRadius: isFullScreen ? '0' : '1.5rem',
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` }}
                >
                  <BookOpen className="w-7 h-7 text-white animate-pulse" />
                </div>
                <p style={{ color: C.textMuted, fontFamily: latinFontStack, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Chargement...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── BOOK CONTAINER ── */}
          <div
            className="w-full h-full flex flex-col"
            style={{
              background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyAlt} 100%)`,
              borderRadius: isFullScreen ? '0' : '1.5rem',
              border: `1px solid ${C.border}`,
              boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.borderSoft}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              overflow: 'hidden',
            }}
          >
            {/* ── HEADER BAR ── */}
            <div
              className="flex items-center justify-between px-5 py-3.5 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surfaceAlt} 100%)`,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, boxShadow: `0 4px 12px ${C.glow}` }}
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="font-bold text-sm leading-tight select-none"
                    style={{ color: C.textPrimary }}
                    dir={textDir}
                  >
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {[content.theme, content.language, content.level].filter(Boolean).map((tag, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: C.textMuted, display: 'inline-block' }} />}
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {tag}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 rounded-xl transition-all hover:scale-110"
                  style={{ color: C.textMuted, background: C.borderSoft }}
                  title={isFullScreen ? 'Réduire' : 'Plein écran'}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl transition-all hover:scale-110"
                  style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── BOOK BODY ── */}
            <div className="flex flex-1 min-h-0">

              {/* Left spine */}
              <div
                className="shrink-0 flex flex-col items-center justify-between py-8"
                style={{
                  width: '44px',
                  background: `linear-gradient(180deg, ${C.primaryDeep} 0%, ${C.primaryDark} 40%, ${C.primaryDeep} 100%)`,
                  borderRight: `1px solid ${C.border}`,
                  boxShadow: 'inset -3px 0 10px rgba(0,0,0,0.3)',
                }}
              >
                {/* Title vertical */}
                <div
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontFamily: isArabic ? arabicFontStack : latinFontStack,
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    maxHeight: '130px',
                    overflow: 'hidden',
                  }}
                  dir="ltr"
                >
                  {content.title}
                </div>

                {/* Spine stripes */}
                <div className="flex flex-col items-center gap-2.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ width: '18px', height: '1px', background: 'rgba(255,255,255,0.15)', borderRadius: '1px' }} />
                  ))}
                </div>

                {/* Spine logo mark */}
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }} />
              </div>

              {/* Page area */}
              <div
                className="flex-1 flex flex-col min-h-0 relative"
                style={{ background: C.surface }}
              >
                {/* Crease shadow */}
                <div
                  className="absolute left-0 top-0 bottom-0 pointer-events-none z-10"
                  style={{ width: '24px', background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}
                />

                {/* Page header */}
                <div
                  className="shrink-0 flex items-center justify-between px-8 pt-4 pb-2.5"
                  style={{ borderBottom: `1px solid ${C.borderSoft}` }}
                >
                  <span style={{ fontSize: '0.58rem', color: C.textMuted, fontFamily: latinFontStack, fontStyle: 'italic' }}>
                    Readdly
                  </span>
                  <span style={{ fontSize: '0.65rem', color: C.primary, fontFamily: latinFontStack }}>✦</span>
                  <span style={{ fontSize: '0.58rem', color: C.textMuted, fontFamily: isArabic ? arabicFontStack : latinFontStack, fontStyle: isArabic ? 'normal' : 'italic', direction: textDir }}>
                    {content.title}
                  </span>
                </div>

                {/* Scrollable text content */}
                <div
                  className="flex-1 overflow-y-auto px-8 py-5 min-h-0"
                  dir={textDir}
                  style={{ scrollbarWidth: 'thin', scrollbarColor: `${C.primary}40 transparent` }}
                >
                  {/* Title block on first page */}
                  {currentPage === 0 && (
                    <div className="text-center mb-8" dir={textDir}>
                      <h2
                        style={{
                          fontSize: '1.6rem',
                          fontFamily,
                          fontWeight: 700,
                          color: C.textPrimary,
                          lineHeight: 1.3,
                          marginBottom: '0.5rem',
                          direction: textDir,
                        }}
                      >
                        {content.title}
                      </h2>
                      {/* Divider */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', margin: '1rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: `linear-gradient(${isArabic ? '270' : '90'}deg, transparent, ${C.primary}50)` }} />
                        <span style={{ fontSize: '0.9rem', color: C.primary, opacity: 0.7 }}>❧</span>
                        <div style={{ flex: 1, height: '1px', background: `linear-gradient(${isArabic ? '90' : '270'}deg, transparent, ${C.primary}50)` }} />
                      </div>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {[content.theme, content.language, content.level, content.ageGroup ? `${content.ageGroup} ans` : null].filter(Boolean).map((tag, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              color: C.primary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.12em',
                              background: `${C.primary}15`,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: `1px solid ${C.primary}25`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Page text with animation */}
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: flipDirection === 'right' ? 24 : -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    dir={textDir}
                  >
                    {pages[currentPage]?.split(/(?<=[.!?؟])\s+/).map((sentence, i) => {
                      // Drop cap on first sentence of first page (only for non-Arabic)
                      if (!isArabic && currentPage === 0 && i === 0 && sentence.length > 1) {
                        const firstLetter = sentence[0];
                        const rest = sentence.slice(1);
                        return (
                          <p
                            key={i}
                            style={{
                              fontFamily,
                              fontSize: '1.05rem',
                              lineHeight: '1.9',
                              color: C.textPrimary,
                              marginBottom: '0.8rem',
                              textAlign,
                              direction: textDir,
                            }}
                          >
                            <span
                              style={{
                                float: 'left',
                                fontSize: '3.8rem',
                                lineHeight: '0.75',
                                fontWeight: 700,
                                color: C.primary,
                                fontFamily: latinFontStack,
                                marginRight: '6px',
                                marginTop: '6px',
                              }}
                            >
                              {firstLetter}
                            </span>
                            {rest}
                          </p>
                        );
                      }
                      return (
                        <p
                          key={i}
                          style={{
                            fontFamily,
                            fontSize: '1.05rem',
                            lineHeight: isArabic ? '2.2' : '1.9',
                            color: C.textPrimary,
                            marginBottom: '0.8rem',
                            textAlign,
                            direction: textDir,
                            textIndent: (currentPage === 0 && i === 0) ? '0' : textIndent,
                          }}
                        >
                          {sentence}
                        </p>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Page footer */}
                <div
                  className="shrink-0 flex items-center justify-between px-8 pb-3.5 pt-2.5"
                  style={{ borderTop: `1px solid ${C.borderSoft}` }}
                >
                  <span style={{ fontSize: '0.58rem', color: C.textMuted, fontFamily: latinFontStack, fontStyle: 'italic' }}>
                    {content.ageGroup ? `Tranche ${content.ageGroup} ans` : ''}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: `${C.primary}90`, fontFamily: latinFontStack, fontWeight: 700 }}>
                    — {currentPage + 1} —
                  </span>
                  <span style={{ fontSize: '0.58rem', color: C.textMuted, fontFamily: latinFontStack, fontStyle: 'italic' }}>
                    {content.author || 'Readdly'}
                  </span>
                </div>
              </div>

              {/* Right edge shadow */}
              <div style={{ width: '10px', background: 'linear-gradient(270deg, rgba(0,0,0,0.12) 0%, transparent 100%)', shrink: 0, flexShrink: 0 }} />
            </div>

            {/* ── NAVIGATION ── */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              style={{ borderTop: `1px solid ${C.border}`, background: `${C.navyAlt}` }}
            >
              {/* Prev */}
              <motion.button
                whileHover={{ scale: currentPage > 0 ? 1.06 : 1 }}
                whileTap={{ scale: currentPage > 0 ? 0.95 : 1 }}
                onClick={goPrev}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all"
                style={{
                  background: currentPage === 0 ? C.borderSoft : `${C.primary}20`,
                  color: currentPage === 0 ? 'rgba(255,255,255,0.2)' : C.primary,
                  border: `1px solid ${currentPage === 0 ? 'transparent' : C.primary + '40'}`,
                  fontSize: '0.8rem',
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: latinFontStack,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Précédente
              </motion.button>

              {/* Progress dots */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(totalPages, 9) }).map((_, i) => {
                    const targetPage = totalPages <= 9 ? i : Math.round((i / 8) * (totalPages - 1));
                    const isActive = totalPages <= 9 ? i === currentPage : Math.abs(targetPage - currentPage) < Math.ceil(totalPages / 9);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setFlipDirection(targetPage > currentPage ? 'right' : 'left');
                          setCurrentPage(targetPage);
                        }}
                        style={{
                          width: isActive ? '18px' : '5px',
                          height: '5px',
                          borderRadius: '3px',
                          background: isActive ? C.primary : `${C.primary}35`,
                          transition: 'all 0.3s ease',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      />
                    );
                  })}
                </div>
                <span style={{ fontSize: '0.58rem', color: C.textMuted, letterSpacing: '0.08em', fontFamily: latinFontStack }}>
                  {currentPage + 1} / {totalPages}
                </span>
              </div>

              {/* Next */}
              <motion.button
                whileHover={{ scale: currentPage < totalPages - 1 ? 1.06 : 1 }}
                whileTap={{ scale: currentPage < totalPages - 1 ? 0.95 : 1 }}
                onClick={goNext}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all"
                style={{
                  background: currentPage === totalPages - 1 ? C.borderSoft : `${C.primary}20`,
                  color: currentPage === totalPages - 1 ? 'rgba(255,255,255,0.2)' : C.primary,
                  border: `1px solid ${currentPage === totalPages - 1 ? 'transparent' : C.primary + '40'}`,
                  fontSize: '0.8rem',
                  cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontFamily: latinFontStack,
                }}
              >
                Suivante
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Reading progress bar */}
            <div style={{ height: '3px', background: `${C.primary}15` }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${C.primaryDark}, ${C.primary})`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

