import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon, Trash2 } from 'lucide-react';
import { EducationalText, Language, Level, Theme } from '../../types';
import { fileToBase64 } from '@/utils/helpers';
import { ImageCropper } from '@/components/ImageCropper';
import { textService } from '../services/textService';

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
  const [ageGroup, setAgeGroup] = useState<string>('7-9');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setLanguage(initialData.language || 'Français');
      setStatus(initialData.status || 'brouillon');
      setLevel(initialData.level || 'Facile');
      setTheme(initialData.theme || 'Général');
      setAgeGroup(initialData.ageGroup || '7-9');
      setCoverImage(initialData.coverImage || '');
    } else {
      setTitle('');
      setContent('');
      setLanguage('Français');
      setStatus('brouillon');
      setLevel('Facile');
      setTheme('Général');
      setAgeGroup('7-9');
      setCoverImage('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;
  const isEdit = !!initialData;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCoverImage(croppedImage);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ 
        title, 
        content, 
        language, 
        status, 
        level, 
        theme, 
        ageGroup, 
        coverImage,
        type: 'TEXT' 
      });
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
                           <option value="7-9">7-9 ans</option><option value="10-12">10-12 ans</option><option value="13-14">13-14 ans</option>
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

               <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 mb-2 block">Image de couverture</label>
                  <div 
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center transition-all group"
                  >
                    {coverImage ? (
                      <>
                        <Image src={coverImage} alt="Cover" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                           <button 
                             type="button"
                             onClick={() => coverInputRef.current?.click()}
                             className="px-6 py-2.5 bg-white/90 hover:bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                           >
                             Changer
                           </button>
                           <button 
                             type="button"
                             onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
                             className="px-6 py-2.5 bg-red-500/90 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                           >
                             <Trash2 className="w-4 h-4" />
                             Supprimer
                           </button>
                        </div>
                      </>
                    ) : (
                      <div onClick={() => coverInputRef.current?.click()} className="text-center p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-indigo-50/30">
                        <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Format paysage (16:9)</span>
                        <span className="text-[10px] text-slate-400/80 font-medium mt-1 block">Cliquez pour importer une image</span>
                      </div>
                    )}
                    <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

        {imageToCrop && (
          <ImageCropper
            image={imageToCrop}
            aspect={16 / 9}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </div>
    </AnimatePresence>
  );
}

export function TextViewModal({ isOpen, onClose, content: initialContent }: { isOpen: boolean, onClose: () => void, content: EducationalText | null }) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [content, setContent] = useState<EducationalText | null>(initialContent);

  useEffect(() => {
    if (isOpen && initialContent) {
      const fetchFullText = async () => {
        try {
          const fullContent = await textService.getText(initialContent.id);
          setContent(fullContent);
        } catch (error) {
          console.error("Failed to load full text content:", error);
          setContent(initialContent);
        }
      };
      fetchFullText();
    } else {
      setContent(null);
      setCurrentPage(0);
    }
  }, [isOpen, initialContent]);

  const isArabic = React.useMemo(() => /[\u0600-\u06FF]/.test(content?.content || ''), [content?.content]);
  
  const pages = React.useMemo(() => {
    const contentText = content?.content || '';
    if (!contentText.trim()) return ["Le contenu du texte est vide."];

    // Split content by sentence delimiters or line breaks
    const rawSentences = contentText.match(/[^.!?\n]+[.!?\n]*/g) || [contentText];
    const pagesList: string[] = [];
    
    let currentChunk: string[] = [];
    let currentWordCount = 0;
    const MAX_WORDS_PER_PAGE = 30;

    for (const rawSentence of rawSentences) {
      const sentence = rawSentence.trim();
      if (!sentence) continue;

      const sentenceWordsArray = sentence.split(/\s+/);
      const sentenceWords = sentenceWordsArray.length;

      // If the sentence itself is longer than 30 words (e.g. no punctuation), we must split it forcefully
      if (sentenceWords > MAX_WORDS_PER_PAGE) {
        // First push whatever we already have
        if (currentChunk.length > 0) {
          pagesList.push(currentChunk.join(' '));
          currentChunk = [];
          currentWordCount = 0;
        }

        // Break the long sentence into chunks of MAX_WORDS_PER_PAGE
        for (let i = 0; i < sentenceWordsArray.length; i += MAX_WORDS_PER_PAGE) {
          pagesList.push(sentenceWordsArray.slice(i, i + MAX_WORDS_PER_PAGE).join(' '));
        }
        continue; // Handled this long sentence entirely
      }

      // Normal case: check if adding this sentence exceeds limit
      if (currentWordCount + sentenceWords > MAX_WORDS_PER_PAGE && currentChunk.length > 0) {
        pagesList.push(currentChunk.join(' '));
        currentChunk = [];
        currentWordCount = 0;
      }

      currentChunk.push(sentence);
      currentWordCount += sentenceWords;
    }

    if (currentChunk.length > 0) {
      pagesList.push(currentChunk.join(' '));
    }

    return pagesList.length > 0 ? pagesList : ["Le contenu du texte est vide."];
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
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">{content.title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{content.theme}</span>
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{content.level}</span>
                </div>
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
                const isActive = i === (currentPage % 5);
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
