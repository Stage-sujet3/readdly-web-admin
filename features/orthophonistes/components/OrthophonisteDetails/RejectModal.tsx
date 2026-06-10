"use client";
import React, { useState } from "react";
import { XCircle, Check } from "lucide-react";
import styles from "./RejectModal.module.css";

const PRESET_REASONS = [
  "Documents manquants ou incomplets",
  "Diplôme non reconnu",
  "Informations incorrectes ou incohérentes",
];

interface RejectModalProps {
  orthophonisteNom: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RejectModal({ orthophonisteNom, onConfirm, onCancel, isLoading }: RejectModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [showOther, setShowOther] = useState(false);

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const toggleOther = () => {
    setShowOther(prev => !prev);
    if (showOther) setOtherReason("");
  };

  const buildFinalReason = () => {
    const parts = [...selectedReasons];
    if (showOther && otherReason.trim()) parts.push(otherReason.trim());
    return parts.join(" ; ");
  };

  const isValid = selectedReasons.length > 0 || (showOther && otherReason.trim().length > 0);

  const handleConfirm = () => {
    if (!isValid || isLoading) return;
    onConfirm(buildFinalReason());
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderIcon}>
            <XCircle style={{ width: "22px", height: "22px", color: "#fff" }} />
          </div>
          <div>
            <p className={styles.modalTitle}>Rejeter le dossier</p>
            <p className={styles.modalSubtitle}>{orthophonisteNom}</p>
          </div>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <p className={styles.reasonsLabel}>Sélectionnez la raison du rejet</p>

          <div className={styles.reasonsList}>
            {PRESET_REASONS.map((reason) => {
              const selected = selectedReasons.includes(reason);
              return (
                <div
                  key={reason}
                  className={`${styles.reasonItem} ${selected ? styles.reasonItemSelected : ""}`}
                  onClick={() => toggleReason(reason)}
                >
                  <div className={`${styles.reasonCheckbox} ${selected ? styles.reasonCheckboxChecked : ""}`}>
                    {selected && <Check style={{ width: "12px", height: "12px", color: "#fff" }} />}
                  </div>
                  <span className={`${styles.reasonText} ${selected ? styles.reasonTextSelected : ""}`}>
                    {reason}
                  </span>
                </div>
              );
            })}

            {/* Other */}
            <div
              className={`${styles.reasonItem} ${showOther ? styles.reasonItemSelected : ""}`}
              onClick={toggleOther}
            >
              <div className={`${styles.reasonCheckbox} ${showOther ? styles.reasonCheckboxChecked : ""}`}>
                {showOther && <Check style={{ width: "12px", height: "12px", color: "#fff" }} />}
              </div>
              <span className={`${styles.reasonText} ${showOther ? styles.reasonTextSelected : ""}`}>
                Autre (précisez)
              </span>
            </div>

            {showOther && (
              <textarea
                className={styles.otherInput}
                placeholder="Décrivez la raison du rejet..."
                rows={3}
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onCancel} disabled={isLoading}>
            Annuler
          </button>
          <button
            className={styles.btnConfirm}
            onClick={handleConfirm}
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Rejet en cours..." : "Confirmer le rejet"}
          </button>
        </div>
      </div>
    </div>
  );
}
