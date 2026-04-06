import React from "react";
import { Sheet } from "@/components/ui/Sheet";
import { 
  Trash2, User, Mail, Phone, IdCard, UserCheck, 
  MapPin, Calendar, CheckCheck, XCircle, Globe, 
  FileCheck, Clock, Activity, ShieldCheck, AlertCircle, 
  Baby, GraduationCap, Lock, Info
} from "lucide-react";
import { Orthophoniste } from "../../types";
import styles from "./OrthophonisteDetails.module.css";

interface OrthophonisteDetailsProps {
  selectedOrthophoniste: Orthophoniste | null;
  setSelectedOrthophoniste: (orthophoniste: Orthophoniste | null) => void;
  setOrthophonisteToDelete: (orthophoniste: Orthophoniste) => void;
  getStatusDisplay: (orthophoniste: Orthophoniste) => { text: string; color: string };
}

export function OrthophonisteDetails({
  selectedOrthophoniste,
  setSelectedOrthophoniste,
  setOrthophonisteToDelete,
  getStatusDisplay
}: OrthophonisteDetailsProps) {
  
  if (!selectedOrthophoniste) return null;

  const fullName = selectedOrthophoniste.prenom && selectedOrthophoniste.nom ? 
    `${selectedOrthophoniste.prenom} ${selectedOrthophoniste.nom}` : 
    (selectedOrthophoniste as any).firstName && (selectedOrthophoniste as any).lastName ?
      `${(selectedOrthophoniste as any).firstName} ${(selectedOrthophoniste as any).lastName}` :
      (selectedOrthophoniste as any).name || selectedOrthophoniste.email || 'Orthophoniste';

  const status = getStatusDisplay(selectedOrthophoniste);
  let statusBadgeStyle = {};
  if (status.color === 'emerald') {
    statusBadgeStyle = { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' };
  } else if (status.color === 'blue') {
    statusBadgeStyle = { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' };
  } else if (status.color === 'amber') {
    statusBadgeStyle = { backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' };
  } else {
    statusBadgeStyle = { backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' };
  }

  // Handle various patients formats from backend if they exist
  const patients = selectedOrthophoniste.enfantsSuivis || (selectedOrthophoniste as any).patients || [];

  return (
    <Sheet open={!!selectedOrthophoniste} onOpenChange={(open) => !open && setSelectedOrthophoniste(null)} size="xl">
      <div className={styles.drawerContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.avatar}>
              {fullName.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 className={styles.name}>{fullName}</h2>
              <p className={styles.email}>{selectedOrthophoniste.email}</p>
              <div className={styles.badges}>
                <span className={styles.roleBadge}>
                  {selectedOrthophoniste.role}
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
                  <div className={styles.value}>{selectedOrthophoniste.numTel || 'Non renseigné'}</div>
                </div>

                <div className={`${styles.infoGroup} ${styles.fullWidth}`}>
                  <div className={styles.label}><Mail className={styles.smallIcon} /> Email</div>
                  <div className={styles.value}>{selectedOrthophoniste.email}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><IdCard className={styles.smallIcon} /> CIN</div>
                  <div className={styles.value}>{selectedOrthophoniste.cin || 'Non renseigné'}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><UserCheck className={styles.smallIcon} /> Genre</div>
                  <div className={styles.value}>{selectedOrthophoniste.genre || 'Non renseigné'}</div>
                </div>

                <div className={`${styles.infoGroup} ${styles.fullWidth}`}>
                  <div className={styles.label}><MapPin className={styles.smallIcon} /> Adresse Complète</div>
                  <div className={styles.value}>{selectedOrthophoniste.adresse || 'Non renseignée'}</div>
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
                    {new Date(selectedOrthophoniste.dateCreation).toLocaleDateString('fr-FR', { 
                      day: '2-digit', month: 'long', year: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div className={styles.infoGroup}>
                  <div className={styles.label}><Mail className={styles.smallIcon} /> Email Vérifié</div>
                  <div className={styles.value}>
                    {selectedOrthophoniste.emailVerified ? (
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
                  <div className={styles.value} style={{ textTransform: 'capitalize' }}>{selectedOrthophoniste.authProvider}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><FileCheck className={styles.smallIcon} /> Profil Complété</div>
                  <div className={styles.value}>
                    {selectedOrthophoniste.isProfileCompleted ? (
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

                <div className={styles.infoGroup}>
                  <div className={styles.label}><Activity className={styles.smallIcon} /> Statut Initial</div>
                  <div className={styles.value}>{selectedOrthophoniste.verificationStatus}</div>
                </div>

                <div className={styles.infoGroup}>
                  <div className={styles.label}><ShieldCheck className={styles.smallIcon} /> Vérification Admin</div>
                  <div className={styles.value}>
                    {selectedOrthophoniste.verificationAdmin ? (
                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <ShieldCheck style={{ width: '1.25rem', height: '1.25rem' }} /> Validé
                      </span>
                    ) : (
                      <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} /> En attente
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Enfants / Patients */}
            {patients.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Baby className={styles.titleIcon} style={{ color: '#3b82f6' }} />
                  Patients Suivis ({patients.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {patients.map((patient: any, index: number) => (
                    <div key={index} className={styles.childCard}>
                      <div className={styles.childNameBox}>
                        <div className={styles.childIcon}>
                          <Baby style={{ width: '1.25rem', height: '1.25rem' }} />
                        </div>
                        <div>
                          <p className={styles.childName}>{patient.prenom} {patient.nom}</p>
                          <p className={styles.childAge}>{patient.age ? `${patient.age} ans` : 'Âge non spécifié'}</p>
                        </div>
                      </div>
                      <div>
                        {patient.niveau && <div className={styles.childLevel}>{patient.niveau}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={() => setSelectedOrthophoniste(null)} className={styles.btnClose}>
            Fermer le tiroir
          </button>
          <button 
            onClick={() => {
              const orthophoniste = selectedOrthophoniste;
              setSelectedOrthophoniste(null);
              setOrthophonisteToDelete(orthophoniste);
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
