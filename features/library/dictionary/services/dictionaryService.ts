import { api } from '@/services/api';
import { Dictionary, DictionaryWord } from '../../types';

export const dictionaryService = {
  // Dictionaries
  getDictionaries: async (): Promise<Dictionary[]> => {
    const response = await api.get('/learning/dictionaries');
    return response.data?.dictionaries ?? response.data ?? [];
  },

  getDictionaryById: async (id: string): Promise<Dictionary> => {
    const response = await api.get(`/learning/dictionaries/${id}`);
    return response.data.dictionary;
  },

  createDictionary: async (data: Partial<Dictionary>): Promise<Dictionary> => {
    const response = await api.post('/learning/dictionaries', data);
    return response.data.dictionary;
  },

  updateDictionary: async (id: string, data: Partial<Dictionary>): Promise<Dictionary> => {
    const response = await api.patch(`/learning/dictionaries/${id}`, data);
    return response.data.dictionary;
  },

  deleteDictionary: async (id: string): Promise<void> => {
    await api.delete(`/learning/dictionaries/${id}`);
  },

  // Words (Nested)
  getDictionaryWords: async (dictionaryId: string): Promise<DictionaryWord[]> => {
    const response = await api.get(`/learning/dictionaries/${dictionaryId}/words`);
    return response.data?.words ?? [];
  },

  addWordToDictionary: async (dictionaryId: string, data: Partial<DictionaryWord>): Promise<DictionaryWord> => {
    const response = await api.post(`/learning/dictionaries/${dictionaryId}/words`, data);
    return response.data.word;
  },

  updateWord: async (id: string, data: Partial<DictionaryWord>): Promise<DictionaryWord> => {
    const response = await api.patch(`/learning/dictionaries/words/${id}`, data);
    return response.data.word;
  },

  deleteWord: async (id: string): Promise<void> => {
    await api.delete(`/learning/dictionaries/words/${id}`);
  }
};
