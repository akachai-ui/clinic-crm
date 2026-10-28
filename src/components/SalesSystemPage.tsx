"use client";

import { useState, useMemo } from "react";
import { ClinicLead } from "@/types/clinic";
import {
  GlobeLock,
  Share2,
  Globe,
  TrendingUp,
  Sparkles,
  MapPin,
  Layers,
  RotateCcw,
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
  // Filter States: Province, Category, and Website Status
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Province list sorted by clinic count
  const provinceList = useMemo(() => {
    const map: Record<string, number> = {};
    clinics.forEach((c) => {
      const p = c.province || "ไม่ระบุ";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics]);

  // Category list sorted by clinic count
  const categoryList = useMemo(() => {
    const map: Record<string, number> = {};
    clinics.forEach((c) => {
      const cat = c.category || "ไม่ระบุ";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics]);

  // Clinics filtered by Province and Category (dynamic baseline for status cards)
  const filteredByProvAndCat = useMemo(() => {
    return clinics.filter((c) => {
      const matchProv =
        selectedProvince === "all" || (c.province || "ไม่ระบุ") === selectedProvince;
      const matchCat =
        selectedCategory === "all" || (c.category || "ไม่ระบุ") === selectedCategory;
      return matchProv && matchCat;
    });
  }, [clinics, selectedProvince, selectedCategory]);

  // Calculate websiteStatus statistics dynamically from filtered clinics
  const statusStats = useMemo(() => {
    const total = filteredByProvAndCat.length;
    let noWebCount = 0;
    let fbLineCount = 0;
    let hasWebCount = 0;

    filteredByProvAndCat.forEach((c) => {
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
    const opportunityPct =
      total > 0 ? ((opportunityCount / total) * 100).toFixed(1) : "0.0";

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
  }, [filteredByProvAndCat]);

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
  const hasActiveFilter =
    selectedProvince !== "all" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  const handleResetFilters = () => {
    setSelectedProvince("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* =========================================================================
          SECTION 1: Filters (Category & Province) + websiteStatus Compact Grid
         ========================================================================= */}
      <section className="glass-panel-3d rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-7 space-y-3 sm:space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 sm:pb-3 border-b border-[#2bccaf]/20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2bccaf]/15 border border-[#2bccaf]/35 text-[#2bccaf] text-[10px] sm:text-xs font-bold shadow-[0_0_10px_rgba(43,204,175,0.2)]">
              <Sparkles className="w-3 h-3 text-[#2bccaf]" />
              สถานะเว็บไซต์และตัวกรองพื้นที่
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
            FILTERS: Category & Province (2-Column Mobile Grid, Space-Saving)
           ========================================================================= */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
          {/* Province Filter Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-300">
              <MapPin className="w-3 h-3 text-[#2bccaf]" />
              <span>จังหวัด (Province)</span>
            </label>
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="glass-input-3d w-full rounded-xl px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-white focus:outline-none appearance-none cursor-pointer pr-7"
              >
                <option value="all" className="bg-[#091526] text-white">
                  ทุกจังหวัด ({clinics.length.toLocaleString()})
                </option>
                {provinceList.map(([prov, count]) => (
                  <option
                    key={prov}
                    value={prov}
                    className="bg-[#091526] text-white"
                  >
                    {prov} ({count.toLocaleString()})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-300">
              <Layers className="w-3 h-3 text-[#2bccaf]" />
              <span>หมวดหมู่ (Category)</span>
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input-3d w-full rounded-xl px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-white focus:outline-none appearance-none cursor-pointer pr-7"
              >
                <option value="all" className="bg-[#091526] text-white">
                  ทุกหมวดหมู่ ({clinics.length.toLocaleString()})
                </option>
                {categoryList.map(([cat, count]) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#091526] text-white"
                  >
                    {cat.length > 28 ? `${cat.substring(0, 28)}...` : cat} ({count.toLocaleString()})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3-COLUMN COMPACT GRID (Fits in ONE single row on smartphone)
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
                <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2.5">
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

                {/* Metric Count & Percent */}
                <div className="mt-1 sm:mt-2.5 pt-1 sm:pt-2 border-t border-white/10 flex flex-col xs:flex-row xs:items-baseline xs:justify-between">
                  <div className="text-sm sm:text-2xl font-black text-white tracking-tight leading-tight">
                    {card.count.toLocaleString()}
                  </div>
                  <div className="text-[11px] sm:text-lg font-black text-[#2bccaf] leading-tight">
                    {card.pct}%
                  </div>
                </div>

                {/* Glowing Progress Bar */}
                <div className="w-full h-1 sm:h-1.5 bg-[#050d1a] rounded-full overflow-hidden border border-white/10 mt-1 sm:mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#2bccaf] to-[#6fffe9] rounded-full shadow-[0_0_8px_#2bccaf]"
                    style={{ width: `${card.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            Active Filter & Selection Strip (with Reset Button)
           ========================================================================= */}
        {hasActiveFilter ? (
          <div className="glass-card-3d p-2 sm:p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs border border-[#2bccaf]/40 bg-[#2bccaf]/10 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 min-w-0 text-[10px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#2bccaf] shrink-0 shadow-[0_0_8px_#2bccaf]" />
              <div className="truncate text-slate-300">
                <span className="font-bold text-white">
                  ผลลัพธ์: {statusStats.total.toLocaleString()} คลินิก
                </span>
                {selectedProvince !== "all" && (
                  <span className="ml-1 text-[#6fffe9]">({selectedProvince})</span>
                )}
                {selectedCategory !== "all" && (
                  <span className="ml-1 text-slate-300 hidden sm:inline">
                    • {selectedCategory.split(" ")[0]}
                  </span>
                )}
                {selectedStatus !== "all" && (
                  <span className="ml-1 text-amber-300">• {selectedStatus}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-[#6fffe9] font-bold text-[10px] sm:text-xs shrink-0 transition-all"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs text-slate-400 text-center pt-0.5">
            เลือกจังหวัด หรือ หมวดหมู่ เพื่อดูสัดส่วนโอกาสขายในพื้นที่
          </div>
        )}
      </section>
    </div>
  );
}
