export interface Orthophoniste {
  idU: string;
  supertokensUserId?: string;
  nom: string;
  prenom: string;
  genre?: string;
  email: string;
  role: string;
  cin?: string;
  avatar?: string;
  numTel?: string;
  adresse?: string;
  authProvider: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  dateCreation: string;
  etatCompte: string;
  isProfileCompleted: boolean;
  profileCompletedAt?: string;
  verificationStatus: string;
  verificationAdmin: boolean;
  files?: any[];
  enfantsSuivis?: any[];
}

export interface OrthophonisteStats {
  totalOrthophonistes: number;
  verifiedOrthophonistes: number;
  totalPatients: number;
}
