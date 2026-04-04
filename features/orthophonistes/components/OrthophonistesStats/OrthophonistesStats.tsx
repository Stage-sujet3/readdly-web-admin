import React from "react";
import { Users, ShieldCheck, Activity } from "lucide-react";
import { OrthophonisteStats } from "../../types";
import styles from "./OrthophonistesStats.module.css";

interface OrthophonistesStatsProps {
  stats: OrthophonisteStats;
}

export function OrthophonistesStats({ stats }: OrthophonistesStatsProps) {
  const verificationRate = stats.totalOrthophonistes > 0 
    ? Math.round((stats.verifiedOrthophonistes / stats.totalOrthophonistes) * 100) 
    : 0;

  return (
    <div className={styles.statsWrapper}>
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperTotal}`}>
          <Users className={styles.icon} />
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.totalOrthophonistes}</span>
          <span className={styles.statLabel}>Total Orthophonistes</span>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={`${styles.iconWrapper} ${styles.iconWrapperVerified}`}>
          <ShieldCheck className={styles.icon} />
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.verifiedOrthophonistes}</span>
          <span className={styles.statLabel}>Vérifiés</span>
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
