"use client"

import React, { useState } from "react";
import { Baby, Trash2, Eye, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { Parent } from "../../types";
import { ChildrenDrawer } from "../ChildrenDrawer/ChildrenDrawer";

interface ParentsTableProps {
  parents: Parent[];
  total: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  loadUserDetails: (parent: Parent) => void;
  setParentToDelete: (parent: Parent) => void;
  getStatusDisplay: (parent: Parent) => { text: string; color: string };
  fetchParentChildren: (parentId: string) => Promise<Parent | null>;
}

export function ParentsTable({
  parents,
  total,
  page,
  setPage,
  limit,
  loadUserDetails,
  setParentToDelete,
  getStatusDisplay,
  fetchParentChildren
}: ParentsTableProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<Parent | null>(null);
  const [isLoadingChildren, setIsLoadingChildren] = useState<string | null>(null);

  const handleOpenChildren = async (parent: Parent) => {
    setActiveParent(parent);
    
    // If we already have children data loaded (and the count matches), we can just open it
    if (parent.enfants && parent.enfants.length > 0) {
      setDrawerOpen(true);
      return;
    }

    // Otherwise, we need to fetch them
    setIsLoadingChildren(parent.idU);
    try {
      const updatedParent = await fetchParentChildren(parent.idU);
      if (updatedParent) {
        setActiveParent(updatedParent);
      }
      setDrawerOpen(true);
    } finally {
      setIsLoadingChildren(null);
    }
  };

  const statusColors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200"
  };
  
  const dotColors: Record<string, string> = {
    emerald: "bg-emerald-500",
    red: "bg-rose-500"
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-slate-50/50 border-b border-slate-100">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
          {total} PARENTS ENREGISTRÉS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/30">
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Enfants</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {parents.map((parent, index) => {
              const fullName = `${parent.prenom} ${parent.nom}`;
              const status = getStatusDisplay(parent);
              const badgeClass = statusColors[status.color] || statusColors.red;
              const dotClass = dotColors[status.color] || dotColors.red;
              const childrenCount = parent.enfantCount || parent.enfants?.length || 0;
              const isLoading = isLoadingChildren === parent.idU;

              return (
                <tr key={parent.idU || index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${parent.genre?.toLowerCase() === 'female' || parent.genre?.toLowerCase() === 'fille' || parent.genre?.toLowerCase() === 'f' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} rounded-2xl flex items-center justify-center font-black text-lg border shadow-sm transition-transform group-hover:scale-105`}>
                        {parent.prenom?.[0]}{parent.nom?.[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-[#1a2a4a] group-hover:text-indigo-600 transition-colors">{fullName}</p>
                          {parent.genre && (
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${parent.genre?.toLowerCase() === 'female' || parent.genre?.toLowerCase() === 'fille' || parent.genre?.toLowerCase() === 'f' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                              {parent.genre === 'F' || parent.genre?.toLowerCase() === 'female' || parent.genre?.toLowerCase() === 'fille' ? 'F' : 'M'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-500">{parent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {parent.numTel || <span className="text-slate-400 italic font-medium">Non renseigné</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => handleOpenChildren(parent)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all disabled:opacity-50 group/badge"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                      ) : (
                        <Baby className="w-4 h-4 text-indigo-500 group-hover/badge:scale-110 transition-transform" />
                      )}
                      <span className="text-sm font-black text-[#1a2a4a] group-hover/badge:text-indigo-700">{childrenCount}</span>
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black ${badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                      {status.text}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => loadUserDetails(parent)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setParentToDelete(parent)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-4">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">PAGE {page} / {Math.max(1, Math.ceil(total / limit))}</span>
        <button 
          onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
          disabled={page >= Math.ceil(total / limit)}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <ChildrenDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        parentName={activeParent ? `${activeParent.prenom} ${activeParent.nom}` : ""}
        children={activeParent?.enfants || []}
      />
    </div>
  );
}
