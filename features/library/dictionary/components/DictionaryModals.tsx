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
  
  // Dynamic list of words
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 1.05, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.05, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200"
        >
          <div className="bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] px-6 py-4 flex justify-between items-center shadow-md z-10 shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {initialData ? 'Modifier le Dictionnaire' : 'Nouveau Dictionnaire (Ajout Multiple)'}
            </h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* === META SECTION === */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Informations Générales</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Titre du Dictionnaire</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5f6ad8] focus:ring-4 focus:ring-[#5f6ad8]/10 transition-all font-bold text-slate-800"
                    placeholder="Ex: Vocabulaire des animaux de la savane..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Langue</label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#5f6ad8] transition-all appearance-none font-bold text-slate-700"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                      >
                        <option value="Français">Français</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Arabe">Arabe</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Thème Global</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#5f6ad8] transition-all font-bold text-slate-700"
                        placeholder="Ex: Animaux"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Statut</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#5f6ad8] transition-all appearance-none font-bold text-slate-700"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ContentStatus)}
                    >
                      <option value="brouillon">Brouillon</option>
                      <option value="actif">Actif (Publié)</option>
                      <option value="inactif">Inactif (Archivé)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* === WORDS SECTION === */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Mots à ajouter ({words.length})</h3>
                  <button
                    type="button"
                    onClick={handleAddWordRow}
                    className="flex items-center gap-2 text-xs font-bold bg-[#5f6ad8]/10 text-[#5f6ad8] px-3 py-1.5 rounded-lg hover:bg-[#5f6ad8]/20 transition-colors uppercase tracking-widest"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nouvelle Ligne
                  </button>
                </div>

                {words.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <p className="text-sm text-slate-400 font-medium mb-3">Aucun mot n'a encore été ajouté.</p>
                    <button
                      type="button"
                      onClick={handleAddWordRow}
                      className="px-6 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition-colors text-xs uppercase tracking-widest"
                    >
                      Ajouter le premier mot
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {words.map((word, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={index}
                        className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {index + 1}
                        </span>
                        
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
                          <input
                            type="text"
                            placeholder="Mot/Expression *"
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#5f6ad8] font-bold text-sm text-slate-800"
                            value={word.word}
                            onChange={(e) => handleUpdateWord(index, 'word', e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Définition (optionnel)"
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#5f6ad8] text-sm text-slate-600"
                            value={word.definition || ''}
                            onChange={(e) => handleUpdateWord(index, 'definition', e.target.value)}
                          />
                          <select
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#5f6ad8] text-sm font-medium text-slate-700 appearance-none"
                            value={word.level}
                            onChange={(e) => handleUpdateWord(index, 'level', e.target.value)}
                          >
                            <option value="Facile">Facile</option>
                            <option value="Moyen">Moyen</option>
                            <option value="Difficile">Difficile</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Thème (Défaut: Global)"
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#5f6ad8] text-sm text-slate-600"
                            value={word.theme || ''}
                            onChange={(e) => handleUpdateWord(index, 'theme', e.target.value)}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveWord(index)}
                          className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto md:ml-0"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="bg-white border-t border-slate-200 p-4 px-6 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                <Check className="w-4 h-4 text-white" />
                {initialData ? 'Enregistrer les modifications' : `Créer avec ${words.length} mots`}
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredWords.map((word, index) => (
                    <motion.div
                      key={word.id || `word-${index}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-slate-800">{word.word}</h3>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditWord(word)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(word.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {word.definition ? (
                        <p className="text-slate-600 text-sm italic line-clamp-2 mb-3 leading-relaxed">
                          "{word.definition}"
                        </p>
                      ) : (
                        <p className="text-slate-300 text-sm italic mb-3">Pas de définition</p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          word.level === 'Facile' ? 'bg-emerald-50 text-emerald-600' :
                          word.level === 'Moyen' ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {word.level}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          {word.theme}
                        </span>
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden z-10 border border-slate-200"
        >
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              {initialData ? 'Modifier le Mot' : 'Ajouter un Mot'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-widest">Le Mot</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 text-xl"
                placeholder="Entrez le mot..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-widest flex items-center gap-2">
                  Définition <span className="text-[10px] font-medium text-slate-400 capitalize">(Optionnel)</span>
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 min-h-[100px] resize-none"
                  placeholder="Décrivez le sens du mot..."
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-widest flex items-center gap-2">
                  Exemple <span className="text-[10px] font-medium text-slate-400 capitalize">(Optionnel)</span>
                </label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-medium text-slate-700 min-h-[80px] resize-none"
                  placeholder="Utilisez le mot dans une phrase..."
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-widest">Niveau</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-widest">Thème</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
                  placeholder="Ex: Animaux"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest text-[10px]"
              >
                Ignorer
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                <Check className="w-4 h-4" />
                Confirmer
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
