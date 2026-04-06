import { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';
import { Story } from '../../types';

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await storyService.getStories();
      setStories(data);
    } catch (err) {
      console.error('Failed to fetch stories:', err);
      setError('Could not load stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const addStory = async (data: Partial<Story>) => {
    try {
      await storyService.addStory(data);
      await fetchStories();
    } catch (err) {
      console.error('Failed to add story:', err);
      throw err;
    }
  };

  const updateStory = async (id: string, data: Partial<Story>) => {
    try {
      await storyService.updateStory(id, data);
      await fetchStories();
    } catch (err) {
      console.error('Failed to update story:', err);
      throw err;
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await storyService.deleteStory(id);
      await fetchStories();
    } catch (err) {
      console.error('Failed to delete story:', err);
      throw err;
    }
  };

  const toggleStatus = async (story: Story) => {
    try {
      await storyService.togglePublish(story.id, story.status);
      await fetchStories();
    } catch (err) {
      console.error('Failed to toggle story status:', err);
      throw err;
    }
  };

  return {
    stories,
    loading,
    error,
    addStory,
    updateStory,
    deleteStory,
    toggleStatus,
    refreshStories: fetchStories
  };
}
