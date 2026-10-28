"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClinicLead } from "@/types/clinic";
import { loadClinicsWithCache, saveClinicsToIDB } from "@/lib/clinics-cache";
import SalesSystemPage from "@/components/SalesSystemPage";
import { Building2, BarChart3, Briefcase, Loader2, Database } from "lucide-react";

export default function SalesRoutePage() {
  const [clinics, setClinics] = useState<ClinicLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initClinics() {
      try {
        setLoading(true);
        const result = await loadClinicsWithCache(false);
        setClinics(result.clinics);
      } catch (err) {
        console.error("Error loading clinics:", err);
      } finally {
        setLoading(false);
      }
    }
    initClinics();
  }, []);

  const handleUpdateClinic = (id: string, updates: Partial<ClinicLead>) => {
    setClinics((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      saveClinicsToIDB(next);
      return next;
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-slate-600 font-medium">
          กำลังโหลดฐานข้อมูลจากแคช...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 px-5 py-3.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900">Clinic CRM</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Database className="w-3 h-3" />
            โหมดประหยัดโควต้า (Local Cache 0 Reads)
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <BarChart3 className="w-4 h-4" />
            กลับหน้าหลัก (ภาพรวม / อบรม / ระบบงานขาย)
          </Link>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-xs">
            <Briefcase className="w-4 h-4" />
            ระบบงานขาย
          </span>
        </div>
      </div>

      <SalesSystemPage clinics={clinics} onUpdateClinic={handleUpdateClinic} />
    </main>
  );
}
