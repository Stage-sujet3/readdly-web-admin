"use client";
import React from "react";
import { Search, Trash2, Eye, MapPin, Calendar, FileText, CheckCheck, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Orthophoniste } from "../../types";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./OrthophonistesGrid.module.css";

interface OrthophonistesGridProps {
  orthophonistes: Orthophoniste[];
  total: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  loadUserDetails: (orthophoniste: Orthophoniste) => void;
  setOrthophonisteToDelete: (orthophoniste: Orthophoniste) => void;
  getStatusDisplay: (orthophoniste: Orthophoniste) => { text: string; color: string };
  isLoading?: boolean;
}

export function OrthophonistesGrid({
  orthophonistes,
  total,
  page,
  setPage,
  limit,
  loadUserDetails,
  setOrthophonisteToDelete,
  getStatusDisplay,
  isLoading = false
}: OrthophonistesGridProps) {

  const renderSkeletons = () => (
    <div className={styles.gridContainer}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.cardHeader}>
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-24 h-6 rounded-full mt-2" />
            </div>
          </div>
          <div className={styles.cardBody}>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className={styles.cardFooter}>
            <Skeleton className="w-full h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <Search style={{ width: '28px', height: '28px' }} />
      </div>
      <h3 className={styles.emptyTitle}>Aucun orthophoniste trouvé</h3>
      <p className={styles.emptyDesc}>
        Il n'y a aucun profil correspondant à vos critères actuels.
      </p>
    </div>
  );

  if (isLoading) {
    return renderSkeletons();
  }

  return (
    <>
      {orthophonistes.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={styles.gridContainer}>
          {orthophonistes.map((o, index) => {
            const fullName = (o.prenom && o.nom) ? `${o.prenom} ${o.nom}` : 
                 (o as any).firstName && (o as any).lastName ? `${(o as any).firstName} ${(o as any).lastName}` :
                 o.email || 'Orthophoniste';
            
            const status = getStatusDisplay(o);
            const statusColors: Record<string, { bg: string, text: string, dot: string, border: string }> = {
              emerald: { bg: '#ecfdf5', text: '#047857', dot: '#10b981', border: '#a7f3d0' },
              blue: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
              amber: { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b', border: '#fde68a' },
              red: { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444', border: '#fecaca' }
            };
            const currentStatusColor = statusColors[status.color] || statusColors.amber;

            const profilePhotoFile = o.files?.find(f => f.fileType === "PROFILE_PHOTO");
            const profilePhotoUrl = profilePhotoFile?.fullUrl || profilePhotoFile?.hostedUrl || (o.avatar?.startsWith('http') ? o.avatar : null);

            // Safe Date
            const safeDate = o.createdAt ? new Date(o.createdAt) : null;
            const formattedDate = safeDate && !isNaN(safeDate.getTime())
              ? safeDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
              : "Date invalide";

            // Docs completion
            const isDocsComplete = o.hasDocs === true;

            return (
              <div key={o.idU || (o as any).id || `ortho-${index}`} className={styles.card}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrapper}>
                    {profilePhotoUrl ? (
                      <img src={profilePhotoUrl} alt={fullName} className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarInitials}>
                        {fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    {o.verificationAdmin === 'VERIFIED' && <div className={styles.onlineIndicator} title="Vérifié" />}
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName} title={fullName}>{fullName}</h3>
                    <p className={styles.userEmail} title={o.email}>{o.email}</p>
                    <span 
                      className={styles.statusBadge} 
                      style={{ backgroundColor: currentStatusColor.bg, color: currentStatusColor.text, borderColor: currentStatusColor.border }}
                    >
                      <span className={styles.statusDot} style={{ backgroundColor: currentStatusColor.dot }} />
                      {status.text}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><Calendar size={14} /> Inscription</span>
                    <span className={styles.infoValue}>{formattedDate}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><User size={14} /> Identité</span>
                    <span className={styles.infoValue}>
                      {o.verificationStatus === 'VERIFIED' ? (
                        <span style={{ color: '#059669' }}>Vérifiée</span>
                      ) : (
                        <span style={{ color: '#dc2626' }}>Non vérifiée</span>
                      )}
                    </span>
                  </div>
                  <div className={styles.infoRow} style={{ marginTop: '4px' }}>
                    <span className={styles.infoLabel}><FileText size={14} /> Dossier</span>
                    {isDocsComplete ? (
                      <span className={styles.docsComplete}><CheckCheck size={12} /> Complet</span>
                    ) : (
                      <span className={styles.docsIncomplete}><AlertCircle size={12} /> Incomplet</span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <button 
                    onClick={() => loadUserDetails(o)}
                    className={styles.btnView}
                  >
                    <Eye size={16} /> Détails
                  </button>
                  <button 
                    onClick={() => setOrthophonisteToDelete(o)}
                    className={styles.btnDelete}
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {total > limit && (
        <div className={styles.pagination}>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className={styles.paginationText}>
            Page {page} sur {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
            disabled={page >= Math.ceil(total / limit)}
          >
            Suivant
          </Button>
        </div>
      )}
    </>
  );
}
