import { useState, useEffect, useCallback } from "react";
import { getAuditLogs, clearAuditLogs } from "@/services/user.service";

export interface AuditLog {
  id: string;
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  description: string;
  metadata: string;
  createdAt: string;
}

export function useAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    actionType: '',
    targetType: '',
  });

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAuditLogs({
        page,
        limit: 6,
        ...filters
      });

      if (response.data?.success) {
        setLogs(response.data.data.logs || []);
        setTotal(response.data.data.total || 0);
        setPages(response.data.data.pages || 0);
      }
    } catch (err) {
      console.error("Audit logs fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  const clearHistory = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer tout l'historique ?")) {
      try {
        await clearAuditLogs();
        await fetchLogs();
      } catch (err) {
        console.error("Error clearing logs:", err);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { 
    logs, 
    total, 
    pages, 
    page, 
    setPage, 
    filters, 
    setFilters, 
    isLoading,
    refresh: fetchLogs,
    clearHistory
  };
}
