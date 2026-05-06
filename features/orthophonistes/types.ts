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
  presentation?: string;
  authProvider: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  dateCreation: string;
  etatCompte: string;
  isProfileCompleted: boolean;
  profileCompletedAt?: string;
  verificationStatus: string;
  verificationAdmin: 'NOT_VERIFIED' | 'VERIFIED' | 'REJECTED';
  latitude?: number;
  longitude?: number;
  hasDocs?: boolean;
  files?: OrthophonisteFile[];
  enfantsSuivis?: any[];
}

export interface OrthophonisteFile {
  id: string;
  fileType: 'CIN_RECTO' | 'CIN_VERSO' | 'ORTHO_DOC' | 'VERIFICATION_PHOTO' | 'PROFILE_PHOTO';
  hostedUrl: string;
  fullUrl?: string;
  fileName: string;
  mimeType: string;
  size: number;
  extension: string;
}

export interface OrthophonisteStats {
  totalOrthophonistes: number;
  verifiedOrthophonistes: number;
  pendingOrthophonistes: number;
  totalPatients: number;
}
