"use client";

import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { TrendingUp, Activity, ShieldAlert, Sparkles } from "lucide-react";

interface TelemetryCardsProps {
  healthScore: number;
  riskLevel: "High" | "Medium" | "Low";
  totalIssues: number;
  complexityDelta: string;
}

export default function TelemetryCards({
  healthScore = 94,
  riskLevel = "Medium",
  totalIssues = 3,
  complexityDelta = "+12",
}: TelemetryCardsProps) {
  
  // Dynamic semantic color configs
  const isHealthHigh = healthScore >= 80;
  const isHealthMed = healthScore >= 50 && healthScore < 80;
  
  const healthGlow = isHealthHigh 
    ? "rgba(34,197,94,0.15)" 
    : isHealthMed ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)";
  const healthText = isHealthHigh 
    ? "text-emerald-400" 
    : isHealthMed ? "text-amber-400" : "text-rose-400";

  const riskColor = riskLevel === "High" 
    ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
    : riskLevel === "Medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full"
    >
      {/* 1. HEALTH SCORE CARD (Stripe-Style Premium Glow) */}
      <div 
        style={{ '--glow-color': healthGlow } as React.CSSProperties}
        className="relative overflow-hidden p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl group transition-all duration-300 hover:border-white/20"
      >
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full blur-[45px] transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: healthGlow }} />
        
        <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono font-bold tracking-wider uppercase">
          <span>Health Score</span>
          <Activity className={`w-3.5 h-3.5 ${healthText}`} />
        </div>
        
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className={`text-4xl font-black tracking-tight font-geist ${healthText}`}>
            <CountUp end={healthScore} duration={1.8} useEasing={true} />
          </span>
          <span className="text-zinc-600 text-sm font-semibold">/100</span>
        </div>

        {/* Shimmering Trend Data */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md w-fit">
          <TrendingUp className="w-3 h-3" />
          <span>+6% from past check</span>
        </div>

        {/* Micro Gauge Shimmer Track */}
        <div className="mt-4 w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className={`h-full rounded-full ${isHealthHigh ? "bg-emerald-500" : isHealthMed ? "bg-amber-500" : "bg-rose-500"}`}
          />
        </div>
      </div>

      {/* 2. MERGE RISK CONTAINER */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20 group">
        <div className={`absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full blur-[45px] opacity-10 bg-white`} />
        
        <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono font-bold tracking-wider uppercase">
          <span>Merge Risk</span>
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        
        <div className="mt-4">
          <span className={`text-3xl font-black tracking-tight font-geist uppercase border px-3 py-0.5 rounded-xl text-center text-sm inline-block ${riskColor}`}>
            {riskLevel} Risk
          </span>
        </div>
        
        <p className="mt-4 text-[11px] font-mono text-zinc-500 leading-normal">
          {riskLevel === "High" ? "Blocking actions triggered." : riskLevel === "Medium" ? "Requires inspection clearance." : "Passed automated checks safely."}
        </p>
      </div>

      {/* 3. EXCEPTION DENSITY MONITOR */}
      <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20">
        <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono font-bold tracking-wider uppercase">
          <span>Total Issues</span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        </div>
        
        <div className="mt-4">
          <span className="text-4xl font-black tracking-tight text-white font-geist">
            <CountUp end={totalIssues} duration={1.2} />
          </span>
        </div>
        
        <p className="mt-4 text-[11px] font-mono text-zinc-500">
          Grounded validation nodes verified {totalIssues} categorical entries.
        </p>
      </div>

      {/* 4. COMPLEXITY ADJUSTMENT VIEW */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20 group">
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-purple-500/10 rounded-full blur-[45px]" />
        
        <div className="flex items-center justify-between text-zinc-500 text-[11px] font-mono font-bold tracking-wider uppercase">
          <span>Complexity Delta</span>
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        </div>
        
        <div className="mt-4">
          <span className="text-4xl font-black tracking-tight text-purple-400 font-geist">
            {complexityDelta}
          </span>
        </div>
        
        <p className="mt-4 text-[11px] font-mono text-zinc-500">
          Linear scale variance across structural code scopes.
        </p>
      </div>
    </motion.div>
  );
}