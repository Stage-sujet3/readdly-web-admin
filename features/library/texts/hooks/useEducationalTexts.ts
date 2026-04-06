import { useState, useEffect } from 'react';
import { textService } from '../services/textService';
import { EducationalText } from '../../types';

export function useEducationalTexts() {
  const [texts, setTexts] = useState<EducationalText[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTexts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await textService.getTexts();
      setTexts(data);
    } catch (err) {
      console.error('Failed to fetch educational texts:', err);
      setError('Could not load educational texts.');
      setTexts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const addText = async (data: Partial<EducationalText>) => {
    try {
      await textService.addText(data);
      await fetchTexts();
    } catch (err) {
      console.error('Failed to add educational text:', err);
      throw err;
    }
  };

  const updateText = async (id: string, data: Partial<EducationalText>) => {
    try {
      await textService.updateText(id, data);
      await fetchTexts();
    } catch (err) {
      console.error('Failed to update educational text:', err);
      throw err;
    }
  };

  const deleteText = async (id: string) => {
    try {
      await textService.deleteText(id);
      await fetchTexts();
    } catch (err) {
      console.error('Failed to delete educational text:', err);
      throw err;
    }
  };

  const toggleStatus = async (text: EducationalText) => {
    try {
      const newStatus = text.status === 'actif' ? 'inactif' : 'actif';
      await textService.updateText(text.id, { status: newStatus } as any);
      await fetchTexts();
    } catch (err) {
      console.error('Failed to toggle text status:', err);
      throw err;
    }
  };

  return {
    texts,
    loading,
    error,
    addText,
    updateText,
    deleteText,
    toggleStatus,
    refreshTexts: fetchTexts
  };
}
