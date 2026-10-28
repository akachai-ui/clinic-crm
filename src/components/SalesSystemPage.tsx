"use client";

import { useState, useMemo, useEffect } from "react";
import { ClinicLead } from "@/types/clinic";
import { saveClinicDeltaUpdate } from "@/lib/clinics-cache";
import {
  Search,
  TrendingUp,
  CheckCircle2,
  MessageSquareQuote,
  Radar,
  Building2,
  Phone,
  Share2,
  GlobeLock,
  Navigation,
  Swords,
  ArrowUpRight,
  Save,
  Check,
  ClipboardCheck,
  Briefcase,
} from "lucide-react";

const FUTURISTIC_STATUS_OPTIONS = [
  {
    label: "ยังไม่ได้ติดต่อ",
    color: "bg-slate-800/80 text-slate-300 border-slate-600/60",
  },
  {
    label: "โทรแล้ว / รอตัดสินใจ",
    color: "bg-amber-500/20 text-amber-300 border-amber-400/50",
  },
  {
    label: "สนใจ / นัดส่งใบเสนอราคา",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/50",
  },
  {
    label: "ปิดการขายสำเร็จ (ทำเว็บ)",
    color: "bg-[#2bccaf]/25 text-[#6fffe9] border-[#2bccaf]",
  },
  {
    label: "ไม่สนใจ",
    color: "bg-rose-500/20 text-rose-300 border-rose-400/50",
  },
];

// Calculate real distance in km between two lat/lng points using Haversine formula
function calculateDistanceKm(
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null
): number | null {
  if (
    lat1 === null ||
    lon1 === null ||
    lat2 === null ||
    lon2 === null ||
    Number.isNaN(lat1) ||
    Number.isNaN(lon1) ||
    Number.isNaN(lat2) ||
    Number.isNaN(lon2)
  ) {
    return null;
  }
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function classifyWebsiteStatus(status?: string): "has_web" | "fb_line" | "no_web" {
  const s = status || "";
  if (s.includes("ไม่มี")) return "no_web";
  if (s.includes("fb") || s.includes("line")) return "fb_line";
  return "has_web";
}

interface SalesSystemPageProps {
  clinics?: ClinicLead[];
  onUpdateClinic?: (id: string, updates: Partial<ClinicLead>) => void;
}

export default function SalesSystemPage({
  clinics = [],
  onUpdateClinic,
}: SalesSystemPageProps) {
  // Competitor Analyzer & Sales System States
  const [searchClinicQuery, setSearchClinicQuery] = useState("");
  const [filterProvince, setFilterProvince] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSalesStatus, setFilterSalesStatus] = useState<string>("all");
  const [selectedTargetClinic, setSelectedTargetClinic] = useState<ClinicLead | null>(
    () => clinics.find((c) => c.websiteStatus?.includes("ไม่มี")) || clinics[0] || null
  );
  const [scopeMode, setScopeMode] = useState<
    "radius_5" | "radius_10" | "district" | "province"
  >("province");
  const [competitorCategoryMode, setCompetitorCategoryMode] =
    useState<string>("same_target");
  const [competitorTab, setCompetitorTab] = useState<"has_web" | "all">("has_web");

  // Sales CRM Form states for the selected customer clinic
  const [isSalesFormOpen, setIsSalesFormOpen] = useState<boolean>(true);
  const [salesStatusInput, setSalesStatusInput] = useState<string>("ยังไม่ได้ติดต่อ");
  const [notesInput, setNotesInput] = useState<string>("");
  const [savingSalesLog, setSavingSalesLog] = useState<boolean>(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<boolean>(false);

  // Sync form fields whenever selectedTargetClinic changes
  useEffect(() => {
    if (selectedTargetClinic) {
      setSalesStatusInput(selectedTargetClinic.salesStatus || "ยังไม่ได้ติดต่อ");
      setNotesInput(selectedTargetClinic.notes || "");
      setSavedSuccessMsg(false);
    }
  }, [selectedTargetClinic?.id]);

  // Save salesStatus + notes to Firebase `clinic_updates` linked by `id`
  const handleSaveSalesLog = async (overrideStatus?: string) => {
    if (!selectedTargetClinic) return;
    const statusToSave = overrideStatus ?? salesStatusInput;
    try {
      setSavingSalesLog(true);
      setSavedSuccessMsg(false);
      const updatedAt = new Date().toISOString();
      const updates: Partial<ClinicLead> = {
        salesStatus: statusToSave,
        notes: notesInput,
        updatedAt,
      };
      await saveClinicDeltaUpdate(selectedTargetClinic.id, updates);
      setSelectedTargetClinic((prev) => (prev ? { ...prev, ...updates } : null));
      if (onUpdateClinic) {
        onUpdateClinic(selectedTargetClinic.id, updates);
      }
      setSavedSuccessMsg(true);
      setTimeout(() => setSavedSuccessMsg(false), 3000);
    } catch (err) {
      console.error("Failed to save sales log:", err);
    } finally {
      setSavingSalesLog(false);
    }
  };

  // Province list for quick filtering when finding customer clinic
  const provinceList = useMemo(() => {
    const map: Record<string, number> = {};
    clinics.forEach((c) => {
      const p = c.province || "ไม่ระบุ";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics]);

  // Category list for filtering customer clinic & competitors
  const categoryList = useMemo(() => {
    const map: Record<string, number> = {};
    clinics.forEach((c) => {
      const cat = c.category || "ไม่ระบุ";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics]);

  // Matching clinics in the search box to select a customer
  const matchingCustomerClinics = useMemo(() => {
    const q = searchClinicQuery.trim().toLowerCase();
    return clinics
      .filter((c) => {
        const matchProv =
          filterProvince === "all" || (c.province || "ไม่ระบุ") === filterProvince;
        const matchCat =
          filterCategory === "all" || (c.category || "ไม่ระบุ") === filterCategory;
        const matchStatus =
          filterSalesStatus === "all" ||
          (c.salesStatus || "ยังไม่ได้ติดต่อ") === filterSalesStatus;
        if (!matchProv || !matchCat || !matchStatus) return false;
        if (!q) return true;
        return (
          c.name?.toLowerCase().includes(q) ||
          c.district?.toLowerCase().includes(q) ||
          c.province?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.notes?.toLowerCase().includes(q)
        );
      })
      .slice(0, 40);
  }, [clinics, searchClinicQuery, filterProvince, filterCategory, filterSalesStatus]);

  // Calculate competitors around `selectedTargetClinic`
  const competitorAnalysis = useMemo(() => {
    if (!selectedTargetClinic) return null;

    const competitorsWithDistance = clinics
      .filter((c) => c.id !== selectedTargetClinic.id)
      .filter((c) => {
        if (competitorCategoryMode === "all") return true;
        if (competitorCategoryMode === "same_target") {
          return (
            c.category === selectedTargetClinic.category ||
            c.searchKeyword === selectedTargetClinic.searchKeyword
          );
        }
        return (c.category || "ไม่ระบุ") === competitorCategoryMode;
      })
      .map((c) => {
        const distanceKm = calculateDistanceKm(
          selectedTargetClinic.latitude,
          selectedTargetClinic.longitude,
          c.latitude,
          c.longitude
        );
        return { clinic: c, distanceKm };
      })
      .filter(({ clinic, distanceKm }) => {
        if (scopeMode === "radius_5") {
          return distanceKm !== null && distanceKm <= 5;
        }
        if (scopeMode === "radius_10") {
          return distanceKm !== null && distanceKm <= 10;
        }
        if (scopeMode === "district") {
          return (
            clinic.province === selectedTargetClinic.province &&
            clinic.district &&
            clinic.district === selectedTargetClinic.district
          );
        }
        return clinic.province === selectedTargetClinic.province;
      })
      .sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        return (b.clinic.reviewCount || 0) - (a.clinic.reviewCount || 0);
      });

    const hasWebList = competitorsWithDistance.filter(
      (item) => classifyWebsiteStatus(item.clinic.websiteStatus) === "has_web"
    );
    const fbLineList = competitorsWithDistance.filter(
      (item) => classifyWebsiteStatus(item.clinic.websiteStatus) === "fb_line"
    );
    const noWebList = competitorsWithDistance.filter(
      (item) => classifyWebsiteStatus(item.clinic.websiteStatus) === "no_web"
    );

    const avgReviewsHasWeb =
      hasWebList.length > 0
        ? Math.round(
            hasWebList.reduce(
              (acc, x) => acc + (Number(x.clinic.reviewCount) || 0),
              0
            ) / hasWebList.length
          )
        : 0;

    const avgReviewsNoWeb =
      noWebList.length > 0
        ? Math.round(
            noWebList.reduce(
              (acc, x) => acc + (Number(x.clinic.reviewCount) || 0),
              0
            ) / noWebList.length
          )
        : 0;

    return {
      all: competitorsWithDistance,
      hasWebList,
      fbLineList,
      noWebList,
      avgReviewsHasWeb,
      avgReviewsNoWeb,
    };
  }, [clinics, selectedTargetClinic, scopeMode, competitorCategoryMode]);

  const targetStatusType = selectedTargetClinic
    ? classifyWebsiteStatus(selectedTargetClinic.websiteStatus)
    : "no_web";

  return (
    <div className="space-y-7">
      {/* 3D Futuristic Glass Header Banner */}
      <div className="glass-panel-3d relative overflow-hidden rounded-3xl p-6 md:p-8 text-white">
        <div className="pointer-events-none absolute -right-12 -top-12 w-72 h-72 rounded-full bg-[#2bccaf]/20 blur-3xl" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2bccaf]/20 border border-[#2bccaf]/45 text-[#6fffe9] text-xs font-bold mb-3 shadow-[0_0_15px_rgba(43,204,175,0.25)]">
          <Briefcase className="w-3.5 h-3.5" />
          ระบบงานขาย & วิเคราะห์คู่แข่งรายคลินิก (Sales CRM & Competitor Radar)
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-wide drop-shadow-[0_0_12px_rgba(43,204,175,0.3)]">
          ระบบงานขาย: วิเคราะห์คู่แข่งในพื้นที่ของลูกค้า & บันทึกผลการติดต่อ
        </h1>
        <p className="text-slate-300 text-sm md:text-base mt-2 max-w-3xl">
          ค้นหาคลินิกลูกค้าเพื่อเปรียบเทียบคู่แข่งในละแวกใกล้เคียงแบบเรียลไทม์ โชว์ความต่างของยอดรีวิวคลินิกที่มีเว็บไซต์ และบันทึกสถานะการขายลง Firebase ทันที
        </p>
      </div>

      {/* Main Competitor Analyzer & Sales Log Workspace */}
      <section className="glass-panel-3d rounded-3xl p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2bccaf]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3be2c4] to-[#178a74] text-[#041f1b] flex items-center justify-center shadow-[0_4px_0_#0d5245,0_0_22px_rgba(43,204,175,0.5)] shrink-0">
              <Radar className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2bccaf]">
                ระบบงานขาย • ข้อมูลจริงจากฐานข้อมูล 100%
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                ระบบวิเคราะห์คู่แข่งในพื้นที่ของลูกค้า (Local Competitor Comparison)
              </h2>
              <p className="text-sm text-slate-300/80 mt-0.5">
                คลิกเลือกชื่อคลินิกลูกค้าทางด้านซ้าย เพื่อดูคู่แข่งที่มีเว็บไซต์ในพื้นที่เดียวกัน และบันทึกสถานะการนำเสนอขาย
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Left Column (4 cols): Search & Click Customer Clinic */}
          <div className="lg:col-span-4 flex flex-col glass-card-3d rounded-3xl p-4 md:p-5">
            <div className="text-xs font-extrabold text-[#2bccaf] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#2bccaf]" />
              1. ค้นหาและคลิกเลือกคลินิกลูกค้า
            </div>

            <div className="space-y-3 mb-3.5">
              {/* Filter by Province */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  กรองจังหวัด (province):
                </label>
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="glass-input-3d w-full rounded-xl px-3 py-2 text-xs font-medium"
                >
                  <option value="all" className="bg-[#091526] text-white">
                    ทุกจังหวัด ({clinics.length.toLocaleString()})
                  </option>
                  {provinceList.map(([prov, cnt]) => (
                    <option
                      key={prov}
                      value={prov}
                      className="bg-[#091526] text-white"
                    >
                      {prov} ({cnt.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  กรองประเภทคลินิก (category):
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="glass-input-3d w-full rounded-xl px-3 py-2 text-xs font-medium"
                >
                  <option value="all" className="bg-[#091526] text-white">
                    ทุกประเภทคลินิก ({categoryList.length} กลุ่ม)
                  </option>
                  {categoryList.map(([cat, cnt]) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-[#091526] text-white"
                    >
                      {cat} ({cnt.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Sales Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  กรองสถานะการขาย (`salesStatus`):
                </label>
                <select
                  value={filterSalesStatus}
                  onChange={(e) => setFilterSalesStatus(e.target.value)}
                  className="glass-input-3d w-full rounded-xl px-3 py-2 text-xs font-medium"
                >
                  <option value="all" className="bg-[#091526] text-white">
                    ทุกสถานะการขาย
                  </option>
                  {FUTURISTIC_STATUS_OPTIONS.map((opt) => (
                    <option
                      key={opt.label}
                      value={opt.label}
                      className="bg-[#091526] text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative pt-1">
                <Search className="w-3.5 h-3.5 text-[#2bccaf] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchClinicQuery}
                  onChange={(e) => setSearchClinicQuery(e.target.value)}
                  placeholder="พิมพ์ชื่อคลินิกลูกค้า, อำเภอ, เบอร์โทร..."
                  className="glass-input-3d w-full pl-8 pr-3 py-2 rounded-xl text-xs placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-300/80 mb-2">
              คลิกที่ชื่อคลินิกด้านล่างเพื่อดูคู่แข่งรอบข้าง:
            </div>

            <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
              {matchingCustomerClinics.map((c) => {
                const isSelected = selectedTargetClinic?.id === c.id;
                const st = classifyWebsiteStatus(c.websiteStatus);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedTargetClinic(c)}
                    className={`w-full text-left p-3.5 rounded-2xl transition ${
                      isSelected
                        ? "glass-card-3d-active text-white"
                        : "bg-[#081526]/80 border border-[#2bccaf]/15 hover:border-[#2bccaf]/50 text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs line-clamp-1 text-white">
                      {c.name}
                    </div>
                    <div
                      className={`text-[10px] line-clamp-1 mt-0.5 ${
                        isSelected ? "text-[#6fffe9]" : "text-slate-400"
                      }`}
                    >
                      {c.category}
                    </div>
                    <div
                      className={`text-[11px] mt-1.5 flex items-center justify-between gap-2 ${
                        isSelected ? "text-slate-100" : "text-slate-300"
                      }`}
                    >
                      <span className="truncate">
                        {c.district ? `${c.district}, ` : ""}
                        {c.province}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 border ${
                          isSelected
                            ? "bg-[#2bccaf] text-[#041f1b] border-white/40"
                            : st === "has_web"
                            ? "bg-[#2bccaf]/15 text-[#6fffe9] border-[#2bccaf]/40"
                            : st === "fb_line"
                            ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                            : "bg-rose-500/20 text-rose-300 border-rose-400/40"
                        }`}
                      >
                        {st === "has_web"
                          ? "มีเว็บแล้ว"
                          : st === "fb_line"
                          ? "มีแค่ FB/Line"
                          : "ไม่มีเว็บ"}
                      </span>
                    </div>
                    {(c.salesStatus && c.salesStatus !== "ยังไม่ได้ติดต่อ") ||
                    c.notes ? (
                      <div
                        className={`mt-2 pt-1.5 border-t text-[10px] flex items-center justify-between gap-1 ${
                          isSelected
                            ? "border-[#2bccaf]/40 text-[#6fffe9]"
                            : "border-white/10 text-[#2bccaf]"
                        }`}
                      >
                        <span className="font-bold truncate">
                          📌 {c.salesStatus || "ยังไม่ได้ติดต่อ"}
                        </span>
                        {c.notes && (
                          <span className="truncate opacity-80">
                            • มีโน้ตบันทึก
                          </span>
                        )}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column (8 cols): Competitor Breakdown & Sales Log Form */}
          <div className="lg:col-span-8 space-y-5">
            {selectedTargetClinic && competitorAnalysis ? (
              <>
                {/* Selected Customer Clinic Card + Scope Filters */}
                <div className="glass-card-3d rounded-3xl p-5 md:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-[#2bccaf]/20 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2bccaf]">
                          <Building2 className="w-3.5 h-3.5" />
                          คลินิกลูกค้าที่เลือกวิเคราะห์
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#2bccaf]/15 border border-[#2bccaf]/30 text-[10px] text-[#6fffe9] font-mono">
                          ID: {selectedTargetClinic.id}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-white leading-snug">
                        {selectedTargetClinic.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        ประเภท: <span className="text-[#6fffe9]">{selectedTargetClinic.category}</span> • พื้นที่:{" "}
                        {selectedTargetClinic.district || "-"}{" "}
                        {selectedTargetClinic.province}
                        {selectedTargetClinic.phone
                          ? ` • โทร: ${selectedTargetClinic.phone}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                          targetStatusType === "has_web"
                            ? "bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50"
                            : targetStatusType === "fb_line"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                            : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                        }`}
                      >
                        {targetStatusType === "has_web" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : targetStatusType === "fb_line" ? (
                          <Share2 className="w-4 h-4" />
                        ) : (
                          <GlobeLock className="w-4 h-4" />
                        )}
                        {selectedTargetClinic.websiteStatus || "ไม่มีเว็บไซต์"}
                      </span>

                      <button
                        onClick={() => setIsSalesFormOpen((v) => !v)}
                        className="btn-neon-3d inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        {isSalesFormOpen
                          ? "ซ่อนฟอร์มบันทึกการขาย"
                          : "บันทึกการขาย / อัปเดตสถานะ"}
                      </button>
                    </div>
                  </div>

                  {/* Area Scope & Category Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                    <div className="md:col-span-7 flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-300 mr-1 font-semibold">
                        ขอบเขตพื้นที่:
                      </span>
                      <button
                        onClick={() => setScopeMode("radius_5")}
                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                          scopeMode === "radius_5"
                            ? "btn-neon-3d"
                            : "bg-white/5 text-slate-300 border border-white/10 hover:border-[#2bccaf]/40"
                        }`}
                      >
                        รัศมี 5 กม.
                      </button>
                      <button
                        onClick={() => setScopeMode("radius_10")}
                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                          scopeMode === "radius_10"
                            ? "btn-neon-3d"
                            : "bg-white/5 text-slate-300 border border-white/10 hover:border-[#2bccaf]/40"
                        }`}
                      >
                        รัศมี 10 กม.
                      </button>
                      <button
                        onClick={() => setScopeMode("district")}
                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                          scopeMode === "district"
                            ? "btn-neon-3d"
                            : "bg-white/5 text-slate-300 border border-white/10 hover:border-[#2bccaf]/40"
                        }`}
                      >
                        อำเภอเดียวกัน ({selectedTargetClinic.district || "-"})
                      </button>
                      <button
                        onClick={() => setScopeMode("province")}
                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                          scopeMode === "province"
                            ? "btn-neon-3d"
                            : "bg-white/5 text-slate-300 border border-white/10 hover:border-[#2bccaf]/40"
                        }`}
                      >
                        จังหวัดเดียวกัน ({selectedTargetClinic.province})
                      </button>
                    </div>

                    <div className="md:col-span-5 flex items-center gap-2">
                      <span className="text-slate-300 shrink-0 font-semibold">
                        ประเภทคู่แข่ง:
                      </span>
                      <select
                        value={competitorCategoryMode}
                        onChange={(e) =>
                          setCompetitorCategoryMode(e.target.value)
                        }
                        className="glass-input-3d w-full rounded-xl px-2.5 py-1.5 text-xs"
                      >
                        <option value="same_target" className="bg-[#091526] text-white">
                          ประเภทเดียวกับลูกค้า ({selectedTargetClinic.category})
                        </option>
                        <option value="all" className="bg-[#091526] text-white">
                          ทุกประเภทคลินิกในพื้นที่
                        </option>
                        {categoryList.map(([cat]) => (
                          <option
                            key={cat}
                            value={cat}
                            className="bg-[#091526] text-white"
                          >
                            เฉพาะ: {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* INLINE 3D GLASS SALES CRM FORM: Update Presentation Status & Call Notes in Firebase */}
                {isSalesFormOpen && (
                  <div className="glass-card-3d-active rounded-3xl p-5 md:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2bccaf]/30 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#2bccaf] text-[#041f1b] flex items-center justify-center shadow-[0_0_15px_#2bccaf]">
                          <ClipboardCheck className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                          <h4 className="text-sm md:text-base font-extrabold text-white">
                            อัปเดตสถานะการนำเสนอ & บันทึกการพูดคุย (เชื่อม Firebase ด้วย ID: {selectedTargetClinic.id})
                          </h4>
                          <p className="text-[11px] text-[#6fffe9]/80">
                            บันทึกเฉพาะผลการติดต่อของคลินิกนี้ลง Firebase (`clinic_updates`) โดยไม่กระทบไฟล์ต้นฉบับ
                          </p>
                        </div>
                      </div>

                      {selectedTargetClinic.phone && (
                        <a
                          href={`tel:${selectedTargetClinic.phone}`}
                          className="btn-neon-3d inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          โทรออก: {selectedTargetClinic.phone}
                        </a>
                      )}
                    </div>

                    {/* 1. Presentation / Sales Status Pills */}
                    <div>
                      <label className="block text-xs font-extrabold text-[#6fffe9] mb-2">
                        1. เลือกสถานะการนำเสนอ (`salesStatus`):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                        {FUTURISTIC_STATUS_OPTIONS.map((opt) => {
                          const isSelected = salesStatusInput === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setSalesStatusInput(opt.label)}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition ${
                                isSelected
                                  ? `${opt.color} ring-2 ring-[#2bccaf] shadow-[0_0_15px_rgba(43,204,175,0.4)]`
                                  : "bg-[#071426]/80 border-white/15 text-slate-300 hover:border-[#2bccaf]/50"
                              }`}
                            >
                              <span className="truncate">{opt.label}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-[#2bccaf]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Call / Presentation Notes */}
                    <div>
                      <label className="block text-xs font-extrabold text-[#6fffe9] mb-1.5">
                        2. บันทึกการพูดคุย / รายละเอียดการนำเสนอ (`notes`):
                      </label>
                      <textarea
                        rows={3}
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="พิมพ์บันทึกผลการโทร เช่น คุยกับคุณหมอ/ผู้จัดการแล้ว สนใจทำเว็บพร้อม Google Ads นัดส่งใบเสนอราคาทาง LINE..."
                        className="glass-input-3d w-full rounded-2xl p-3.5 text-xs md:text-sm placeholder:text-slate-400"
                      />
                    </div>

                    {/* Save Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-slate-300">
                        {savedSuccessMsg ? (
                          <span className="inline-flex items-center gap-1.5 font-extrabold text-[#041f1b] bg-[#2bccaf] px-3 py-1 rounded-xl shadow-[0_0_15px_#2bccaf]">
                            <CheckCircle2 className="w-4 h-4" />
                            บันทึกลง Firebase สำเร็จแล้ว!
                          </span>
                        ) : selectedTargetClinic.updatedAt ? (
                          <span className="text-[#6fffe9]">
                            อัปเดตล่าสุดเมื่อ:{" "}
                            {new Date(
                              selectedTargetClinic.updatedAt
                            ).toLocaleString("th-TH")}
                          </span>
                        ) : (
                          <span>ยังไม่มีประวัติการบันทึกใน Firebase</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveSalesLog()}
                        disabled={savingSalesLog}
                        className="btn-neon-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {savingSalesLog
                          ? "กำลังบันทึกลง Firebase..."
                          : "บันทึกสถานะ & การพูดคุยลง Firebase"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3 Summary Stat 3D Glass Cards of Competitors in Area */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card-3d rounded-3xl p-4 md:p-5">
                    <div className="text-xs font-bold text-slate-300">
                      คู่แข่งในพื้นที่นี้ทั้งหมด
                    </div>
                    <div className="text-3xl font-black text-white mt-1.5">
                      {competitorAnalysis.all.length.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-300">
                        คลินิก
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      ที่เปิดให้บริการอยู่ในพื้นที่เดียวกัน
                    </p>
                  </div>

                  <div className="glass-card-3d rounded-3xl p-4 md:p-5 border-[#2bccaf]/50">
                    <div className="text-xs font-extrabold text-[#2bccaf] flex items-center justify-between">
                      <span>คู่แข่งที่มีเว็บไซต์เป็นทางการแล้ว</span>
                      <CheckCircle2 className="w-4 h-4 text-[#2bccaf]" />
                    </div>
                    <div className="text-3xl font-black text-[#6fffe9] mt-1.5 drop-shadow-[0_0_10px_rgba(43,204,175,0.4)]">
                      {competitorAnalysis.hasWebList.length.toLocaleString()}{" "}
                      <span className="text-xs font-bold text-[#2bccaf]">
                        แห่ง (
                        {competitorAnalysis.all.length > 0
                          ? Math.round(
                              (competitorAnalysis.hasWebList.length /
                                competitorAnalysis.all.length) *
                                100
                            )
                          : 0}
                        %)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      คลินิกเหล่านี้กำลังดึงคนไข้ที่ค้นหาผ่าน Google ในพื้นที่นี้
                    </p>
                  </div>

                  <div className="glass-card-3d rounded-3xl p-4 md:p-5 border-rose-400/35">
                    <div className="text-xs font-extrabold text-rose-300 flex items-center justify-between">
                      <span>ยังไม่มีเว็บ / ใช้แค่ FB หรือ LINE</span>
                      <GlobeLock className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-3xl font-black text-rose-300 mt-1.5">
                      {(
                        competitorAnalysis.noWebList.length +
                        competitorAnalysis.fbLineList.length
                      ).toLocaleString()}{" "}
                      <span className="text-xs font-bold text-rose-400">
                        แห่ง
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      ไม่มีเว็บ {competitorAnalysis.noWebList.length} แห่ง • ใช้แค่เพจ/Line{" "}
                      {competitorAnalysis.fbLineList.length} แห่ง
                    </p>
                  </div>
                </div>

                {/* Side-by-Side Comparison + High-Impact Review Multiplier 3D Hologram Banner */}
                <div className="glass-card-3d rounded-3xl p-5 md:p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
                      <Swords className="w-5 h-5 text-[#2bccaf]" />
                      เปรียบเทียบคลินิกของลูกค้า กับ คู่แข่งที่มีเว็บไซต์ในพื้นที่เดียวกัน
                    </h4>
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 shadow-[0_0_12px_rgba(43,204,175,0.3)]">
                      🔥 จุดขายสำคัญใช้ปิดการขาย
                    </span>
                  </div>

                  {/* HIGH-IMPACT HERO BANNER: Average Reviews With Website vs Without Website */}
                  {(() => {
                    const hasWebAvg = competitorAnalysis.avgReviewsHasWeb;
                    const noWebAvg = competitorAnalysis.avgReviewsNoWeb;
                    const multiplier =
                      noWebAvg > 0
                        ? (hasWebAvg / noWebAvg).toFixed(1)
                        : hasWebAvg > 0
                        ? "5.0"
                        : "1.0";
                    const maxVal = Math.max(hasWebAvg, noWebAvg, 1);
                    const hasWebBarPct = Math.max(
                      12,
                      Math.round((hasWebAvg / maxVal) * 100)
                    );
                    const noWebBarPct = Math.max(
                      8,
                      Math.round((noWebAvg / maxVal) * 100)
                    );

                    return (
                      <div className="rounded-3xl bg-gradient-to-br from-[#061524] via-[#0c292c] to-[#05101d] text-white p-5 md:p-6 shadow-[0_20px_45px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-[#2bccaf]/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2bccaf]/25">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-[#2bccaf]/20 text-[#6fffe9] text-xs font-extrabold mb-1.5 border border-[#2bccaf]/40">
                              <TrendingUp className="w-3.5 h-3.5" />
                              สถิติพิสูจน์ผลลัพธ์จากคนไข้จริงในพื้นที่นี้
                            </div>
                            <h5 className="text-base md:text-lg font-black text-white">
                              ยอดรีวิวเฉลี่ยของคลินิกที่มีเว็บไซต์ vs คลินิกที่ไม่มีเว็บไซต์
                            </h5>
                            <p className="text-xs text-slate-300 mt-0.5">
                              ยอดรีวิวบน Google สะท้อนถึงจำนวนคนไข้จริงที่ค้นหาเจอคลินิกและเข้ามาใช้บริการ
                            </p>
                          </div>

                          {hasWebAvg > noWebAvg && noWebAvg > 0 && (
                            <div className="btn-neon-3d px-5 py-3 rounded-2xl text-center shrink-0">
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#041f1b]">
                                คลินิกที่มีเว็บมีคนไข้รีวิวมากกว่าถึง
                              </div>
                              <div className="text-2xl md:text-3xl font-black leading-none mt-0.5 text-[#041f1b]">
                                {multiplier} เท่า!
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Visual Bar Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                          {/* Has Website Box */}
                          <div className="bg-[#2bccaf]/15 border-2 border-[#2bccaf] rounded-2xl p-4 shadow-[0_0_25px_rgba(43,204,175,0.2)]">
                            <div className="flex items-center justify-between text-xs font-extrabold text-[#6fffe9] mb-1">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#2bccaf]" />
                                คลินิกที่มีเว็บไซต์ ({competitorAnalysis.hasWebList.length} แห่ง)
                              </span>
                              <span className="px-2 py-0.5 rounded bg-[#2bccaf] text-[#041f1b] text-[10px] font-black">
                                ชนะขาดลอย
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2 my-2">
                              <span className="text-3xl md:text-4xl font-black text-[#6fffe9] drop-shadow-[0_0_12px_rgba(43,204,175,0.6)]">
                                {hasWebAvg.toLocaleString()}
                              </span>
                              <span className="text-xs font-bold text-[#2bccaf]">
                                รีวิว / คลินิก (ค่าเฉลี่ย)
                              </span>
                            </div>
                            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-[#2bccaf]/30">
                              <div
                                className="h-full bg-gradient-to-r from-[#2bccaf] to-[#6fffe9] rounded-full shadow-[0_0_12px_#2bccaf] transition-all duration-500"
                                style={{ width: `${hasWebBarPct}%` }}
                              />
                            </div>
                          </div>

                          {/* No Website Box */}
                          <div className="bg-white/5 border border-rose-400/35 rounded-2xl p-4">
                            <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-1">
                              <span className="flex items-center gap-1.5">
                                <GlobeLock className="w-4 h-4 text-rose-400" />
                                คลินิกที่ไม่มีเว็บไซต์ ({competitorAnalysis.noWebList.length} แห่ง)
                              </span>
                              <span className="text-[11px] text-slate-400">
                                เสียเปรียบการค้นหา
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2 my-2">
                              <span className="text-3xl md:text-4xl font-black text-rose-300">
                                {noWebAvg.toLocaleString()}
                              </span>
                              <span className="text-xs font-normal text-slate-300">
                                รีวิว / คลินิก (ค่าเฉลี่ย)
                              </span>
                            </div>
                            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                              <div
                                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                style={{ width: `${noWebBarPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Sales Script Punchline */}
                        <div className="mt-4 pt-3.5 border-t border-[#2bccaf]/20 flex items-start gap-2.5 text-xs text-slate-200">
                          <MessageSquareQuote className="w-4 h-4 text-[#2bccaf] shrink-0 mt-0.5" />
                          <p className="italic leading-relaxed">
                            <span className="font-extrabold text-[#2bccaf] not-italic">
                              ประโยคใช้พูดปิดการขายทันที:{" "}
                            </span>
                            “คุณหมอดูตัวเลขจริงในพื้นที่นี้เลยครับ คลินิกคู่แข่งที่มีเว็บไซต์มีคนไข้รีวิวเฉลี่ยสูงถึง{" "}
                            <span className="font-black text-[#6fffe9] underline not-italic">
                              {hasWebAvg.toLocaleString()} รีวิว
                            </span>{" "}
                            ในขณะที่คลินิกที่ไม่มีเว็บไซต์มีเฉลี่ยแค่{" "}
                            <span className="font-bold text-rose-300 not-italic">
                              {noWebAvg.toLocaleString()} รีวิว
                            </span>{" "}
                            {hasWebAvg > noWebAvg && noWebAvg > 0
                              ? `(ต่างกันถึง ${multiplier} เท่า!) `
                              : ""}
                            เพราะคนไข้เวลาค้นหาบน Google เขาคลิกเข้าเว็บไซต์ที่ดูน่าเชื่อถือก่อนเสมอครับ”
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Customer Clinic Box */}
                    <div className="bg-[#071324]/90 rounded-2xl p-4 border border-white/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate pr-2">
                          ของลูกค้า: {selectedTargetClinic.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200 font-semibold shrink-0">
                          คลินิกลูกค้า
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-slate-400">สถานะเว็บไซต์:</span>
                        <span
                          className={`font-bold ${
                            targetStatusType === "has_web"
                              ? "text-[#2bccaf]"
                              : "text-rose-400"
                          }`}
                        >
                          {selectedTargetClinic.websiteStatus || "ไม่มีเว็บไซต์"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">
                          คะแนน & จำนวนรีวิว Google ของลูกค้า:
                        </span>
                        <span className="font-bold text-white">
                          ⭐ {selectedTargetClinic.rating || "-"} (
                          {selectedTargetClinic.reviewCount?.toLocaleString() ||
                            0}{" "}
                          รีวิว)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ลิงก์ปัจจุบัน:</span>
                        {selectedTargetClinic.websiteOrLine ? (
                          <a
                            href={selectedTargetClinic.websiteOrLine}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2bccaf] hover:underline font-medium truncate max-w-[180px]"
                          >
                            {selectedTargetClinic.websiteOrLine}
                          </a>
                        ) : (
                          <span className="text-rose-400 font-medium">
                            ไม่มีลิงก์เว็บไซต์บน Google Maps
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Competitors with Websites Box */}
                    <div className="bg-[#2bccaf]/15 rounded-2xl p-4 border border-[#2bccaf]/45 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#6fffe9]">
                          คู่แข่งที่มีเว็บไซต์แล้ว ({competitorAnalysis.hasWebList.length} แห่ง)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#2bccaf] text-[#041f1b] font-bold shrink-0">
                          คู่แข่งที่มีเว็บ
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#2bccaf]/30">
                        <span className="text-slate-200">
                          ความได้เปรียบบน Google:
                        </span>
                        <span className="font-extrabold text-[#6fffe9]">
                          ติดหน้าแรก SEO + ยิง Google Ads ได้ทันที
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-200 pt-1 leading-relaxed">
                        💡 สามารถกดปุ่ม <b className="text-[#6fffe9]">“เปิดดูเว็บคู่แข่ง”</b> ในตารางด้านล่าง เพื่อเปิดหน้าเว็บไซต์ของคลินิกคู่แข่งในพื้นที่ให้ลูกค้าดูเทียบสดๆ ได้เลย
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table of Competitors in the Area */}
                <div className="glass-card-3d rounded-3xl overflow-hidden">
                  <div className="bg-[#071527]/90 px-4 py-3.5 border-b border-[#2bccaf]/25 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCompetitorTab("has_web")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                          competitorTab === "has_web"
                            ? "btn-neon-3d"
                            : "bg-white/5 text-slate-300 border border-white/15 hover:border-[#2bccaf]/40"
                        }`}
                      >
                        เฉพาะคู่แข่งที่มีเว็บไซต์ ({competitorAnalysis.hasWebList.length})
                      </button>
                      <button
                        onClick={() => setCompetitorTab("all")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                          competitorTab === "all"
                            ? "btn-neon-3d"
                            : "bg-white/5 text-slate-300 border border-white/15 hover:border-[#2bccaf]/40"
                        }`}
                      >
                        คู่แข่งทั้งหมดในพื้นที่ ({competitorAnalysis.all.length})
                      </button>
                    </div>
                    <span className="text-[11px] text-[#2bccaf] font-semibold">
                      เรียงตามระยะทางใกล้คลินิกลูกค้ามากที่สุด
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-[#08172b] border-b border-[#2bccaf]/25 text-[#2bccaf] uppercase">
                        <tr>
                          <th className="py-3 px-4 font-extrabold">ชื่อคลินิกคู่แข่ง</th>
                          <th className="py-3 px-3 font-extrabold">ระยะห่าง / พื้นที่</th>
                          <th className="py-3 px-3 font-extrabold">รีวิว Google</th>
                          <th className="py-3 px-3 font-extrabold">สถานะเว็บไซต์</th>
                          <th className="py-3 px-4 font-extrabold text-right">
                            เปิดดูเว็บไซต์คู่แข่ง
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2bccaf]/15">
                        {(competitorTab === "has_web"
                          ? competitorAnalysis.hasWebList
                          : competitorAnalysis.all
                        ).length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-slate-400"
                            >
                              ไม่พบคลินิกคู่แข่งในขอบเขตที่เลือก (ลองขยายขอบเขตเป็น อำเภอ หรือ จังหวัดเดียวกัน)
                            </td>
                          </tr>
                        ) : (
                          (competitorTab === "has_web"
                            ? competitorAnalysis.hasWebList
                            : competitorAnalysis.all
                          ).map(({ clinic, distanceKm }) => {
                            const st = classifyWebsiteStatus(clinic.websiteStatus);
                            return (
                              <tr
                                key={clinic.id}
                                className="hover:bg-[#2bccaf]/10 transition"
                              >
                                <td className="py-3 px-4 font-bold text-white max-w-[230px]">
                                  <div className="line-clamp-1">{clinic.name}</div>
                                  <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                                    {clinic.category}
                                  </div>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap text-slate-300">
                                  {distanceKm !== null ? (
                                    <span className="inline-flex items-center gap-1 font-bold text-[#2bccaf]">
                                      <Navigation className="w-3 h-3" />
                                      ห่าง {distanceKm.toFixed(1)} กม.
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                  <div className="text-[11px] text-slate-400">
                                    {clinic.district || clinic.province}
                                  </div>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  {clinic.rating ? (
                                    <span className="font-bold text-amber-300">
                                      ⭐ {clinic.rating}{" "}
                                      <span className="text-slate-400 font-normal">
                                        ({clinic.reviewCount?.toLocaleString()})
                                      </span>
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                      st === "has_web"
                                        ? "bg-[#2bccaf]/20 text-[#6fffe9] border-[#2bccaf]/50"
                                        : st === "fb_line"
                                        ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                                        : "bg-rose-500/20 text-rose-300 border-rose-400/40"
                                    }`}
                                  >
                                    {st === "has_web"
                                      ? "มีเว็บไซต์"
                                      : st === "fb_line"
                                      ? "FB / LINE"
                                      : "ไม่มีเว็บไซต์"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {clinic.websiteOrLine ? (
                                    <a
                                      href={clinic.websiteOrLine}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2bccaf]/20 hover:bg-[#2bccaf] text-[#6fffe9] hover:text-[#041f1b] border border-[#2bccaf]/45 font-bold transition"
                                    >
                                      เปิดดูเว็บคู่แข่ง
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </a>
                                  ) : (
                                    <span className="text-slate-500">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-12 border border-dashed border-[#2bccaf]/30 rounded-3xl text-slate-400 text-sm">
                คลิกเลือกคลินิกลูกค้าทางด้านซ้ายเพื่อเริ่มวิเคราะห์คู่แข่ง
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
