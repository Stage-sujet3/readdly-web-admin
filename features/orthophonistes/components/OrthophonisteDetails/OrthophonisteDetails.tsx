"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Sheet } from "@/components/ui/Sheet";
import {
  User, Mail, Phone, IdCard, MapPin, Calendar, CheckCheck,
  XCircle, FileText, ShieldCheck, AlertCircle, Trash2,
  Eye, Clock, CheckCircle2, Stethoscope, ImageOff, Globe
} from "lucide-react";
import { Orthophoniste, OrthophonisteFile } from "../../types";
import { RejectModal } from "./RejectModal";
import { viewOrthophonisteDocs } from "@/services/user.service";
import styles from "./OrthophonisteDetails.module.css";

interface OrthophonisteDetailsProps {
  selectedOrthophoniste: Orthophoniste | null;
  setSelectedOrthophoniste: (orthophoniste: Orthophoniste | null) => void;
  setOrthophonisteToDelete: (orthophoniste: Orthophoniste) => void;
  getStatusDisplay: (orthophoniste: Orthophoniste) => { text: string; color: string };
  showRejectModal: boolean;
  setShowRejectModal: (v: boolean) => void;
  isVerifying: boolean;
  onVerify: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const FILE_TYPE_LABELS: Record<string, string> = {
  CIN_RECTO: "CIN Recto",
  CIN_VERSO: "CIN Verso",
  ORTHO_DOC: "Diplôme / Doc",
  VERIFICATION_PHOTO: "Photo Vérif.",
  PROFILE_PHOTO: "Photo Profil",
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string; dotColor: string }> = {
  emerald: { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0", dotColor: "#10b981" },
  amber:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a", dotColor: "#f59e0b" },
  red:     { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca", dotColor: "#ef4444" },
  blue:    { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dotColor: "#3b82f6" },
};

function DocCard({ file }: { file: OrthophonisteFile }) {
  const isImage = file.mimeType?.startsWith("image/") || ["jpg","jpeg","png","webp"].includes(file.extension?.toLowerCase());
  const url = file.fullUrl || file.hostedUrl;

  return (
    <div className={styles.docCard}>
      {isImage ? (
        <div className={styles.docPreview} style={{ position: "relative", width: "100%", height: "120px" }}>
          <Image src={url} alt={FILE_TYPE_LABELS[file.fileType] || file.fileType} fill style={{ objectFit: "cover" }} />
        </div>
      ) : (
        <div className={styles.docPlaceholder}>
          <FileText style={{ width: "28px", height: "28px", color: "#94a3b8" }} />
          <span className={styles.docPlaceholderText}>{file.extension?.toUpperCase() || "DOC"}</span>
        </div>
      )}
      <div className={styles.docFooter}>
        <span className={styles.docLabel}>{FILE_TYPE_LABELS[file.fileType] || file.fileType}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.docViewBtn}>
          <Eye style={{ width: "10px", height: "10px" }} /> Voir
        </a>
      </div>
    </div>
  );
}

function DocPlaceholder({ label }: { label: string }) {
  return (
    <div className={styles.docCard}>
      <div className={styles.docPlaceholder}>
        <ImageOff style={{ width: "24px", height: "24px", color: "#cbd5e1" }} />
        <span className={styles.docPlaceholderText}>Non fourni</span>
      </div>
      <div className={styles.docFooter}>
        <span className={styles.docLabel}>{label}</span>
      </div>
    </div>
  );
}

function SecureDocViewer({ orthophonisteId }: { orthophonisteId: string }) {
  const [password, setPassword] = useState("");
  const [docData, setDocData] = useState<{ url: string, mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!password) { setError("Mot de passe requis"); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await viewOrthophonisteDocs(orthophonisteId, password);
      if (res.data?.success && res.data.data?.url) {
        setDocData(res.data.data);
      } else {
        setError(res.data?.message || "Erreur de vérification");
      }
    } catch (e) {
      setError("Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  };

  if (docData) {
    const isImage = docData.mimeType?.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].some(ext => docData.url.toLowerCase().includes(ext));
    return (
      <div className={styles.docCard}>
        {isImage ? (
          <div className={styles.docPreview} style={{ position: "relative", width: "100%", height: "120px" }}>
            <Image src={docData.url} alt="Document Sécurisé" fill style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <div className={styles.docPlaceholder}>
            <FileText style={{ width: "28px", height: "28px", color: "#94a3b8" }} />
            <span className={styles.docPlaceholderText}>DOCUMENT</span>
          </div>
        )}
        <div className={styles.docFooter}>
          <span className={styles.docLabel}>Diplôme / Doc</span>
          <a href={docData.url} target="_blank" rel="noopener noreferrer" className={styles.docViewBtn}>
            <Eye style={{ width: "10px", height: "10px" }} /> Ouvrir
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.secureDocContainer}>
      <ShieldCheck style={{ width: "28px", height: "28px", color: "#6366f1", marginBottom: '12px' }} />
      <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600, marginBottom: '6px' }}>
        Document Protégé
      </p>
      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '16px', textAlign: 'center', maxWidth: '240px' }}>
        Veuillez entrer votre mot de passe administrateur pour consulter le document.
      </p>
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)}
        placeholder="Mot de passe admin"
        className={styles.passwordInput}
        style={{ marginBottom: '12px', width: '100%', maxWidth: '220px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginBottom: '12px' }}>{error}</p>}
      <button 
        onClick={handleVerify}
        disabled={isLoading}
        style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '0.813rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? "Vérification..." : "Voir le document"}
      </button>
    </div>
  )
}

export function OrthophonisteDetails({
  selectedOrthophoniste,
  setSelectedOrthophoniste,
  setOrthophonisteToDelete,
  getStatusDisplay,
  showRejectModal,
  setShowRejectModal,
  isVerifying,
  onVerify,
  onReject,
}: OrthophonisteDetailsProps) {
  if (!selectedOrthophoniste) return null;

  const o = selectedOrthophoniste;
  const fullName = (o.prenom && o.nom)
    ? `${o.prenom} ${o.nom}`
    : (o as any).firstName && (o as any).lastName
      ? `${(o as any).firstName} ${(o as any).lastName}`
      : o.email || "Orthophoniste";

  const status = getStatusDisplay(o);
  const statusStyle = STATUS_STYLES[status.color] || STATUS_STYLES.amber;
  
  const orthophonisteId = o.idU || (o as any).id;

  // Profile photo
  const profilePhotoFile = o.files?.find(f => f.fileType === "PROFILE_PHOTO");
  const profilePhotoUrl = profilePhotoFile?.fullUrl || profilePhotoFile?.hostedUrl || (o.avatar?.startsWith('http') ? o.avatar : null);

  // Document files
  const getFile = (type: OrthophonisteFile["fileType"]) =>
    o.files?.find(f => f.fileType === type);

  const isVerified = o.verificationAdmin === "VERIFIED";
  const isRejected = o.verificationAdmin === "REJECTED";

  // Google Maps embed
  const hasCoords = o.latitude != null && o.longitude != null;
  const addressQuery = o.adresse ? encodeURIComponent(o.adresse) : '';
  const mapsEmbedUrl = hasCoords
    ? `https://www.google.com/maps?q=${o.latitude},${o.longitude}&output=embed&z=15`
    : addressQuery
      ? `https://www.google.com/maps?q=${addressQuery}&output=embed&z=15`
      : null;

  // Safe Date parsing
  const safeDate = (o as any).verifiedAt ? new Date((o as any).verifiedAt) : (o.createdAt ? new Date(o.createdAt) : null);
  const formattedDate = safeDate && !isNaN(safeDate.getTime())
    ? safeDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : "Non vérifié";

  // Document Completeness
  const hasCinRecto = !!getFile("CIN_RECTO");
  const hasCinVerso = !!getFile("CIN_VERSO");
  const hasDiplome = !!getFile("ORTHO_DOC");
  const isDocsComplete = hasCinRecto && hasCinVerso && hasDiplome;

  return (
    <>
      <Sheet open={!!selectedOrthophoniste} onOpenChange={(open) => !open && setSelectedOrthophoniste(null)} size="2xl">
        <div className={styles.drawerContainer}>

          {/* ── HERO HEADER ─────────────────────────── */}
          <div className={styles.heroHeader}>
            <div className={styles.heroRow}>
              <div className={styles.avatarWrapper}>
                {profilePhotoUrl ? (
                  <Image src={profilePhotoUrl} alt={fullName} width={100} height={100} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarInitials}>
                    {fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                {isVerified && <div className={styles.onlineIndicator} />}
              </div>

              <div className={styles.heroInfo}>
                <h2 className={styles.heroName}>{fullName}</h2>
                <p className={styles.heroEmail}>{o.email}</p>
                <div className={styles.badgesRow}>
                  <span className={styles.roleTag}>Orthophoniste</span>
                  <span
                    className={styles.statusBadge}
                    style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}
                  >
                    <span className={styles.statusDot} style={{ background: statusStyle.dotColor }} />
                    {status.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── VERIFIED / REJECTED BANNER ───────────── */}
          {isVerified && (
            <div className={`${styles.resultBanner} ${styles.resultBannerVerified}`}>
              <CheckCircle2 style={{ width: "18px", height: "18px", flexShrink: 0 }} />
              Ce dossier a été validé — un email de confirmation a été envoyé à l'orthophoniste.
            </div>
          )}
          {isRejected && (
            <div className={`${styles.resultBanner} ${styles.resultBannerRejected}`}>
              <XCircle style={{ width: "18px", height: "18px", flexShrink: 0 }} />
              Ce dossier a été rejeté — un email d'information a été envoyé à l'orthophoniste.
            </div>
          )}

          {/* ── SCROLLABLE BODY ──────────────────────── */}
          <div className={styles.scrollBody}>

            {/* ── 2-COL GRID: Infos perso + Compte ──── */}
            <div className={styles.grid2col}>

              {/* Col 1 — Informations personnelles */}
              <div className={styles.card}>
                <p className={styles.cardTitle}>
                  <User className={styles.cardTitleIcon} /> Informations
                </p>
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <Phone style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Téléphone</p>
                      <p className={styles.infoValue}>{o.numTel || <span className={styles.infoValueMuted}>—</span>}</p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <ShieldCheck style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Vérification Identité</p>
                      <p className={styles.infoValue}>
                        Statut : {o.verificationStatus === 'VERIFIED' ? '✔ Vérifié' : o.verificationStatus === 'REJECTED' ? '❌ Rejeté' : 'En attente'}
                        <br />
                        Date : {formattedDate}
                        {o.verificationStatus === 'VERIFIED' && (o as any).faceMatchScore !== undefined && (o as any).faceMatchScore !== null && (
                          <>
                            <br />
                            <span style={{ fontSize: '0.75rem', color: '#059669' }}>
                              Niveau de confiance IA : {Math.round((o as any).faceMatchScore * 100)}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <User style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Genre</p>
                      <p className={styles.infoValue}>{o.genre || <span className={styles.infoValueMuted}>—</span>}</p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <MapPin style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Adresse cabinet</p>
                      <p className={styles.infoValue}>{o.adresse || <span className={styles.infoValueMuted}>—</span>}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2 — Compte & Sécurité */}
              <div className={styles.card}>
                <p className={styles.cardTitle}>
                  <ShieldCheck className={styles.cardTitleIcon} /> Compte
                </p>
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <Calendar style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Inscription</p>
                      <p className={styles.infoValue}>{formattedDate}</p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <Mail style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Email vérifié</p>
                      <p className={styles.infoValue}>
                        {o.emailVerified
                          ? <span className={styles.boolTrue}><CheckCheck style={{ width: "14px", height: "14px" }} /> Oui</span>
                          : <span className={styles.boolFalse}><XCircle style={{ width: "14px", height: "14px" }} /> Non</span>
                        }
                      </p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <Globe style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Auth</p>
                      <p className={styles.infoValue} style={{ textTransform: 'capitalize' }}>{o.authProvider}</p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <Stethoscope style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Profil complété</p>
                      <p className={styles.infoValue}>
                        {o.isProfileCompleted
                          ? <span className={styles.boolTrue}><CheckCheck style={{ width: "14px", height: "14px" }} /> Oui</span>
                          : <span className={styles.boolFalse}><Clock style={{ width: "14px", height: "14px" }} /> Non</span>
                        }
                      </p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoIconWrap}>
                      <FileText style={{ width: "14px", height: "14px", color: "#6366f1" }} />
                    </div>
                    <div>
                      <p className={styles.infoLabel}>Dossier Documents</p>
                      <p className={styles.infoValue}>
                        {isDocsComplete
                          ? <span className={styles.boolTrue}><CheckCheck style={{ width: "14px", height: "14px" }} /> Complet</span>
                          : <span className={styles.boolFalse}><AlertCircle style={{ width: "14px", height: "14px" }} /> Incomplet</span>
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── DOCUMENTS ───────────────────────────── */}
            <div className={styles.cardFull}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '14px' }}>
                <p className={styles.cardTitle} style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                  <FileText className={styles.cardTitleIcon} /> Documents soumis
                </p>
                {profilePhotoUrl && (
                  <a href={profilePhotoUrl} target="_blank" rel="noopener noreferrer" className={styles.btnViewProfilePhoto}>
                    <Eye style={{ width: "14px", height: "14px" }} /> Voir la photo de profil
                  </a>
                )}
              </div>
              <div className={styles.docsGrid} style={{ gridTemplateColumns: '1fr' }}>
                {getFile("ORTHO_DOC")
                  ? <SecureDocViewer orthophonisteId={orthophonisteId} />
                  : <DocPlaceholder label="Diplôme / Doc" />}
              </div>
            </div>

            {/* ── GOOGLE MAPS ─────────────────────────── */}
            <div className={styles.cardFull}>
              <p className={styles.cardTitle}>
                <MapPin className={styles.cardTitleIcon} /> Localisation du cabinet
              </p>
              <div className={styles.mapContainer}>
                {mapsEmbedUrl ? (
                  <iframe
                    className={styles.mapIframe}
                    title="Localisation cabinet"
                    src={mapsEmbedUrl}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className={styles.mapPlaceholder}>
                    <MapPin style={{ width: "36px", height: "36px", color: "#cbd5e1" }} />
                    <p className={styles.mapPlaceholderText}>
                      {o.adresse || "Localisation non renseignée"}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>{/* end scrollBody */}

          {/* ── ACTION BAR ──────────────────────────── */}
          <div className={styles.actionBar}>
            <button
              className={styles.btnAccept}
              disabled={isVerified || isVerifying}
              onClick={() => onVerify(orthophonisteId)}
              title={isVerified ? "Déjà validé" : "Valider ce dossier"}
            >
              {isVerifying
                ? <><span className={styles.spinner} /> Validation...</>
                : <><CheckCircle2 style={{ width: "18px", height: "18px" }} /> Accepter</>
              }
            </button>

            {!isVerified && (
              <button
                className={styles.btnReject}
                disabled={isRejected || isVerifying}
                onClick={() => setShowRejectModal(true)}
                title={isRejected ? "Déjà rejeté" : "Rejeter ce dossier"}
              >
                <XCircle style={{ width: "18px", height: "18px" }} /> Rejeter
              </button>
            )}

            <button
              className={styles.btnDelete}
              onClick={() => {
                setSelectedOrthophoniste(null);
                setOrthophonisteToDelete(o);
              }}
              title="Supprimer ce compte"
            >
              <Trash2 style={{ width: "14px", height: "14px" }} />
            </button>
          </div>

        </div>
      </Sheet>

      {/* ── REJECT MODAL ────────────────────────── */}
      {showRejectModal && (
        <RejectModal
          orthophonisteNom={fullName}
          onConfirm={(reason) => onReject(orthophonisteId, reason)}
          onCancel={() => setShowRejectModal(false)}
          isLoading={isVerifying}
        />
      )}
    </>
  );
}
