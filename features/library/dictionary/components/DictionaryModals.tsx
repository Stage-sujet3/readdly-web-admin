import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Trash2, Edit3, BookOpen, Search, Languages, Tag, AlertCircle } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { Dictionary, DictionaryWord, Language, Level, ContentStatus } from '../../types';

interface DictionaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Dictionary | null;
}

export function DictionaryFormModal({ isOpen, onClose, onSave, initialData }: DictionaryFormModalProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [language, setLanguage] = useState<Language>(initialData?.language || 'Français');
  const [theme, setTheme] = useState(initialData?.theme || 'Général');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'brouillon');
  const [words, setWords] = useState<Partial<DictionaryWord>[]>(initialData?.words || []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setLanguage(initialData.language);
      setTheme(initialData.theme);
      setStatus(initialData.status);
      setWords(initialData.words || []);
    } else {
      setTitle('');
      setLanguage('Français');
      setTheme('Général');
      setStatus('brouillon');
      setWords([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddWordRow = () => {
    setWords([...words, { word: '', definition: '', level: 'Facile', theme: theme || 'Général' }]);
  };

  const handleUpdateWord = (index: number, field: keyof DictionaryWord, value: string) => {
    const updatedWords = [...words];
    updatedWords[index] = { ...updatedWords[index], [field]: value };
    setWords(updatedWords);
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, language, theme, status, words });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:pl-[340px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
        <motion.div
           initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
           className="relative w-full max-w-5xl h-[90vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-200 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {initialData ? 'Modifier le Dictionnaire' : 'Nouveau Dictionnaire'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de données lexicale</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="flex-1 flex flex-col min-h-0" onSubmit={handleSubmit}>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="space-y-10">
                {/* Meta Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Titre du dictionnaire</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Vocabulaire de la Nature..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-800 font-bold transition-all" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Langue</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-slate-700 font-bold text-sm cursor-pointer appearance-none" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                          <option value="Français">Français</option><option value="Anglais">Anglais</option><option value="Arabe">Arabe</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thème Global</label>
                        <input type="text" placeholder="Ex: Animaux" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 text-slate-700 font-bold text-sm" value={theme} onChange={(e) => setTheme(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Mode Ajout Multiple</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      Ce dictionnaire regroupera un ensemble de mots partageant le même thème et la même langue pour un apprentissage cohérent.
                    </p>
                  </div>
                </div>

                {/* Words Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Liste des Mots ({words.length})</h3>
                      <div className="h-px w-20 bg-slate-100" />
                    </div>
                    <button type="button" onClick={handleAddWordRow} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <Plus className="w-4 h-4" /> Ajouter une ligne
                    </button>
                  </div>

                  <div className="space-y-3">
                    {words.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4">
                          <Plus className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Commencez par ajouter un mot</p>
                      </div>
                    ) : (
                      words.map((word, index) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={index} className="group flex gap-4 items-center bg-white border border-slate-100 p-4 rounded-[1.5rem] hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {index + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            <input type="text" placeholder="Mot *" className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 font-bold text-sm" value={word.word} onChange={(e) => handleUpdateWord(index, 'word', e.target.value)} required />
                            <input type="text" placeholder="Définition" className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 text-sm font-medium" value={word.definition || ''} onChange={(e) => handleUpdateWord(index, 'definition', e.target.value)} />
                            <select className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 text-sm font-bold appearance-none cursor-pointer" value={word.level} onChange={(e) => handleUpdateWord(index, 'level', e.target.value as Level)}>
                              <option value="Facile">Facile</option><option value="Moyen">Moyen</option><option value="Difficile">Difficile</option>
                            </select>
                            <input type="text" placeholder="Exemple" className="bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-indigo-500 text-sm italic" value={word.example || ''} onChange={(e) => handleUpdateWord(index, 'theme', e.target.value)} />
                          </div>
                          <button type="button" onClick={() => handleRemoveWord(index)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 border-t border-slate-100 flex justify-end items-center gap-4 bg-slate-50/30">
              <button type="button" onClick={onClose} className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Annuler</button>
              <button type="submit" className="px-10 py-4 bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all flex items-center gap-3">
                <Check className="w-5 h-5" />
                {initialData ? 'Enregistrer' : `Créer le dictionnaire`}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface DictionaryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: Dictionary | null;
  onAddWord: (data: any) => void;
  onUpdateWord: (id: string, data: any) => void;
  onDeleteWord: (id: string) => void;
}

export function DictionaryViewModal({ isOpen, onClose, dictionary, onAddWord, onUpdateWord, onDeleteWord }: DictionaryViewModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<DictionaryWord | null>(null);
  
  // Word delete confirmation state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [wordToDeleteId, setWordToDeleteId] = useState<string | null>(null);

  if (!isOpen || !dictionary) return null;

  const filteredWords = (dictionary.words || []).filter(w => 
    w.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditWord = (word: DictionaryWord) => {
    setEditingWord(word);
    setIsWordModalOpen(true);
  };

  const handleAddWord = () => {
    setEditingWord(null);
    setIsWordModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setWordToDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteWord = () => {
    if (wordToDeleteId) {
      onDeleteWord(wordToDeleteId);
      setIsDeleteConfirmOpen(false);
      setWordToDeleteId(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 md:pl-[340px]">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateY: 15 }}
          className="relative w-full max-w-5xl h-[85vh] bg-[#fafafa] rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col z-10 border-r-[12px] border-indigo-200/50"
        >
          {/* Left Binder Strip */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-indigo-600 flex flex-col justify-around items-center py-10 z-20 shadow-[4px_0_15px_rgba(0,0,0,0.2)]">
            {[...Array(8)].map((_, i) => <div key={i} className="w-6 h-2 bg-indigo-400 rounded-full opacity-50" />)}
          </div>

          <div className="flex-1 flex flex-col pl-20 pr-10 py-10 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-indigo-100 pb-6 shrink-0">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{dictionary.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    {dictionary.language}
                  </span>
                  <span className="text-slate-400 font-medium tracking-wide">{dictionary.theme}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-bold">{(dictionary.words || []).length} Mots</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Chercher un mot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all w-48 md:w-64"
                  />
                </div>
                <button
                  onClick={handleAddWord}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase tracking-widest active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Words List */}
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
              {filteredWords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredWords.map((word, index) => (
                    <motion.div
                      key={word.id || `word-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative bg-white border border-slate-100 rounded-[2rem] p-7 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{word.word}</h3>
                          <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                               word.level === 'Facile' ? 'bg-emerald-50 text-emerald-600' :
                               word.level === 'Moyen' ? 'bg-amber-50 text-amber-600' :
                               'bg-red-50 text-red-600'
                             }`}>
                               {word.level}
                             </span>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                               {word.theme}
                             </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => handleEditWord(word)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteClick(word.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                          <p className="text-slate-600 font-bold text-sm leading-relaxed">
                            {word.definition || <span className="text-slate-300 italic font-medium">Pas de définition</span>}
                          </p>
                        </div>
                        
                        {word.example && (
                          <div className="flex gap-3 items-start px-2">
                            <span className="text-indigo-400 font-serif text-2xl leading-none">“</span>
                            <p className="text-slate-400 italic text-xs leading-relaxed font-medium">
                              {word.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <BookOpen className="w-16 h-16 opacity-10" />
                  <p className="text-lg font-medium">Aucun mot trouvé dans ce dictionnaire.</p>
                  <button
                    onClick={handleAddWord}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Ajouter le premier mot
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <WordFormModal
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        initialData={editingWord}
        dictionaryLanguage={dictionary.language}
        onSave={(data) => {
          if (editingWord) onUpdateWord(editingWord.id, data);
          else onAddWord(data);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteWord}
        title="Supprimer ce mot"
        message="Voulez-vous vraiment retirer ce mot du dictionnaire ?"
        itemName={dictionary.words?.find(w => w.id === wordToDeleteId)?.word}
      />
    </AnimatePresence>
  );
}

interface WordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: DictionaryWord | null;
  dictionaryLanguage: Language;
}

function WordFormModal({ isOpen, onClose, onSave, initialData, dictionaryLanguage }: WordFormModalProps) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [level, setLevel] = useState<Level>('Facile');
  const [theme, setTheme] = useState('Général');

  useEffect(() => {
    if (initialData) {
      setWord(initialData.word);
      setDefinition(initialData.definition || '');
      setExample(initialData.example || '');
      setLevel(initialData.level);
      setTheme(initialData.theme);
    } else {
      setWord('');
      setDefinition('');
      setExample('');
      setLevel('Facile');
      setTheme('Général');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ word, definition, example, level, theme, language: dictionaryLanguage });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:pl-[340px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
        <motion.div
           initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
           className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-200 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {initialData ? 'Modifier le Mot' : 'Nouveau Mot'}
              </h2>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Le Mot</label>
              <input 
                type="text" 
                placeholder="Ex: Éléphant..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 font-bold transition-all text-2xl" 
                value={word} 
                onChange={(e) => setWord(e.target.value)} 
                required 
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Définition</label>
              <textarea 
                placeholder="Sens du mot..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 text-slate-700 font-medium resize-none h-24" 
                value={definition} 
                onChange={(e) => setDefinition(e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Exemple d'utilisation</label>
              <textarea 
                placeholder="Une phrase d'exemple..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 text-slate-700 font-medium italic resize-none h-20" 
                value={example} 
                onChange={(e) => setExample(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Niveau</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm appearance-none cursor-pointer" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                  <option value="Facile">Facile</option><option value="Moyen">Moyen</option><option value="Difficile">Difficile</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thème</label>
                <input type="text" placeholder="Thème" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-bold text-sm" value={theme} onChange={(e) => setTheme(e.target.value)} />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Annuler</button>
              <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Confirmer
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
