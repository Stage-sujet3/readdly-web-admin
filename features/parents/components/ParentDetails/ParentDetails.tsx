import React from "react";
import { Sheet } from "@/components/ui/Sheet";
import { 
  Trash2, User, Mail, Phone, IdCard, UserCheck, 
  MapPin, Calendar, CheckCheck, XCircle, Globe, 
  FileCheck, Clock, Activity, ShieldCheck, AlertCircle, 
  Baby, GraduationCap, Lock, Info
} from "lucide-react";
import { Parent } from "../../types";
import styles from "./ParentDetails.module.css";

interface ParentDetailsProps {
  selectedParent: Parent | null;
  setSelectedParent: (parent: Parent | null) => void;
  setParentToDelete: (parent: Parent) => void;
  getStatusDisplay: (parent: Parent) => { text: string; color: string };
}

export function ParentDetails({
  selectedParent,
  setSelectedParent,
  setParentToDelete,
  getStatusDisplay
}: ParentDetailsProps) {
  
  if (!selectedParent) return null;

  const fullName = selectedParent.prenom && selectedParent.nom ? 
    `${selectedParent.prenom} ${selectedParent.nom}` : 
    (selectedParent as any).firstName && (selectedParent as any).lastName ?
      `${(selectedParent as any).firstName} ${(selectedParent as any).lastName}` :
      (selectedParent as any).name || selectedParent.email || 'Parent';

  const status = getStatusDisplay(selectedParent);
  let statusBadgeStyle = {};
  if (status.color === 'emerald') {
    statusBadgeStyle = { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' };
  } else {
    statusBadgeStyle = { backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' };
  }

  // Handle various children formats from backend
  const parentChildren = selectedParent.enfants || (selectedParent as any).children || [];

  return (
    <Sheet open={!!selectedParent} onOpenChange={(open) => !open && setSelectedParent(null)} size="xl">
      <div className={styles.drawerContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div 
              className={styles.avatar} 
              style={{ 
                backgroundColor: selectedParent.genre?.toLowerCase() === 'female' || selectedParent.genre?.toLowerCase() === 'fille' || selectedParent.genre?.toLowerCase() === 'f' ? '#fff1f2' : '#eff6ff',
                color: selectedParent.genre?.toLowerCase() === 'female' || selectedParent.genre?.toLowerCase() === 'fille' || selectedParent.genre?.toLowerCase() === 'f' ? '#e11d48' : '#2563eb',
                borderColor: selectedParent.genre?.toLowerCase() === 'female' || selectedParent.genre?.toLowerCase() === 'fille' || selectedParent.genre?.toLowerCase() === 'f' ? '#fecdd3' : '#bfdbfe'
              }}
            >
              {fullName.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 className={styles.name}>{fullName}</h2>
              <p className={styles.email}>{selectedParent.email}</p>
              <div className={styles.badges}>
                <span className={styles.roleBadge}>
                  {selectedParent.role}
                </span>
                <span className={styles.statusBadge} style={statusBadgeStyle}>
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            
            {/* Informations Personnelles */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Info className={styles.titleIcon} />
                Informations Personnelles
              </h3>
              <div className={styles.grid}>
                
                <div className={styles.infoGroup}>
                  <div className={styles.label}><User className={styles.smallIcon} /> Nom Complet</div>
                  <div className={styles.value}>{fullName}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><Phone className={styles.smallIcon} /> Téléphone</div>
                  <div className={styles.value}>{selectedParent.numTel || 'Non renseigné'}</div>
                </div>

                <div className={`${styles.infoGroup} ${styles.fullWidth}`}>
                  <div className={styles.label}><Mail className={styles.smallIcon} /> Email</div>
                  <div className={styles.value}>{selectedParent.email}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><IdCard className={styles.smallIcon} /> CIN</div>
                  <div className={styles.value}>{selectedParent.cin || 'Non renseigné'}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><UserCheck className={styles.smallIcon} /> Genre</div>
                  <div className={styles.value}>{selectedParent.genre || 'Non renseigné'}</div>
                </div>

                <div className={`${styles.infoGroup} ${styles.fullWidth}`}>
                  <div className={styles.label}><MapPin className={styles.smallIcon} /> Adresse Complète</div>
                  <div className={styles.value}>{selectedParent.adresse || 'Non renseignée'}</div>
                </div>

              </div>
            </div>

            {/* Compte & Sécurité */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Lock className={styles.titleIcon} />
                Compte & Sécurité
              </h3>
              <div className={styles.grid}>
                
                <div className={styles.infoGroup}>
                  <div className={styles.label}><Calendar className={styles.smallIcon} /> Date de Création</div>
                  <div className={styles.value}>
                    {new Date(selectedParent.dateCreation).toLocaleDateString('fr-FR', { 
                      day: '2-digit', month: 'long', year: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div className={styles.infoGroup}>
                  <div className={styles.label}><Mail className={styles.smallIcon} /> Email Vérifié</div>
                  <div className={styles.value}>
                    {selectedParent.emailVerified ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <CheckCheck style={{ width: '1.25rem', height: '1.25rem' }} /> Oui
                      </span>
                    ) : (
                      <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <XCircle style={{ width: '1.25rem', height: '1.25rem' }} /> Non
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><Globe className={styles.smallIcon} /> Fournisseur Auth</div>
                  <div className={styles.value} style={{ textTransform: 'capitalize' }}>{selectedParent.authProvider}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><FileCheck className={styles.smallIcon} /> Profil Complété</div>
                  <div className={styles.value}>
                    {selectedParent.isProfileCompleted ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <CheckCheck style={{ width: '1.25rem', height: '1.25rem' }} /> Complété
                      </span>
                    ) : (
                      <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <Clock style={{ width: '1.25rem', height: '1.25rem' }} /> En cours
                      </span>
                    )}
                  </div>
                </div>



              </div>
            </div>
            
            {/* Enfants */}
            {parentChildren.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Baby className={styles.titleIcon} style={{ color: '#ec4899' }} />
                  Enfants Inscrits ({parentChildren.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {parentChildren.map((enfant: any, index: number) => {
                      const isGirl = enfant.genre?.toLowerCase() === 'female' || enfant.genre?.toLowerCase() === 'fille' || enfant.genre?.toLowerCase() === 'f';
                      const cardClass = isGirl ? styles.childCardGirl : styles.childCardBoy;
                      
                      return (
                        <div key={index} className={`${styles.childCard} ${cardClass}`}>
                          <div className={styles.childNameBox}>
                            <div className={styles.childIcon}>
                              <Baby style={{ width: '1.25rem', height: '1.25rem' }} />
                            </div>
                            <div>
                              <p className={styles.childName}>{enfant.prenom} {enfant.nom}</p>
                              <div className="flex items-center gap-2">
                                <span className={styles.childGenderBadge}>
                                  {isGirl ? 'Fille' : 'Garçon'}
                                </span>
                                <span className={styles.childAgeBadge}>
                                  {enfant.age ? `${enfant.age} ans` : 'Âge non spécifié'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {enfant.niveau && <div className={styles.childLevel}>{enfant.niveau}</div>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={() => setSelectedParent(null)} className={styles.btnClose}>
            Fermer le tiroir
          </button>
          <button 
            onClick={() => {
              const parent = selectedParent;
              setSelectedParent(null);
              setParentToDelete(parent);
            }} 
            className={styles.btnDelete}
          >
            <Trash2 style={{ width: '1rem', height: '1rem' }} />
            Supprimer l'utilisateur
          </button>
        </div>
      </div>
    </Sheet>
  );
}
