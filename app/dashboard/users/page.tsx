"use client"

import { useEffect, useState } from "react"
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sheet } from "@/components/ui/Sheet"
import { getUsersList, deleteUser } from "@/services/user.service"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'ORTHOPHONISTE' | 'PARENT'>('ORTHOPHONISTE');
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  const fetchUsers = async () => {
    try {
      const response = await getUsersList(page, limit);
      if (response.data?.success) {
        setUsers(response.data.data.users || []);
        setTotal(response.data.data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteUser(userToDelete.id);
      if (response.data?.success) {
        alert("Utilisateur supprimé avec succès");
        setUserToDelete(null);
        fetchUsers();
      } else {
        alert(response.data?.message || "Échec de la suppression");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Utilisateurs</h1>
          <p className="text-sm font-medium text-muted-foreground">Gérez les comptes et les accès de la plateforme</p>
        </div>
      </div>

      <div className="flex bg-muted/30 p-1.5 rounded-2xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('ORTHOPHONISTE')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ORTHOPHONISTE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Orthophonistes
        </button>
        <button
          onClick={() => setActiveTab('PARENT')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'PARENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Parents
        </button>
      </div>

      <Card className="overflow-visible mb-8">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {activeTab === 'ORTHOPHONISTE' ? 'Orthophonistes' : 'Parents'}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {users.filter(u => u.role === activeTab).length} inscrit(s)
            </p>
          </div>
          <div className="relative max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-12 pr-4 py-2 bg-card border border-border rounded-xl outline-none focus:border-primary/50 shadow-sm text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Nom & Email</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Statut</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Date d'inscription</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.filter(u => u.role === activeTab).map((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur';
                
                return (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border group-hover:scale-110 transition-transform ${activeTab === 'ORTHOPHONISTE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'}`}>
                        {fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight">{fullName}</p>
                        <p className="text-[10px] font-medium text-muted-foreground lowercase">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${user.etatCompte === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                       <span className="text-xs font-bold text-foreground">{user.etatCompte || 'INACTIVE'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-medium text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-lg transition-colors"
                      >
                        Voir infos
                      </button>
                      <button 
                        onClick={() => setUserToDelete(user)}
                        className="p-2 hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
              {users.filter(u => u.role === activeTab).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center text-sm font-medium text-muted-foreground">
                    Aucun {activeTab.toLowerCase()} sur cette page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Drawer */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        {selectedUser && (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-2xl border border-primary/20">
                {(`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`).trim().substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">{(`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`).trim() || 'Utilisateur'}</h2>
                <p className="text-sm font-medium text-muted-foreground">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedUser.role === "PARENT" ? "primary" : selectedUser.role === "ORTHOPHONISTE" ? "success" : "info"}>
                    {selectedUser.role}
                  </Badge>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedUser.etatCompte === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold text-slate-600">{selectedUser.etatCompte || 'INACTIVE'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Informations Personnelles</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Téléphone</span>
                    <span className="text-sm font-bold text-foreground">{selectedUser.numTel || 'Non renseigné'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Genre</span>
                    <span className="text-sm font-bold text-foreground">{selectedUser.genre || 'Non renseigné'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Adresse</span>
                    <span className="text-sm font-bold text-foreground">{selectedUser.adresse || 'Non renseignée'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Informations Compte</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
                   <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Date de création</span>
                    <span className="text-sm font-bold text-foreground">
                      {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Email Vérifié</span>
                    <div className="flex items-center gap-1">
                      {selectedUser.emailVerified ? <CheckCircle className="w-4 h-4 text-green-500"/> : <XCircle className="w-4 h-4 text-red-500"/>}
                      <span className="text-sm font-bold text-foreground">{selectedUser.emailVerified ? 'Oui' : 'Non'}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Méthode de Connexion</span>
                    <span className="text-sm font-bold text-foreground capitalize">{selectedUser.authProvider?.toLowerCase() || 'Standard'}</span>
                  </div>
                </div>
              </div>

              {selectedUser.files && selectedUser.files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Documents ({selectedUser.files.length})</h3>
                  <div className="flex flex-col gap-3">
                    {selectedUser.files.map((file: any) => (
                      <button 
                         key={file.id} 
                         onClick={() => setViewingDoc(file)}
                         className="w-full text-left flex items-center gap-3 p-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl transition-colors group"
                      >
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-indigo-950 truncate">{file.fileName || 'Document attaché'}</p>
                          <p className="text-[10px] font-medium text-indigo-400 uppercase">{file.extension || 'Fichier'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 flex flex-col gap-3 border-t border-border mt-auto">
               <button 
                  onClick={() => {
                    const user = selectedUser;
                    setSelectedUser(null);
                    setUserToDelete(user);
                  }}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
               >
                 <Trash2 className="w-4 h-4" />
                 Supprimer le compte
               </button>
               <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
               >
                 Fermer le profil
               </button>
            </div>
          </div>
        )}
      </Sheet>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Supprimer l'utilisateur ?</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 px-4">
                Êtes-vous sûr de vouloir supprimer <span className="font-bold text-slate-900">{userToDelete.firstName} {userToDelete.lastName}</span> ? 
                Cette action est irréversible et supprimera toutes les données associées.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-200"
                >
                  {isDeleting ? "Suppression..." : "Oui, supprimer définitivement"}
                </button>
                <button 
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fullscreen Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{viewingDoc.fileName || 'Document'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{viewingDoc.extension || 'Fichier'}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-slate-100/50 flex items-center justify-center min-h-[500px]">
              {viewingDoc.extension?.toLowerCase() === 'pdf' ? (
                <iframe 
                  src={viewingDoc.hostedUrl || viewingDoc.fullUrl} 
                  className="w-full h-full min-h-[500px] rounded-xl border border-slate-200 bg-white"
                  title={viewingDoc.fileName}
                />
              ) : (
                <img 
                  src={viewingDoc.hostedUrl || viewingDoc.fullUrl} 
                  alt={viewingDoc.fileName || 'Document'}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-sm border border-slate-200 bg-white"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-doc.png' }}
                />
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
               <a 
                 href={viewingDoc.hostedUrl || viewingDoc.fullUrl} 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl transition-colors text-sm"
               >
                 Ouvrir dans un nouvel onglet
               </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

