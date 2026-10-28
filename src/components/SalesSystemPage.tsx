"use client";

import { ClinicLead } from "@/types/clinic";
import { Briefcase, Sparkles, Database } from "lucide-react";

interface SalesSystemPageProps {
  clinics?: ClinicLead[];
  onUpdateClinic?: (id: string, updates: Partial<ClinicLead>) => void;
}

export default function SalesSystemPage({
  clinics = [],
  onUpdateClinic,
}: SalesSystemPageProps) {
  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel-3d rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/15 border border-[#2bccaf]/30 text-[#2bccaf] text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            ระบบงานขาย (Sales System)
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">
            ระบบงานขาย
          </h1>
          <p className="text-sm text-slate-300/80 mt-1">
            หน้าว่างพร้อมสำหรับการออกแบบและพัฒนาทีละขั้นตอนตามที่คุณต้องการ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card-3d px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#2bccaf]" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                ข้อมูลคลินิกพร้อมใช้งาน
              </div>
              <div className="text-sm font-extrabold text-[#2bccaf]">
                {clinics.length.toLocaleString()} รายการ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Starting Canvas Area */}
      <div className="glass-panel-3d rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[380px] border border-dashed border-[#2bccaf]/30">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3be2c4]/20 to-[#178a74]/20 border border-[#2bccaf]/40 text-[#2bccaf] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(43,204,175,0.25)]">
          <Sparkles className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          ล้างหน้าระบบงานขายเรียบร้อยแล้ว
        </h2>
        <p className="text-slate-300 text-sm max-w-md leading-relaxed mb-6">
          โครงสร้างหน้าเว็บและข้อมูลคลินิก {clinics.length.toLocaleString()} รายการพร้อมเชื่อมต่อ
          กรุณาระบุขั้นตอนแรก (Step 1) ที่คุณต้องการสร้างได้เลยครับ
        </p>
      </div>
    </div>
  );
}
