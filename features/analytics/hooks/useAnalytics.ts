import { useState, useEffect } from 'react';
import { getGlobalAnalytics } from '@/services/user.service';
import { AnalyticsData } from '../types';

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGlobalAnalytics();
      const realData = response?.data?.success ? response.data.data : null;
      if (!realData) {
        throw new Error('Aucune donnée analytics reçue depuis le backend.');
      }
      setData(realData);
    } catch (err: unknown) {
      console.error('Analytics error:', err);
      setData(null);
      if (err instanceof Error) {
        setError(err.message || 'Erreur analytics');
      } else {
        setError('Erreur analytics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchAnalytics
  };
}
