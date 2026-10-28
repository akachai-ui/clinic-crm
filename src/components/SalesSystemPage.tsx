"use client";

import { useState, useMemo } from "react";
import { ClinicLead } from "@/types/clinic";
import {
  GlobeLock,
  Share2,
  Globe,
  TrendingUp,
  Sparkles,
  Filter,
  Info,
  CheckCircle2,
} from "lucide-react";

interface SalesSystemPageProps {
  clinics?: ClinicLead[];
  onUpdateClinic?: (id: string, updates: Partial<ClinicLead>) => void;
}

export default function SalesSystemPage({
  clinics = [],
  onUpdateClinic,
}: SalesSystemPageProps) {
  // State for selected website status (clicked to filter)
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
      mobileLabel: "ไม่มีเว็บ",
      subLabel: "กลุ่มโอกาสสูงสุด (Hot Leads)",
      count: statusStats.noWebCount,
      pct: statusStats.noWebPct,
      tag: "Tier 1: Hot Leads",
      tagColor: "bg-rose-500/15 text-rose-300 border-rose-500/40",
      accentColor: "from-rose-500/20 via-rose-500/5 to-transparent",
      borderColor: "border-rose-500/35 hover:border-rose-400",
      activeRing: "ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]",
      iconBg: "bg-gradient-to-br from-rose-500 to-amber-600 shadow-[0_2px_0_#9f1239,0_0_12px_rgba(244,63,94,0.45)]",
      icon: GlobeLock,
      highlight: "ค้นหาบน Google ไม่เจอ เสียลูกค้าให้คู่แข่งทุกวัน",
      description: "ยังไม่มีหน้าเว็บเลย เป็นกลุ่มเป้าหมายอันดับ 1 ที่ต้องการปิดการขายเพื่อสร้างตัวตนบน Google",
    },
    {
      id: "fb_line",
      keyMatch: "เว็บไซต์เป็น fb line หรือ link อื่นที่ไม่ใช้เว็บ",
      label: "ใช้ FB / LINE แทนเว็บ",
      mobileLabel: "ใช้ FB/LINE",
      subLabel: "กลุ่มเป้าหมายรอง (Warm Leads)",
      count: statusStats.fbLineCount,
      pct: statusStats.fbLinePct,
      tag: "Tier 2: Warm Leads",
      tagColor: "bg-amber-500/15 text-amber-300 border-amber-500/40",
      accentColor: "from-amber-500/20 via-amber-500/5 to-transparent",
      borderColor: "border-amber-500/35 hover:border-amber-400",
      activeRing: "ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_2px_0_#9a3412,0_0_12px_rgba(245,158,11,0.45)]",
      icon: Share2,
      highlight: "ขาด SEO ติดอันดับ และไม่น่าเชื่อถือเท่าเว็บไซต์ทางการ",
      description: "มีโซเชียลแต่ยังขาดเว็บไซต์หลักที่สร้างความน่าเชื่อถือและการค้นหาติดอันดับบน Google",
    },
    {
      id: "has_web",
      keyMatch: "มีเว็บไซด์",
      label: "มีเว็บไซต์แล้ว",
      mobileLabel: "มีเว็บแล้ว",
      subLabel: "กลุ่มคู่แข่ง & Benchmark",
      count: statusStats.hasWebCount,
      pct: statusStats.hasWebPct,
      tag: "Benchmark",
      tagColor: "bg-[#2bccaf]/15 text-[#6fffe9] border-[#2bccaf]/40",
      accentColor: "from-[#2bccaf]/20 via-[#2bccaf]/5 to-transparent",
      borderColor: "border-[#2bccaf]/35 hover:border-[#2bccaf]",
      activeRing: "ring-2 ring-[#2bccaf] shadow-[0_0_20px_rgba(43,204,175,0.45)]",
      iconBg: "bg-gradient-to-br from-[#3be2c4] to-[#178a74] shadow-[0_2px_0_#0d5245,0_0_12px_rgba(43,204,175,0.45)]",
      icon: Globe,
      highlight: "มีตัวตนบน Google Search ครองส่วนแบ่งตลาด",
      description: "มีเว็บไซต์ทางการเรียบร้อย ใช้เป็นตัวอย่างอ้างอิงความสำเร็จ และวิเคราะห์ในระบบเรดาร์คู่แข่ง",
    },
  ];

  const activeCardInfo = cards.find((c) => c.keyMatch === selectedStatus);

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* =========================================================================
          SECTION 1: websiteStatus Compact Grid (No Mobile Scrolling Needed)
         ========================================================================= */}
      <section className="glass-panel-3d rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-7 space-y-3 sm:space-y-5">
        {/* Section Header (Compact Mobile App Style) */}
        <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-[#2bccaf]/20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2bccaf]/15 border border-[#2bccaf]/35 text-[#2bccaf] text-[10px] sm:text-xs font-bold shadow-[0_0_10px_rgba(43,204,175,0.2)]">
              <Sparkles className="w-3 h-3 text-[#2bccaf]" />
              สถานะเว็บไซต์คลินิก
            </div>
            <h2 className="text-sm sm:text-lg md:text-xl font-black text-white tracking-wide mt-1">
              สัดส่วนเว็บไซต์คลินิกทั่วไทย
            </h2>
          </div>

          {/* Compact Market Opportunity Badge */}
          <div className="glass-card-3d px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-2 border border-[#2bccaf]/40 bg-[#0c202a]/80 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-[#2bccaf] shrink-0" />
            <div className="text-right">
              <div className="text-[9px] sm:text-[10px] text-slate-300 font-semibold leading-tight">
                โอกาสขาย
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#6fffe9] leading-tight">
                {statusStats.opportunityPct}%{" "}
                <span className="text-[10px] text-slate-400 font-normal hidden xs:inline">
                  ({statusStats.opportunityCount.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3-COLUMN COMPACT GRID (Fits in ONE single row on smartphone without scrolling)
           ========================================================================= */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
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
                role="button"
                tabIndex={0}
                className={`glass-card-3d relative overflow-hidden rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-5 cursor-pointer transition-all duration-200 active:scale-95 select-none bg-gradient-to-b ${
                  card.accentColor
                } ${card.borderColor} ${
                  isSelected ? card.activeRing : ""
                }`}
              >
                {/* Card Top: Icon & Desktop Tag */}
                <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-3">
                  <div
                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${card.iconBg} text-white flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <span
                    className={`text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border truncate hidden sm:inline-block ${card.tagColor}`}
                  >
                    {card.tag}
                  </span>
                  {/* Mobile active indicator dot */}
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#2bccaf] shadow-[0_0_8px_#2bccaf] sm:hidden" />
                  )}
                </div>

                {/* Status Name */}
                <h3 className="text-[11px] sm:text-base font-black text-white leading-tight truncate">
                  <span className="sm:hidden">{card.mobileLabel}</span>
                  <span className="hidden sm:inline">{card.label}</span>
                </h3>

                {/* Subtitle on Desktop */}
                <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden md:block mt-0.5">
                  {card.subLabel}
                </p>

                {/* Metric Count & Percent */}
                <div className="mt-1.5 sm:mt-3 pt-1 sm:pt-2 border-t border-white/10 flex flex-col xs:flex-row xs:items-baseline xs:justify-between">
                  <div className="text-sm sm:text-2xl font-black text-white tracking-tight leading-tight">
                    {card.count.toLocaleString()}
                  </div>
                  <div className="text-[11px] sm:text-lg font-black text-[#2bccaf] leading-tight">
                    {card.pct}%
                  </div>
                </div>

                {/* Glowing Progress Bar */}
                <div className="w-full h-1 sm:h-1.5 bg-[#050d1a] rounded-full overflow-hidden border border-white/10 mt-1.5 sm:mt-2.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#2bccaf] to-[#6fffe9] rounded-full shadow-[0_0_8px_#2bccaf]"
                    style={{ width: `${card.pct}%` }}
                  />
                </div>

                {/* Desktop Highlight snippet */}
                <p className="text-[11px] text-slate-300/80 leading-snug mt-2.5 pt-2 border-t border-white/5 hidden lg:block">
                  {card.highlight}
                </p>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            Active Card Detail Strip (Shows when user taps a card)
           ========================================================================= */}
        {activeCardInfo ? (
          <div className="glass-card-3d p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-2 text-xs border border-[#2bccaf]/40 bg-[#2bccaf]/10 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#2bccaf] shrink-0 shadow-[0_0_8px_#2bccaf]" />
              <div className="min-w-0">
                <span className="text-white font-bold text-[11px] sm:text-xs">
                  {activeCardInfo.label} ({activeCardInfo.count.toLocaleString()} คลินิก)
                </span>
                <span className="text-slate-300 text-[10px] sm:text-xs ml-1.5 hidden xs:inline">
                  — {activeCardInfo.highlight}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedStatus("all")}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-[#6fffe9] font-bold text-[10px] sm:text-xs shrink-0"
            >
              ดูทั้งหมด
            </button>
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs text-slate-400 text-center pt-0.5">
            แตะการ์ดเพื่อกรองและดูรายละเอียดเฉพาะกลุ่มคลินิก
          </div>
        )}
      </section>
    </div>
  );
}
