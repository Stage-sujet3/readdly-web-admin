import { useState, useEffect } from 'react';
import { dictionaryService } from '../services/dictionaryService';
import { Dictionary, DictionaryWord } from '../../types';

export function useDictionary() {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDictionaries = async () => {
    setLoading(true);
    try {
      const data = await dictionaryService.getDictionaries();
      setDictionaries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch dictionaries:', err);
      setError('Could not load dictionaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictionaries();
  }, []);

  // --- Dictionary Methods ---
  const addDictionary = async (data: any) => {
    try {
      const response = await dictionaryService.createDictionary({
        title: data.title,
        language: data.language,
        theme: data.theme,
        status: data.status,
      });
      if (data.words && data.words.length > 0) {
        await Promise.all(data.words.map((w: any) => 
          dictionaryService.addWordToDictionary(response.id, w)
        ));
      }
      await fetchDictionaries();
    } catch (err) {
      console.error('Failed to add dictionary:', err);
      throw err;
    }
  };

  const updateDictionary = async (id: string, data: any) => {
    try {
      // 1. Update basic dictionary info
      await dictionaryService.updateDictionary(id, {
        title: data.title,
        language: data.language,
        theme: data.theme,
        status: data.status,
      });

      // 2. Sync words if provided
      if (data.words && Array.isArray(data.words)) {
        const oldDict = dictionaries.find(d => d.id === id);
        if (oldDict) {
          const oldWords = oldDict.words || [];
          const newWords = data.words;
          
          const toAdd = newWords.filter((w: any) => !w.id || w.id.startsWith('temp-'));
          const toUpdate = newWords.filter((w: any) => w.id && !w.id.startsWith('temp-') && oldWords.some((ow: any) => ow.id === w.id));
          const toDelete = oldWords.filter((ow: any) => !newWords.some((w: any) => w.id === ow.id));

          // Use sequential execution or Promise.allSettled to be more resilient
          for (const w of toAdd) {
            const { id: _, ...wordData } = w; // Remove temp id
            await dictionaryService.addWordToDictionary(id, wordData);
          }
          for (const w of toUpdate) {
            await dictionaryService.updateWord(w.id, w);
          }
          for (const w of toDelete) {
            await dictionaryService.deleteWord(w.id);
          }
        }
      }

      await fetchDictionaries();
    } catch (err) {
      console.error('Failed to update dictionary:', err);
      throw err;
    }
  };


  const deleteDictionary = async (id: string) => {
    try {
      await dictionaryService.deleteDictionary(id);
      await fetchDictionaries();
    } catch (err) {
      console.error('Failed to delete dictionary:', err);
      throw err;
    }
  };

  const toggleDictionaryStatus = async (dict: Dictionary) => {
    try {
      const nextStatus = dict.status === 'actif' ? 'inactif' : 'actif';
      await dictionaryService.updateDictionary(dict.id, { status: nextStatus });
      await fetchDictionaries();
    } catch (err) {
      console.error('Failed to toggle dictionary status:', err);
      throw err;
    }
  };

  // --- Word Methods ---
  const addWordToDictionary = async (dictionaryId: string, data: Partial<DictionaryWord>) => {
    try {
      await dictionaryService.addWordToDictionary(dictionaryId, data);
      await fetchDictionaries(); // Optimization: could just update local state
    } catch (err) {
      console.error('Failed to add word:', err);
      throw err;
    }
  };

  const updateWordInDictionary = async (wordId: string, data: Partial<DictionaryWord>) => {
    try {
      await dictionaryService.updateWord(wordId, data);
      await fetchDictionaries();
    } catch (err) {
      console.error('Failed to update word:', err);
      throw err;
    }
  };

  const deleteWordFromDictionary = async (wordId: string) => {
    try {
      await dictionaryService.deleteWord(wordId);
      await fetchDictionaries();
    } catch (err) {
      console.error('Failed to delete word:', err);
      throw err;
    }
  };

  return {
    dictionaries,
    loading,
    error,
    addDictionary,
    updateDictionary,
    deleteDictionary,
    toggleDictionaryStatus,
    addWordToDictionary,
    updateWordInDictionary,
    deleteWordFromDictionary,
    refreshDictionaries: fetchDictionaries
  };
}
