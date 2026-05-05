"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Loader2, BookOpen, Languages } from 'lucide-react';
import { TextFormModal, TextViewModal } from '@/features/library/texts/components/TextModals';
import { TextCard } from '@/features/library/texts/components/TextCard';
import { Bookshelf } from '@/features/library/stories/components/Bookshelf';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useEducationalTexts } from '@/features/library/texts/hooks/useEducationalTexts';
import { EducationalText } from '@/features/library/types';

export default function TextsPage() {
  const { texts, loading, addText, updateText, deleteText, toggleStatus } = useEducationalTexts();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<EducationalText | null>(null);

  // Delete Modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, title: string } | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const handleSave = async (data: any) => {
    try {
      if (selectedText) {
        await updateText(selectedText.id, data);
      } else {
        await addText(data);
      }
      setIsFormOpen(false);
      setSelectedText(null);
    } catch (error) {
      console.error("Failed to save educational text:", error);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteText(itemToDelete.id);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete text:", error);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setIsDeleteOpen(true);
  };

  const filteredTexts = (texts || []).filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (t.content && t.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || t.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const isLang = (text: EducationalText, lang: string) => {
    const l = (text.language || 'Français').toLowerCase();
    if (lang === 'Français') return l === 'français' || l === 'french';
    if (lang === 'Anglais') return l === 'anglais' || l === 'english';
    if (lang === 'Arabe') return l === 'arabe' || l === 'arabic';
    return false;
  };

  const frenchTexts = filteredTexts.filter(t => t.status === 'actif' && isLang(t, 'Français'));
  const englishTexts = filteredTexts.filter(t => t.status === 'actif' && isLang(t, 'Anglais'));
  const arabicTexts = filteredTexts.filter(t => t.status === 'actif' && isLang(t, 'Arabe'));
  const inactiveTexts = filteredTexts.filter(t => t.status !== 'actif');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-6 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher des textes éducatifs..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">Textes</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-[#5f6ad8] rounded-full text-xs font-bold border border-indigo-100/50">
                {texts.length} Textes
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedText(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-2xl hover:shadow-indigo-200 transition-all font-bold w-full md:w-auto uppercase tracking-widest text-sm"
          >
            <Plus className="w-5 h-5" />
            Nouveau Texte
          </motion.button>
        </div>

        {/* ── DYNAMIC CLASSIFICATION FILTERS ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 text-slate-500 min-w-max">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Filter className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filtrer par niveau</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'Facile', 'Moyen', 'Difficile'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedLevel === level 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                {selectedLevel === level && (
                  <motion.div 
                    layoutId="activeLevelText"
                    className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {level === 'all' ? 'Tous' : level}
                </span>
              </button>
            ))}
          </div>

          {selectedLevel !== 'all' && (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedLevel('all')}
              className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-4 py-2.5 rounded-xl transition-all"
            >
              Réinitialiser
            </motion.button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#5f6ad8]" />
          <p className="font-medium animate-pulse text-lg italic text-indigo-600/40">Ouverture de la bibliothèque...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* FRENCH SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Textes en Français</h2>
              <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md">{frenchTexts.length}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {frenchTexts.length > 0 ? (
                frenchTexts.map((text: EducationalText) => (
                  <TextCard
                    key={text.id}
                    id={text.id}
                    title={text.title}
                    status={text.status}
                    level={text.level}
                    theme={text.theme}
                    onClick={() => { setSelectedText(text); setIsViewOpen(true); }}
                    onEdit={() => { setSelectedText(text); setIsFormOpen(true); }}
                    onDelete={() => handleDeleteClick(text.id, text.title)}
                    onToggleStatus={() => toggleStatus(text)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">Aucun texte en français</div>
              )}
            </div>
          </section>

          {/* ENGLISH SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">English Educational Texts</h2>
              <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md">{englishTexts.length}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {englishTexts.length > 0 ? (
                englishTexts.map((text: EducationalText) => (
                  <TextCard
                    key={text.id}
                    id={text.id}
                    title={text.title}
                    status={text.status}
                    level={text.level}
                    theme={text.theme}
                    onClick={() => { setSelectedText(text); setIsViewOpen(true); }}
                    onEdit={() => { setSelectedText(text); setIsFormOpen(true); }}
                    onDelete={() => handleDeleteClick(text.id, text.title)}
                    onToggleStatus={() => toggleStatus(text)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">No English texts</div>
              )}
            </div>
          </section>

          {/* ARABIC SECTION */}
          <section>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">نصوص تعليمية بالعربية</h2>
              <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md">{arabicTexts.length}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {arabicTexts.length > 0 ? (
                arabicTexts.map((text: EducationalText) => (
                  <TextCard
                    key={text.id}
                    id={text.id}
                    title={text.title}
                    status={text.status}
                    level={text.level}
                    theme={text.theme}
                    onClick={() => { setSelectedText(text); setIsViewOpen(true); }}
                    onEdit={() => { setSelectedText(text); setIsFormOpen(true); }}
                    onDelete={() => handleDeleteClick(text.id, text.title)}
                    onToggleStatus={() => toggleStatus(text)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">لا توجد نصوص باللغة العربية</div>
              )}
            </div>
          </section>

          {/* ARCHIVES SECTION */}
          {inactiveTexts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-1.5 h-8 bg-slate-400 rounded-full" />
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Archives & Brouillons</h2>
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md">{inactiveTexts.length}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {inactiveTexts.map((text: EducationalText) => (
                  <TextCard
                    key={text.id}
                    id={text.id}
                    title={text.title}
                    status={text.status}
                    level={text.level}
                    theme={text.theme}
                    onClick={() => { setSelectedText(text); setIsViewOpen(true); }}
                    onEdit={() => { setSelectedText(text); setIsFormOpen(true); }}
                    onDelete={() => handleDeleteClick(text.id, text.title)}
                    onToggleStatus={() => toggleStatus(text)}
                  />
                ))}
              </div>
            </section>
          )}
          
          {filteredTexts.length === 0 && texts.length > 0 && (
            <div className="text-center py-32 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
               <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Aucun résultat</h3>
               <p className="text-slate-300 font-medium">Ajustez votre recherche ou vos filtres.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TextFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedText(null); }}
        onSave={handleSave}
        initialData={selectedText}
      />

      <TextViewModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelectedText(null); }}
        content={selectedText}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setItemToDelete(null); }}
        onConfirm={confirmDelete}
        title="Supprimer le texte"
        message="Êtes-vous sûr de vouloir supprimer ce texte éducatif ? Cette action est irréversible."
        itemName={itemToDelete?.title}
      />
    </div>
  );
}
