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
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

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
    const matchesTheme = selectedTheme === 'all' || t.theme === selectedTheme;
    
    return matchesSearch && matchesLevel && matchesTheme;
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
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filtrer par:</span>
          </div>

          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:border-[#5f6ad8] transition-all cursor-pointer shadow-sm"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">Tous les niveaux</option>
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>

          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:border-[#5f6ad8] transition-all cursor-pointer shadow-sm"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="all">Tous les thèmes</option>
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

          {(selectedLevel !== 'all' || selectedTheme !== 'all') && (
            <button 
              onClick={() => { setSelectedLevel('all'); setSelectedTheme('all'); }}
              className="text-xs font-bold text-[#5f6ad8] hover:underline px-2"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#5f6ad8]" />
          <p className="font-medium animate-pulse text-lg italic text-indigo-600/40">Ouverture de la bibliothèque...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {/* FRENCH SHELF */}
          <Bookshelf title="Textes en Français" theme="library">
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
              <div className="py-10 text-center text-slate-400 text-sm italic w-full">Aucun texte en français</div>
            )}
          </Bookshelf>

          {/* ENGLISH SHELF */}
          <Bookshelf title="English Educational Texts" theme="library">
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
              <div className="py-10 text-center text-slate-400 text-sm italic w-full">No English texts</div>
            )}
          </Bookshelf>

          {/* ARABIC SHELF */}
          <Bookshelf title="نصوص تعليمية بالعربية" theme="library">
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
              <div className="py-10 text-center text-slate-400 text-sm italic w-full">لا توجد نصوص باللغة العربية</div>
            )}
          </Bookshelf>

          {/* DRAFTS & ARCHIVES */}
          <Bookshelf title="Archives & Brouillons" theme="glass">
            {inactiveTexts.length > 0 ? (
              inactiveTexts.map((text: EducationalText) => (
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
              <div className="py-10 text-center text-slate-400 text-sm italic w-full">Aucun brouillon ni archive</div>
            )}
          </Bookshelf>
          
          {filteredTexts.length === 0 && texts.length > 0 && (
            <div className="text-center py-32 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
               <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Aucun résultat</h3>
               <p className="text-slate-300 font-medium">Ajustez votre recherche ou vos filtres.</p>
            </div>
          )}
          
          {!loading && (texts || []).length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Aucun texte éducatif</h3>
              <p className="text-slate-300 font-medium">Commencez par créer votre premier texte éducatif.</p>
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
