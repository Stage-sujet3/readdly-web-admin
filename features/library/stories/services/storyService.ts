import { api } from '@/services/api';
import { Story } from '../../types';

export const storyService = {
  getStories: async (): Promise<Story[]> => {
    const response = await api.get('/learning/stories');
    return response.data.stories || [];
  },

  getStory: async (id: string): Promise<Story> => {
    const response = await api.get(`/learning/stories/${id}`);
    return response.data.story;
  },

  addStory: async (data: Partial<Story>): Promise<Story> => {
    const response = await api.post('/learning/stories', data);
    return response.data.story;
  },

  updateStory: async (id: string, data: Partial<Story>): Promise<Story> => {
    const response = await api.patch(`/learning/stories/${id}`, data);
    return response.data.story;
  },

  deleteStory: async (id: string): Promise<void> => {
    await api.delete(`/learning/stories/${id}`);
  },

  togglePublish: async (id: string, currentStatus: string): Promise<Story> => {
    const newStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
    return storyService.updateStory(id, { status: newStatus });
  }
};
