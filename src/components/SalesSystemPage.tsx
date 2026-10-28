"use client";

import { useState, useMemo } from "react";
import { ClinicLead } from "@/types/clinic";
import {
  GlobeLock,
  Share2,
  Globe,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
} from "lucide-react";

interface SalesSystemPageProps {
  clinics?: ClinicLead[];
  onUpdateClinic?: (id: string, updates: Partial<ClinicLead>) => void;
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export default function SalesSystemPage({
  clinics = [],
  onUpdateClinic,
}: SalesSystemPageProps) {
  // State for selected website status (can be clicked to filter or inspect)
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Calculate websiteStatus statistics
  const statusStats = useMemo(() => {
    const total = clinics.length;
    let noWebCount = 0;
    let fbLineCount = 0;
    let hasWebCount = 0;

    clinics.forEach((c) => {
      const s = c.websiteStatus || "";
      if (s.includes("ไม่มี")) {
        noWebCount++;
      } else if (s.includes("fb") || s.includes("line")) {
        fbLineCount++;
      } else if (s.includes("มีเว็บ")) {
        hasWebCount++;
      } else {
        // Fallback categorization
        if (s.toLowerCase().includes("no") || s === "") noWebCount++;
        else hasWebCount++;
      }
    });

    const noWebPct = total > 0 ? ((noWebCount / total) * 100).toFixed(1) : "0.0";
    const fbLinePct = total > 0 ? ((fbLineCount / total) * 100).toFixed(1) : "0.0";
    const hasWebPct = total > 0 ? ((hasWebCount / total) * 100).toFixed(1) : "0.0";
    const opportunityCount = noWebCount + fbLineCount;
    const opportunityPct = total > 0 ? ((opportunityCount / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      noWebCount,
      noWebPct,
      fbLineCount,
      fbLinePct,
      hasWebCount,
      hasWebPct,
      opportunityCount,
      opportunityPct,
    };
  }, [clinics]);

  const cards = [
    {
      id: "no_web",
      keyMatch: "ไม่มีเว็บไซต์",
      label: "ไม่มีเว็บไซต์",
      subLabel: "กลุ่มโอกาสสูงสุด (Hot Leads)",
      count: statusStats.noWebCount,
      pct: statusStats.noWebPct,
      tag: "Tier 1: ตลาดเปิดกว้าง",
      tagColor: "bg-rose-500/15 text-rose-300 border-rose-500/40",
      accentColor: "from-rose-500/20 via-rose-500/5 to-transparent",
      borderColor: "border-rose-500/30 hover:border-rose-400/80",
      activeRing: "ring-2 ring-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.35)]",
      iconBg: "bg-gradient-to-br from-rose-500 to-amber-600 shadow-[0_4px_0_#9f1239,0_0_18px_rgba(244,63,94,0.5)]",
      icon: GlobeLock,
      highlight: "ค้นหาบน Google ไม่เจอ ลูกค้าหลุดไปคู่แข่ง",
      description: "ยังไม่มีหน้าเว็บเป็นของตนเอง ถือเป็นกลุ่มเป้าหมายอันดับ 1 ที่ต้องการปิดการขายเพื่อสร้างตัวตนบนโลกออนไลน์",
    },
    {
      id: "fb_line",
      keyMatch: "เว็บไซต์เป็น fb line หรือ link อื่นที่ไม่ใช้เว็บ",
      label: "ใช้ FB / LINE แทนเว็บ",
      subLabel: "กลุ่มเป้าหมายรอง (Warm Leads)",
      count: statusStats.fbLineCount,
      pct: statusStats.fbLinePct,
      tag: "Tier 2: พึ่งพาโซเชียล",
      tagColor: "bg-amber-500/15 text-amber-300 border-amber-500/40",
      accentColor: "from-amber-500/20 via-amber-500/5 to-transparent",
      borderColor: "border-amber-500/30 hover:border-amber-400/80",
      activeRing: "ring-2 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)]",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_4px_0_#9a3412,0_0_18px_rgba(245,158,11,0.5)]",
      icon: Share2,
      highlight: "ขาด SEO ติดอันดับ และไม่น่าเชื่อถือเท่าเว็บไซต์",
      description: "มีสื่อโซเชียลอยู่แล้ว เข้าใจการตลาดดิจิทัล แต่ยังขาดเว็บไซต์หลักที่สร้างความน่าเชื่อถือและการค้นหาติดอันดับบน Google",
    },
    {
      id: "has_web",
      keyMatch: "มีเว็บไซด์",
      label: "มีเว็บไซต์แล้ว",
      subLabel: "กลุ่มคู่แข่ง & Benchmark",
      count: statusStats.hasWebCount,
      pct: statusStats.hasWebPct,
      tag: "ผู้นำตลาด (Market Standard)",
      tagColor: "bg-[#2bccaf]/15 text-[#6fffe9] border-[#2bccaf]/40",
      accentColor: "from-[#2bccaf]/20 via-[#2bccaf]/5 to-transparent",
      borderColor: "border-[#2bccaf]/30 hover:border-[#2bccaf]/80",
      activeRing: "ring-2 ring-[#2bccaf] shadow-[0_0_25px_rgba(43,204,175,0.4)]",
      iconBg: "bg-gradient-to-br from-[#3be2c4] to-[#178a74] shadow-[0_4px_0_#0d5245,0_0_18px_rgba(43,204,175,0.5)]",
      icon: Globe,
      highlight: "มีตัวตนบน Google Search ครองส่วนแบ่งตลาด",
      description: "มีเว็บไซต์ทางการเรียบร้อย ใช้เป็นตัวอย่างอ้างอิงความสำเร็จ และวิเคราะห์เปรียบเทียบในระบบเรดาร์คู่แข่ง",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          SECTION 1: websiteStatus Cards (Market Opportunity & Breakdown)
         ========================================================================= */}
      <section className="glass-panel-3d rounded-3xl p-6 md:p-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2bccaf]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/15 border border-[#2bccaf]/35 text-[#2bccaf] text-xs font-bold mb-2 shadow-[0_0_12px_rgba(43,204,175,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#2bccaf]" />
              Section 1 • การวิเคราะห์สถานะเว็บไซต์ (Website Status Matrix)
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
              สัดส่วนสถานะเว็บไซต์ของคลินิกทั่วไทย
            </h2>
            <p className="text-sm text-slate-300/80 mt-1">
              จำแนกคลินิกทั้งหมด {statusStats.total.toLocaleString()} แห่ง เพื่อชี้เป้าโอกาสการปิดการขายเว็บไซต์
            </p>
          </div>

          {/* Market Opportunity Metric Badge */}
          <div className="glass-card-3d px-4 py-3 rounded-2xl flex items-center gap-3.5 border border-[#2bccaf]/40 bg-gradient-to-br from-[#0c202a] to-[#040e1a]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3be2c4] to-[#178a74] text-[#031d19] flex items-center justify-center font-black shadow-[0_2px_8px_rgba(43,204,175,0.4)]">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-300">
                โอกาสทองในการนำเสนอขาย
              </div>
              <div className="text-base font-extrabold text-[#6fffe9] flex items-center gap-1.5">
                <span>{statusStats.opportunityPct}%</span>
                <span className="text-xs font-medium text-slate-400">
                  ({statusStats.opportunityCount.toLocaleString()} คลินิก)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedStatus === card.keyMatch;

            return (
              <div
                key={card.id}
                onClick={() =>
                  setSelectedStatus((prev) =>
                    prev === card.keyMatch ? "all" : card.keyMatch
                  )
                }
                className={`glass-card-3d relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-b ${
                  card.accentColor
                } ${card.borderColor} ${
                  isSelected ? card.activeRing : ""
                }`}
              >
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${card.iconBg} text-white flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${card.tagColor}`}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* Title & SubLabel */}
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    {card.label}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {card.subLabel}
                  </p>
                </div>

                {/* Big Count & Percentage */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl font-black text-white tracking-tight">
                      {card.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      คลินิกในระบบ
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#2bccaf]">
                      {card.pct}%
                    </span>
                    <div className="text-[10px] text-slate-400">
                      ของคลินิกทั้งหมด
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#050d1a] rounded-full overflow-hidden border border-white/10 mt-3.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#2bccaf] to-[#6fffe9] rounded-full shadow-[0_0_10px_#2bccaf]"
                    style={{ width: `${card.pct}%` }}
                  />
                </div>

                {/* Highlight Point */}
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-300/90 leading-relaxed flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2bccaf] mt-1.5 shrink-0 shadow-[0_0_6px_#2bccaf]" />
                  <span>{card.highlight}</span>
                </div>

                {/* Interactive Click Indicator */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-400 hover:text-[#2bccaf] transition-colors">
                  <span>{isSelected ? "✓ กำลังเลือกดูข้อมูลนี้" : "คลิกเพื่อคัดกรอง"}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "translate-x-1 text-[#2bccaf]" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Filter Bar (if user clicked any card) */}
        {selectedStatus !== "all" && (
          <div className="glass-card-3d p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs border border-[#2bccaf]/40 bg-[#2bccaf]/10">
            <div className="flex items-center gap-2 text-[#6fffe9] font-medium">
              <Filter className="w-4 h-4 text-[#2bccaf]" />
              <span>
                กำลังกรองคลินิกเฉพาะสถานะ:{" "}
                <strong className="text-white underline">{selectedStatus}</strong>
              </span>
            </div>
            <button
              onClick={() => setSelectedStatus("all")}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-xs"
            >
              ล้างตัวกรอง (ดูทั้งหมด)
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
