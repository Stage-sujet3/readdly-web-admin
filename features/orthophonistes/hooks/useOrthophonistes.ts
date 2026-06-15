import { useState, useEffect, useCallback } from "react";
import { getOrthophonistesList, deleteOrthophoniste, getUser, verifyOrthophoniste, rejectOrthophoniste } from "@/services/user.service";
import { Orthophoniste, OrthophonisteStats } from "../types";

export function useOrthophonistes() {
  const [orthophonistes, setOrthophonistes] = useState<Orthophoniste[]>([]);
  const [stats, setStats] = useState<OrthophonisteStats & { pendingOrthophonistes?: number }>({
    totalOrthophonistes: 0,
    verifiedOrthophonistes: 0,
    totalPatients: 0,
    pendingOrthophonistes: 0,
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const limit = 10;

  const fetchOrthophonistes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOrthophonistesList(page, limit, searchTerm, statusFilter).catch(() => ({ data: { success: false } }));
      
      const orthophonistesData = (response.data?.success && response.data.data.users) 
        ? response.data.data.users.filter((user: any) => user.role === 'ORTHOPHONISTE') 
        : [];

      setOrthophonistes(orthophonistesData);
      setTotal(response.data?.data?.total || orthophonistesData.length);
      
      const verifiedCount = orthophonistesData.filter((ortho: Orthophoniste) => 
        ortho.verificationAdmin === 'VERIFIED'
      ).length;
      
      const pendingCount = orthophonistesData.filter((ortho: Orthophoniste) => 
        ortho.verificationAdmin === 'NOT_VERIFIED'
      ).length;

      setStats({
        totalOrthophonistes: orthophonistesData.length,
        verifiedOrthophonistes: verifiedCount,
        totalPatients: 0,
        pendingOrthophonistes: pendingCount
      });
    } catch (error) {
      console.error("Failed to fetch orthophonistes", error);
      setOrthophonistes([]);
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
      const idToFetch = orthophoniste.idU || (orthophoniste as any).id;
      const response = await getUser(idToFetch);
      if (response.data?.success) {
        setSelectedOrthophoniste(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load user details:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleVerifyOrthophoniste = async (id: string) => {
    setIsVerifying(true);
    try {
      const response = await verifyOrthophoniste(id);
      if (response.data?.success) {
        // Update local state immediately for instant feedback
        setSelectedOrthophoniste(prev => 
          prev ? { ...prev, verificationAdmin: 'VERIFIED', verificationStatus: 'VERIFIED', etatCompte: 'ACTIVE' } : null
        );
        setOrthophonistes(prev =>
          prev.map(o => (o.idU || (o as any).id) === id ? { ...o, verificationAdmin: 'VERIFIED', verificationStatus: 'VERIFIED', etatCompte: 'ACTIVE' } : o)
        );
        fetchOrthophonistes();
      } else {
        alert(response.data?.message || "Échec de la validation");
      }
    } catch (error) {
      console.error("Verify error:", error);
      alert("Une erreur est survenue lors de la validation");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRejectOrthophoniste = async (id: string, reason: string) => {
    setIsVerifying(true);
    try {
      const response = await rejectOrthophoniste(id, reason);
      if (response.data?.success) {
        setSelectedOrthophoniste(prev =>
          prev ? { ...prev, verificationAdmin: 'REJECTED', verificationStatus: 'REJECTED' } : null
        );
        setOrthophonistes(prev =>
          prev.map(o => (o.idU || (o as any).id) === id ? { ...o, verificationAdmin: 'REJECTED', verificationStatus: 'REJECTED' } : o)
        );
        setShowRejectModal(false);
        fetchOrthophonistes();
      } else {
        alert(response.data?.message || "Échec du rejet");
      }
    } catch (error) {
      console.error("Reject error:", error);
      alert("Une erreur est survenue lors du rejet");
    } finally {
      setIsVerifying(false);
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
      if (statusFilter === 'VERIFIED') {
        filtered = filtered.filter(o => o.verificationAdmin === 'VERIFIED');
      } else if (statusFilter === 'REJECTED') {
        filtered = filtered.filter(o => o.verificationAdmin === 'REJECTED');
      } else if (statusFilter === 'PENDING') {
        filtered = filtered.filter(o => o.verificationAdmin === 'NOT_VERIFIED');
      }
    }
    return filtered;
  }, [orthophonistes, statusFilter]);

  const getStatusDisplay = (ortho: Orthophoniste) => {
    if (ortho.verificationAdmin === 'VERIFIED') {
      return { text: 'Vérifié', color: 'emerald' };
    } else if (ortho.verificationAdmin === 'REJECTED') {
      return { text: 'Rejeté', color: 'red' };
    } else {
      return { text: 'En attente', color: 'amber' };
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
    isVerifying,
    showRejectModal,
    setShowRejectModal,
    loadUserDetails,
    handleDeleteOrthophoniste,
    handleVerifyOrthophoniste,
    handleRejectOrthophoniste,
    getStatusDisplay,
    fetchOrthophonistes
  };
}
