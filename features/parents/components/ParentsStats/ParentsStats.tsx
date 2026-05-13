import React from "react";
import { Users, ShieldCheck, Baby, Activity } from "lucide-react";
import { ParentStats } from "../../types";
import { motion } from "framer-motion";

interface ParentsStatsProps {
  stats: ParentStats;
}

export function ParentsStats({ stats }: ParentsStatsProps) {
  const verificationRate = stats.totalParents > 0 
    ? Math.round((stats.verifiedParents / stats.totalParents) * 100) 
    : 0;

  const cards = [
    { label: "Total Parents", value: stats.totalParents, icon: Users, color: "text-blue-500", gradient: "from-blue-500/20 to-blue-500/5" },
    { label: "Total Enfants", value: stats.totalChildren, icon: Baby, color: "text-indigo-500", gradient: "from-indigo-500/20 to-indigo-500/5" },
    { label: "Identités Vérifiées", value: `${verificationRate}%`, icon: ShieldCheck, color: "text-emerald-500", gradient: "from-emerald-500/20 to-emerald-500/5" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={i} 
          className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} ${card.color} rounded-2xl flex items-center justify-center shadow-sm`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{card.label}</p>
              <p className="text-2xl font-black text-[#1a2a4a]">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
