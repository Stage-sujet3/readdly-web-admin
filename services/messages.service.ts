import { api } from './api';

export const messagesService = {
  // Admin endpoints
  getMessages: (params?: {
    type?: string;
    status?: string;
    senderType?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.status) query.set('status', params.status);
    if (params?.senderType) query.set('senderType', params.senderType);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return api.get(`/admin/feedback/messages?${query.toString()}`);
  },

  getMessageStats: () => api.get('/admin/feedback/messages/stats'),

  getMessage: (id: string) => api.get(`/admin/feedback/messages/${id}`),

  replyToMessage: (id: string, reply: string) =>
    api.post(`/admin/feedback/messages/${id}/reply`, { reply }),

  getRatingsSummary: () => api.get('/admin/feedback/ratings'),
};
