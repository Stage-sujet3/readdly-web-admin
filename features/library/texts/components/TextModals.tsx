import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileText } from 'lucide-react';
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
  const [theme, setTheme] = useState<Theme>('Général' as any);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Réinitialiser les champs quand initialData change (pour l'édition)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setLanguage(initialData.language || 'Français');
      setStatus(initialData.status || 'brouillon');
      setLevel(initialData.level || 'Facile');
      setTheme(initialData.theme || 'Général' as any);
    } else {
      setTitle('');
      setContent('');
      setLanguage('Français');
      setStatus('brouillon');
      setLevel('Facile');
      setTheme('Général' as any);
    }
  }, [initialData, isOpen]);


  if (!isOpen) return null;
  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple - ne pas accepter les champs vides ou seulement des espaces
    if (!title.trim()) {
      alert("Le titre est obligatoire");
      return;
    }
    
    if (!content.trim()) {
      alert("Le contenu est obligatoire");
      return;
    }
    
    if (!language) {
      alert("La langue est obligatoire");
      return;
    }
    
    if (!status) {
      alert("Le statut est obligatoire");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSave({ 
        title: title.trim(), 
        content: content.trim(),
        language: language.trim(),
        status: status.trim(),
        level,
        theme
      });
      // La page parent (page.tsx) ferme le modal via setIsFormOpen(false)
    } catch (error) {
      console.error("Error during save:", error);
      // Ne pas fermer en cas d'erreur, laisser l'utilisateur corriger
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div
           initial={{ y: -50, opacity: 0, rotate: -2 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 50, opacity: 0, rotate: 2 }}
           className="relative w-full max-w-2xl bg-white rounded-xl shadow-[10px_20px_60px_rgba(0,0,0,0.15)] max-h-[95vh] flex flex-col font-sans border border-gray-200 z-10"
        >
          <div className="absolute inset-x-0 h-px top-1/3 bg-black/5 pointer-events-none" />
          
          <div className="flex-1 flex flex-col px-8 py-6 min-h-0 relative z-10">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Modifier le texte' : 'Nouveau texte éducatif'}
              </h2>
              <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="flex-1 flex flex-col min-h-0" onSubmit={handleSubmit}>
              <div className="flex-1 overflow-y-auto space-y-6 pb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Entrez le titre du texte" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:border-transparent text-gray-900 placeholder-gray-500" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue *
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:border-transparent text-gray-900" 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      required
                    >
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Arabe">Arabe</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau *
                      </label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:border-transparent text-gray-900" 
                        value={level} 
                        onChange={(e) => setLevel(e.target.value as Level)}
                        required
                      >
                        <option value="Facile">Facile</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Difficile">Difficile</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thème *
                      </label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:border-transparent text-gray-900" 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value as Theme)}
                        required
                      >
                        <option value="Animaux">Animaux</option>
                        <option value="École">École</option>
                        <option value="Émotions">Émotions</option>
                        <option value="Famille">Famille</option>
                        <option value="Nature">Nature</option>
                        <option value="Aventure">Aventure</option>
                        <option value="Science">Science</option>
                        <option value="Histoire">Histoire</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut *
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:border-transparent text-gray-900" 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="brouillon">Brouillon</option>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu *
                    </label>
                    <textarea 
                      placeholder="Entrez le contenu du texte éducatif" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6ad8] focus:border-transparent text-gray-900 placeholder-gray-500 resize-y min-h-[300px]" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#5f6ad8] hover:bg-[#444fc0] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
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
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 perspective-[2000px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
           initial={{ y: 50, opacity: 0, rotate: 2 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 50, opacity: 0, rotate: -2 }}
           className="relative w-full max-w-4xl bg-[#fffdf5] rounded-sm shadow-2xl p-12 font-mono flex flex-col max-h-[85vh] z-10"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-800 rounded-full">
            <X className="w-6 h-6" />
          </button>

          <div className="mb-10 text-center border-b-2 border-slate-800 border-dashed pb-8">
             <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs mb-4">Texte Éducatif</div>
             <h1 className="text-4xl font-extrabold text-slate-800 uppercase tracking-widest leading-snug">{content.title}</h1>
          </div>

          <div className="overflow-y-auto custom-scrollbar pr-4 text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
             <p>{content.content}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
