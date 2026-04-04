import React from "react";
import { Trash2 } from "lucide-react";
import { Parent } from "../../types";
import styles from "./ParentDeleteModal.module.css";

interface ParentDeleteModalProps {
  parentToDelete: Parent | null;
  setParentToDelete: (parent: Parent | null) => void;
  handleDeleteParent: () => void;
  isDeleting: boolean;
}

export function ParentDeleteModal({
  parentToDelete,
  setParentToDelete,
  handleDeleteParent,
  isDeleting
}: ParentDeleteModalProps) {
  
  if (!parentToDelete) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <Trash2 className={styles.icon} />
          </div>
          <h3 className={styles.title}>Supprimer le parent ?</h3>
          <p className={styles.description}>
            Êtes-vous sûr de vouloir supprimer <span className={styles.descriptionBold}>{parentToDelete.prenom} {parentToDelete.nom}</span> ? 
            Cette action est irréversible et supprimera toutes les données associées.
          </p>
          
          <div className={styles.actions}>
            <button 
              onClick={handleDeleteParent}
              disabled={isDeleting}
              className={styles.btnConfirm}
            >
              {isDeleting ? "Suppression..." : "Oui, supprimer définitivement"}
            </button>
            <button 
              onClick={() => setParentToDelete(null)}
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
