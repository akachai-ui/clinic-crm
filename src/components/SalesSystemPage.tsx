"use client";

import { useState, useMemo, useEffect } from "react";
import { ClinicLead } from "@/types/clinic";
import { saveClinicDeltaUpdate } from "@/lib/clinics-cache";
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
  User,
  Users,
  FileText,
  Save,
  Check,
  X,
  ClipboardEdit,
  Clock,
  Loader2,
  Calendar,
  CalendarClock,
  AlertCircle,
  Bell,
  BellRing,
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

// Helper to format short Thai date (e.g. 29 ต.ค. 69)
function formatThaiDateShort(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export type FollowUpUrgency =
  | "overdue"
  | "today"
  | "tomorrow"
  | "approaching"
  | "upcoming"
  | "none";

export interface FollowUpInfo {
  urgency: FollowUpUrgency;
  diffDays: number;
  label: string;
}

// Helper to check detailed follow-up reminder info
function getClinicFollowUpInfo(dateStr?: string): FollowUpInfo {
  if (!dateStr) return { urgency: "none", diffDays: 9999, label: "" };
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        urgency: "overdue",
        diffDays,
        label: `เลยกำหนด ${Math.abs(diffDays)} วัน`,
      };
    }
    if (diffDays === 0) {
      return {
        urgency: "today",
        diffDays: 0,
        label: "ถึงกำหนดวันนี้!",
      };
    }
    if (diffDays === 1) {
      return {
        urgency: "tomorrow",
        diffDays: 1,
        label: "นัดหมายพรุ่งนี้!",
      };
    }
    if (diffDays <= 3) {
      return {
        urgency: "approaching",
        diffDays,
        label: `ใกล้ถึงนัด (อีก ${diffDays} วัน)`,
      };
    }
    return {
      urgency: "upcoming",
      diffDays,
      label: `นัดติดตาม ${formatThaiDateShort(dateStr)}`,
    };
  } catch {
    return { urgency: "upcoming", diffDays: 999, label: dateStr };
  }
}

const SALES_STATUS_OPTIONS = [
  {
    label: "ยังไม่ได้ติดต่อ",
    color: "bg-slate-700/70 text-slate-300 border-slate-600/60",
    dot: "bg-slate-400",
  },
  {
    label: "โทรแล้ว / รอตัดสินใจ",
    color: "bg-amber-500/20 text-amber-300 border-amber-400/50",
    dot: "bg-amber-400",
  },
  {
    label: "สนใจ / นัดส่งใบเสนอราคา",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/50",
    dot: "bg-cyan-400",
  },
  {
    label: "ปิดการขายสำเร็จ (ทำเว็บ)",
    color: "bg-[#2bccaf]/25 text-[#6fffe9] border-[#2bccaf]",
    dot: "bg-[#2bccaf]",
  },
  {
    label: "ไม่สนใจ",
    color: "bg-rose-500/20 text-rose-300 border-rose-400/50",
    dot: "bg-rose-400",
  },
];

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

  // Section 3: CRM Recording Modal States
  const [editingClinic, setEditingClinic] = useState<ClinicLead | null>(null);
  const [formContact1, setFormContact1] = useState<string>("");
  const [formContact2, setFormContact2] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");
  const [formSalesStatus, setFormSalesStatus] = useState<string>("ยังไม่ได้ติดต่อ");
  const [formNextFollowUp, setFormNextFollowUp] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Section 4: Reminders Notification & Filter States
  const [showRemindersModal, setShowRemindersModal] = useState<boolean>(false);
  const [filterFollowUpOnly, setFilterFollowUpOnly] = useState<boolean>(false);
  const [remindersTab, setRemindersTab] = useState<"urgent" | "all" | "overdue" | "today">("urgent");

  // Fast shortcut to set follow-up date (e.g. +1, +3, +7 days from today)
  const setFollowUpDaysFromNow = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setFormNextFollowUp(`${yyyy}-${mm}-${dd}`);
  };

  // Lock background scroll when CRM modal or Reminders modal is open
  useEffect(() => {
    if (editingClinic || showRemindersModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [editingClinic, showRemindersModal]);

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

  // Pre-calculate follow-up reminders across all clinics
  const followUpReminders = useMemo(() => {
    return clinics
      .filter((c) => Boolean(c.nextFollowUpDate))
      .map((c) => ({
        clinic: c,
        info: getClinicFollowUpInfo(c.nextFollowUpDate),
      }))
      .sort((a, b) => a.info.diffDays - b.info.diffDays);
  }, [clinics]);

  const urgentReminders = useMemo(() => {
    return followUpReminders.filter((r) => r.info.diffDays <= 3);
  }, [followUpReminders]);

  const overdueReminders = useMemo(() => {
    return followUpReminders.filter((r) => r.info.urgency === "overdue");
  }, [followUpReminders]);

  const todayReminders = useMemo(() => {
    return followUpReminders.filter((r) => r.info.urgency === "today");
  }, [followUpReminders]);

  const approachingReminders = useMemo(() => {
    return followUpReminders.filter(
      (r) => r.info.urgency === "tomorrow" || r.info.urgency === "approaching"
    );
  }, [followUpReminders]);

  // 5. Final filtered clinics taking selected websiteStatus card + Search Query + Follow-up filter into account
  const finalFilteredClinics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return filteredByProvAndCat
      .filter((c) => {
        // Status filter
        if (selectedStatus !== "all") {
          const s = c.websiteStatus || "ไม่ระบุ";
          if (s !== selectedStatus) return false;
        }

        // Follow-up only filter
        if (filterFollowUpOnly && !c.nextFollowUpDate) {
          return false;
        }

        // Search query filter (Name, Phone, District, Contact Names, Notes)
        if (q) {
          const matchName = (c.name || "").toLowerCase().includes(q);
          const matchPhone = (c.phone || "").toLowerCase().includes(q);
          const matchDistrict = (c.district || "").toLowerCase().includes(q);
          const matchCategory = (c.category || "").toLowerCase().includes(q);
          const matchContact1 = (c.contactName1 || "").toLowerCase().includes(q);
          const matchContact2 = (c.contactName2 || "").toLowerCase().includes(q);
          const matchNotes = (c.notes || "").toLowerCase().includes(q);
          if (
            !matchName &&
            !matchPhone &&
            !matchDistrict &&
            !matchCategory &&
            !matchContact1 &&
            !matchContact2 &&
            !matchNotes
          ) {
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
  }, [filteredByProvAndCat, selectedStatus, searchQuery, sortBy, filterFollowUpOnly]);

  // Reset pagination when filters or search change
  useMemo(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedProvince, selectedCategory, selectedStatus, searchQuery, sortBy, filterFollowUpOnly]);

  const displayedClinics = useMemo(() => {
    return finalFilteredClinics.slice(0, visibleCount);
  }, [finalFilteredClinics, visibleCount]);

  // Open CRM Modal with clinic data
  const handleOpenCRMModal = (clinic: ClinicLead) => {
    setEditingClinic(clinic);
    setFormContact1(clinic.contactName1 || "");
    setFormContact2(clinic.contactName2 || "");
    setFormNotes(clinic.notes || "");
    setFormSalesStatus(clinic.salesStatus || "ยังไม่ได้ติดต่อ");
    setFormNextFollowUp(clinic.nextFollowUpDate || "");
    setSaveSuccess(false);
  };

  // Close CRM Modal
  const handleCloseCRMModal = () => {
    setEditingClinic(null);
    setSaveSuccess(false);
  };

  // Save CRM Log to Firebase & State
  const handleSaveCRM = async () => {
    if (!editingClinic) return;
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      const updatedAt = new Date().toISOString();
      const updates: Partial<ClinicLead> = {
        contactName1: formContact1.trim(),
        contactName2: formContact2.trim(),
        notes: formNotes.trim(),
        salesStatus: formSalesStatus,
        nextFollowUpDate: formNextFollowUp.trim() ? formNextFollowUp.trim() : "",
        updatedAt,
      };

      // 1. Save to Firebase clinic_updates collection
      await saveClinicDeltaUpdate(editingClinic.id, updates);

      // 2. Optimistic update to parent state & IndexedDB
      if (onUpdateClinic) {
        onUpdateClinic(editingClinic.id, updates);
      }

      // 3. Update current editing state
      setEditingClinic((prev) => (prev ? { ...prev, ...updates } : null));

      setSaveSuccess(true);
      const savedClinicName = editingClinic.name;

      // Close modal and bounce back to list after brief 500ms visual confirmation
      setTimeout(() => {
        setEditingClinic(null);
        setSaveSuccess(false);
        setToastMessage(`บันทึกข้อมูล "${savedClinicName}" เรียบร้อยแล้ว`);
        setTimeout(() => {
          setToastMessage(null);
        }, 3500);
      }, 500);
    } catch (err) {
      console.error("Failed to save CRM record:", err);
    } finally {
      setIsSaving(false);
    }
  };

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
    filterFollowUpOnly ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedProvince("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setFilterFollowUpOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* =========================================================================
          REMINDER CENTER BANNER: Follow-up Alerts (Overdue / Today / Approaching 1-3d)
         ========================================================================= */}
      {urgentReminders.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-gradient-to-r from-amber-950/40 via-[#071322]/95 to-rose-950/30 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          {/* Ambient Glow Orb */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            {/* Left: Icon & Alert Title & Badges */}
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <BellRing className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                    <span>แจ้งเตือนนัดหมายติดตามผล</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      {urgentReminders.length} คลินิกที่ต้องติดต่อ
                    </span>
                  </h3>
                </div>

                {/* Urgency Counter Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px]">
                  {overdueReminders.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      <AlertCircle className="w-2.5 h-2.5" />
                      เลยกำหนด {overdueReminders.length} คลินิก
                    </span>
                  )}
                  {todayReminders.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-200 border border-amber-400/60 font-bold animate-pulse">
                      <CalendarClock className="w-2.5 h-2.5 text-amber-300" />
                      ถึงกำหนดวันนี้ {todayReminders.length} คลินิก
                    </span>
                  )}
                  {approachingReminders.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/50 font-bold">
                      <Clock className="w-2.5 h-2.5" />
                      ใกล้ถึงนัด (1-3 วัน) {approachingReminders.length} คลินิก
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <button
                type="button"
                onClick={() => setFilterFollowUpOnly(!filterFollowUpOnly)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                  filterFollowUpOnly
                    ? "bg-[#2bccaf] text-slate-950 border-[#2bccaf] shadow-[0_0_15px_rgba(43,204,175,0.4)]"
                    : "bg-white/5 hover:bg-white/15 text-slate-200 border-white/10"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>{filterFollowUpOnly ? "แสดงทุกคลินิก" : "กรองในรายการ"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRemindersModal(true)}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>ดูคิวนัดหมาย ({urgentReminders.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
          SECTION 2: CLINIC LEADS LIST & CRM LOGGING TRIGGER
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
                placeholder="ค้นหาชื่อคลินิก, ผู้ติดต่อ, เบอร์..."
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

            {/* Bell Reminders Trigger Button */}
            <button
              type="button"
              onClick={() => setShowRemindersModal(true)}
              title="ดูรายการนัดหมายติดตามผล"
              className={`relative px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                urgentReminders.length > 0
                  ? "bg-amber-500/20 text-amber-200 border-amber-400/50 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">นัดติดตาม</span>
              {urgentReminders.length > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {urgentReminders.length}
                </span>
              )}
            </button>

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

              const currentSalesStatus =
                clinic.salesStatus || "ยังไม่ได้ติดต่อ";
              const statusCfg =
                SALES_STATUS_OPTIONS.find((o) => o.label === currentSalesStatus) ||
                SALES_STATUS_OPTIONS[0];

              const followUpInfo = getClinicFollowUpInfo(clinic.nextFollowUpDate);
              const hasCRMData =
                clinic.contactName1 ||
                clinic.contactName2 ||
                clinic.notes ||
                clinic.nextFollowUpDate;

              return (
                <div
                  key={clinic.id || index}
                  className="glass-card-3d rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-[#2bccaf]/60 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Info & Badges */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        {/* Sales Status Pill */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold ${statusCfg.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                          />
                          {currentSalesStatus}
                        </span>

                        {/* Scheduled Follow-up Badge (if set) */}
                        {clinic.nextFollowUpDate && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold ${
                              followUpInfo.urgency === "today"
                                ? "bg-amber-500/25 text-amber-200 border-amber-400/60 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                                : followUpInfo.urgency === "overdue"
                                ? "bg-rose-500/25 text-rose-200 border-rose-400/60 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                                : followUpInfo.urgency === "tomorrow"
                                ? "bg-orange-500/25 text-orange-200 border-orange-400/60 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                : followUpInfo.urgency === "approaching"
                                ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/50"
                                : "bg-cyan-500/20 text-cyan-200 border-cyan-400/40"
                            }`}
                          >
                            {followUpInfo.urgency === "today" ? (
                              <CalendarClock className="w-2.5 h-2.5 text-amber-300" />
                            ) : followUpInfo.urgency === "overdue" ? (
                              <AlertCircle className="w-2.5 h-2.5 text-rose-300" />
                            ) : followUpInfo.urgency === "tomorrow" ? (
                              <BellRing className="w-2.5 h-2.5 text-orange-300" />
                            ) : followUpInfo.urgency === "approaching" ? (
                              <Clock className="w-2.5 h-2.5 text-yellow-300" />
                            ) : (
                              <Calendar className="w-2.5 h-2.5 text-cyan-300" />
                            )}
                            <span>
                              {followUpInfo.urgency === "today"
                                ? `⚡ ถึงกำหนดวันนี้! (${formatThaiDateShort(clinic.nextFollowUpDate)})`
                                : followUpInfo.urgency === "overdue"
                                ? `🚨 เลยกำหนด ${Math.abs(followUpInfo.diffDays)} วัน (${formatThaiDateShort(clinic.nextFollowUpDate)})`
                                : followUpInfo.urgency === "tomorrow"
                                ? `⏰ นัดพรุ่งนี้! (${formatThaiDateShort(clinic.nextFollowUpDate)})`
                                : followUpInfo.urgency === "approaching"
                                ? `⏰ ใกล้ถึงนัด (อีก ${followUpInfo.diffDays} วัน)`
                                : `นัดติดตาม ${formatThaiDateShort(clinic.nextFollowUpDate)}`}
                            </span>
                          </span>
                        )}

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

                      {/* Saved CRM Details Preview (If already logged) */}
                      {hasCRMData && (
                        <div className="mt-2 p-2 rounded-xl bg-[#06101c]/80 border border-[#2bccaf]/25 text-xs space-y-1.5">
                          <div className="flex flex-wrap items-center gap-3 text-[11px]">
                            {clinic.contactName1 && (
                              <span className="inline-flex items-center gap-1 text-[#6fffe9] font-semibold">
                                <User className="w-3 h-3 text-[#2bccaf]" />
                                <strong>ผู้ติดต่อ 1:</strong> {clinic.contactName1}
                              </span>
                            )}
                            {clinic.contactName2 && (
                              <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                                <Users className="w-3 h-3 text-cyan-400" />
                                <strong>ผู้ติดต่อ 2:</strong> {clinic.contactName2}
                              </span>
                            )}
                            {clinic.nextFollowUpDate && (
                              <span
                                className={`inline-flex items-center gap-1 font-bold ${
                                  followUpInfo.urgency === "today"
                                    ? "text-amber-300 animate-pulse"
                                    : followUpInfo.urgency === "overdue"
                                    ? "text-rose-300"
                                    : followUpInfo.urgency === "tomorrow"
                                    ? "text-orange-300"
                                    : followUpInfo.urgency === "approaching"
                                    ? "text-yellow-300"
                                    : "text-cyan-300"
                                }`}
                              >
                                <CalendarClock className="w-3 h-3 text-[#2bccaf]" />
                                <strong>นัดติดตาม:</strong>{" "}
                                {formatThaiDateShort(clinic.nextFollowUpDate)}
                                {followUpInfo.urgency === "today" && " (⚡ ถึงกำหนดวันนี้!)"}
                                {followUpInfo.urgency === "overdue" && ` (🚨 เลยกำหนด ${Math.abs(followUpInfo.diffDays)} วัน)`}
                                {followUpInfo.urgency === "tomorrow" && " (⏰ นัดพรุ่งนี้!)"}
                                {followUpInfo.urgency === "approaching" && ` (⏰ อีก ${followUpInfo.diffDays} วัน)`}
                              </span>
                            )}
                          </div>
                          {clinic.notes && (
                            <p className="text-[11px] text-slate-300/90 line-clamp-1 italic">
                              📝 &ldquo;{clinic.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Quick Actions & Log CRM Trigger Button */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {/* One-Tap Phone Call Button */}
                      {clinic.phone && (
                        <a
                          href={`tel:${clinic.phone}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 font-bold text-xs transition-all active:scale-95"
                          title={`โทรหา ${clinic.name}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-[#2bccaf]" />
                          <span>{clinic.phone}</span>
                        </a>
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

                      {/* Main CRM Logging Action Button */}
                      <button
                        onClick={() => handleOpenCRMModal(clinic)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
                          hasCRMData
                            ? "bg-[#2bccaf]/20 hover:bg-[#2bccaf]/30 text-[#6fffe9] border border-[#2bccaf]/50"
                            : "btn-neon-3d"
                        }`}
                      >
                        <ClipboardEdit className="w-3.5 h-3.5" />
                        <span>{hasCRMData ? "แก้ไข CRM" : "บันทึกผล"}</span>
                      </button>
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

      {/* =========================================================================
          SECTION 3: CRM LOGGING MODAL / BOTTOM SHEET (Fixed Header & Sticky Footer)
         ========================================================================= */}
      {editingClinic && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={handleCloseCRMModal}
            aria-hidden="true"
          />

          {/* Modal Container: Fixed Height on Mobile, Pinned Header & Footer, Scrollable Body */}
          <div className="relative w-full sm:max-w-xl h-[88vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#2bccaf]/40 bg-[#081525] shadow-[0_-15px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-6 duration-250">
            {/* Top Drag Handle on Mobile */}
            <div className="pt-2.5 pb-1 sm:hidden flex justify-center bg-[#081525] shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-slate-600/70" />
            </div>

            {/* 1. PINNED MODAL HEADER (Always Visible) */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#2bccaf]/20 bg-[#081525] shrink-0 flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2bccaf]/15 border border-[#2bccaf]/30 text-[#2bccaf] text-[10px] sm:text-xs font-bold">
                  <ClipboardEdit className="w-3 h-3" />
                  บันทึกข้อมูลการติดต่อ (Sales CRM Log)
                </div>
                <h3 className="text-base sm:text-lg font-black text-white truncate leading-snug">
                  {editingClinic.name}
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                  <span className="text-[#6fffe9]">
                    {formatCategoryLabel(editingClinic.category || "")}
                  </span>
                  <span>•</span>
                  <span>
                    {editingClinic.district ? `${editingClinic.district}, ` : ""}
                    {editingClinic.province}
                  </span>
                </p>
              </div>

              {/* Close X Button */}
              <button
                onClick={handleCloseCRMModal}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all shrink-0"
                title="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. SCROLLABLE MIDDLE BODY (Effortless up/down touch scrolling) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3.5 sm:space-y-4">
              {/* Quick Call Action Strip */}
              {editingClinic.phone && (
                <div className="p-2.5 rounded-2xl bg-[#0d2238] border border-[#2bccaf]/30 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0">
                    <Phone className="w-4 h-4 text-[#2bccaf] shrink-0" />
                    <span className="hidden xs:inline">เบอร์คลินิก:</span>
                    <strong className="text-white font-mono truncate">
                      {editingClinic.phone}
                    </strong>
                  </div>
                  <a
                    href={`tel:${editingClinic.phone}`}
                    className="btn-neon-3d px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 active:scale-95 shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>โทรออกทันที</span>
                  </a>
                </div>
              )}

              {/* Form Field 1: Sales Status Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  สถานะการขาย (Sales Pipeline Status) <span className="text-[#2bccaf]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SALES_STATUS_OPTIONS.map((opt) => {
                    const isSel = formSalesStatus === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setFormSalesStatus(opt.label)}
                        className={`p-2 rounded-xl text-[11px] font-bold border text-left transition-all flex items-center gap-1.5 active:scale-95 ${
                          isSel
                            ? `${opt.color} ring-2 ring-[#2bccaf] shadow-md`
                            : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Field 2: Contact Name 1 */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <User className="w-3.5 h-3.5 text-[#2bccaf]" />
                  <span>ชื่อผู้ติดต่อ 1 (เจ้าของ / แพทย์ผู้มีอำนาจตัดสินใจ)</span>
                </label>
                <input
                  type="text"
                  value={formContact1}
                  onChange={(e) => setFormContact1(e.target.value)}
                  placeholder="เช่น นพ.สมชาย (เจ้าของคลินิก), หมอหญิง"
                  className="glass-input-3d w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Form Field 3: Contact Name 2 */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ชื่อผู้ติดต่อ 2 (ผู้จัดการคลินิก / ผู้ช่วย / เคาน์เตอร์)</span>
                </label>
                <input
                  type="text"
                  value={formContact2}
                  onChange={(e) => setFormContact2(e.target.value)}
                  placeholder="เช่น คุณเมย์ (ผู้จัดการคลินิก / นัดหมาย), พี่แนน"
                  className="glass-input-3d w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Form Field 4: Next Follow-up Date & Quick Shortcuts */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <CalendarClock className="w-3.5 h-3.5 text-[#2bccaf]" />
                    <span>วันที่ต้องติดตามรอบถัดไป (Next Follow-up)</span>
                  </label>
                  {formNextFollowUp && (
                    <button
                      type="button"
                      onClick={() => setFormNextFollowUp("")}
                      className="text-[10px] text-rose-400 hover:text-rose-300 underline font-semibold transition-colors"
                    >
                      ล้างวันที่
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="date"
                    value={formNextFollowUp}
                    onChange={(e) => setFormNextFollowUp(e.target.value)}
                    className="glass-input-3d flex-1 px-3 py-2 rounded-xl text-xs text-white [color-scheme:dark] focus:outline-none focus:border-[#2bccaf]"
                  />
                  {/* Quick-tap date buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setFollowUpDaysFromNow(1)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#2bccaf]/20 hover:text-[#6fffe9] border border-white/10 hover:border-[#2bccaf]/40 text-[11px] font-bold text-slate-300 transition-all active:scale-95"
                    >
                      +1 วัน (พรุ่งนี้)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFollowUpDaysFromNow(3)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#2bccaf]/20 hover:text-[#6fffe9] border border-white/10 hover:border-[#2bccaf]/40 text-[11px] font-bold text-slate-300 transition-all active:scale-95"
                    >
                      +3 วัน
                    </button>
                    <button
                      type="button"
                      onClick={() => setFollowUpDaysFromNow(7)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#2bccaf]/20 hover:text-[#6fffe9] border border-white/10 hover:border-[#2bccaf]/40 text-[11px] font-bold text-slate-300 transition-all active:scale-95"
                    >
                      +7 วัน
                    </button>
                  </div>
                </div>

                {formNextFollowUp && (
                  <p className="text-[10px] text-cyan-300 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-[#2bccaf]" />
                    <span>นัดหมายวัน: {formatThaiDateShort(formNextFollowUp)}</span>
                  </p>
                )}
              </div>

              {/* Form Field 5: Details & Notes */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <FileText className="w-3.5 h-3.5 text-[#2bccaf]" />
                  <span>รายละเอียด (ผลการพูดคุย / ข้อตกลง / นัดหมายติดตามผล)</span>
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={4}
                  placeholder="บันทึกรายละเอียด เช่น สนใจทำเว็บไซต์แพ็กเกจ Pro นัดส่ง Proposal ทางไลน์วันศุกร์นี้..."
                  className="glass-input-3d w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Success Notification Banner */}
              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-[#2bccaf]/20 border border-[#2bccaf]/60 text-[#6fffe9] text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#2bccaf] shrink-0" />
                  <span>บันทึกข้อมูลผู้ติดต่อและรายละเอียดลงระบบเรียบร้อยแล้ว!</span>
                </div>
              )}
            </div>

            {/* 3. PINNED BOTTOM FOOTER (Always Visible, Never Cut Off) */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-white/10 bg-[#06101c]/98 backdrop-blur-md pb-safe shrink-0 flex items-center justify-between gap-3">
              <div className="text-[10px] text-slate-400 truncate">
                {editingClinic.updatedAt ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>อัปเดต: {new Date(editingClinic.updatedAt).toLocaleDateString("th-TH")}</span>
                  </span>
                ) : (
                  <span>ยังไม่มีประวัติ</span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseCRMModal}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all active:scale-95"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={handleSaveCRM}
                  disabled={isSaving}
                  className="btn-neon-3d px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950 stroke-[3]" />
                      <span>บันทึกสำเร็จ!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>บันทึกข้อมูล</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: FOLLOW-UP REMINDERS CENTER MODAL (ศูนย์แจ้งเตือนนัดหมายติดตามผล)
         ========================================================================= */}
      {showRemindersModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowRemindersModal(false)}
        >
          <div
            className="glass-panel-3d w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. PINNED MODAL HEADER */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-white/10 bg-[#06101c]/98 backdrop-blur-md shrink-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-white tracking-wide truncate">
                    ศูนย์แจ้งเตือนนัดหมายติดตามผล
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                    มี {followUpReminders.length} คลินิกที่มีนัดหมาย • {urgentReminders.length} รายการที่ต้องติดต่อด่วน
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRemindersModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-all shrink-0 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. PINNED FILTER TABS */}
            <div className="px-4 py-2 border-b border-white/10 bg-[#081526]/90 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setRemindersTab("urgent")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  remindersTab === "urgent"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>ด่วน (1-3 วัน & เลยกำหนด)</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    remindersTab === "urgent"
                      ? "bg-slate-950 text-amber-300"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {urgentReminders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRemindersTab("today")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  remindersTab === "today"
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>ถึงกำหนดวันนี้</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    remindersTab === "today"
                      ? "bg-slate-950 text-amber-300"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {todayReminders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRemindersTab("overdue")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  remindersTab === "overdue"
                    ? "bg-rose-500 text-white shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>เลยกำหนด</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    remindersTab === "overdue"
                      ? "bg-black/40 text-rose-200"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {overdueReminders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRemindersTab("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  remindersTab === "all"
                    ? "bg-[#2bccaf] text-slate-950 shadow-md"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>ทั้งหมด</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    remindersTab === "all"
                      ? "bg-slate-950 text-[#6fffe9]"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {followUpReminders.length}
                </span>
              </button>
            </div>

            {/* 3. SCROLLABLE REMINDERS LIST */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3 min-h-[220px]">
              {(() => {
                const list =
                  remindersTab === "urgent"
                    ? urgentReminders
                    : remindersTab === "today"
                    ? todayReminders
                    : remindersTab === "overdue"
                    ? overdueReminders
                    : followUpReminders;

                if (list.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6 text-[#2bccaf]" />
                      </div>
                      <p className="text-sm font-bold text-slate-300">
                        ไม่มีรายการนัดหมายในหมวดนี้
                      </p>
                      <p className="text-xs text-slate-500">
                        คุณติดตามผลคลินิกในหมวดนี้ครบถ้วนแล้ว
                      </p>
                    </div>
                  );
                }

                return list.map(({ clinic, info }) => (
                  <div
                    key={clinic.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-[#06101c]/90 border border-white/10 hover:border-[#2bccaf]/50 transition-all space-y-2 group"
                  >
                    {/* Top row: Urgency & Location */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black border ${
                          info.urgency === "today"
                            ? "bg-amber-500/25 text-amber-200 border-amber-400/60 animate-pulse"
                            : info.urgency === "overdue"
                            ? "bg-rose-500/25 text-rose-200 border-rose-400/60"
                            : info.urgency === "tomorrow"
                            ? "bg-orange-500/25 text-orange-200 border-orange-400/60"
                            : info.urgency === "approaching"
                            ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/50"
                            : "bg-cyan-500/20 text-cyan-200 border-cyan-400/40"
                        }`}
                      >
                        {info.urgency === "today" ? (
                          <CalendarClock className="w-3 h-3 text-amber-300" />
                        ) : info.urgency === "overdue" ? (
                          <AlertCircle className="w-3 h-3 text-rose-300" />
                        ) : info.urgency === "tomorrow" ? (
                          <BellRing className="w-3 h-3 text-orange-300" />
                        ) : (
                          <Calendar className="w-3 h-3 text-cyan-300" />
                        )}
                        <span>
                          {info.label} ({formatThaiDateShort(clinic.nextFollowUpDate)})
                        </span>
                      </span>

                      <span className="text-[10px] text-slate-400">
                        จ.{clinic.province}{" "}
                        {clinic.district ? `(${clinic.district})` : ""}
                      </span>
                    </div>

                    {/* Clinic Name & Category */}
                    <div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-[#6fffe9] transition-colors leading-snug">
                        {clinic.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatCategoryLabel(clinic.category || "")}
                      </p>
                    </div>

                    {/* Contacts & Notes Preview */}
                    {(clinic.contactName1 ||
                      clinic.contactName2 ||
                      clinic.notes) && (
                      <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-slate-300">
                          {clinic.contactName1 && (
                            <span className="inline-flex items-center gap-1 text-[#6fffe9]">
                              <User className="w-3 h-3 text-[#2bccaf]" />
                              <strong>{clinic.contactName1}</strong>
                            </span>
                          )}
                          {clinic.contactName2 && (
                            <span className="inline-flex items-center gap-1 text-slate-300">
                              <Users className="w-3 h-3 text-cyan-400" />
                              <span>{clinic.contactName2}</span>
                            </span>
                          )}
                        </div>
                        {clinic.notes && (
                          <p className="text-[11px] text-slate-400 italic line-clamp-1">
                            📝 &ldquo;{clinic.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {clinic.phone && (
                        <a
                          href={`tel:${clinic.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#2bccaf]" />
                          <span>{clinic.phone}</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowRemindersModal(false);
                          handleOpenCRMModal(clinic);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2bccaf]/20 hover:bg-[#2bccaf]/30 text-[#6fffe9] border border-[#2bccaf]/50 text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <ClipboardEdit className="w-3.5 h-3.5 text-[#2bccaf]" />
                        <span>บันทึก CRM</span>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* 4. PINNED FOOTER */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-white/10 bg-[#06101c]/98 backdrop-blur-md pb-safe shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilterFollowUpOnly(true);
                  setShowRemindersModal(false);
                }}
                className="text-xs text-[#6fffe9] hover:underline font-bold flex items-center gap-1"
              >
                <ListFilter className="w-3.5 h-3.5 text-[#2bccaf]" />
                <span>กรองคลินิกกลุ่มนี้ในหน้ารายการ</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRemindersModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast Notification when returned to main list */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 py-2.5 rounded-2xl bg-[#031d19]/95 text-[#6fffe9] border border-[#2bccaf]/70 shadow-[0_4px_25px_rgba(43,204,175,0.45)] backdrop-blur-md flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-[#2bccaf] shrink-0" />
          <span className="truncate max-w-[280px] sm:max-w-md">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
