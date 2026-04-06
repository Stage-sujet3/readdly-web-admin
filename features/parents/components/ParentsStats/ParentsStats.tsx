import React from "react";
import { Users, ShieldCheck, Baby, Activity } from "lucide-react";
import { ParentStats } from "../../types";
import styles from "./ParentsStats.module.css";

interface ParentsStatsProps {
  stats: ParentStats;
}

export function ParentsStats({ stats }: ParentsStatsProps) {
  const verificationRate = stats.totalParents > 0 
    ? Math.round((stats.verifiedParents / stats.totalParents) * 100) 
    : 0;

  return (
    <div className={styles.statsWrapper}>
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperTotal}`}>
          <Users className={styles.icon} />
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.totalParents}</span>
          <span className={styles.statLabel}>Total Parents</span>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperVerified}`}>
          <ShieldCheck className={styles.icon} />
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.verifiedParents}</span>
          <span className={styles.statLabel}>Vérifiés</span>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperChildren}`}>
          <Baby className={styles.icon} />
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.totalChildren}</span>
          <span className={styles.statLabel}>Enfants Inscrits</span>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperRate}`}>
          <Activity className={styles.icon} />
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{verificationRate}%</span>
          <span className={styles.statLabel}>Taux de vérification</span>
        </div>
      </div>
    </div>
  );
}
