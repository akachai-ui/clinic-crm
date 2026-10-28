"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { ClinicLead } from "@/types/clinic";
import { loadClinicsWithCache, saveClinicsToIDB } from "@/lib/clinics-cache";
import type { ProvinceStat } from "@/components/ThailandProvinceMap";
import SalesTrainingPage from "@/components/SalesTrainingPage";
import SalesSystemPage from "@/components/SalesSystemPage";
import {
  Globe,
  MapPin,
  Layers,
  RotateCcw,
  Building2,
  Share2,
  GlobeLock,
  CheckCircle2,
  Loader2,
  Map as MapIcon,
  List,
  BarChart3,
  GraduationCap,
  RefreshCw,
  Database,
  Briefcase,
  Sparkles,
} from "lucide-react";

const ThailandProvinceMap = dynamic(
  () => import("@/components/ThailandProvinceMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] rounded-2xl glass-card-3d animate-pulse flex items-center justify-center text-sm text-[#2bccaf]">
        กำลังสร้างแผนที่โฮโลแกรมประเทศไทย 3 มิติ...
      </div>
    ),
  }
);

export default function HomePage() {
  const [clinics, setClinics] = useState<ClinicLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [deltaReadsUsed, setDeltaReadsUsed] = useState<number>(0);

  // Page/Tab switcher: "page1" (Overview & Map) | "page2" (Sales Training) | "page3" (Sales System)
  const [activePage, setActivePage] = useState<"page1" | "page2" | "page3">("page1");

  // Filter states for Section 1
  const [selectedWebsiteStatus, setSelectedWebsiteStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Toggle between Map view and Grid list inside the Province card
  const [provinceViewMode, setProvinceViewMode] = useState<"map" | "list">("map");

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

  // Filtered clinics based on selections
  const filteredClinics = useMemo(() => {
    return clinics.filter((item) => {
      const matchWebsite =
        selectedWebsiteStatus === "all" ||
        (item.websiteStatus || "ไม่ระบุ") === selectedWebsiteStatus;
      const matchProvince =
        selectedProvince === "all" ||
        (item.province || "ไม่ระบุ") === selectedProvince;
      const matchCategory =
        selectedCategory === "all" ||
        (item.category || "ไม่ระบุ") === selectedCategory;
      return matchWebsite && matchProvince && matchCategory;
    });
  }, [clinics, selectedWebsiteStatus, selectedProvince, selectedCategory]);

  // Group counts for websiteStatus (respecting province & category filters)
  const websiteStatusBreakdown = useMemo(() => {
    const base = clinics.filter((item) => {
      const matchProvince =
        selectedProvince === "all" || (item.province || "ไม่ระบุ") === selectedProvince;
      const matchCategory =
        selectedCategory === "all" || (item.category || "ไม่ระบุ") === selectedCategory;
      return matchProvince && matchCategory;
    });
    const counts: Record<string, number> = {};
    base.forEach((c) => {
      const key = c.websiteStatus || "ไม่ระบุ";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [clinics, selectedProvince, selectedCategory]);

  // Group counts for category (respecting websiteStatus & province filters)
  const categoryBreakdown = useMemo(() => {
    const base = clinics.filter((item) => {
      const matchWebsite =
        selectedWebsiteStatus === "all" ||
        (item.websiteStatus || "ไม่ระบุ") === selectedWebsiteStatus;
      const matchProvince =
        selectedProvince === "all" || (item.province || "ไม่ระบุ") === selectedProvince;
      return matchWebsite && matchProvince;
    });
    const counts: Record<string, number> = {};
    base.forEach((c) => {
      const key = c.category || "ไม่ระบุ";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [clinics, selectedWebsiteStatus, selectedProvince]);

  // Group stats + centroid coordinates for province (respecting websiteStatus & category filters)
  const provinceStats: ProvinceStat[] = useMemo(() => {
    const base = clinics.filter((item) => {
      const matchWebsite =
        selectedWebsiteStatus === "all" ||
        (item.websiteStatus || "ไม่ระบุ") === selectedWebsiteStatus;
      const matchCategory =
        selectedCategory === "all" || (item.category || "ไม่ระบุ") === selectedCategory;
      return matchWebsite && matchCategory;
    });

    const map: Record<
      string,
      { count: number; latSum: number; lngSum: number; coordCount: number }
    > = {};

    base.forEach((c) => {
      const key = c.province || "ไม่ระบุ";
      if (!map[key]) {
        map[key] = { count: 0, latSum: 0, lngSum: 0, coordCount: 0 };
      }
      map[key].count += 1;
      if (
        typeof c.latitude === "number" &&
        typeof c.longitude === "number" &&
        !Number.isNaN(c.latitude) &&
        !Number.isNaN(c.longitude)
      ) {
        map[key].latSum += c.latitude;
        map[key].lngSum += c.longitude;
        map[key].coordCount += 1;
      }
    });

    return Object.entries(map)
      .map(([province, data]) => ({
        province,
        count: data.count,
        lat: data.coordCount > 0 ? data.latSum / data.coordCount : 13.75,
        lng: data.coordCount > 0 ? data.lngSum / data.coordCount : 100.5,
      }))
      .sort((a, b) => b.count - a.count);
  }, [clinics, selectedWebsiteStatus, selectedCategory]);

  const resetFilters = () => {
    setSelectedWebsiteStatus("all");
    setSelectedProvince("all");
    setSelectedCategory("all");
  };

  const hasActiveFilters =
    selectedWebsiteStatus !== "all" ||
    selectedProvince !== "all" ||
    selectedCategory !== "all";

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
              ระบบวิเคราะห์ข้อมูลคลินิก {clinics.length.toLocaleString()} แห่งทั่วไทย • 3D Futuristic Intelligence
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
              onClick={() => setActivePage("page1")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "page1"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              ภาพรวม & แผนที่จังหวัด
            </button>
            <button
              onClick={() => setActivePage("page2")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "page2"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              ประโยชน์ของการมีเว็บไซต์
            </button>
            <button
              onClick={() => setActivePage("page3")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "page3"
                  ? "btn-neon-3d"
                  : "text-slate-300 hover:text-[#2bccaf] hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              ระบบงานขาย
            </button>
          </div>
        </div>
      </div>

      {activePage === "page1" ? (
        /* ==================== PAGE 1: Overview & Interactive 3D Map ==================== */
        <section className="space-y-7">
          {/* Top 3D Filter Deck & Counter */}
          <div className="glass-panel-3d rounded-3xl p-6 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2bccaf]/20">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#2bccaf] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Holographic Data Matrix
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
                  ภาพรวมการแบ่งกลุ่มข้อมูลคลินิก
                </h1>
                <p className="text-sm text-slate-300/80 mt-0.5">
                  จำแนกตาม สถานะเว็บไซต์ (`websiteStatus`), จังหวัด (`province`), และ ประเภทคลินิก (`category`)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="glass-card-3d inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#2bccaf] hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    ล้างตัวกรอง
                  </button>
                )}
                <div className="glass-card-3d-active px-5 py-2.5 rounded-2xl text-right">
                  <span className="text-[11px] text-[#6fffe9] block font-bold uppercase tracking-wider">
                    จำนวนที่ตรงเงื่อนไข
                  </span>
                  <span className="text-2xl font-black text-white drop-shadow-[0_0_12px_rgba(43,204,175,0.6)]">
                    {filteredClinics.length.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#2bccaf] ml-1.5 font-semibold">
                    / {clinics.length.toLocaleString()} คลินิก
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Futuristic Glass Dropdown Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
              {/* Website Status Selector */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#2bccaf] uppercase tracking-wider mb-2">
                  <Globe className="w-4 h-4 text-[#2bccaf]" />
                  สถานะเว็บไซต์ (websiteStatus)
                </label>
                <select
                  value={selectedWebsiteStatus}
                  onChange={(e) => setSelectedWebsiteStatus(e.target.value)}
                  className="glass-input-3d w-full rounded-xl px-3.5 py-2.5 text-sm font-medium"
                >
                  <option value="all" className="bg-[#091526] text-white">
                    ทั้งหมด (
                    {websiteStatusBreakdown
                      .reduce((a, b) => a + b[1], 0)
                      .toLocaleString()}
                    )
                  </option>
                  {websiteStatusBreakdown.map(([status, count]) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-[#091526] text-white"
                    >
                      {status} ({count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Selector */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#2bccaf] uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4 text-[#2bccaf]" />
                  จังหวัด (province)
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="glass-input-3d w-full rounded-xl px-3.5 py-2.5 text-sm font-medium"
                >
                  <option value="all" className="bg-[#091526] text-white">
                    ทุกจังหวัด ({provinceStats.length} จังหวัด)
                  </option>
                  {provinceStats.map((stat) => (
                    <option
                      key={stat.province}
                      value={stat.province}
                      className="bg-[#091526] text-white"
                    >
                      {stat.province} ({stat.count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selector */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#2bccaf] uppercase tracking-wider mb-2">
                  <Layers className="w-4 h-4 text-[#2bccaf]" />
                  ประเภทคลินิก (category)
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="glass-input-3d w-full rounded-xl px-3.5 py-2.5 text-sm font-medium"
                >
                  <option value="all" className="bg-[#091526] text-white">
                    ทุกประเภท ({categoryBreakdown.length} กลุ่ม)
                  </option>
                  {categoryBreakdown.map(([cat, count]) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-[#091526] text-white"
                    >
                      {cat} ({count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 1. Breakdown by Website Status 3D Cards */}
          <div>
            <h2 className="text-sm font-bold text-[#2bccaf] uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2bccaf]" />
              แยกตามสถานะเว็บไซต์ (websiteStatus)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {websiteStatusBreakdown.map(([status, count]) => {
                const isSelected = selectedWebsiteStatus === status;
                const total =
                  websiteStatusBreakdown.reduce((acc, curr) => acc + curr[1], 0) ||
                  1;
                const pct = ((count / total) * 100).toFixed(1);

                let Icon = Globe;
                let badgeColor =
                  "bg-[#2bccaf]/20 text-[#6fffe9] border-[#2bccaf]/50";
                let barColor =
                  "bg-gradient-to-r from-[#2bccaf] to-[#6fffe9] shadow-[0_0_12px_#2bccaf]";

                if (status.includes("ไม่มี")) {
                  Icon = GlobeLock;
                  badgeColor = "bg-rose-500/20 text-rose-300 border-rose-400/40";
                  barColor =
                    "bg-gradient-to-r from-rose-500 to-pink-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]";
                } else if (status.includes("fb") || status.includes("line")) {
                  Icon = Share2;
                  badgeColor =
                    "bg-amber-500/20 text-amber-300 border-amber-400/40";
                  barColor =
                    "bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]";
                } else {
                  Icon = CheckCircle2;
                }

                return (
                  <button
                    key={status}
                    onClick={() =>
                      setSelectedWebsiteStatus(isSelected ? "all" : status)
                    }
                    className={`text-left p-5 rounded-3xl ${
                      isSelected ? "glass-card-3d-active" : "glass-card-3d"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badgeColor}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {status}
                      </span>
                      <span className="text-xs font-extrabold text-[#2bccaf]">
                        {pct}%
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white mb-3.5 tracking-tight">
                      {count.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-300">
                        รายการ
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#050d1a] rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Breakdown by Province (3D Holographic Map) & Category */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Province Map (7 columns on desktop) */}
            <div className="lg:col-span-7 glass-panel-3d rounded-3xl p-5 md:p-6 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2bccaf]" />
                    แผนที่โฮโลแกรมประเทศไทยแยกตามเขตจังหวัด (77 จังหวัด)
                    {selectedProvince !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 font-bold">
                        {selectedProvince}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-300/80 mt-0.5">
                    คลิกที่เขตจังหวัดบนแผนที่ 3 มิติเพื่อกรองข้อมูลเฉพาะจังหวัดนั้น
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-[#060f1d]/90 p-1 rounded-xl border border-[#2bccaf]/25">
                  <button
                    onClick={() => setProvinceViewMode("map")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      provinceViewMode === "map"
                        ? "btn-neon-3d"
                        : "text-slate-300 hover:text-[#2bccaf]"
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    แผนที่ 3D
                  </button>
                  <button
                    onClick={() => setProvinceViewMode("list")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      provinceViewMode === "list"
                        ? "btn-neon-3d"
                        : "text-slate-300 hover:text-[#2bccaf]"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    รายชื่อ ({provinceStats.length})
                  </button>
                </div>
              </div>

              {provinceViewMode === "map" ? (
                <ThailandProvinceMap
                  provinceStats={provinceStats}
                  selectedProvince={selectedProvince}
                  onSelectProvince={setSelectedProvince}
                  clinicsInSelectedProvince={
                    selectedProvince === "all" ? [] : filteredClinics
                  }
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[540px] overflow-y-auto pr-1">
                  {provinceStats.map((stat) => {
                    const isSelected = selectedProvince === stat.province;
                    return (
                      <button
                        key={stat.province}
                        onClick={() =>
                          setSelectedProvince(isSelected ? "all" : stat.province)
                        }
                        className={`flex items-center justify-between p-3 rounded-xl text-xs transition ${
                          isSelected
                            ? "glass-card-3d-active text-white font-bold"
                            : "glass-card-3d text-slate-200 hover:text-white"
                        }`}
                      >
                        <span className="truncate pr-1">{stat.province}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            isSelected
                              ? "bg-[#2bccaf] text-[#041f1b]"
                              : "bg-[#2bccaf]/15 text-[#2bccaf] border border-[#2bccaf]/30"
                          }`}
                        >
                          {stat.count.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Category Breakdown (5 columns on desktop) */}
            <div className="lg:col-span-5 glass-panel-3d rounded-3xl p-5 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2bccaf]" />
                    แยกตามประเภทคลินิก (category)
                  </h2>
                  <p className="text-xs text-slate-300/80 mt-0.5">
                    คลิกเพื่อกรองเฉพาะประเภทคลินิกที่สนใจ
                  </p>
                </div>
                <span className="text-xs font-bold text-[#2bccaf] px-2.5 py-1 rounded-full bg-[#2bccaf]/15 border border-[#2bccaf]/30">
                  {categoryBreakdown.length} ประเภท
                </span>
              </div>
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1.5">
                {categoryBreakdown.map(([cat, count]) => {
                  const isSelected = selectedCategory === cat;
                  const total =
                    categoryBreakdown.reduce((a, b) => a + b[1], 0) || 1;
                  const pct = ((count / total) * 100).toFixed(1);

                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setSelectedCategory(isSelected ? "all" : cat)
                      }
                      className={`w-full text-left p-3.5 rounded-2xl transition ${
                        isSelected ? "glass-card-3d-active" : "glass-card-3d"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-xs mb-2">
                        <span className="font-bold text-white line-clamp-1">
                          {cat}
                        </span>
                        <span className="font-extrabold text-[#2bccaf] shrink-0">
                          {count.toLocaleString()}{" "}
                          <span className="font-normal text-slate-300">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#050d1a] rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#2bccaf] to-[#6fffe9] rounded-full shadow-[0_0_10px_#2bccaf]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : activePage === "page2" ? (
        /* ==================== PAGE 2: Sales Training Playbook ==================== */
        <SalesTrainingPage />
      ) : (
        /* ==================== PAGE 3: Sales System (Competitor Analysis + CRM) ==================== */
        <SalesSystemPage clinics={clinics} onUpdateClinic={handleUpdateClinic} />
      )}
    </main>
  );
}
