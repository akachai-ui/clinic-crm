"use client";

import { useState, useMemo, useEffect } from "react";
import { ClinicLead } from "@/types/clinic";
import { saveClinicDeltaUpdate } from "@/lib/clinics-cache";
import {
  Search,
  Phone,
  MapPin,
  ExternalLink,
  Star,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Save,
  Briefcase,
  Building2,
  Mail,
  Filter,
} from "lucide-react";

export const SALES_STATUS_OPTIONS = [
  { label: "ยังไม่ได้ติดต่อ", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { label: "ติดต่อแล้ว / รอติดตาม", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "สนใจ / ส่งใบเสนอราคา", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "ปิดการขายสำเร็จ", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "ไม่สนใจ / ติดต่อไม่ได้", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export function getSalesStatusBadgeStyle(status: string) {
  const found = SALES_STATUS_OPTIONS.find((s) => s.label === status);
  if (found) return found.color;
  if (status.includes("ยัง")) return "bg-slate-100 text-slate-700 border-slate-200";
  if (status.includes("สำเร็จ")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status.includes("สนใจ") && !status.includes("ไม่"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (status.includes("ไม่")) return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

interface SalesWorkspaceProps {
  clinics: ClinicLead[];
  onUpdateClinic: (id: string, updates: Partial<ClinicLead>) => void;
  selectedProvince?: string;
  selectedWebsiteStatus?: string;
  selectedCategory?: string;
}

export default function SalesWorkspace({
  clinics,
  onUpdateClinic,
  selectedProvince = "all",
  selectedWebsiteStatus = "all",
  selectedCategory = "all",
}: SalesWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSalesStatus, setSelectedSalesStatus] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Selected clinic for side detail drawer
  const [activeClinic, setActiveClinic] = useState<ClinicLead | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedSalesStatus,
    selectedDistrict,
    selectedProvince,
    selectedWebsiteStatus,
    selectedCategory,
  ]);

  // Reset district when province changes
  useEffect(() => {
    setSelectedDistrict("all");
  }, [selectedProvince]);

  // Available districts in current clinics set
  const districtOptions = useMemo(() => {
    const map: Record<string, number> = {};
    clinics.forEach((c) => {
      const d = (c.district || "").trim();
      if (d) map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [clinics]);

  // Sales status summary counts across current filtered clinics from Section 1
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    SALES_STATUS_OPTIONS.forEach((o) => (map[o.label] = 0));
    clinics.forEach((c) => {
      const st = c.salesStatus || "ยังไม่ได้ติดต่อ";
      map[st] = (map[st] || 0) + 1;
    });
    return map;
  }, [clinics]);

  // Apply Sales-level search, salesStatus, and district filter
  const salesFilteredClinics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return clinics.filter((c) => {
      const matchStatus =
        selectedSalesStatus === "all" ||
        (c.salesStatus || "ยังไม่ได้ติดต่อ") === selectedSalesStatus;
      const matchDistrict =
        selectedDistrict === "all" || (c.district || "") === selectedDistrict;
      if (!matchStatus || !matchDistrict) return false;

      if (!q) return true;
      return (
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        c.district?.toLowerCase().includes(q) ||
        c.province?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q)
      );
    });
  }, [clinics, searchQuery, selectedSalesStatus, selectedDistrict]);

  const totalPages = Math.max(1, Math.ceil(salesFilteredClinics.length / pageSize));
  const paginatedClinics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return salesFilteredClinics.slice(start, start + pageSize);
  }, [salesFilteredClinics, currentPage, pageSize]);

  // Update salesStatus in Firestore (delta collection + main collection)
  const handleStatusChange = async (clinicId: string, newStatus: string) => {
    try {
      setUpdatingStatusId(clinicId);
      const updatedAt = new Date().toISOString();
      await saveClinicDeltaUpdate(clinicId, { salesStatus: newStatus, updatedAt });
      onUpdateClinic(clinicId, { salesStatus: newStatus, updatedAt });
      if (activeClinic?.id === clinicId) {
        setActiveClinic((prev) =>
          prev ? { ...prev, salesStatus: newStatus, updatedAt } : null
        );
      }
    } catch (err) {
      console.error("Failed to update salesStatus:", err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Save sales notes in Firestore (delta collection + main collection)
  const handleSaveNote = async () => {
    if (!activeClinic) return;
    try {
      setSavingNote(true);
      const updatedAt = new Date().toISOString();
      await saveClinicDeltaUpdate(activeClinic.id, { notes: noteInput, updatedAt });
      onUpdateClinic(activeClinic.id, { notes: noteInput, updatedAt });
      setActiveClinic((prev) =>
        prev ? { ...prev, notes: noteInput, updatedAt } : null
      );
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  const openDetailDrawer = (clinic: ClinicLead) => {
    setActiveClinic(clinic);
    setNoteInput(clinic.notes || "");
  };

  return (
    <section className="space-y-6">
      {/* Sales Pipeline Summary Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                ข้อมูลรายละเอียดสำหรับฝ่ายขาย (หน้าที่ 2 — Sales CRM)
              </h2>
              <p className="text-sm text-slate-500">
                ค้นหารายชื่อ โทรติดต่อ เปิดลิงก์เพจ/แผนที่ อัปเดตสถานะการขาย และบันทึกโน้ตการคุยกับลูกค้า
              </p>
            </div>
          </div>

          {/* Active Context Badges from Section 1 */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {selectedWebsiteStatus !== "all" && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                เว็บ: {selectedWebsiteStatus}
              </span>
            )}
            {selectedProvince !== "all" && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                จังหวัด: {selectedProvince}
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium max-w-[220px] truncate">
                ประเภท: {selectedCategory}
              </span>
            )}
          </div>
        </div>

        {/* Pipeline Status Filter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          <button
            onClick={() => setSelectedSalesStatus("all")}
            className={`p-3.5 rounded-xl border text-left transition ${
              selectedSalesStatus === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className="text-xs opacity-80 font-medium">สถานะทั้งหมด</div>
            <div className="text-xl font-bold mt-1">
              {clinics.length.toLocaleString()}
            </div>
          </button>

          {SALES_STATUS_OPTIONS.map((opt) => {
            const count = statusCounts[opt.label] || 0;
            const isSelected = selectedSalesStatus === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() =>
                  setSelectedSalesStatus(isSelected ? "all" : opt.label)
                }
                className={`p-3.5 rounded-xl border text-left transition ${
                  isSelected
                    ? "ring-2 ring-indigo-600 bg-indigo-50/60 border-indigo-500"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs text-slate-500 font-medium truncate">
                  {opt.label}
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {count.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search & District Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-5">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อคลินิก, เบอร์โทร, ที่อยู่, อำเภอ หรือบันทึกโน้ต..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="all">
                ทุกอำเภอ/เขต ({districtOptions.length} พื้นที่)
              </option>
              {districtOptions.map(([dist, cnt]) => (
                <option key={dist} value={dist}>
                  {dist} ({cnt.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value={25}>แสดง 25 รายการ</option>
              <option value={50}>แสดง 50 รายการ</option>
              <option value={100}>แสดง 100 รายการ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-800">
            รายชื่อคลินิกสำหรับฝ่ายขาย ({salesFilteredClinics.length.toLocaleString()} รายการ)
          </div>
          <div className="text-xs text-slate-500">
            หน้า {currentPage} จาก {totalPages}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">คลินิก / ประเภท</th>
                <th className="py-3.5 px-4 font-semibold">พื้นที่</th>
                <th className="py-3.5 px-4 font-semibold">เบอร์โทรติดต่อ</th>
                <th className="py-3.5 px-4 font-semibold">ช่องทางออนไลน์</th>
                <th className="py-3.5 px-4 font-semibold">รีวิว</th>
                <th className="py-3.5 px-4 font-semibold">สถานะการขาย (อัปเดตทันที)</th>
                <th className="py-3.5 px-4 font-semibold text-right">รายละเอียด / โน้ต</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedClinics.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลคลินิกตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                paginatedClinics.map((clinic) => (
                  <tr
                    key={clinic.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Clinic Name & Category */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <button
                        onClick={() => openDetailDrawer(clinic)}
                        className="font-semibold text-slate-900 hover:text-indigo-600 text-left line-clamp-1 transition"
                      >
                        {clinic.name}
                      </button>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {clinic.category}
                      </div>
                      {clinic.notes && (
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] max-w-full truncate">
                          <MessageSquare className="w-3 h-3 shrink-0" />
                          <span className="truncate">{clinic.notes}</span>
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div className="font-medium text-slate-800">
                        {clinic.province || "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {clinic.district || "-"}
                        {clinic.subdistrict ? ` • ${clinic.subdistrict}` : ""}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {clinic.phone ? (
                        <a
                          href={`tel:${clinic.phone}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {clinic.phone}
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">ไม่มีเบอร์โทร</span>
                      )}
                    </td>

                    {/* Website Status & Links */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-slate-700 mb-1">
                        {clinic.websiteStatus || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        {clinic.websiteOrLine && (
                          <a
                            href={clinic.websiteOrLine}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium"
                          >
                            <Globe className="w-3 h-3" />
                            เว็บ/เพจ
                          </a>
                        )}
                        {clinic.googleMapsUrl && (
                          <a
                            href={clinic.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium"
                          >
                            <MapPin className="w-3 h-3" />
                            แผนที่
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Rating & Reviews */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {clinic.rating ? (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {clinic.rating}
                          <span className="text-slate-400 font-normal">
                            ({clinic.reviewCount?.toLocaleString() || 0})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* Quick Sales Status Selector */}
                    <td className="py-3.5 px-4">
                      <select
                        disabled={updatingStatusId === clinic.id}
                        value={clinic.salesStatus || "ยังไม่ได้ติดต่อ"}
                        onChange={(e) =>
                          handleStatusChange(clinic.id, e.target.value)
                        }
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${getSalesStatusBadgeStyle(
                          clinic.salesStatus || "ยังไม่ได้ติดต่อ"
                        )}`}
                      >
                        {SALES_STATUS_OPTIONS.map((opt) => (
                          <option
                            key={opt.label}
                            value={opt.label}
                            className="bg-white text-slate-800"
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openDetailDrawer(clinic)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        ข้อมูล / โน้ต
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            แสดง{" "}
            <span className="font-semibold text-slate-700">
              {salesFilteredClinics.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            ถึง{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, salesFilteredClinics.length)}
            </span>{" "}
            จากทั้งหมด{" "}
            <span className="font-semibold text-slate-700">
              {salesFilteredClinics.length.toLocaleString()}
            </span>{" "}
            รายการ
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
              ก่อนหน้า
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer for Sales Rep */}
      {activeClinic && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 mb-2">
                    {activeClinic.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {activeClinic.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveClinic(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector inside Drawer */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  สถานะการขาย (Sales Status)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SALES_STATUS_OPTIONS.map((opt) => {
                    const isSelected =
                      (activeClinic.salesStatus || "ยังไม่ได้ติดต่อ") === opt.label;
                    return (
                      <button
                        key={opt.label}
                        onClick={() =>
                          handleStatusChange(activeClinic.id, opt.label)
                        }
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                          isSelected
                            ? `${opt.color} ring-2 ring-indigo-500/30`
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">เบอร์โทรศัพท์:</span>
                  {activeClinic.phone ? (
                    <a
                      href={`tel:${activeClinic.phone}`}
                      className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {activeClinic.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">อีเมล:</span>
                  {activeClinic.email ? (
                    <a
                      href={`mailto:${activeClinic.email}`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline text-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {activeClinic.email}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">สถานะเว็บไซต์:</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {activeClinic.websiteStatus || "-"}
                  </span>
                </div>

                {activeClinic.websiteOrLine && (
                  <div className="pt-2 border-t border-slate-200/70">
                    <span className="text-slate-500 text-xs block mb-1">
                      ลิงก์เว็บไซต์ / Facebook / Line:
                    </span>
                    <a
                      href={activeClinic.websiteOrLine}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline break-all font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {activeClinic.websiteOrLine}
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-slate-500 text-xs block mb-1">
                    ที่อยู่เต็ม ({activeClinic.province} • {activeClinic.district}):
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeClinic.address || "-"}
                  </p>
                  {activeClinic.googleMapsUrl && (
                    <a
                      href={activeClinic.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      เปิดดูพิกัดใน Google Maps
                    </a>
                  )}
                </div>
              </div>

              {/* Sales Notes Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  บันทึกฝ่ายขาย / โน้ตการติดต่อ (Sales Notes)
                </label>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="จดบันทึกรายละเอียดการคุย ชื่อผู้ติดต่อ เวลาที่สะดวกให้โทรกลับ หรือข้อเสนอที่ลูกค้าสนใจ..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[11px] text-slate-400">
                    {activeClinic.updatedAt
                      ? `อัปเดตล่าสุด: ${new Date(activeClinic.updatedAt).toLocaleString("th-TH")}`
                      : ""}
                  </span>
                  <button
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingNote ? "กำลังบันทึก..." : "บันทึกโน้ต"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveClinic(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                ปิดหน้าต่างนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
