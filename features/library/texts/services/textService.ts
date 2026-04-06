import { api } from '@/services/api';
import { EducationalText } from '../../types';

export const textService = {
  getTexts: async (): Promise<EducationalText[]> => {
    const response = await api.get('/learning/texts');
    return response.data.texts || [];
  },

  getText: async (id: string): Promise<EducationalText> => {
    const response = await api.get(`/learning/texts/${id}`);
    return response.data.text;
  },

  addText: async (data: Partial<EducationalText>): Promise<EducationalText> => {
    const response = await api.post('/learning/texts', data);
    return response.data.text;
  },

  updateText: async (id: string, data: Partial<EducationalText>): Promise<EducationalText> => {
    const response = await api.patch(`/learning/texts/${id}`, data);
    return response.data.text;
  },

  deleteText: async (id: string): Promise<void> => {
    await api.delete(`/learning/texts/${id}`);
  },

  togglePublish: async (id: string, currentStatus: string): Promise<EducationalText> => {
    const newStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
    return textService.updateText(id, { status: newStatus } as any);
  }
};
