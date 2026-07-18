"use client";

import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Flame, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Play, 
  LogOut,
} from "lucide-react";
import TelemetryCards from "@/components/workspace/telemetry-cards";

export default function Home() {
  const { data: session } = useSession();
  
  // Repositories State Tracker
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  
  // Pull Request State Tracker
  const [prs, setPrs] = useState([]);
  const [loadingPrs, setLoadingPrs] = useState(false);
  const [selectedPr, setSelectedPr] = useState<any>(null);

  // Inspection Engine Data Tracks
  const [codeDiff, setCodeDiff] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  
  // Upstream GitHub Error Committer State
  const [committingReview, setCommittingReview] = useState(false);

  // Syncing user repositories on mounting active session
  useEffect(() => {
    if (session) {
      setLoadingRepos(true);
      fetch("/api/repos")
        .then((res) => res.json())
        .then((data) => {
          if (data.repos) setRepos(data.repos);
          setLoadingRepos(false);
        })
        .catch(() => setLoadingRepos(false));
    }
  }, [session]);

  const handleSelectRepo = (repo: any) => {
    setSelectedRepo(repo);
    setPrs([]);
    setSelectedPr(null);
    setCodeDiff("");
    setAnalytics(null);
    setLoadingPrs(true);

    // Dynamic case fallback checking both full_name and fullName fields to safeguard sidebar context switching
    const targetRepoPath = repo.full_name || repo.fullName || repo.name;

    fetch(`/api/prs?repo=${encodeURIComponent(targetRepoPath)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.prs) setPrs(data.prs);
        setLoadingPrs(false);
      })
      .catch(() => setLoadingPrs(false));
  };

  const handleSelectPr = (pr: any) => {
    setSelectedPr(pr);
    setAnalytics(null);
    setCodeDiff("Loading raw patch data from GitHub structural stream...");
    
    const targetRepoPath = selectedRepo.full_name || selectedRepo.fullName || selectedRepo.name;
    
    fetch(`/api/diff?repo=${encodeURIComponent(targetRepoPath)}&pr=${pr.number}`)
      .then((res) => res.json())
      .then((data) => {
        setCodeDiff(data.diff || "No code changes found in this dynamic stream window.");
      })
      .catch(() => setCodeDiff("Failed to reach diff server network interface."));
  };

  const handleReview = async () => {
    if (!codeDiff || codeDiff.startsWith("Loading") || codeDiff.startsWith("Select an active")) return;
    setAnalytics(null);
    setLoadingReview(true);
    
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeDiff }),
      });
      
      if (!res.ok) throw new Error("Server engine rejected pipeline stream.");
      
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Static evaluation crashed", err);
      alert("Engine connection dropped. Initialized structural diagnostic fallback nodes.");
    } finally {
      setLoadingReview(false);
    }
  };

  // Automated handler pushing discovered analysis exceptions downstream directly to GitHub PR threads
  const handleCommitToGitHub = async () => {
    if (!analytics || !selectedRepo || !selectedPr) return;
    setCommittingReview(true);

    const targetRepoPath = selectedRepo.full_name || selectedRepo.fullName || selectedRepo.name;

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "commit", 
          repoFullName: targetRepoPath,
          prNumber: selectedPr.number,
          issues: analytics.issues || []
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert("🎉 All metric violations successfully committed directly to your GitHub Pull Request threads!");
      } else {
        alert(`Commit compilation fault: ${data.error}`);
      }
    } catch (err) {
      alert("Critical transmission failure communicating error files with upstream target server.");
    } finally {
      setCommittingReview(false);
    }
  };

  const getIssuesByCategory = (cat: string) => {
    return analytics?.issues?.filter((i: any) => i.category === cat) || [];
  };

  if (!session) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="w-full max-w-md p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl text-center space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white font-geist">PR Lens <span className="text-blue-500">2.0</span></h1>
            <p className="text-zinc-400 text-xs font-mono">Grounded Code Review Engine OS</p>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Connect your developer workspace profile to initialize automated real-time issue profiling, tracking complexity adjustments across execution threads.
          </p>
          <button 
            onClick={() => signIn("github")} 
            className="w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608.1 1.006.942 1.534 1.422 1.534.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Authenticate via GitHub Portal
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      {/* LEFT COLUMN: CONTEXT DRILLDOWN MANAGER */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl">
          <h2 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-3 flex items-center gap-2 font-mono">
            <span>📁 Active Repositories</span>
          </h2>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1 native-scrollbar">
            {loadingRepos ? (
              <div className="space-y-2 py-2">
                <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
              </div>
            ) : (
              repos.map((repo: any) => (
                <div 
                  key={repo.id} 
                  onClick={() => handleSelectRepo(repo)}
                  className={`group relative p-2.5 rounded-xl text-xs font-mono font-medium tracking-tight text-left truncate transition-all duration-300 cursor-pointer ${
                    selectedRepo?.id === repo.id 
                      ? "bg-blue-500/10 border border-blue-500/30 text-blue-400" 
                      : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  {repo.name}
                </div>
              ))
            )}
          </div>
        </div>

        {selectedRepo && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <h2 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase mb-3 flex items-center gap-2 font-mono">
              <span>⌄ Open Pull Requests</span>
            </h2>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1 native-scrollbar">
              {loadingPrs ? (
                <div className="space-y-2 py-2">
                  <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
                </div>
              ) : prs.length === 0 ? (
                <p className="text-[11px] text-zinc-600 italic font-mono p-2">Zero active branches queued.</p>
              ) : (
                prs.map((pr: any) => (
                  <div 
                    key={pr.id}
                    onClick={() => handleSelectPr(pr)}
                    className={`p-2.5 rounded-xl text-xs font-mono font-medium tracking-tight text-left cursor-pointer transition-all duration-300 truncate ${
                      selectedPr?.id === pr.id 
                        ? "bg-white/10 text-white border border-white/10" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                    }`}
                  >
                    #{pr.number} {pr.title}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* RIGHT COLUMN: CORE WORKSPACE VIEWPORT LAYER */}
      <div className="lg:col-span-3 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-geist">AI Review Workspace</h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">Deterministic Execution Mode Active</p>
          </div>
          <button 
            onClick={() => signOut()} 
            className="self-start sm:self-auto h-8 px-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect Node
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative rounded-2xl border border-white/10 bg-[#09090B] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                WORKSPACE_PATCH_STREAM_BUFFER
              </span>
            </div>
            <textarea
              className="w-full h-44 p-4 font-mono text-xs bg-transparent text-zinc-300 focus:outline-none resize-none leading-relaxed native-scrollbar"
              value={codeDiff}
              placeholder="Select an active pull request patch data matrix tracking array sequence branch structure or drop clean code block lines directly into this terminal grid frame environment..."
              onChange={(e) => setCodeDiff(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleReview}
            disabled={loadingReview || !codeDiff || codeDiff.trim() === "" || codeDiff.startsWith("Loading") || codeDiff.startsWith("Select an active")}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,130,246,0.2)] enabled:hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed cursor-pointer"
          >
            <Play className={`w-4 h-4 ${loadingReview ? "animate-spin" : ""}`} />
            {loadingReview ? "Processing Grounded Structural Diagnostics..." : "Execute PR-Lens Platform Analysis"}
          </button>

          {analytics && (
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleCommitToGitHub}
              disabled={committingReview || !analytics.issues?.length}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.2)] enabled:hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608.1 1.006.942 1.534 1.422 1.534.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {committingReview ? "Pushing Discovered Issue Nodes..." : "Commit All Discovered Errors to GitHub Thread"}
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {analytics && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <TelemetryCards 
                healthScore={analytics.healthScore}
                riskLevel={analytics.riskLevel}
                totalIssues={analytics.issues?.length || 0}
                complexityDelta={analytics.complexityDelta}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
                  <h3 className="text-xs font-bold text-rose-400 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" /> 
                    Security Flaws ({getIssuesByCategory("critical").length})
                  </h3>
                  <div className="space-y-3">
                    {getIssuesByCategory("critical").map((issue: any, i: number) => (
                      <div key={i} className="relative p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{issue.title}</p>
                          <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md">
                            -{issue.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">{issue.details}</p>
                      </div>
                    ))}
                    {getIssuesByCategory("critical").length === 0 && (
                      <p className="text-xs text-zinc-600 italic font-mono p-1">Zero structural critical exceptions flagged.</p>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
                  <h3 className="text-xs font-bold text-amber-500 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Flame className="w-4 h-4" /> 
                    Performance Profiles ({getIssuesByCategory("performance").length})
                  </h3>
                  <div className="space-y-3">
                    {getIssuesByCategory("performance").map((issue: any, i: number) => (
                      <div key={i} className="relative p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{issue.title}</p>
                          <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                            -{issue.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">{issue.details}</p>
                      </div>
                    ))}
                    {getIssuesByCategory("performance").length === 0 && (
                      <p className="text-xs text-zinc-600 italic font-mono p-1">Pipeline performance velocity balances are fully stable.</p>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
                  <h3 className="text-xs font-bold text-blue-400 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <Zap className="w-4 h-4" /> 
                    Maintainability Delta ({getIssuesByCategory("quality").length})
                  </h3>
                  <div className="space-y-3">
                    {getIssuesByCategory("quality").map((issue: any, i: number) => (
                      <div key={i} className="relative p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{issue.title}</p>
                          <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
                            -{issue.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">{issue.details}</p>
                      </div>
                    ))}
                    {getIssuesByCategory("quality").length === 0 && (
                      <p className="text-xs text-zinc-600 italic font-mono p-1">Clean architectural structural parameters are aligned.</p>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" /> 
                    System Design Strengths
                  </h3>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 min-h-[100px]">
                    <ul className="space-y-2 text-xs text-zinc-400 font-mono list-none">
                      {analytics.positives?.map((pos: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          <span>{pos}</span>
                        </li>
                      ))}
                      {analytics.positives?.length === 0 && (
                        <p className="text-xs text-zinc-600 italic font-mono">No explicitly captured high-scale design notes flagged.</p>
                      )}
                    </ul>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}