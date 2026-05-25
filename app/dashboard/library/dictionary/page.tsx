"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, BookOpen, Trash2, Edit3, Eye, Loader2, Book as BookIcon, Languages, Archive, PlusCircle, Filter } from 'lucide-react';
import { DictionaryFormModal, DictionaryViewModal } from '@/features/library/dictionary/components/DictionaryModals';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDictionary } from '@/features/library/dictionary/hooks/useDictionary';
import { Dictionary } from '@/features/library/types';
import { isNewContent } from '@/features/library/utils/date';

export default function DictionaryPage() {
  const { 
    dictionaries, 
    loading, 
    addDictionary, 
    updateDictionary, 
    deleteDictionary,
    addWordToDictionary,
    updateWordInDictionary,
    deleteWordFromDictionary
  } = useDictionary();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedDict, setSelectedDict] = useState<Dictionary | null>(null);
  
  // Delete Modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, title: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSaveDictionary = async (data: any) => {
    try {
      if (selectedDict) {
        await updateDictionary(selectedDict.id, data);
      } else {
        await addDictionary(data);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save dictionary:", error);
    }
  };

  const confirmDeleteDictionary = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDictionary(itemToDelete.id);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete dictionary:", error);
    }
  };

  const handleDeleteDictionaryClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setIsDeleteOpen(true);
  };

  const filteredDicts = (dictionaries ?? []).filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || d.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const isLang = (dict: Dictionary, lang: string) => {
    const l = dict.language.toLowerCase();
    if (lang === 'Français') return l === 'français' || l === 'french';
    if (lang === 'Anglais') return l === 'anglais' || l === 'english';
    if (lang === 'Arabe') return l === 'arabe' || l === 'arabic';
    return false;
  };

  const frenchDicts = filteredDicts.filter(d => isLang(d, 'Français') && d.status === 'actif');
  const englishDicts = filteredDicts.filter(d => isLang(d, 'Anglais') && d.status === 'actif');
  const arabicDicts = filteredDicts.filter(d => isLang(d, 'Arabe') && d.status === 'actif');
  const draftDicts = filteredDicts.filter(d => d.status !== 'actif');


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-indigo-600/40">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-medium text-lg italic">Ouverture de la bibliothèque...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Search & Actions */}
      <div className="flex flex-col space-y-6 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher un dictionnaire..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">Dictionnaire</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-[#5f6ad8] rounded-full text-xs font-bold border border-indigo-100/50">
                {dictionaries.length} Dictionnaires
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedDict(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5f6ad8] to-[#444fc0] text-white rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-2xl hover:shadow-indigo-200 transition-all font-bold w-full md:w-auto uppercase tracking-widest text-sm"
          >
            <Plus className="w-5 h-5" />
            Nouveau Dictionnaire
          </motion.button>
        </div>

        {/* ── DYNAMIC CLASSIFICATION FILTERS ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 text-slate-500 min-w-max">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Filter className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filtrer par statut</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'actif', 'brouillon'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedStatus === status 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                {selectedStatus === status && (
                  <motion.div 
                    layoutId="activeStatusDict"
                    className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">
                  {status === 'all' ? 'Tous' : status}
                </span>
              </button>
            ))}
          </div>

          {selectedStatus !== 'all' && (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedStatus('all')}
              className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-4 py-2.5 rounded-xl transition-all"
            >
              Réinitialiser
            </motion.button>
          )}
        </div>
      </div>

      {/* Library Shelves */}
      <div className="space-y-16">
        <Shelf title="Français" dictionaries={frenchDicts} icon={<Languages className="w-5 h-5" />} color="bg-blue-600" 
          onView={(d) => { setSelectedDict(d); setIsViewOpen(true); }}
          onEdit={(d) => { setSelectedDict(d); setIsFormOpen(true); }}
          onDelete={(d) => handleDeleteDictionaryClick(d.id, d.title)}
        />
        
        <Shelf title="Anglais" dictionaries={englishDicts} icon={<Languages className="w-5 h-5" />} color="bg-rose-600" 
          onView={(d) => { setSelectedDict(d); setIsViewOpen(true); }}
          onEdit={(d) => { setSelectedDict(d); setIsFormOpen(true); }}
          onDelete={(d) => handleDeleteDictionaryClick(d.id, d.title)}
        />
        
        <Shelf title="Arabe" dictionaries={arabicDicts} icon={<Languages className="w-5 h-5" />} color="bg-emerald-600" 
          onView={(d) => { setSelectedDict(d); setIsViewOpen(true); }}
          onEdit={(d) => { setSelectedDict(d); setIsFormOpen(true); }}
          onDelete={(d) => handleDeleteDictionaryClick(d.id, d.title)}
        />
        
        <Shelf title="Brouillons" dictionaries={draftDicts} icon={<Archive className="w-5 h-5" />} color="bg-slate-500" isDraft
          onView={(d) => { setSelectedDict(d); setIsViewOpen(true); }}
          onEdit={(d) => { setSelectedDict(d); setIsFormOpen(true); }}
          onDelete={(d) => handleDeleteDictionaryClick(d.id, d.title)}
        />
      </div>

      {/* Empty State */}
      {filteredDicts.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <BookIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Aucun dictionnaire</h3>
          <p className="text-slate-300 font-medium">Commencez par créer votre premier dictionnaire de vocabulaire.</p>
        </div>
      )}

      {/* Modals */}
      <DictionaryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveDictionary}
        initialData={selectedDict}
      />

      <DictionaryViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dictionary={selectedDict ? dictionaries.find(d => d.id === selectedDict.id) || selectedDict : null}
        onAddWord={(data) => selectedDict && addWordToDictionary(selectedDict.id, data)}
        onUpdateWord={(id, data) => updateWordInDictionary(id, data)}
        onDeleteWord={(id) => deleteWordFromDictionary(id)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteDictionary}
        title="Supprimer le dictionnaire"
        message="Voulez-vous vraiment supprimer ce dictionnaire et tous les mots qu'il contient ? Cette action est irréversible."
        itemName={itemToDelete?.title}
      />
    </div>
  );
}

interface ShelfProps {
  title: string;
  dictionaries: Dictionary[];
  icon: React.ReactNode;
  color: string;
  isDraft?: boolean;
  onView: (d: Dictionary) => void;
  onEdit: (d: Dictionary) => void;
  onDelete: (d: Dictionary) => void;
}

function Shelf({ title, dictionaries, icon, color, isDraft, onView, onEdit, onDelete }: ShelfProps) {
  return (
    <div className="relative group/shelf">
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 ${isDraft ? 'text-slate-400' : 'text-slate-800'}`}>
          <div className={`p-2 rounded-lg text-white shadow-lg ${color}`}>
            {icon}
          </div>
          {title}
          <span className="ml-2 px-3 py-0.5 bg-slate-100 text-slate-400 rounded-full text-xs font-bold tracking-normal">
            {dictionaries.length}
          </span>
        </h2>
      </div>

      <div className="relative pt-4 pb-12">
        {/* Books Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12 relative z-10">
          {dictionaries.map((dict, idx) => (
            <DictionaryBook 
              key={dict.id} 
              dictionary={dict} 
              index={idx} 
              color={color}
              isNew={isNewContent(dict.createdAt)}
              onView={() => onView(dict)}
              onEdit={() => onEdit(dict)}
              onDelete={() => onDelete(dict)}
            />
          ))}
          
          {dictionaries.length === 0 && (
            <div className="col-span-full h-40 flex items-center justify-center text-slate-300 font-medium italic border-2 border-dashed border-slate-100 rounded-2xl">
              Cette étagère est vide
            </div>
          )}
        </div>

        {/* The Actual Shelf Visual */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.05)] border-t border-white/50" />
      </div>
    </div>
  );
}

function DictionaryBook({ dictionary, index, color, isNew, onView, onEdit, onDelete }: { 
  dictionary: Dictionary; 
  index: number; 
  color: string;
  isNew?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const rotation = (index % 3 - 1) * 2; // subtle random rotation

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="relative cursor-pointer group"
      style={{ rotate: `${rotation}deg` }}
    >
      <div 
        onClick={onView}
        className={`relative aspect-[3/4] rounded-r-xl rounded-l-md shadow-[10px_10px_20px_rgba(0,0,0,0.1)] transition-all overflow-hidden flex flex-col ${color} ${isNew ? 'animate-pulse border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)]' : ''}`}
      >
        {isNew && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-b-md shadow-sm z-50">
            Nouveau
          </div>
        )}
        {/* Book Spine Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 z-10 border-r border-white/10" />
        
        {/* Book Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-white space-y-4">
          <BookIcon className="w-10 h-10 opacity-30" />
          <h3 className="text-sm font-black uppercase tracking-wider leading-tight px-2">
            {dictionary.title}
          </h3>
          <div className="absolute bottom-4 left-6 right-4 flex justify-between items-center text-[10px] font-bold opacity-60">
            <span>{(dictionary.words || []).length} MOTS</span>
            <span className="uppercase">{dictionary.theme}</span>
          </div>
        </div>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-indigo-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-30">
          <button 
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Eye className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-white hover:text-indigo-600 transition-all font-bold text-xs"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-white hover:text-red-600 transition-all font-bold text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Label under book */}
      <div className="mt-4 text-center">
        <p className="text-xs font-bold text-slate-500 truncate px-2 lowercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
          {dictionary.title}
        </p>
      </div>
    </motion.div>
  );
}
