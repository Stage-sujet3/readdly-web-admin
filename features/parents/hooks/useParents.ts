import { useState, useEffect, useCallback } from "react";
import { getParentsList, deleteParent, getParentWithChildren } from "@/services/user.service";
import { Parent, ParentStats } from "../types";

export function useParents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [stats, setStats] = useState<ParentStats>({
    totalChildren: 0,
    totalParents: 0,
    verifiedParents: 0
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  const limit = 10;

  const fetchParents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getParentsList(page, limit, searchTerm, statusFilter);
      
      if (response.data?.success) {
        const parentsData = response.data.data.users?.filter((user: any) => user.role === 'PARENT') || [];
        setParents(parentsData);
        setTotal(response.data.data.total || 0);
        
        // Calculate stats from backend data
        const totalChildren = parentsData.reduce((sum: number, parent: any) => {
          const count = parent.enfants?.length || parent.children?.length || parent.totalChildren || parent.enfantCount || 0;
          return sum + count;
        }, 0);
        
        const verifiedParents = parentsData.filter((parent: Parent) => 
          parent.verificationStatus === 'VERIFIED' && parent.emailVerified
        ).length;
        
        setStats({
          totalChildren,
          totalParents: parentsData.length,
          verifiedParents
        });
      } else {
        setParents([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch parents", error);
      setParents([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    fetchParents();
  }, [fetchParents]);

  const loadUserDetails = async (parent: Parent) => {
    setSelectedParent(parent);
    setIsFetching(true);
    try {
      const response = await getParentWithChildren(parent.idU);
      if (response.data) {
        const detailedParent = response.data.data || response.data;
        setSelectedParent(detailedParent);
        setParents(prev => prev.map(p => p.idU === detailedParent.idU ? detailedParent : p));
      }
    } catch (error) {
      console.error("Failed to load user details:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteParent = async () => {
    if (!parentToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteParent(parentToDelete.idU);
      if (response.data?.success) {
        alert("Parent supprimé avec succès");
        setParentToDelete(null);
        fetchParents();
      } else {
        alert(response.data?.message || "Échec de la suppression");
      }
    } catch (error) {
      console.error("Delete parent error:", error);
      alert("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getFilteredParents = useCallback(() => {
    let filtered = parents;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(parent => parent.verificationStatus === statusFilter);
    }
    return filtered;
  }, [parents, statusFilter]);

  const getStatusDisplay = (parent: Parent) => {
    if (parent.verificationStatus === 'VERIFIED' && parent.emailVerified) {
      return { text: 'Vérifié', color: 'emerald' };
    } else if (parent.etatCompte === 'ACTIVE') {
      return { text: 'Actif', color: 'blue' };
    } else if (parent.verificationStatus === 'PENDING') {
      return { text: 'En attente', color: 'amber' };
    } else {
      return { text: 'Inactif', color: 'red' };
    }
  };

  return {
    parents: getFilteredParents(),
    stats,
    total,
    page,
    setPage,
    limit,
    selectedParent,
    setSelectedParent,
    parentToDelete,
    setParentToDelete,
    isDeleting,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isLoading,
    isFetching,
    loadUserDetails,
    handleDeleteParent,
    getStatusDisplay,
    fetchParents
  };
}
