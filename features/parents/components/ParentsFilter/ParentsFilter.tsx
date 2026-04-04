import React from "react";
import { Search } from "lucide-react";
import styles from "./ParentsFilter.module.css";

interface ParentsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function ParentsFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}: ParentsFilterProps) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterWrapper}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un parent par nom, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.selectContainer}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusSelect}
          >
            <option value="all">Tous les statuts</option>
            <option value="VERIFIED">Vérifiés</option>
            <option value="PENDING">En attente</option>
            <option value="REJECTED">Rejetés</option>
            <option value="NOT_STARTED">Non commencés</option>
          </select>
        </div>
      </div>
    </div>
  );
}
