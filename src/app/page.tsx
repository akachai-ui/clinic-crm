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

  // Default to Sales Presentation ("presentation") as the primary main page
  const [activePage, setActivePage] = useState<"presentation" | "crm">("presentation");

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
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="glass-panel-3d p-8 rounded-3xl flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-[#2bccaf] animate-spin mb-4 drop-shadow-[0_0_15px_#2bccaf]" />
          <p className="text-[#2bccaf] font-bold tracking-wide">
            กำลังเปิดระบบฐานข้อมูลคลินิกโฮโลแกรม...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-7 print:p-0 print:m-0 print:max-w-none print:space-y-0">
      {/* Ambient Futuristic 3D Light Orbs */}
      <div className="pointer-events-none fixed top-[-120px] left-[-120px] w-[380px] h-[380px] rounded-full bg-[#2bccaf]/15 blur-[110px] -z-10 print:hidden" />
      <div className="pointer-events-none fixed bottom-[-150px] right-[-100px] w-[420px] h-[420px] rounded-full bg-[#2bccaf]/12 blur-[130px] -z-10 print:hidden" />

      {/* Top 3D Glassmorphism Command Bar */}
      <div className="glass-panel-3d rounded-3xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3be2c4] to-[#178a74] text-[#031d19] flex items-center justify-center shadow-[0_4px_0_#0d5245,0_0_22px_rgba(43,204,175,0.55)] border border-white/40">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-black text-lg tracking-wide text-white drop-shadow-[0_0_10px_rgba(43,204,175,0.35)]">
                CLINIC CRM <span className="text-[#2bccaf]">NEXUS</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2bccaf]/15 text-[#2bccaf] border border-[#2bccaf]/40 shadow-[0_0_15px_rgba(43,204,175,0.2)]">
                <Database className="w-3 h-3" />
                Zero-Quota Hybrid (Reads: {deltaReadsUsed})
              </span>
            </div>
            <span className="text-xs text-slate-300/80 block mt-0.5">
              ระบบนำเสนอขายและจัดการข้อมูลคลินิก {clinics.length.toLocaleString()} แห่งทั่วไทย • 3D Futuristic Intelligence
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDeltaSync}
            disabled={syncingFirebase}
            title="ซิงค์เฉพาะรายการที่มีการแก้ไขสถานะการขายหรือโน้ต"
            className="glass-card-3d inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2bccaf] hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                syncingFirebase ? "animate-spin text-[#2bccaf]" : ""
              }`}
            />
            {syncingFirebase ? "กำลังซิงค์ข้อมูล..." : "ซิงค์รายการอัปเดต"}
          </button>

          {/* 3D Futuristic Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#060f1d]/80 p-1.5 rounded-2xl border border-[#2bccaf]/25 shadow-inner">
            <button
              onClick={() => setActivePage("presentation")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "presentation"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              สไลด์นำเสนอขาย (Sales Pitch)
            </button>
            <button
              onClick={() => setActivePage("crm")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "crm"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              ระบบงานขาย & CRM Leads
            </button>
          </div>
        </div>
      </div>

      {activePage === "presentation" ? (
        /* ==================== PAGE: Sales Pitch & Training Playbook ==================== */
        <SalesTrainingPage />
      ) : (
        /* ==================== PAGE: Sales System (CRM & Leads) ==================== */
        <SalesSystemPage clinics={clinics} onUpdateClinic={handleUpdateClinic} />
      )}
    </main>
  );
}
