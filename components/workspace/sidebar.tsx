"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Folder, ChevronRight, GitPullRequest, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface TreeItemProps {
  label: string;
  icon?: React.ReactNode;
  indent?: boolean;
  statusColor?: string;
}

function SidebarItem({ label, icon, indent = false, statusColor }: TreeItemProps) {
  return (
    <motion.div
      whileHover={{ x: 6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative flex items-center justify-between px-3 py-2 mx-2 rounded-xl text-xs font-mono font-medium tracking-tight text-zinc-400 hover:text-white cursor-pointer transition-all duration-300 hover:bg-white/[0.04] hover:backdrop-blur-xl ${
        indent ? "ml-6" : ""
      }`}
    >
      {/* Active Left Border Highlight */}
      <span className="absolute left-0 top-1/4 h-1/2 w-[3px] bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="flex items-center gap-2">
        {icon && <span className="text-zinc-500 group-hover:text-blue-400 transition-colors">{icon}</span>}
        <span>{label}</span>
      </div>

      {statusColor && (
        <span className={`h-2 w-2 rounded-full ring-4 shadow-sm ${statusColor}`} />
      )}
    </motion.div>
  );
}

export default function Sidebar() {
  const [openSection, setOpenSection] = useState({ repos: true, prs: true, reviews: true });

  const toggleSection = (key: 'repos' | 'prs' | 'reviews') => {
    setOpenSection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-64 h-full glass-panel border-r border-white/10 flex flex-col pt-4 overflow-y-auto select-none">
      
      {/* Repositories Directory */}
      <div className="mb-4">
        <div 
          onClick={() => toggleSection('repos')}
          className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold font-sans tracking-wider text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors"
        >
          {openSection.repos ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span>📁 Repositories</span>
        </div>
        
        {openSection.repos && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 space-y-0.5">
            <SidebarItem label="AI Reviewer" icon={<ChevronDown className="w-3.5 h-3.5 text-zinc-600" />} />
            <SidebarItem label="Backend" icon={<Folder className="w-3.5 h-3.5" />} indent />
            <SidebarItem label="Frontend" icon={<Folder className="w-3.5 h-3.5 text-blue-400/80" />} indent />
            <SidebarItem label="API" icon={<Folder className="w-3.5 h-3.5" />} indent />
          </motion.div>
        )}
      </div>

      {/* Open Pull Requests Directory */}
      <div className="mb-4">
        <div 
          onClick={() => toggleSection('prs')}
          className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold font-sans tracking-wider text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors"
        >
          {openSection.prs ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span>⌄ Open Pull Requests</span>
        </div>

        {openSection.prs && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 space-y-0.5">
            <SidebarItem label="#52 Auth Engine" icon={<GitPullRequest className="w-3.5 h-3.5" />} statusColor="bg-blue-500 ring-blue-500/20" />
            <SidebarItem label="#61 Cache Optimizer" icon={<GitPullRequest className="w-3.5 h-3.5" />} statusColor="bg-amber-500 ring-amber-500/20" />
            <SidebarItem label="#75 Leak Fix" icon={<GitPullRequest className="w-3.5 h-3.5" />} statusColor="bg-rose-500 ring-rose-500/20" />
          </motion.div>
        )}
      </div>

      {/* Recent Reviews Audit Directory */}
      <div className="mb-4">
        <div 
          onClick={() => toggleSection('reviews')}
          className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold font-sans tracking-wider text-zinc-500 uppercase cursor-pointer hover:text-zinc-300 transition-colors"
        >
          {openSection.reviews ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span>⌄ Recent Reviews</span>
        </div>

        {openSection.reviews && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 space-y-0.5">
            <SidebarItem label="Today" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />} />
            <SidebarItem label="Yesterday" icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />} />
            <SidebarItem label="Failed Reviews" icon={<XCircle className="w-3.5 h-3.5 text-rose-500" />} />
          </motion.div>
        )}
      </div>
    </aside>
  );
}