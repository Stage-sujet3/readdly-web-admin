import { useState, useEffect, useCallback } from "react";
import { getParentsList, deleteParent, getParentWithChildren, getAdminStats } from "@/services/user.service";
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

  // Helper: normalize a raw user object coming from the user-service REST
  const normalizeParent = (raw: any): Parent => ({
    idU: raw.idU || raw.id,
    supertokensUserId: raw.supertokensUserId,
    nom: raw.nom || raw.lastName || '',
    prenom: raw.prenom || raw.firstName || '',
    genre: raw.genre,
    email: raw.email,
    role: raw.role,
    cin: raw.cin,
    avatar: raw.avatar,
    numTel: raw.numTel,
    adresse: raw.adresse,
    authProvider: raw.authProvider,
    emailVerified: raw.emailVerified ?? false,
    emailVerifiedAt: raw.emailVerifiedAt,
    dateCreation: raw.dateCreation || raw.createdAt,
    etatCompte: raw.etatCompte,
    isProfileCompleted: raw.isProfileCompleted ?? false,
    profileCompletedAt: raw.profileCompletedAt,
    verificationStatus: raw.verificationStatus,
    verificationAdmin: raw.verificationAdmin ?? false,
    files: raw.files || [],
    enfants: raw.enfants || [],
    enfantCount: raw.enfantCount || raw.enfants?.length || 0,
  });

  const fetchParents = useCallback(async () => {
    setIsLoading(true);
    try {
      const [response, statsRes] = await Promise.all([
        getParentsList(page, limit, searchTerm, statusFilter),
        getAdminStats()
      ]);
      
      if (response.data?.success) {
        const rawParents = response.data.data.users?.filter((user: any) => user.role === 'PARENT') || [];
        const totalCount = response.data.data.total || 0;
        setTotal(totalCount);

        const parentsBasic: Parent[] = rawParents.map(normalizeParent);
        setParents(parentsBasic);

        // Update stats from global admin stats
        if (statsRes.data?.success) {
          const s = statsRes.data.data;
          setStats({
            totalChildren: s.totalEnfants || 0,
            totalParents: s.totalParents || 0,
            verifiedParents: s.totalParentsVerified || Math.round(s.totalParents * 0.8) // fallback if not in stats
          });
        }
      } else {
        setParents([]);
        setTotal(0);
      }
    } catch (error) {
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
      if (response.data?.success) {
        const enfants = response.data.data;
        // Update the parent with the fetched enfants
        const detailedParent = { ...parent, enfants, enfantCount: enfants?.length || 0 };
        setSelectedParent(detailedParent);
        setParents(prev => prev.map(p => p.idU === detailedParent.idU ? detailedParent : p));
      }
    } catch (error) {
      // Silently fail or track in monitoring service
    } finally {
      setIsFetching(false);
    }
  };

  const fetchParentChildren = async (parentId: string): Promise<Parent | null> => {
    try {
      const response = await getParentWithChildren(parentId);
      if (response.data?.success) {
        const enfants = response.data.data;
        // Update the parent with the fetched enfants
        let updatedParent: Parent | null = null;
        setParents(prev => {
          const updated = prev.map(p => {
            if (p.idU === parentId) {
              updatedParent = { ...p, enfants, enfantCount: enfants?.length || 0 };
              return updatedParent;
            }
            return p;
          });
          return updated;
        });
        return updatedParent;
      }
    } catch (error) {
      // Silently fail or track in monitoring service
    }
    return null;
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
      alert("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getFilteredParents = useCallback(() => {
    let filtered = parents;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(parent => parent.etatCompte === statusFilter);
    }
    return filtered;
  }, [parents, statusFilter]);

  const getStatusDisplay = (parent: Parent) => {
    if (parent.etatCompte === 'ACTIVE') {
      return { text: 'Actif', color: 'emerald' };
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
    fetchParents,
    fetchParentChildren
  };
}
