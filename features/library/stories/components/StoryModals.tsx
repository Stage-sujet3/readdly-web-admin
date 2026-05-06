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
import { ProgressBar } from '@/components/ui/ProgressBar';

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
  const [theme, setTheme] = useState<Theme>(initialData?.theme || 'Général');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'brouillon');
  const [language, setLanguage] = useState<Language>(initialData?.language || 'Français');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(initialData?.content && initialData.content.startsWith('data:application/pdf') ? initialData.content : null);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('Préparation...');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setContent(initialData.content || '');
      setCoverImage(initialData.coverImage || '');
      setAgeGroup(initialData.ageGroup || '6-8');
      setLevel(initialData.level || 'Facile');
      setTheme(initialData.theme || 'Général');
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
      setTheme('Général');
      setStatus('brouillon');
      setLanguage('Français');
      setPdfPreview(null);
      setPdfFile(null);
      setUploadProgress(0);
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
    setUploadProgress(10);
    setUploadMessage('Initialisation de l\'upload...');
    
    try {
      if (pdfFile) {
        // Mode PDF : on retourne un FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ageGroup', ageGroup);
        formData.append('level', level);
        formData.append('theme', theme);
        formData.append('language', language);
        formData.append('status', status);
        if (coverImage) {
          formData.append('coverImage', coverImage);
        }
        formData.append('file', pdfFile);
        
        // Simulate progress for OCR which can be slow
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev < 30) {
              setUploadMessage('Upload du fichier en cours...');
              return prev + 5;
            }
            if (prev < 80) {
              setUploadMessage('Extraction du texte via OCR...');
              return prev + 2;
            }
            if (prev < 95) {
              setUploadMessage('Finalisation et enregistrement...');
              return prev + 1;
            }
            return prev;
          });
        }, 500);

        await onSave(formData, true); // true = isFormData
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadMessage('Terminé !');
      } else {
        // Mode classique (ou édition d'un PDF sans changer le fichier)
        // On préserve le type s'il existe déjà dans initialData (ex: PDF), sinon par défaut 'TEXT'
        const storyType = initialData?.type || 'TEXT';
        
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
          type: storyType
        }, false);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 md:pl-[340px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col z-10"
          style={{ height: 'auto', maxHeight: '90vh' }}
        >
          <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isEdit ? `Modifier l'histoire` : `Nouvelle Histoire`}
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuration de la bibliothèque</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="p-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-5 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Titre de l'histoire</label>
                  <input type="text" placeholder="Ex: Le Petit Prince..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-bold transition-all text-lg" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
                  <textarea placeholder="Résumé de l'histoire..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-600 font-medium resize-none h-[120px] transition-all" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="pt-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-3 block">Statut de publication</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                    {(['brouillon', 'actif', 'inactif'] as ContentStatus[]).map((s) => (
                      <button key={s} type="button" onClick={() => setStatus(s)} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${status === s ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-3 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Couverture</label>
                  <div onClick={() => coverInputRef.current?.click()} className="relative aspect-[3/4.2] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group">
                    {coverImage ? <img src={coverImage} alt="Cover" className="w-full h-full object-cover" /> : <div className="text-center p-4"><ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" /><span className="text-[10px] font-bold text-slate-400 uppercase">Importer</span></div>}
                    <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>

              <div className="col-span-4 space-y-5">
                <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Langue</label>
                       <select className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm appearance-none cursor-pointer" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                         <option value="Français">Français</option><option value="Anglais">Anglais</option><option value="Arabe">Arabe</option>
                       </select>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Niveau</label>
                       <select className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm appearance-none cursor-pointer" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                         <option value="Facile">Facile</option><option value="Moyen">Moyen</option><option value="Difficile">Difficile</option>
                       </select>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Âge Cible</label>
                       <select className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm appearance-none cursor-pointer" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                         <option value="3-5">3-5 ans</option><option value="6-8">6-8 ans</option><option value="9-12">9-12 ans</option><option value="13+">13+ ans</option>
                       </select>
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Thème</label>
                       <select className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm appearance-none cursor-pointer" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                         <option value="Général">Général</option><option value="Animaux">Animaux</option><option value="École">École</option><option value="Émotions">Émotions</option><option value="Famille">Famille</option><option value="Nature">Nature</option><option value="Aventure">Aventure</option><option value="Science">Science</option><option value="Histoire">Histoire</option><option value="Sports">Sports</option><option value="Espace">Espace</option><option value="Alimentation">Alimentation</option><option value="Voyage">Voyage</option><option value="Technologie">Technologie</option><option value="Autre">Autre</option>
                       </select>
                     </div>
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fichier PDF</label>
                  <div onClick={() => pdfInputRef.current?.click()} className={`w-full h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all gap-2 ${pdfPreview ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30'}`}>
                    {pdfPreview ? <><Check className="w-8 h-8 text-emerald-500" /><span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">PDF Importé</span></> : <><Upload className="w-8 h-8 text-slate-300" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Importer le PDF</span></>}
                    <input type="file" ref={pdfInputRef} onChange={handlePdfChange} accept="application/pdf" className="hidden" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end items-center gap-4">
              <button type="button" onClick={onClose} className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Annuler</button>
              <button type="submit" disabled={isUploading} className="px-10 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50">
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {isUploading ? "En cours..." : isEdit ? "Enregistrer" : "Créer l'histoire"}
              </button>
            </div>
            {isUploading && <div className="mt-4"><ProgressBar progress={uploadProgress} label={uploadMessage} status="loading" /></div>}
          </form>
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

  const isArabic = React.useMemo(() => /[\u0600-\u06FF]/.test(content?.content || ''), [content?.content]);
  const pages = React.useMemo(() => {
    if (content?.type === 'PDF' && content.children?.length) return content.children.map((ch: any) => ch.content || "Chapitre vide");
    if (!content?.content) return ["Le contenu de l'histoire est vide."];
    const words = content.content.split(/\s+/).filter(Boolean);
    const result: string[] = [];
    for (let i = 0; i < words.length; i += 220) result.push(words.slice(i, i + 220).join(' '));
    return result;
  }, [content]);

  const totalPages = pages.length;

  useEffect(() => {
    if (isOpen) { setCurrentPage(0); const timer = setTimeout(() => setLoading(false), 450); return () => clearTimeout(timer); }
    else setLoading(true);
  }, [isOpen]);

  if (!isOpen || !content) return null;

  const goNext = () => { if (currentPage < totalPages - 1) { setFlipDirection('right'); setCurrentPage(p => p + 1); } };
  const goPrev = () => { if (currentPage > 0) { setFlipDirection('left'); setCurrentPage(p => p - 1); } };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') goNext();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'Escape') onClose();
  };

  const fontFamily = isArabic ? '"Scheherazade New", serif' : 'Georgia, serif';
  const textDir = isArabic ? 'rtl' : 'ltr';

  const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isFullScreen ? '' : 'p-4 md:p-10 md:pl-[340px]'}`} onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: 'none' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
        
        {content.coverImage && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <img src={content.coverImage} alt="" className="w-full h-full object-cover blur-[80px] scale-110" />
            <div className="absolute inset-0 bg-slate-950/40" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="relative w-full max-w-4xl h-full max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-10"
        >
          {/* Top Bar */}
          <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-white z-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">{content.title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lecture Immersive</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Page {currentPage + 1} sur {totalPages}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Reading Area */}
          <div className="flex-1 overflow-hidden flex relative">
            {/* Left Page Shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
            
            <div className="flex-1 overflow-y-auto px-20 py-16 custom-scrollbar flex flex-col items-center">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: flipDirection === 'right' ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-3xl w-full"
                dir={textDir}
              >
                <div 
                  className="text-slate-800 text-2xl md:text-3xl leading-[1.8] font-medium"
                  style={{ fontFamily }}
                >
                  {pages[currentPage]}
                </div>
              </motion.div>
            </div>

            {/* Right Page Shadow */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
          </div>

          {/* Footer Navigation */}
          <div className="px-10 py-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
            <button 
              onClick={goPrev} 
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-20 bg-white border border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const isActive = i === (currentPage % 5); // simplified for demo
                return <div key={i} className={`h-1.5 rounded-full transition-all ${isActive ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
              })}
            </div>

            <button 
              onClick={goNext} 
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-20 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-slate-100">
            <motion.div 
              className="h-full bg-indigo-600" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

