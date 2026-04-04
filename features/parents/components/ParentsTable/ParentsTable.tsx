import React from "react";
import { Baby, Search, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Parent } from "../../types";
import styles from "./ParentsTable.module.css";

interface ParentsTableProps {
  parents: Parent[];
  total: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  loadUserDetails: (parent: Parent) => void;
  setParentToDelete: (parent: Parent) => void;
  getStatusDisplay: (parent: Parent) => { text: string; color: string };
}

export function ParentsTable({
  parents,
  total,
  page,
  setPage,
  limit,
  loadUserDetails,
  setParentToDelete,
  getStatusDisplay
}: ParentsTableProps) {
  
  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.resultsText}>
            {total} parent{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Parent</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Baby style={{ width: '1rem', height: '1rem' }} />
                    Enfants
                  </div>
                </th>
                <th className={styles.th}>Inscription</th>
                <th className={`${styles.th} ${styles.thRight}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((parent, index) => {
                const fullName = parent.prenom && parent.nom ? 
                  `${parent.prenom} ${parent.nom}` : 
                  (parent as any).firstName && (parent as any).lastName ?
                    `${(parent as any).firstName} ${(parent as any).lastName}` :
                    (parent as any).name || parent.email || 'Parent';
                
                const status = getStatusDisplay(parent);
                
                // Dashboard specific colors mapping
                const statusColors: Record<string, { bg: string, text: string, dot: string, border: string }> = {
                  emerald: { bg: '#ecfdf5', text: '#047857', dot: '#10b981', border: '#a7f3d0' },
                  blue: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
                  amber: { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b', border: '#fde68a' },
                  red: { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444', border: '#fecaca' }
                };
                
                const currentStatusColor = statusColors[status.color] || statusColors.red;

                const childrenCount = parent.enfants?.length || 
                  (parent as any).children?.length ||
                  (parent as any).totalChildren ||
                  (parent as any).enfantCount ||
                  0;

                return (
                  <tr key={parent.idU || `parent-${index}`} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className={styles.userName}>{fullName}</p>
                          <p className={styles.userEmail}>{parent.email}</p>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Baby style={{ width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                          {childrenCount}
                        </span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>
                        {new Date(parent.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.tdRight}`}>
                      <div className={styles.actionButtons}>
                        <button 
                          onClick={() => loadUserDetails(parent)}
                          className={styles.btnAction}
                          title="Voir les détails"
                        >
                          <Eye style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                        <button 
                          onClick={() => setParentToDelete(parent)}
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
              
              {parents.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ width: '4rem', height: '4rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <Search style={{ width: '1.5rem', height: '1.5rem', color: '#94a3b8' }} />
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>Aucun parent ne correspond à vos critères de recherche.</p>
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
