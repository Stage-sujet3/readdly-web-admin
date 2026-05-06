"use client"

import React from "react"
import { X, Baby, Calendar, GraduationCap, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Enfant {
  idEnfant: string
  nom: string
  prenom: string
  age?: number
  genre?: string
  niveau?: string
  dateCreation: string
  avatar?: string
  derniereActivite?: string | null
}

interface ChildrenDrawerProps {
  isOpen: boolean
  onClose: () => void
  parentName: string
  children: Enfant[]
}

export function ChildrenDrawer({ isOpen, onClose, parentName, children }: ChildrenDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-[#1a2a4a]">Enfants de {parentName}</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {children.length} enfant{children.length > 1 ? 's' : ''} enregistré{children.length > 1 ? 's' : ''}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {children.length > 0 ? (
                children.map((child, i) => {
                  const isGirl = child.genre?.toLowerCase() === 'female' || child.genre?.toLowerCase() === 'fille' || child.genre?.toLowerCase() === 'f';
                  const themeColor = isGirl ? 'pink' : 'blue';
                  const bgColor = isGirl ? 'bg-pink-50' : 'bg-blue-50';
                  const textColor = isGirl ? 'text-pink-600' : 'text-blue-600';
                  const borderColor = isGirl ? 'border-pink-100' : 'border-blue-100';
                  const iconBg = isGirl ? 'bg-pink-100' : 'bg-blue-100';

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={child.idEnfant}
                      className={`p-6 ${bgColor} border ${borderColor} rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}
                    >
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className={`w-14 h-14 ${iconBg} ${textColor} rounded-2xl flex items-center justify-center font-black text-xl border-2 border-white shadow-sm group-hover:scale-110 transition-transform`}>
                          {child.prenom[0]}{child.nom[0]}
                        </div>
                        <div>
                          <h3 className={`font-black ${isGirl ? 'text-pink-900' : 'text-blue-900'} text-lg leading-none mb-1.5`}>
                            {child.prenom} {child.nom}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${isGirl ? 'bg-pink-200 text-pink-700' : 'bg-blue-200 text-blue-700'}`}>
                              {child.genre === 'F' || child.genre?.toLowerCase() === 'female' || child.genre?.toLowerCase() === 'fille' ? 'Fille' : 'Garçon'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${isGirl ? 'bg-pink-200 text-pink-700' : 'bg-blue-200 text-blue-700'}`}>
                              {child.age || '?'} ans
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white transition-all">
                          <div className={`flex items-center gap-2 ${isGirl ? 'text-pink-400' : 'text-blue-400'} mb-1`}>
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Niveau</span>
                          </div>
                          <p className={`text-sm font-bold ${isGirl ? 'text-pink-900' : 'text-blue-900'}`}>{child.niveau || 'Non précisé'}</p>
                        </div>
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 hover:bg-white transition-all">
                          <div className={`flex items-center gap-2 ${isGirl ? 'text-pink-400' : 'text-blue-400'} mb-1`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Ajouté le</span>
                          </div>
                          <p className={`text-sm font-bold ${isGirl ? 'text-pink-900' : 'text-blue-900'}`}>
                            {new Date(child.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      </div>

                      {/* Decoration blob */}
                      <div className={`absolute -right-4 -top-4 w-24 h-24 ${isGirl ? 'bg-pink-200/20' : 'bg-blue-200/20'} rounded-full blur-2xl -z-0`} />
                    </motion.div>
                  )
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Baby className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-600">Aucun enfant trouvé</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/30">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-[#1a2a4a] text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/20 hover:bg-[#25375c] transition-all"
              >
                Fermer le profil
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
