import React from "react";
import { Trash2 } from "lucide-react";
import { Orthophoniste } from "../../types";
import styles from "./OrthophonisteDeleteModal.module.css";

interface OrthophonisteDeleteModalProps {
  orthophonisteToDelete: Orthophoniste | null;
  setOrthophonisteToDelete: (orthophoniste: Orthophoniste | null) => void;
  handleDeleteOrthophoniste: () => void;
  isDeleting: boolean;
}

export function OrthophonisteDeleteModal({
  orthophonisteToDelete,
  setOrthophonisteToDelete,
  handleDeleteOrthophoniste,
  isDeleting
}: OrthophonisteDeleteModalProps) {
  
  if (!orthophonisteToDelete) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <Trash2 className={styles.icon} />
          </div>
          <h3 className={styles.title}>Supprimer l'orthophoniste ?</h3>
          <p className={styles.description}>
            Êtes-vous sûr de vouloir supprimer <span className={styles.descriptionBold}>{orthophonisteToDelete.prenom} {orthophonisteToDelete.nom}</span> ? 
            Cette action est irréversible et supprimera toutes les données associées.
          </p>
          
          <div className={styles.actions}>
            <button 
              onClick={handleDeleteOrthophoniste}
              disabled={isDeleting}
              className={styles.btnConfirm}
            >
              {isDeleting ? "Suppression..." : "Oui, supprimer définitivement"}
            </button>
            <button 
              onClick={() => setOrthophonisteToDelete(null)}
              disabled={isDeleting}
              className={styles.btnCancel}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
