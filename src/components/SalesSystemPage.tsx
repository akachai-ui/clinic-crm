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
  Search,
  Phone,
  ExternalLink,
  Star,
  Building2,
  ArrowUpDown,
  CheckCircle2,
  ListFilter,
  Navigation,
} from "lucide-react";

interface SalesSystemPageProps {
  clinics?: ClinicLead[];
  onUpdateClinic?: (id: string, updates: Partial<ClinicLead>) => void;
}

// Clean helper to format long category names for mobile screens
function formatCategoryLabel(cat: string): string {
  if (cat.includes("ทันตกรรม")) return "คลินิกทันตกรรม";
  if (cat.includes("กายภาพบำบัด")) return "คลินิกกายภาพบำบัด";
  if (cat.includes("เสริมความงาม")) return "คลินิกเสริมความงาม";
  if (cat.includes("เวชกรรม")) return "คลินิกเวชกรรม/เฉพาะทาง";
  return cat;
}

const PAGE_SIZE = 15;

export default function SalesSystemPage({
  clinics = [],
  onUpdateClinic,
}: SalesSystemPageProps) {
  // Filter States: Province, Category, and Website Status
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Section 2: Search, Sort, and Pagination States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"reviews" | "rating" | "name">("reviews");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // 1. Cascading Province list: if category is selected, show province counts for that category
  const provinceList = useMemo(() => {
    const pool =
      selectedCategory === "all"
        ? clinics
        : clinics.filter((c) => (c.category || "ไม่ระบุ") === selectedCategory);
    const map: Record<string, number> = {};
    pool.forEach((c) => {
      const p = c.province || "ไม่ระบุ";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics, selectedCategory]);

  // 2. Cascading Category list: if province is selected, show category counts for that province
  const categoryList = useMemo(() => {
    const pool =
      selectedProvince === "all"
        ? clinics
        : clinics.filter((c) => (c.province || "ไม่ระบุ") === selectedProvince);
    const map: Record<string, number> = {};
    pool.forEach((c) => {
      const cat = c.category || "ไม่ระบุ";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics, selectedProvince]);

  // 3. Clinics filtered by Province and Category (dynamic baseline for status cards)
  const filteredByProvAndCat = useMemo(() => {
    return clinics.filter((c) => {
      const matchProv =
        selectedProvince === "all" || (c.province || "ไม่ระบุ") === selectedProvince;
      const matchCat =
        selectedCategory === "all" || (c.category || "ไม่ระบุ") === selectedCategory;
      return matchProv && matchCat;
    });
  }, [clinics, selectedProvince, selectedCategory]);

  // 4. Calculate websiteStatus statistics dynamically from filtered clinics
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

  // 5. Final filtered clinics taking selected websiteStatus card + Search Query into account
  const finalFilteredClinics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return filteredByProvAndCat
      .filter((c) => {
        // Status filter
        if (selectedStatus !== "all") {
          const s = c.websiteStatus || "ไม่ระบุ";
          if (s !== selectedStatus) return false;
        }

        // Search query filter (Name, Phone, District)
        if (q) {
          const matchName = (c.name || "").toLowerCase().includes(q);
          const matchPhone = (c.phone || "").toLowerCase().includes(q);
          const matchDistrict = (c.district || "").toLowerCase().includes(q);
          const matchCategory = (c.category || "").toLowerCase().includes(q);
          if (!matchName && !matchPhone && !matchDistrict && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "reviews") {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === "rating") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === "name") {
          return (a.name || "").localeCompare(b.name || "", "th");
        }
        return 0;
      });
  }, [filteredByProvAndCat, selectedStatus, searchQuery, sortBy]);

  // Reset pagination when filters or search change
  useMemo(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedProvince, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const displayedClinics = useMemo(() => {
    return finalFilteredClinics.slice(0, visibleCount);
  }, [finalFilteredClinics, visibleCount]);

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

  const hasActiveFilter =
    selectedProvince !== "all" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedProvince("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
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
              สัดส่วนเว็บไซต์คลินิก
              {selectedProvince !== "all" ? ` จ.${selectedProvince}` : " ทั่วไทย"}
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
                <span className="text-[10px] text-slate-400 font-normal">
                  ({statusStats.opportunityCount}/{statusStats.total})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FILTERS: Category & Province
           ========================================================================= */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
          {/* Province Filter Dropdown */}
          <div className="space-y-1">
            <label className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#2bccaf]" />
                จังหวัด
              </span>
              <span className="text-[9px] text-slate-400">
                {selectedCategory !== "all" ? "ในหมวดที่เลือก" : ""}
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="glass-input-3d w-full rounded-xl px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-white focus:outline-none appearance-none cursor-pointer pr-7"
              >
                <option value="all" className="bg-[#091526] text-white">
                  ทุกจังหวัด ({provinceList.reduce((acc, x) => acc + x[1], 0).toLocaleString()})
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
            <label className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#2bccaf]" />
                หมวดหมู่
              </span>
              <span className="text-[9px] text-slate-400">
                {selectedProvince !== "all" ? `ใน จ.${selectedProvince}` : ""}
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input-3d w-full rounded-xl px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-semibold text-white focus:outline-none appearance-none cursor-pointer pr-7"
              >
                <option value="all" className="bg-[#091526] text-white">
                  ทุกหมวดหมู่ ({categoryList.reduce((acc, x) => acc + x[1], 0).toLocaleString()})
                </option>
                {categoryList.map(([cat, count]) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#091526] text-white"
                  >
                    {formatCategoryLabel(cat)} ({count.toLocaleString()})
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
            3-COLUMN COMPACT GRID (websiteStatus Cards)
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
      </section>

      {/* =========================================================================
          SECTION 2: CLINIC LEADS LIST (Display matching selected card)
         ========================================================================= */}
      <section className="glass-panel-3d rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-7 space-y-3.5 sm:space-y-5">
        {/* Section 2 Header & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2bccaf]/20">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#2bccaf]/20 text-[#2bccaf] flex items-center justify-center">
                <ListFilter className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-lg font-black text-white tracking-wide">
                รายชื่อคลินิกเป้าหมาย
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/40">
                {finalFilteredClinics.length.toLocaleString()} รายการ
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              {selectedStatus === "all" ? (
                <span>แสดงทุกสถานะเว็บไซต์</span>
              ) : (
                <span>
                  กรองเฉพาะ:{" "}
                  <strong className="text-white underline">{selectedStatus}</strong>
                </span>
              )}
              {selectedProvince !== "all" && (
                <span className="text-[#6fffe9]"> • จ.{selectedProvince}</span>
              )}
              {selectedCategory !== "all" && (
                <span className="text-slate-300">
                  {" "}
                  • {formatCategoryLabel(selectedCategory)}
                </span>
              )}
            </p>
          </div>

          {/* Quick Search & Sort Control */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อคลินิก, เบอร์โทร..."
                className="glass-input-3d w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="glass-input-3d pl-2.5 pr-6 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs text-white font-medium focus:outline-none appearance-none cursor-pointer"
              >
                <option value="reviews" className="bg-[#091526] text-white">
                  รีวิวมากสุด
                </option>
                <option value="rating" className="bg-[#091526] text-white">
                  คะแนนสูงสุด
                </option>
                <option value="name" className="bg-[#091526] text-white">
                  ชื่อ ก-ฮ
                </option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
            </div>

            {hasActiveFilter && (
              <button
                onClick={handleResetFilters}
                title="ล้างการค้นหาและตัวกรอง"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-[#6fffe9] shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Clinic Cards List (Mobile Ergonomic Cards) */}
        {displayedClinics.length > 0 ? (
          <div className="space-y-2.5 sm:space-y-3">
            {displayedClinics.map((clinic, index) => {
              const s = clinic.websiteStatus || "";
              const isNoWeb = s.includes("ไม่มี");
              const isFbLine = s.includes("fb") || s.includes("line");
              const isHasWeb = s.includes("มีเว็บ");

              return (
                <div
                  key={clinic.id || index}
                  className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-[#2bccaf]/60 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Left: Info & Badges */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        {/* Website Status Badge */}
                        {isNoWeb ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                            <GlobeLock className="w-2.5 h-2.5" />
                            ไม่มีเว็บไซต์
                          </span>
                        ) : isFbLine ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                            <Share2 className="w-2.5 h-2.5" />
                            ใช้ FB/LINE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/40 font-bold">
                            <Globe className="w-2.5 h-2.5" />
                            มีเว็บไซต์
                          </span>
                        )}

                        {/* Category Tag */}
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-medium">
                          {formatCategoryLabel(clinic.category || "")}
                        </span>

                        {/* Location Tag */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                          <MapPin className="w-2.5 h-2.5 text-[#2bccaf]" />
                          {clinic.district ? `${clinic.district}, ` : ""}
                          {clinic.province}
                        </span>

                        {/* Rating Tag */}
                        {clinic.rating && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {clinic.rating} ({clinic.reviewCount || 0})
                          </span>
                        )}
                      </div>

                      {/* Clinic Name */}
                      <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#6fffe9] transition-colors leading-snug truncate">
                        {clinic.name}
                      </h4>

                      {/* Address preview on desktop */}
                      {clinic.address && (
                        <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                          {clinic.address}
                        </p>
                      )}
                    </div>

                    {/* Right: Quick Sales Action Buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {/* One-Tap Phone Call Button */}
                      {clinic.phone ? (
                        <a
                          href={`tel:${clinic.phone}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2bccaf]/20 to-[#178a74]/30 hover:from-[#2bccaf] hover:to-[#178a74] text-[#6fffe9] hover:text-[#031d19] border border-[#2bccaf]/40 font-bold text-xs transition-all active:scale-95 shadow-sm"
                          title={`โทรหา ${clinic.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{clinic.phone}</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500 px-2 py-1">
                          ไม่มีเบอร์โทร
                        </span>
                      )}

                      {/* Google Maps Button */}
                      {clinic.googleMapsUrl && (
                        <a
                          href={clinic.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95"
                          title="เปิดแผนที่ Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#2bccaf]" />
                        </a>
                      )}

                      {/* Web / Social Link Button */}
                      {clinic.websiteOrLine && (
                        <a
                          href={clinic.websiteOrLine}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95"
                          title="เปิดลิงก์เว็บ/โซเชียล"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load More Button */}
            {visibleCount < finalFilteredClinics.length && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="btn-neon-3d px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>
                    โหลดเพิ่มอีก {Math.min(PAGE_SIZE, finalFilteredClinics.length - visibleCount)} คลินิก
                  </span>
                  <span className="text-[10px] opacity-80">
                    ({visibleCount}/{finalFilteredClinics.length})
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 rounded-2xl border border-dashed border-[#2bccaf]/30 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm sm:text-base font-bold text-white">
              ไม่พบคลิกนิกตามเงื่อนไขที่เลือก
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              ลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อดูคลินิกทั้งหมด
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/40 font-bold text-xs hover:bg-[#2bccaf]/30 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
