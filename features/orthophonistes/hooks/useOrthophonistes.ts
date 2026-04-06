import { useState, useEffect, useCallback } from "react";
import { getOrthophonistesList, deleteOrthophoniste, getUser } from "@/services/user.service";
import { Orthophoniste, OrthophonisteStats } from "../types";

export function useOrthophonistes() {
  const [orthophonistes, setOrthophonistes] = useState<Orthophoniste[]>([]);
  const [stats, setStats] = useState<OrthophonisteStats>({
    totalOrthophonistes: 0,
    verifiedOrthophonistes: 0,
    totalPatients: 0
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedOrthophoniste, setSelectedOrthophoniste] = useState<Orthophoniste | null>(null);
  const [orthophonisteToDelete, setOrthophonisteToDelete] = useState<Orthophoniste | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  const limit = 10;

  const fetchOrthophonistes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOrthophonistesList(page, limit, searchTerm, statusFilter);
      
      if (response.data?.success) {
        const orthophonistesData = response.data.data.users?.filter((user: any) => user.role === 'ORTHOPHONISTE') || [];
        setOrthophonistes(orthophonistesData);
        setTotal(response.data.data.total || 0);
        
        // Calculate stats from backend data
        const verifiedOrthophonistes = orthophonistesData.filter((ortho: Orthophoniste) => 
          ortho.verificationStatus === 'VERIFIED' && ortho.emailVerified
        ).length;
        
        setStats({
          totalOrthophonistes: orthophonistesData.length,
          verifiedOrthophonistes,
          totalPatients: 0 // Simplified - no children display in initial data currently
        });
      } else {
        setOrthophonistes([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch orthophonistes", error);
      setOrthophonistes([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    fetchOrthophonistes();
  }, [fetchOrthophonistes]);

  const loadUserDetails = async (orthophoniste: Orthophoniste) => {
    setSelectedOrthophoniste(orthophoniste);
    setIsFetching(true);
    try {
      const response = await getUser(orthophoniste.idU);
      if (response.data?.success) {
        setSelectedOrthophoniste(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load user details:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteOrthophoniste = async () => {
    if (!orthophonisteToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteOrthophoniste(orthophonisteToDelete.idU);
      if (response.data?.success) {
        alert("Orthophoniste supprimé avec succès");
        setOrthophonisteToDelete(null);
        fetchOrthophonistes();
      } else {
        alert(response.data?.message || "Échec de la suppression");
      }
    } catch (error) {
      console.error("Delete orthophoniste error:", error);
      alert("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getFilteredOrthophonistes = useCallback(() => {
    let filtered = orthophonistes;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ortho => ortho.verificationStatus === statusFilter);
    }
    return filtered;
  }, [orthophonistes, statusFilter]);

  const getStatusDisplay = (ortho: Orthophoniste) => {
    if (ortho.verificationStatus === 'VERIFIED' && ortho.emailVerified) {
      return { text: 'Vérifié', color: 'emerald' };
    } else if (ortho.etatCompte === 'ACTIVE') {
      return { text: 'Actif', color: 'blue' };
    } else if (ortho.verificationStatus === 'PENDING') {
      return { text: 'En attente', color: 'amber' };
    } else {
      return { text: 'Inactif', color: 'red' };
    }
  };

  return {
    orthophonistes: getFilteredOrthophonistes(),
    stats,
    total,
    page,
    setPage,
    limit,
    selectedOrthophoniste,
    setSelectedOrthophoniste,
    orthophonisteToDelete,
    setOrthophonisteToDelete,
    isDeleting,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isLoading,
    isFetching,
    loadUserDetails,
    handleDeleteOrthophoniste,
    getStatusDisplay,
    fetchOrthophonistes
  };
}
