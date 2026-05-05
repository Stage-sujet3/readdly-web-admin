import React from "react";
import { Search, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Orthophoniste } from "../../types";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./OrthophonistesTable.module.css";

interface OrthophonistesTableProps {
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

export function OrthophonistesTable({
  orthophonistes,
  total,
  page,
  setPage,
  limit,
  loadUserDetails,
  setOrthophonisteToDelete,
  getStatusDisplay,
  isLoading = false
}: OrthophonistesTableProps) {
  
  if (isLoading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <Skeleton className="w-48 h-6" />
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Orthophoniste</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th}>Inscription</th>
                <th className={`${styles.th} ${styles.thRight}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.userInfo}>
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-48 h-3" />
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <Skeleton className="w-24 h-6 rounded-full" />
                  </td>
                  <td className={styles.td}>
                    <Skeleton className="w-24 h-4" />
                  </td>
                  <td className={`${styles.td} ${styles.tdRight}`}>
                    <div className={styles.actionButtons}>
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.resultsText}>
            {total} orthophoniste{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Orthophoniste</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th}>Inscription</th>
                <th className={`${styles.th} ${styles.thRight}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orthophonistes.map((orthophoniste, index) => {
                const fullName = orthophoniste.prenom && orthophoniste.nom ? 
                  `${orthophoniste.prenom} ${orthophoniste.nom}` : 
                  (orthophoniste as any).firstName && (orthophoniste as any).lastName ?
                    `${(orthophoniste as any).firstName} ${(orthophoniste as any).lastName}` :
                    (orthophoniste as any).name || orthophoniste.email || 'Orthophoniste';
                
                const status = getStatusDisplay(orthophoniste);
                
                // Dashboard specific colors mapping
                const statusColors: Record<string, { bg: string, text: string, dot: string, border: string }> = {
                  emerald: { bg: '#ecfdf5', text: '#047857', dot: '#10b981', border: '#a7f3d0' },
                  blue: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
                  amber: { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b', border: '#fde68a' },
                  red: { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444', border: '#fecaca' }
                };
                
                const currentStatusColor = statusColors[status.color] || statusColors.red;

                return (
                  <tr key={orthophoniste.idU || `orthophoniste-${index}`} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className={styles.userName}>{fullName}</p>
                          <p className={styles.userEmail}>{orthophoniste.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.statusBadge} style={{ backgroundColor: currentStatusColor.bg, color: currentStatusColor.text, borderColor: currentStatusColor.border }}>
                        <span className={styles.statusDot} style={{ backgroundColor: currentStatusColor.dot }} />
                        {status.text}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
                        {new Date(orthophoniste.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.tdRight}`}>
                      <div className={styles.actionButtons}>
                        <button 
                          onClick={() => loadUserDetails(orthophoniste)}
                          className={styles.btnAction}
                          title="Voir les détails"
                        >
                          <Eye style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                        <button 
                          onClick={() => setOrthophonisteToDelete(orthophoniste)}
                          className={styles.btnDelete}
                          title="Supprimer"
                        >
                          <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {orthophonistes.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ width: '4rem', height: '4rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <Search style={{ width: '1.5rem', height: '1.5rem', color: '#94a3b8' }} />
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>Aucun orthophoniste ne correspond à vos critères de recherche.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
