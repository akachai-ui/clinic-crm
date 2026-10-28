"use client";

import { useEffect, useState, useCallback } from "react";
import { ClinicLead } from "@/types/clinic";
import { loadClinicsWithCache, saveClinicsToIDB } from "@/lib/clinics-cache";
import SalesTrainingPage from "@/components/SalesTrainingPage";
import SalesSystemPage from "@/components/SalesSystemPage";
import {
  Building2,
  Loader2,
  RefreshCw,
  Database,
  Briefcase,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [clinics, setClinics] = useState<ClinicLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [deltaReadsUsed, setDeltaReadsUsed] = useState<number>(0);

  // Default to Sales CRM System ("crm") as the primary focus page
  const [activePage, setActivePage] = useState<"presentation" | "crm">("crm");

  useEffect(() => {
    async function initClinics() {
      try {
        setLoading(true);
        const result = await loadClinicsWithCache(false);
        setClinics(result.clinics);
        setDeltaReadsUsed(result.deltaReadsUsed);
      } catch (err) {
        console.error("Error loading clinics:", err);
      } finally {
        setLoading(false);
      }
    }
    initClinics();
  }, []);

  const handleDeltaSync = async () => {
    try {
      setSyncingFirebase(true);
      const result = await loadClinicsWithCache(true);
      setClinics(result.clinics);
      setDeltaReadsUsed(result.deltaReadsUsed);
    } catch (err) {
      console.error("Error syncing delta updates:", err);
    } finally {
      setSyncingFirebase(false);
    }
  };

  const handleUpdateClinic = useCallback(
    (id: string, updates: Partial<ClinicLead>) => {
      setClinics((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        );
        saveClinicsToIDB(next);
        return next;
      });
    },
    []
  );

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-panel-3d p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center max-w-xs text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#2bccaf] animate-spin mb-3 drop-shadow-[0_0_15px_#2bccaf]" />
          <p className="text-[#2bccaf] font-bold text-sm sm:text-base tracking-wide">
            กำลังเปิดระบบฐานข้อมูลคลินิก...
          </p>
          <span className="text-slate-400 text-xs mt-1">3D Mobile Intelligence</span>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen p-3 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-8 print:p-0 print:m-0 print:max-w-none print:space-y-0">
      {/* Ambient Futuristic 3D Light Orbs */}
      <div className="pointer-events-none fixed top-[-80px] left-[-80px] sm:top-[-120px] sm:left-[-120px] w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full bg-[#2bccaf]/15 blur-[80px] sm:blur-[110px] -z-10 print:hidden" />
      <div className="pointer-events-none fixed bottom-[-100px] right-[-80px] sm:bottom-[-150px] sm:right-[-100px] w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-[#2bccaf]/12 blur-[90px] sm:blur-[130px] -z-10 print:hidden" />

      {/* Top Mobile & Desktop App Bar */}
      <header className="glass-panel-3d rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#3be2c4] to-[#178a74] text-[#031d19] flex items-center justify-center shadow-[0_3px_0_#0d5245,0_0_18px_rgba(43,204,175,0.5)] border border-white/40 shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-wide text-white drop-shadow-[0_0_10px_rgba(43,204,175,0.35)]">
                CLINIC CRM <span className="text-[#2bccaf]">NEXUS</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#2bccaf]/15 text-[#2bccaf] border border-[#2bccaf]/40">
                <Database className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {clinics.length.toLocaleString()} คลินิก
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">
                • Zero-Quota (Reads: {deltaReadsUsed})
              </span>
            </div>
          </div>
        </div>

        {/* Sync Button & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
          <button
            onClick={handleDeltaSync}
            disabled={syncingFirebase}
            title="ซิงค์เฉพาะรายการที่มีการแก้ไข"
            className="glass-card-3d inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#2bccaf] hover:text-white active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncingFirebase ? "animate-spin text-[#2bccaf]" : ""
              }`}
            />
            <span className="hidden xs:inline">
              {syncingFirebase ? "กำลังซิงค์..." : "ซิงค์ข้อมูล"}
            </span>
          </button>

          {/* Desktop Nav Switcher (hidden on mobile, uses bottom nav instead) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#060f1d]/80 p-1.5 rounded-2xl border border-[#2bccaf]/25 shadow-inner">
            <button
              onClick={() => setActivePage("crm")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "crm"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              ระบบงานขาย
            </button>
            <button
              onClick={() => setActivePage("presentation")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "presentation"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              สไลด์นำเสนอขาย
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activePage === "presentation" ? (
        <SalesTrainingPage />
      ) : (
        <SalesSystemPage clinics={clinics} onUpdateClinic={handleUpdateClinic} />
      )}

      {/* =========================================================================
          Mobile App Bottom Navigation Bar (iOS / Android Native Style)
          Visible only on screens < 640px (sm:hidden)
         ========================================================================= */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-2.5 pb-safe bg-[#060d18]/92 backdrop-blur-2xl border-t border-[#2bccaf]/25 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] print:hidden">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            onClick={() => setActivePage("crm")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-95 ${
              activePage === "crm"
                ? "bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 shadow-[0_0_15px_rgba(43,204,175,0.35)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase
              className={`w-5 h-5 mb-1 ${
                activePage === "crm" ? "text-[#2bccaf]" : "text-slate-400"
              }`}
            />
            <span className="text-[11px] font-bold tracking-tight">ระบบงานขาย (CRM)</span>
          </button>

          <button
            onClick={() => setActivePage("presentation")}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all active:scale-95 ${
              activePage === "presentation"
                ? "bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 shadow-[0_0_15px_rgba(43,204,175,0.35)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles
              className={`w-5 h-5 mb-1 ${
                activePage === "presentation" ? "text-[#2bccaf]" : "text-slate-400"
              }`}
            />
            <span className="text-[11px] font-bold tracking-tight">สไลด์นำเสนอ</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
