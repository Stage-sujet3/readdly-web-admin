"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Bookshelf } from '@/features/library/stories/components/Bookshelf';
import { BookCard } from '@/features/library/stories/components/BookCard';
import { StoryFormModal, StoryViewModal } from '@/features/library/stories/components/StoryModals';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useStories } from '@/features/library/stories/hooks/useStories';
import { Story } from '@/features/library/types';

export default function StoriesPage() {
  const { stories, loading, addStory, updateStory, deleteStory, toggleStatus, refreshStories } = useStories();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  // Delete Modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, title: string } | null>(null);
  
  const handleSave = async (data: any) => {
    try {
      if (selectedStory) {
        await updateStory(selectedStory.id, data);
      } else {
        await addStory(data);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save story:", error);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteStory(itemToDelete.id);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setIsDeleteOpen(true);
  };

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  const filteredStories = stories.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || s.level === selectedLevel;
    const matchesTheme = selectedTheme === 'all' || s.theme === selectedTheme;
    
    return matchesSearch && matchesLevel && matchesTheme;
  });

  const frenchStories = filteredStories.filter(s => s.status === 'actif' && s.language === 'Français');
  const englishStories = filteredStories.filter(s => s.status === 'actif' && s.language === 'Anglais');
  const arabicStories = filteredStories.filter(s => s.status === 'actif' && s.language === 'Arabe');
  const inactiveStories = filteredStories.filter(s => s.status !== 'actif');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-6 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou description..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#5f6ad8]/10 focus:border-[#5f6ad8] shadow-sm text-slate-800 font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedStory(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-2xl hover:shadow-indigo-200 transition-all font-bold w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Histoire
          </motion.button>
        </div>

        {/* ── DYNAMIC CLASSIFICATION FILTERS ── */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Classer par:</span>
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
          <p className="font-medium animate-pulse">Ouverture de la bibliothèque...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {/* FRENCH SHELF */}
          <Bookshelf title="Histoires en Français">
            {frenchStories.length > 0 ? (
              frenchStories.map((story: Story) => (
                <BookCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  coverImage={story.coverImage}
                  status={story.status}
                  variant="story"
                  onClick={() => { setSelectedStory(story); setIsViewOpen(true); }}
                  onEdit={() => { setSelectedStory(story); setIsFormOpen(true); }}
                  onDelete={() => handleDeleteClick(story.id, story.title)}
                  onToggleStatus={() => toggleStatus(story)}
                />
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm italic">Aucune histoire en français</div>
            )}
          </Bookshelf>

          {/* ENGLISH SHELF */}
          <Bookshelf title="English Stories">
            {englishStories.length > 0 ? (
              englishStories.map((story: Story) => (
                <BookCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  coverImage={story.coverImage}
                  status={story.status}
                  variant="story"
                  onClick={() => { setSelectedStory(story); setIsViewOpen(true); }}
                  onEdit={() => { setSelectedStory(story); setIsFormOpen(true); }}
                  onDelete={() => handleDeleteClick(story.id, story.title)}
                  onToggleStatus={() => toggleStatus(story)}
                />
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm italic">No English stories</div>
            )}
          </Bookshelf>

          {/* ARABIC SHELF */}
          <Bookshelf title="قصص بالعربية">
            {arabicStories.length > 0 ? (
              arabicStories.map((story: Story) => (
                <BookCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  coverImage={story.coverImage}
                  status={story.status}
                  variant="story"
                  onClick={() => { setSelectedStory(story); setIsViewOpen(true); }}
                  onEdit={() => { setSelectedStory(story); setIsFormOpen(true); }}
                  onDelete={() => handleDeleteClick(story.id, story.title)}
                  onToggleStatus={() => toggleStatus(story)}
                />
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm italic">لا توجد قصص باللغة العربية</div>
            )}
          </Bookshelf>

          {/* DRAFTS & ARCHIVES */}
          <Bookshelf title="Archives & Brouillons" theme="glass">
            {inactiveStories.length > 0 ? (
              inactiveStories.map((story: Story) => (
                <BookCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  coverImage={story.coverImage}
                  status={story.status}
                  variant="story"
                  onClick={() => { setSelectedStory(story); setIsViewOpen(true); }}
                  onEdit={() => { setSelectedStory(story); setIsFormOpen(true); }}
                  onDelete={() => handleDeleteClick(story.id, story.title)}
                  onToggleStatus={() => toggleStatus(story)}
                />
              ))
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm italic">Aucun brouillon</div>
            )}
          </Bookshelf>
          
          {filteredStories.length === 0 && (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm">
              <div className="w-24 h-24 mx-auto mb-6 opacity-50 grayscale select-none text-6xl text-center">📚</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucune histoire trouvée</h3>
              <p className="text-slate-500">Ajustez votre recherche ou créez une nouvelle histoire pour remplir la bibliothèque.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <StoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={selectedStory}
      />

      <StoryViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        content={selectedStory}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'histoire"
        message="Êtes-vous sûr de vouloir supprimer cette histoire ? Cette action est irréversible."
        itemName={itemToDelete?.title}
      />
    </div>
  );
}
