export function isNewContent(createdAt?: string | Date): boolean {
  if (!createdAt) return false;
  
  const createdDate = new Date(createdAt);
  if (isNaN(createdDate.getTime())) return false;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24); 
  
  // Is considered new if created within the last 3 days
  return diffDays <= 3;
}
