"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Search,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Award,
  Users,
  Target,
  Presentation,
  MessageSquareQuote,
  Flame,
  ArrowRight,
  Smartphone,
  Laptop,
  HelpCircle,
  Zap,
  Share2,
  MessageCircle,
  Layers,
  Repeat,
  Activity,
  Rocket,
  Crown,
  MapPin,
  BarChart3,
  Bot,
  Cpu,
} from "lucide-react";

export default function SalesPresentationPage() {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);

  const totalSlides = 5; // Slide 1, 2, 3, 4, 5

  // Speaker notes & reference cheat sheet data per slide
  const speakerNotesData: Record<
    number,
    {
      title: string;
      script: string;
      cheatSheet?: {
        title: string;
        items: { label: string; desc: string }[];
      };
    }
  > = {
    1: {
      title: "บทพูดแนะนำสำหรับเปิดใจทันตแพทย์เจ้าของคลินิก (สไลด์ 01 - ทำไมต้องมีเว็บไซต์):",
      script:
        "“กราบเรียนคุณหมอครับ วันนี้ผมอยากชวนคุณหมอดูพฤติกรรมคนไข้ทันตกรรมในพื้นที่ปัจจุบันครับ สำหรับเคสหัตถการเฉพาะทาง เช่น รากฟันเทียม จัดฟันใส หรือวีเนียร์ งานวิจัยพฤติกรรมคนไข้ของ Google และ Dental Consumer Research พบว่าคนไข้กลุ่มนี้กว่า 90% จะไม่ตัดสินใจผ่านแชตในโซเชียลมีเดีย แต่จะค้นหาผ่าน Google เพื่อตรวจสอบประวัติทันตแพทย์ วุฒิบัตร และมาตรฐานคลินิกก่อนเสมอ เว็บไซต์จึงไม่ใช่แค่หน้าโปรโมท แต่คือ ‘หน้าร้านดิจิทัลทางการแพทย์’ ที่ช่วยคัดกรองคนไข้เคสใหญ่ และสร้างความไว้วางใจให้คลินิกของคุณหมอตลอด 24 ชั่วโมงครับ”",
      cheatSheet: {
        title: "💡 โพยลับสำหรับเซลล์: หากคุณหมอถามว่า แหล่งอ้างอิง [1] คือใคร?",
        items: [
          {
            label: "1. Think with Google",
            desc: "ฝ่ายวิจัยข้อมูลของ Google โดยตรง วิเคราะห์พฤติกรรมว่าคนไข้เสิร์ชหาอะไรและตรวจสอบประวัติคุณหมออย่างไรก่อนไปคลินิก",
          },
          {
            label: "2. PatientPop (Tebra)",
            desc: "แพลตฟอร์มซอฟต์แวร์คลินิกทันตกรรมระดับโลก สำรวจคนไข้ทำฟันเคสใหญ่ว่าทำไมถึงเลือกคลินิกที่มีเว็บไซต์ทางการ",
          },
          {
            label: "3. BrightLocal Research",
            desc: "สถาบันวิจัยการค้นหาแบบ Local Search (เช่น 'หมอฟัน ใกล้ฉัน') และการตัดสินใจจากรีวิวและความน่าเชื่อถือของคลินิก",
          },
        ],
      },
    },
    2: {
      title:
        "บทพูดแนะนำสำหรับตอบข้อโต้แย้ง 'มีเพจกับไลน์แล้ว ทำไมต้องมีเว็บ?' (สไลด์ 02 - เครื่องมือ 3 ประสาน):",
      script:
        "“กราบเรียนคุณหมอครับ คุณหมอหลายท่านมักถามผมว่า ‘คลินิกหมอมี Facebook เพจ กับ LINE OA อยู่แล้ว เว็บไซต์ยังจำเป็นอยู่ไหม?’ ผมขออนุญาตเปรียบเทียบให้เห็นภาพชัดๆ ครับ: Facebook เหมือน ‘ป้ายบิลบอร์ดริมทางด่วน’ ที่คอยกวักมือเรียกคนให้รู้จักคลินิก, ส่วน LINE OA เหมือน ‘ห้องคุยส่วนตัวหน้าเคาน์เตอร์’ ที่เอาไว้คุยปิดนัดและดูแลคนไข้ประจำครับ... แต่สิ่งที่ขาดไม่ได้เลยสำหรับเคสใหญ่ เช่น จัดฟันใส หรือ รากฟันเทียม คือ ‘เว็บไซต์’ ครับ เพราะเว็บไซต์คือ ‘ห้องตรวจประวัติและวุฒิบัตรของคุณหมอ’ ที่คนไข้จะเข้าไปตรวจเช็กเพื่อให้มั่นใจ 100% ก่อนจะยอมเปิดปากและตัดสินใจจ่ายเงินก้อนใหญ่ ถ้าไม่มีเว็บไซต์ คนไข้ที่ทัก FB หรือ LINE จะลังเลและหายไปง่ายมากครับ ดังนั้นคลินิกที่โตอย่างมั่นคงจึงต้องมีทั้ง 3 เครื่องมือทำงานเสริมกันครับ”",
      cheatSheet: {
        title: "💡 สรุปหน้าที่ 3 เครื่องมือให้เซลล์จำง่ายๆ (Dental Funnel):",
        items: [
          {
            label: "📢 FB / IG (ป้ายบิลบอร์ด)",
            desc: "ดึงดูดสายตาคนทั่วไปให้รู้จักชื่อคลินิก แต่ข้อมูลตกฟีดไว และคนยังไม่ได้ตัดสินใจรักษาทันที",
          },
          {
            label: "🏛️ Website (ห้องตรวจ & วุฒิบัตร)",
            desc: "สร้างความเชื่อมั่น 100% ให้คนไข้ยอมทำเคสใหญ่ ดักรับคนค้นหาจาก Google SEO ตลอด 24 ชม. ไม่ตกฟีด",
          },
          {
            label: "💬 LINE OA (ห้องปิดนัด & เคาน์เตอร์)",
            desc: "คุยปิดการนัดหมาย 1-on-1 และส่งข้อความเตือนนัดหมาย ดูแลให้กลับมาทำฟันต่อเนื่อง",
          },
        ],
      },
    },
    3: {
      title: "บทพูดแนะนำสำหรับเปิดใจคุณหมอเรื่อง SEO + AEO + GEO ในยุค AI (สไลด์ 03):",
      script:
        "“กราบเรียนคุณหมอครับ วันนี้พฤติกรรมการค้นหาของคนไข้เปลี่ยนไปเร็วกว่าที่เราคิดครับ ในอดีตคนไข้จะพิมพ์ค้นหาคีย์เวิร์ดสั้นๆ แบบ SEO เช่น 'จัดฟันใส สยาม' แต่ปัจจุบันคนไข้มีข้อสงสัยและค้นหาคำถามยาวขึ้น เป็นระบบ AEO เช่น 'จัดฟันใสเจ็บไหม กี่เดือนเห็นผล' และที่มาแรงและล้ำหน้าที่สุดในตอนนี้คือ 'GEO' ครับ คนไข้เริ่มหันไปเปิด ChatGPT หรือ Google Gemini แล้วถามตรงๆ ว่า 'ช่วยแนะนำคลินิกทำรากฟันเทียมในกรุงเทพฯ ที่คุณหมอเก่งและรีวิวดีให้หน่อย' ถ้าคลินิกไม่มีเว็บไซต์ที่มีมาตรฐานทางเทคนิคถูกต้อง AI จะมองไม่เห็นคลินิกของคุณหมอเลยครับ แต่โครงสร้างเว็บไซต์ที่เราสร้าง ออกแบบมารองรับทั้ง 3 ระบบ: ทำให้ Google หาเจอ (SEO), ดึงคำตอบไปโชว์บนสุด (AEO) และให้ AI ดึงชื่อคลินิกของคุณหมอไปแนะนำคนไข้เคสใหญ่ (GEO) ครับ”",
      cheatSheet: {
        title: "💡 สรุปย่อ 10 วินาทีสำหรับเซลล์ (SEO vs AEO vs GEO):",
        items: [
          {
            label: "🌐 1. SEO (ค้นหาเจอ)",
            desc: "คนไข้พิมพ์คำค้นหา เช่น 'รากฟันเทียม บางนา' ➔ เว็บไซต์ติดหน้าแรก Google",
          },
          {
            label: "💡 2. AEO (ตอบคำถามโดนใจ)",
            desc: "คนไข้ถามข้อกังวล เช่น 'จัดฟันใสเจ็บไหม' ➔ เว็บเราขึ้นเป็นกล่องคำตอบด่วนบนสุด",
          },
          {
            label: "🤖 3. GEO (AI แนะนำชื่อคลินิก)",
            desc: "คนไข้ถาม ChatGPT / Gemini ➔ AI ดึงชื่อคลินิกของคุณหมอไปพิมพ์แนะนำเป็นอันดับ 1",
          },
        ],
      },
    },
    4: {
      title: "บทพูดแนะนำสำหรับตอบคำถาม 'ทำไมคลินิกต้องใช้บริการ Google Ads?' (สไลด์ 04):",
      script:
        "“กราบเรียนคุณหมอครับ คุณหมอหลายท่านมักเคยมีประสบการณ์ยิงแอดใน Facebook แล้วเจอคนทักมาถามราคาเล่นๆ แล้วเงียบหาย หรือเคยลองยิง Google Ads เองแล้วพบว่างบรั่วไหลเร็วมาก... เหตุผลที่คลินิกทันตกรรมจำเป็นต้องใช้บริการ Google Ads จากผู้เชี่ยวชาญ มี 3 ข้อสำคัญครับ: ข้อแรกคือ ‘คุณภาพคนไข้’ ครับ คนที่เสิร์ช Google ไม่ใช่คนที่เล่นโซเชียลฆ่าเวลา แต่เป็นคนที่กำลังปวดฟัน หรือเตรียมงบพร้อมทำรากฟันเทียม/จัดฟันใสอยู่แล้ว จึงมีโอกาสปิดการรักษาได้สูงกว่ามาก... ข้อสองคือ ‘ความคุ้มค่าระดับทวีคูณ (ROI)’ สำหรับเคสใหญ่ ค่าแอดหลักพัน แต่ถ้าปิดเคสรากฟันเทียมได้แค่ 1-2 เคส ก็กำไรคุ้มทั้งเดือนแล้วครับ... และข้อสามคือ ‘การควบคุมงบไม่ให้รั่วไหล’ ด้วยการตัดคีย์เวิร์ดขยะออก และดูแลไม่ให้ผิดกฎหมาย พรบ.สถานพยาบาล เพื่อให้คลินิกของคุณหมอครองอันดับ 1 ในพื้นที่อย่างปลอดภัยและเห็นผลลัพธ์เป็นตัวเงินจริงครับ”",
      cheatSheet: {
        title: "💡 สรุป 3 จุดตายที่เซลล์ต้องเน้นย้ำกับคุณหมอ:",
        items: [
          {
            label: "🎯 1. High-Intent (คนไข้พร้อมรักษา)",
            desc: "ต่างจาก Facebook ที่ต้องสุ่ม แต่ Google ดักคนที่เสิร์ชหาหมอเพื่อรักษาจริงและพร้อมจ่าย",
          },
          {
            label: "💰 2. ROI มหาศาลในเคสใหญ่",
            desc: "เคสรากฟันเทียม/จัดฟันใส 35,000–100,000 บ. ยิงแอดปิดได้แค่ 1-2 เคสก็คุ้มค่าบริการทั้งเดือน",
          },
          {
            label: "🛡️ 3. ไม่ยิงเองเพราะงบรั่วไหล & เสี่ยงโดนแบน",
            desc: "ผู้เชี่ยวชาญช่วยตัดคำค้นหาขยะ (Negative Keywords) และคุมให้ถูกกฎโฆษณาแพทย์ 100%",
          },
        ],
      },
    },
    5: {
      title: "บทพูดแนะนำสำหรับนำเสนอแพ็กเกจราคาและการลงทุน (สไลด์ 05):",
      script:
        "“กราบเรียนคุณหมอครับ สำหรับแพ็กเกจการให้บริการ เราแบ่งตามเป้าหมายของคลินิกออกเป็น 3 ระดับครับ: สำหรับคลินิกที่ต้องการวางรากฐานโฉนดดิจิทัลและสร้างความน่าเชื่อถือทันที แพ็กเกจ Starter จะตอบโจทย์มาตรฐานทั้งหมดครับ... แต่แพ็กเกจที่คลินิกทันตกรรมส่วนใหญ่เลือกใช้และเห็นผลลัพธ์ชัดเจนที่สุด คือ ‘Professional Package’ ครับ เพราะรวมทั้งการสร้างเว็บ, การทำ SEO ติดหน้าแรก Google, และการยิง Google Ads ดักคนไข้เคสใหญ่ในพื้นที่ทันที... ซึ่งสำหรับเคสรากฟันเทียมหรือจัดฟันใส เพียงแค่แพ็กเกจนี้ช่วยคุณหมอปิดเคสได้เพิ่มเพียงเดือนละ 1-2 ราย ก็คุ้มทุนค่าบริการทั้งหมดและสร้างกำไรให้คลินิกทันทีครับ และสำหรับคลินิกที่ต้องการยึดครองอันดับ 1 ในพื้นที่แบบเบ็ดเสร็จ เราก็มีแพ็กเกจ Enterprise ดูแลแบบ Full-Ecosystem ครับ”",
      cheatSheet: {
        title: "💡 เทคนิคการนำเสนอราคาสำหรับเซลล์:",
        items: [
          {
            label: "⭐ ดัน Professional Package เป็นหลัก",
            desc: "เป็นแพ็กเกจยอดนิยมที่สุด (Sweet Spot) มีทั้ง Ads (ได้ยอดทันที) + SEO (ยั่งยืน)",
          },
          {
            label: "🦷 เปรียบเทียบกับมูลค่าเคสคนไข้",
            desc: "ย้ำเสมอว่า 'ปิดเคสรากฟันเทียม/จัดฟันใสได้แค่ 1-2 เคสต่อเดือน ก็คุ้มทุนค่าแพ็กเกจแล้ว'",
          },
          {
            label: "🤝 ย้ำเรื่องความปลอดภัย & ไร้สัญญาผูกมัด",
            desc: "ดูแลถูกกฎหมายโฆษณาแพทย์ 100% พร้อมรายงานผลทุกสัปดาห์อย่างโปร่งใส",
          },
        ],
      },
    },
  };

  // Keyboard navigation (Arrow keys & Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);



  const renderSlideContent = (slideIndex: number) => {
    switch (slideIndex) {
      case 1:
        return (
<div className="h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500 relative z-10 space-y-4 md:space-y-6    ">
              {/* Top Tag & Meta */}
              <div className="flex items-center justify-between border-b border-[#2bccaf]/20 pb-2.5 sm:pb-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/20 border border-[#2bccaf]/45 text-[#6fffe9] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(43,204,175,0.25)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#2bccaf]" />
                  SLIDE 01 • DENTAL PRACTICE GROWTH
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2bccaf] animate-ping" />
                  DENTAL CLINICAL EXCELLENCE
                </div>
              </div>

              {/* Hero Headline & Subtitle */}
              <div className="space-y-1.5 sm:space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-snug">
                  ทำไมคลินิกทันตกรรมยุคนี้...{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2bccaf] via-[#6fffe9] to-teal-200 drop-shadow-[0_0_25px_rgba(43,204,175,0.5)]">
                    ต้องมีเว็บไซต์ทางการแพทย์เป็นของตัวเอง?
                  </span>
                </h1>
                <p className="text-xs sm:text-sm md:text-[15px] text-slate-300 max-w-4xl font-normal leading-relaxed">
                  ในยุคที่คนไข้เคสหัตถการเฉพาะทาง (จัดฟันใส, รากฟันเทียม, วีเนียร์) กว่า <span className="text-[#6fffe9] font-black underline decoration-[#2bccaf]">90% ค้นหาประวัติทันตแพทย์และมาตรฐานคลินิกบน Google</span> ก่อนตัดสินใจนัดหมายรักษา <span className="text-[10px] text-[#2bccaf] font-mono align-super font-bold cursor-help" title="Think with Google (Healthcare Consumer Journey) & PatientPop Dental Survey">[1]</span>
                </p>
              </div>

              {/* Contrast Matrix: Social Media vs Official Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 print-grid-2 gap-3.5 sm:gap-4 md:gap-6 flex-1 items-stretch">
                {/* Left: Pain Point (Social Media Only) */}
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#180a12]/90 via-[#1e0d16]/90 to-[#12080d]/90 border border-rose-500/40 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center shrink-0 min-w-[36px] min-h-[36px]">
                          <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-400">
                            โมเดลเดิม • ข้อจำกัดทางทันตกรรม
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-lg font-black text-white">
                            พึ่งพาเฉพาะ Facebook เพจ หรือ LINE
                          </h3>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        แพลตฟอร์มเช่า
                      </span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs md:text-sm text-slate-300">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ค้นหาหัตถการเฉพาะทางบน Google ไม่เจอ:</b> คนไข้ที่ค้นหา <i>"รากฟันเทียม"</i>, <i>"จัดฟันใส"</i> จะไม่เจอเพจ หากไม่ทราบชื่อคลินิกตรงๆ</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ยากต่อการคัดกรองคนไข้เคสใหญ่:</b> คนไข้ในโซเชียลมักทักเทียบราคาหัตถการทั่วไป ต่างจากคนไข้ที่มีความพร้อมและตั้งใจรักษาจริง</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ความเสี่ยงกฎหมายโฆษณาทางการแพทย์:</b> เสี่ยงถูกอัลกอริทึมปิดกั้นคำทางการแพทย์ และ Reach เพจลดลงจนต้องจ่ายค่าแอดสูงขึ้น</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] sm:text-xs text-rose-300 font-semibold mt-2">
                    <span>ต้นทุนการตลาด</span>
                    <span className="font-black text-rose-400">ค่าแอดแพงขึ้น แต่ได้เคสใหญ่น้อย</span>
                  </div>
                </div>

                {/* Right: Solution (Official Medical Website) */}
                <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#061e22]/90 via-[#0a292e]/90 to-[#04161a]/90 border-2 border-[#2bccaf] shadow-[0_0_35px_rgba(43,204,175,0.25)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#2bccaf] text-[#041f1b] flex items-center justify-center font-black shadow-[0_0_15px_#2bccaf] shrink-0 min-w-[36px] min-h-[36px]">
                          <Laptop className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                        </div>
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#2bccaf]">
                            โมเดลใหม่ • คลินิกทันตกรรมมาตรฐาน
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-lg font-black text-white">
                            เว็บไซต์ทางการแพทย์ของคลินิกทันตกรรม
                          </h3>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-[#2bccaf] text-[#041f1b]">
                        สินทรัพย์ดิจิทัล 100%
                      </span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs md:text-sm text-slate-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ติดหน้าแรก Google คำค้นหาเฉพาะทาง (Dental SEO):</b> ดักรับคนไข้ในพื้นที่ที่ค้นหา <i>"จัดฟันใส บางนา"</i>, <i>"รากฟันเทียม ใกล้ฉัน"</i> ที่พร้อมเริ่มรักษา</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>สร้างความน่าเชื่อถือระดับสถาบันทันตกรรม:</b> แสดงประวัติทันตแพทย์เฉพาะทาง วุฒิบัตร มาตรฐานห้องสเตอร์ไรล์ และรีวิวเคสอย่างเป็นระบบ</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ระบบคัดกรอง & นัดหมายคนไข้เคสใหญ่ 24 ชม.:</b> ให้ข้อมูลหัตถการอย่างถูกต้อง ตารางตรวจแพทย์ และรับนัดหมายปรึกษาล่วงหน้าอย่างมืออาชีพ</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-[#2bccaf]/30 flex items-center justify-between text-[11px] sm:text-xs text-[#6fffe9] font-bold mt-2">
                    <span>ผลลัพธ์ระยะยาว</span>
                    <span className="font-black text-[#2bccaf] flex items-center gap-1">
                      ดึงดูดคนไข้เคสใหญ่ & ยั่งยืน <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Big Market Opportunity Punchline */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#071626] via-[#0b282c] to-[#061523] p-3 sm:p-4 md:p-5 border border-[#2bccaf]/50 flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#2bccaf] text-[#041f1b] flex items-center justify-center font-black text-base sm:text-xl md:text-2xl shadow-[0_0_18px_#2bccaf] shrink-0 min-w-[44px] min-h-[44px]">
                    82%
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm md:text-base font-black text-white">
                      สถิติตลาดจริง: 82.1% ของคลินิกทันตกรรมในไทยยังไม่มีเว็บไซต์เป็นของตัวเอง
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-slate-300">
                      (จากฐานข้อมูลคลินิก 8,050 แห่งทั่วประเทศ) คลินิกทันตกรรมของคุณหมอที่เริ่มต้นทำก่อน จะปักหมุดครองอันดับ 1 ในพื้นที่บน Google ทันที
                    </div>
                  </div>
                </div>

                <div className="shrink-0 hidden sm:flex items-center">
                  <span className="px-3.5 py-1.5 md:py-2 rounded-xl bg-[#2bccaf]/20 border border-[#2bccaf]/50 text-[#6fffe9] text-xs font-black">
                    🏆 First-Mover Advantage
                  </span>
                </div>
              </div>

              {/* Slide 16:9 Footer Bar with Citations */}
              <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
                <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
                  <span className="text-[#2bccaf] font-bold">[1] ข้อมูลอ้างอิง:</span>
                  <span>Think with Google (Healthcare Consumer Journey), PatientPop Dental Survey & BrightLocal Research</span>
                </div>
                <div className="text-[#2bccaf] font-bold font-mono text-[10px] shrink-0 self-end sm:self-auto">
                  DENTAL CLINICAL EXCELLENCE • PITCH DECK SLIDE 01
                </div>
              </div>
            </div>
        
        );
      case 2:
        return (
<div className="h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500 relative z-10 space-y-3 sm:space-y-4 md:space-y-5    ">
              {/* Top Tag & Meta */}
              <div className="flex items-center justify-between border-b border-[#2bccaf]/20 pb-2 sm:pb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/20 border border-[#2bccaf]/45 text-[#6fffe9] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(43,204,175,0.25)]">
                  <Layers className="w-3.5 h-3.5 text-[#2bccaf]" />
                  SLIDE 02 • DIGITAL TRIAGE & DENTAL ECOSYSTEM
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2bccaf] animate-ping" />
                  PATIENT ACQUISITION FUNNEL
                </div>
              </div>

              {/* Hero Headline & Subtitle */}
              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-black text-white tracking-tight leading-snug">
                  FB / IG &nbsp;vs&nbsp; LINE OA &nbsp;vs&nbsp; Website:{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2bccaf] via-[#6fffe9] to-teal-200 drop-shadow-[0_0_25px_rgba(43,204,175,0.5)]">
                    3 เครื่องมือ... ทำหน้าที่ต่างกันอย่างไรในธุรกิจคลินิกทันตกรรม?
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-4xl font-normal leading-relaxed">
                  ไม่ใช่การเลือกอย่างใดอย่างหนึ่ง แต่คือ <span className="text-[#6fffe9] font-bold">"ระบบสามประสาน (Tri-Ecosystem)"</span> ที่เปลี่ยนคนเห็นโพสต์ ให้กลายเป็นคนไข้เคสใหญ่ที่นั่งบนเก้าอี้ทำฟันของคุณหมอ
                </p>
              </div>

              {/* 3-Column Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 print-grid-3 gap-3 sm:gap-4 flex-1 items-stretch">
                {/* 1. Facebook & Instagram */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#16122a]/85 via-[#1b1535]/85 to-[#110d22]/85 border border-indigo-400/35 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-500/25 to-pink-500/25 border border-indigo-400/50 text-indigo-300 flex items-center justify-center shrink-0">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 block">
                            Awareness • ป้ายบิลบอร์ด
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            Facebook & Instagram
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        ดึงดูดคน
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span><b>ดึงดูดสายตาคนทั่วไป (Passive):</b> ทำให้คนไถฟีดสะดุดตากับภาพเคสก่อน-หลัง สตอรี่บรรยากาศคลินิก</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>อายุโพสต์สั้น (ตกฟีดไว):</b> โพสต์มีอายุ 24–48 ชม. แล้วตกฟีด คนไข้ค้นหาประวัติการรักษาย้อนหลังยากมาก</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ความท้าทาย:</b> Reach ลดลงต่อเนื่อง ค่าแอดแพงขึ้นทุกปี และเสี่ยงต่อข้อกำหนดคำโฆษณาแพทย์</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between gap-1 text-[10px] sm:text-xs text-indigo-300 font-semibold mt-2">
                    <span className="whitespace-nowrap shrink-0">บทบาทหลัก:</span>
                    <span className="font-black text-indigo-300 truncate">📢 ดึงคนใหม่ให้รู้จักคลินิก (Attract)</span>
                  </div>
                </div>

                {/* 2. Official Medical Website (Core Highlight) */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#061e22]/95 via-[#0a292e]/95 to-[#04161a]/95 border-2 border-[#2bccaf] shadow-[0_0_30px_rgba(43,204,175,0.25)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#2bccaf] text-[#041f1b] shadow-[0_0_10px_#2bccaf]">
                      ★ CORE ENGINE
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2bccaf] text-[#041f1b] flex items-center justify-center font-black shadow-[0_0_15px_#2bccaf] shrink-0">
                          <Laptop className="w-4 h-4 stroke-[2.4]" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#2bccaf] block">
                            Trust & Conversion • โฉนดดิจิทัล
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            เว็บไซต์ทางการของคลินิก
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ดักรับคนไข้ที่พร้อมรักษาจริง (Active):</b> ติด Google หน้าแรก คำค้นหา <i>"รากฟันเทียม"</i>, <i>"จัดฟันใส ใกล้ฉัน"</i></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>พิสูจน์ประวัติแพทย์ & วุฒิบัตร (Trust):</b> แสดงคุณวุฒิทันตแพทย์ ห้องผ่าตัดปลอดเชื้อ และรีวิวเคสอย่างเป็นระเบียบ</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>สินทรัพย์ 100% ไม่ตกฟีด:</b> ให้ข้อมูลและคัดกรองเคสตลอด 24 ชม. ตลอดไป โดยไม่ต้องจ่ายค่าแอดทุกคลิก</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2bccaf]/30 flex items-center justify-between gap-1 text-[10px] sm:text-xs text-[#6fffe9] font-bold mt-2">
                    <span className="whitespace-nowrap shrink-0">บทบาทหลัก:</span>
                    <span className="font-black text-[#2bccaf] truncate">🏛️ ปิดความลังเลใจ & สร้างความเชื่อมั่น (Convert)</span>
                  </div>
                </div>

                {/* 3. LINE Official Account */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#071f15]/85 via-[#0b281c]/85 to-[#051710]/85 border border-emerald-500/35 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/25 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block">
                            Retention • เคาน์เตอร์นัดหมาย
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            LINE Official Account
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ดูแลคนไข้
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><b>คุยปิดนัดหมาย 1-on-1:</b> ตอบคำถามเฉพาะบุคคล คัดกรองคิวแพทย์ลงตรวจ และรับชำระเงินมัดจำ</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><b>แจ้งเตือนนัด & ดูแลหลังรักษา (Post-op):</b> เตือนเวลานัดทำฟัน และส่งคำแนะนำดูแลช่องปากต่อเนื่อง</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ข้อจำกัด:</b> ไม่สามารถหาคนไข้ใหม่จากภายนอกเองได้ ต้องมี Website หรือ Facebook ส่งคนเข้ามาแอด</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between gap-1 text-[10px] sm:text-xs text-emerald-300 font-semibold mt-2">
                    <span className="whitespace-nowrap shrink-0">บทบาทหลัก:</span>
                    <span className="font-black text-emerald-300 truncate">💬 ปิดการนัดหมาย & ดูแลระยะยาว (Retain)</span>
                  </div>
                </div>
              </div>

              {/* Unified Ecosystem Funnel Banner */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#071626] via-[#0b282c] to-[#061523] p-3 sm:p-3.5 md:p-4 border border-[#2bccaf]/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-black text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      1. FB / IG (เห็นคลินิก)
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#2bccaf] shrink-0 hidden sm:block" />
                    <span className="px-2.5 py-1 rounded-lg bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 shadow-[0_0_10px_rgba(43,204,175,0.3)]">
                      2. Website (เช็กประวัติแพทย์ & มั่นใจ 100%)
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#2bccaf] shrink-0 hidden sm:block" />
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      3. LINE OA (จองคิว & ดูแลคนไข้ประจำ)
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs text-[#2bccaf] font-semibold italic shrink-0">
                    *ถ้าขาดเว็บไซต์ คนไข้เคสใหญ่มักจะ "ทักแล้วหาย" เพราะยังไม่มั่นใจในตัวแพทย์
                  </div>
                </div>
              </div>

              {/* Slide 16:9 Footer Bar */}
              <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[#2bccaf] font-bold">💡 หลักการตลาดคลินิก:</span>
                  <span>Digital Synergy Funnel (Attract ➔ Validate ➔ Retain) เพื่อการเติบโตของคลินิกอย่างยั่งยืน</span>
                </div>
                <div className="text-[#2bccaf] font-bold font-mono text-[10px] shrink-0 self-end sm:self-auto">
                  DENTAL CLINICAL EXCELLENCE • PITCH DECK SLIDE 02
                </div>
              </div>
            </div>
        
        );
      case 3:
        return (
<div className="h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500 relative z-10 space-y-3 sm:space-y-4 md:space-y-5    ">
              {/* Top Tag & Meta */}
              <div className="flex items-center justify-between border-b border-[#2bccaf]/20 pb-2 sm:pb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/20 border border-[#2bccaf]/45 text-[#6fffe9] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(43,204,175,0.25)]">
                  <Bot className="w-3.5 h-3.5 text-[#2bccaf]" />
                  SLIDE 03 • NEXT-GEN PATIENT SEARCH EVOLUTION
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2bccaf] animate-ping" />
                  AI & SEARCH VISIBILITY MATRIX
                </div>
              </div>

              {/* Hero Headline & Subtitle */}
              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-black text-white tracking-tight leading-snug">
                  SEO &nbsp;+&nbsp; AEO &nbsp;+&nbsp; GEO คืออะไร?{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2bccaf] via-[#6fffe9] to-teal-200 drop-shadow-[0_0_25px_rgba(43,204,175,0.5)]">
                    3 มิติการค้นหาของคนไข้... ที่คลินิกทันตกรรมต้องพร้อมในยุค AI
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-4xl font-normal leading-relaxed">
                  จากการค้นหาคีย์เวิร์ดแบบเดิม สู่ยุคที่คนไข้ถาม AI (ChatGPT / Gemini) ให้ช่วยเลือกหมอฟันที่ดีที่สุด ทำความเข้าใจ 3 เครื่องยนต์ที่จะชี้ชะตาคนไข้เคสใหญ่ในอนาคต
                </p>
              </div>

              {/* 3-Column Comparison Matrix: SEO vs AEO vs GEO */}
              <div className="grid grid-cols-1 md:grid-cols-3 print-grid-3 gap-3 sm:gap-4 flex-1 items-stretch">
                {/* 1. SEO (Search Engine Optimization) */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#0c182b]/85 via-[#11233d]/85 to-[#091424]/85 border border-sky-400/35 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500/20 border border-sky-400/50 text-sky-300 flex items-center justify-center shrink-0">
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-sky-400 block">
                            ยุคดั้งเดิม • แย่งชิงหน้าแรก
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            SEO (Search Engine)
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        ค้นหาเจอ
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span><b>พฤติกรรมคนไข้:</b> พิมพ์คีย์เวิร์ดสั้นๆ เช่น <i>"รากฟันเทียม บางนา"</i>, <i>"จัดฟันใส ใกล้ฉัน"</i> บน Google</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span><b>การแสดงผล:</b> เว็บไซต์ติดอันดับ 1–3 ของแถบผลลัพธ์ปกติ (10 Blue Links) ในหน้าแรก Google</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span><b>เป้าหมายหลัก:</b> ดึงดูดคนไข้ที่กำลังค้นหาบริการให้คลิกเข้าสู่เว็บไซต์ของคลินิกโดยตรง</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-500/20 flex items-center justify-between text-[10px] sm:text-xs text-sky-300 font-semibold mt-2">
                    <span>เปรียบเสมือน</span>
                    <span className="font-black text-sky-300">ป้ายบอกทางบนทางหลวง Google</span>
                  </div>
                </div>

                {/* 2. AEO (Answer Engine Optimization) */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#1c1606]/85 via-[#292009]/85 to-[#141004]/85 border border-amber-400/35 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-400 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block">
                            ยุคคำตอบทันใจ • แย่งกล่องบนสุด
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            AEO (Answer Engine)
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ตอบคำถาม
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><b>พฤติกรรมคนไข้:</b> ค้นหาข้อกังวล เช่น <i>"จัดฟันใสเจ็บไหม กี่เดือนเห็นผล?"</i>, <i>"รากฟันเทียมอยู่ได้กี่ปี"</i></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><b>การแสดงผล:</b> Google ดึงข้อความจากเว็บเราไปโชว์เป็น <b>กล่องคำตอบด่วนบนสุด (Featured Snippet)</b> ทันที</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><b>เป้าหมายหลัก:</b> ปิดความกังวลและสร้างความน่าเชื่อถือในฐานะอาจารย์แพทย์ผู้เชี่ยวชาญทันที</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[10px] sm:text-xs text-amber-300 font-semibold mt-2">
                    <span>เปรียบเสมือน</span>
                    <span className="font-black text-amber-300">ป้ายตอบข้อสงสัยหน้าห้องตรวจ</span>
                  </div>
                </div>

                {/* 3. GEO (Generative Engine Optimization - Hero Highlight) */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#061e22]/95 via-[#0a292e]/95 to-[#04161a]/95 border-2 border-[#2bccaf] shadow-[0_0_30px_rgba(43,204,175,0.25)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#2bccaf] text-[#041f1b] shadow-[0_0_10px_#2bccaf]">
                      ★ NEW 2025+ AI ERA
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2bccaf] text-[#041f1b] flex items-center justify-center font-black shadow-[0_0_15px_#2bccaf] shrink-0">
                          <Bot className="w-4 h-4 stroke-[2.4]" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#2bccaf] block">
                            ยุคใหม่ล่าสุด • AI แนะนำคลินิก
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            GEO (Generative Engine)
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>พฤติกรรมคนไข้:</b> ถาม AI ยาวๆ เช่น <i>"แนะนำคลินิกทำรากฟันเทียมใน กทม. ที่หมอเก่งและรีวิวดีให้หน่อย"</i></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>การแสดงผล:</b> ChatGPT, Gemini, Perplexity <b>พิมพ์แนะนำชื่อคลินิกของคุณหมอ</b> พร้อมแนบลิงก์เว็บเรา</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>เป้าหมายหลัก:</b> ดักรับคนไข้ยุคใหม่ที่เชื่อถือ AI และคัดกรองเฉพาะคลินิกที่มีคุณวุฒิตรงจริง</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2bccaf]/30 flex items-center justify-between text-[10px] sm:text-xs text-[#6fffe9] font-bold mt-2">
                    <span>เปรียบเสมือน</span>
                    <span className="font-black text-[#2bccaf]">อาจารย์หมอ AI แนะนำคนไข้มาหาเรา</span>
                  </div>
                </div>
              </div>

              {/* Unified Strategic Synergy Banner */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#071626] via-[#0b282c] to-[#061523] p-3 sm:p-3.5 md:p-4 border border-[#2bccaf]/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-black text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      1. SEO (ค้นหาเจอ)
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#2bccaf] shrink-0 hidden sm:block" />
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      2. AEO (ตอบคำถามคลายความกังวล)
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#2bccaf] shrink-0 hidden sm:block" />
                    <span className="px-2.5 py-1 rounded-lg bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 shadow-[0_0_10px_rgba(43,204,175,0.3)]">
                      3. GEO (AI สรุปและแนะนำคลินิกคุณหมอ)
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs text-[#2bccaf] font-semibold italic shrink-0">
                    *ถ้าคลินิกไม่มีเว็บไซต์มาตรฐาน AI จะมองไม่เห็นและไม่สามารถดึงไปแนะนำคนไข้ได้
                  </div>
                </div>
              </div>

              {/* Slide 16:9 Footer Bar */}
              <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[#2bccaf] font-bold">💡 ยุค Search Generative Experience:</span>
                  <span>SEO (Indexed on Google) + AEO (Direct Featured Answers) + GEO (AI Chat Recommendations)</span>
                </div>
                <div className="text-[#2bccaf] font-bold font-mono text-[10px] shrink-0 self-end sm:self-auto">
                  DENTAL CLINICAL EXCELLENCE • PITCH DECK SLIDE 03
                </div>
              </div>
            </div>
        
        );
      case 4:
        return (
<div className="h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500 relative z-10 space-y-3 sm:space-y-4 md:space-y-5    ">
              {/* Top Tag & Meta */}
              <div className="flex items-center justify-between border-b border-[#2bccaf]/20 pb-2 sm:pb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/20 border border-[#2bccaf]/45 text-[#6fffe9] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(43,204,175,0.25)]">
                  <Target className="w-3.5 h-3.5 text-[#2bccaf]" />
                  SLIDE 04 • HIGH-INTENT PATIENT ACQUISITION
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2bccaf] animate-ping" />
                  PERFORMANCE MARKETING FOR DENTISTS
                </div>
              </div>

              {/* Hero Headline & Subtitle */}
              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-black text-white tracking-tight leading-snug">
                  ทำไมคลินิกทันตกรรม...{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2bccaf] via-[#6fffe9] to-teal-200 drop-shadow-[0_0_25px_rgba(43,204,175,0.5)]">
                    ต้องใช้บริการ Google Ads โดยเฉพาะ?
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-4xl font-normal leading-relaxed">
                  เปลี่ยนจากการ "ยิงแอดหว่านในโซเชียล" สู่การ "ดักรับคนไข้เคสใหญ่ที่เตรียมเงินพร้อมรักษา" เข้าใจเหตุผลว่าทำไมคลินิกทันตกรรมชั้นนำจึงเลือกลงทุนใน Google Ads
                </p>
              </div>

              {/* 3-Column Core Value Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 print-grid-3 gap-3 sm:gap-4 flex-1 items-stretch">
                {/* 1. High-Intent Patients */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#201305]/85 via-[#2b1907]/85 to-[#160c03]/85 border border-amber-500/40 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block">
                            High-Intent • คุณภาพคนไข้
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            คนไข้พร้อมเริ่มรักษาจริง
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        พร้อมจ่าย
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><b>ดักรับคนที่ค้นหาหัตถการตรงๆ:</b> เช่น <i>"รากฟันเทียม บางนา"</i>, <i>"จัดฟันใส ผ่อนได้"</i> คนกลุ่มนี้มีปัญหาและเตรียมงบพร้อมรักษา</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><b>ไม่เสียเวลาตอบแชตถามราคาเล่นๆ:</b> คนไข้เข้าเว็บไซต์ ศึกษามาตรฐานคุณหมอ แล้วทักมาเพื่อ <b>"จองคิวลงตรวจจริง"</b> เป็นหลัก</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><b>ชนะคู่แข่งในเสี้ยววินาที:</b> ขึ้นอันดับ 1 ทันทีเมื่อคนไข้ในพื้นที่มีอาการหรือต้องการทำฟันด่วน</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[10px] sm:text-xs text-amber-300 font-semibold mt-2">
                    <span>จุดเด่นสำคัญ</span>
                    <span className="font-black text-amber-400">คัดกรองคนไข้เคสใหญ่ (High Conversion)</span>
                  </div>
                </div>

                {/* 2. High-Ticket ROI Multiplier (Hero Highlight) */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#061e22]/95 via-[#0a292e]/95 to-[#04161a]/95 border-2 border-[#2bccaf] shadow-[0_0_30px_rgba(43,204,175,0.25)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#2bccaf] text-[#041f1b] shadow-[0_0_10px_#2bccaf]">
                      ★ ROI สูงสุดในคลินิก
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2bccaf] text-[#041f1b] flex items-center justify-center font-black shadow-[0_0_15px_#2bccaf] shrink-0">
                          <TrendingUp className="w-4 h-4 stroke-[2.4]" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#2bccaf] block">
                            High-Ticket ROI • คืนทุนเร็ว
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            ปิดเคสใหญ่ 1-2 เคส คืนทุนทันที
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>หัตถการมูลค่าสูง (High-Ticket):</b> รากฟันเทียม (35,000–70,000 บ.), จัดฟันใส (50,000–150,000 บ.), วีเนียร์ (10,000+/ซี่)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ค่าคลิกหลักสิบ สู่รายได้หลักแสน:</b> ค่าแอดเฉลี่ย 15–40 บ./คลิก ปิดคนไข้เคสใหญ่เพียง 1–2 ราย กำไรก็เกินคุ้มงบแอดทั้งเดือน</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ล็อคพิกัดรอบคลินิก (Geo-Targeting):</b> เลือกรัศมี 3–7 กม. หรือเขตพื้นที่เป้าหมาย งบไม่รั่วไหลออกนอกพื้นที่</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2bccaf]/30 flex items-center justify-between text-[10px] sm:text-xs text-[#6fffe9] font-bold mt-2">
                    <span>จุดเด่นสำคัญ</span>
                    <span className="font-black text-[#2bccaf]">ผลตอบแทนคุ้มค่าทวีคูณ (Massive ROI)</span>
                  </div>
                </div>

                {/* 3. Professional Precision vs DIY Risk */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#1d0b16]/85 via-[#280f1e]/85 to-[#160811]/85 border border-rose-500/40 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 block">
                            Compliance • มาตรฐานมืออาชีพ
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-white">
                            ปลอดภัย ถูกกฎหมาย & งบไม่รั่ว
                          </h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        ไม่โดนแบน
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ถูกกฎ พรบ.สถานพยาบาล & Google Policy:</b> ป้องกันบัญชีโฆษณาถูกแบนถาวรจากการใช้คำต้องห้ามทางการแพทย์</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ตัดคีย์เวิร์ดขยะออก (Negative Keywords):</b> คัดทิ้งคำค้นหาเปลืองเงิน เช่น <i>"รากฟันเทียมฟรี"</i>, <i>"จัดฟัน pantip"</i>, <i>"รพ.รัฐ"</i></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><b>ติดตั้ง Conversion Tracking 100%:</b> วัดผลแม่นยำทุกบาท รู้ว่าคนไข้คนไหนโทรมา หรือแอด LINE มาจากแอดตัวไหน</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-[10px] sm:text-xs text-rose-300 font-semibold mt-2">
                    <span>จุดเด่นสำคัญ</span>
                    <span className="font-black text-rose-400">ปกป้องงบ & สร้างผลลัพธ์จริง (Safe & Profitable)</span>
                  </div>
                </div>
              </div>

              {/* High Impact ROI Simulation Banner */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#071626] via-[#0b282c] to-[#061523] p-3 sm:p-3.5 md:p-4 border border-[#2bccaf]/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-black text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      งบโฆษณา Google Ads ~15,000 บ./ด.
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#2bccaf] shrink-0 hidden sm:block" />
                    <span className="px-2.5 py-1 rounded-lg bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/50 shadow-[0_0_10px_rgba(43,204,175,0.3)]">
                      ได้คนไข้รากฟันเทียม/จัดฟันใส 2 เคส (~100,000 บ.)
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#2bccaf] shrink-0 hidden sm:block" />
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ผลตอบแทน (ROI) เติบโตมากกว่า 500%+ ทันที
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs text-[#2bccaf] font-semibold italic shrink-0">
                    *Google Ads ไม่ใช่ค่าใช้จ่าย แต่คือเครื่องจักรผลิตคนไข้เคสใหญ่
                  </div>
                </div>
              </div>

              {/* Slide 16:9 Footer Bar */}
              <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[#2bccaf] font-bold">💡 บริการ Google Ads มืออาชีพ:</span>
                  <span>High-Intent Targeting + Geo-Fencing + Healthcare Compliance + Negative Keywords Optimization</span>
                </div>
                <div className="text-[#2bccaf] font-bold font-mono text-[10px] shrink-0 self-end sm:self-auto">
                  DENTAL CLINICAL EXCELLENCE • PITCH DECK SLIDE 04
                </div>
              </div>
            </div>
        
        );
      case 5:
        return (
<div className="h-full flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500 relative z-10 space-y-3 sm:space-y-4 md:space-y-5  ">
              {/* Top Tag & Meta */}
              <div className="flex items-center justify-between border-b border-[#2bccaf]/20 pb-2 sm:pb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bccaf]/20 border border-[#2bccaf]/45 text-[#6fffe9] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(43,204,175,0.25)]">
                  <Award className="w-3.5 h-3.5 text-[#2bccaf]" />
                  SLIDE 05 • DENTAL PRACTICE INVESTMENT & PRICING
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2bccaf] animate-ping" />
                  TRANSPARENT VALUE-BASED PACKAGES
                </div>
              </div>

              {/* Hero Headline & Subtitle */}
              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-black text-white tracking-tight leading-snug">
                  แพ็กเกจ & อัตราค่าบริการ...{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2bccaf] via-[#6fffe9] to-teal-200 drop-shadow-[0_0_25px_rgba(43,204,175,0.5)]">
                    การลงทุนที่คืนทุนทันทีตั้งแต่ 1-2 เคสแรก
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-4xl font-normal leading-relaxed">
                  โครงสร้างราคาที่ออกแบบมาเพื่อคลินิกทันตกรรมโดยเฉพาะ ชัดเจน โปร่งใส ปรับแต่งตามเป้าหมายของคลินิกได้
                </p>
              </div>

              {/* 3-Tier Pricing Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 print-grid-3 gap-3 sm:gap-4 flex-1 items-stretch">
                {/* Tier 1: Starter Package */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#0c182b]/85 via-[#11233d]/85 to-[#091424]/85 border border-sky-400/35 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                        STARTER PACKAGE
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        เริ่มต้น
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white">
                      Medical Website Standard
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mb-3">
                      เว็บไซต์การแพทย์มาตรฐาน โฉนดดิจิทัล 100%
                    </p>

                    <div className="mb-3.5 pb-3 border-b border-sky-500/20">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white font-mono">฿29,000</span>
                        <span className="text-[11px] text-slate-400">/ ครั้งเดียว</span>
                      </div>
                      <span className="text-[10px] text-sky-300 font-semibold block mt-0.5">
                        *ฟรี Domain & Hosting ความเร็วสูง 1 ปี
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>เว็บทันตกรรม 100% Responsive มือถือ & คอม</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>หน้าประวัติแพทย์ วุฒิบัตร & มาตรฐานห้องผ่าตัด</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>โครงสร้าง On-Page SEO + Medical Schema</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>ปุ่มโทรด่วน เชื่อมต่อ LINE OA & Google Maps</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-500/20 text-[10px] sm:text-xs text-sky-300 font-semibold mt-3">
                    <span>เหมาะสำหรับ: คลินิกที่ต้องการสร้างความน่าเชื่อถือทันที</span>
                  </div>
                </div>

                {/* Tier 2: Professional Package (Hero Highlight) */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#061e22]/95 via-[#0a292e]/95 to-[#04161a]/95 border-2 border-[#2bccaf] shadow-[0_0_35px_rgba(43,204,175,0.3)] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#2bccaf] text-[#041f1b] shadow-[0_0_12px_#2bccaf]">
                      ★ แนะนำสูงสุดสำหรับคลินิกเคสใหญ่
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#2bccaf]">
                        PROFESSIONAL PACKAGE
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white">
                      Website + SEO + Google Ads
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-300 mb-3">
                      ระบบสามประสาน ดักรับคนไข้เคสใหญ่ในพื้นที่ทันที
                    </p>

                    <div className="mb-3.5 pb-3 border-b border-[#2bccaf]/30">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white font-mono">฿49,000</span>
                        <span className="text-[11px] text-[#6fffe9]">แรกเข้าพร้อมดูแลเดือนแรก</span>
                      </div>
                      <span className="text-[10px] text-[#2bccaf] font-semibold block mt-0.5">
                        *เดือนถัดไปค่าบริการดูแล Ads & SEO 15,000 บ./ด.
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>รวมทุกฟังก์ชันใน Starter Package ครบถ้วน</b></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>จัดการแคมเปญ Google Ads มืออาชีพ</b> เจาะพื้นที่รอบคลินิก</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ทำ Dental SEO + AEO + GEO</b> ติดหน้าแรก & AI แนะนำ</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>ตัดคีย์เวิร์ดขยะ (Negative Keywords)</b> คุมถูกกฎแพทย์</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2bccaf] shrink-0 mt-0.5" />
                        <span><b>Conversion Tracking</b> วัดผลยอดโทรและแอด LINE ทุกบาท</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2bccaf]/30 text-[10px] sm:text-xs text-[#6fffe9] font-bold mt-3">
                    <span>เหมาะสำหรับ: คลินิกที่ต้องการยอดคนไข้เคสใหญ่ทันทีและยั่งยืน</span>
                  </div>
                </div>

                {/* Tier 3: Enterprise Package */}
                <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-gradient-to-br from-[#1d102b]/85 via-[#26153b]/85 to-[#150a22]/85 border border-purple-400/35 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                        ENTERPRISE PACKAGE
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        คลินิกชั้นนำ
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white">
                      Full-Ecosystem Dominance
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mb-3">
                      ยึดครองอันดับ 1 ในพื้นที่แบบเบ็ดเสร็จรอบทิศทาง
                    </p>

                    <div className="mb-3.5 pb-3 border-b border-purple-500/20">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-white font-mono">฿89,000</span>
                        <span className="text-[11px] text-slate-400">/ ปรับตามสเกล</span>
                      </div>
                      <span className="text-[10px] text-purple-300 font-semibold block mt-0.5">
                        *บริการดูแลครบวงจรรายเดือนตามตกลง
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span><b>รวมทุกฟังก์ชันใน Professional Package ครบถ้วน</b></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>ยึดครองหน้าแรก 3 จุด (Ads + Maps 3-Pack + SEO)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>บริหาร Multi-Platform (Google + YouTube + FB Retargeting)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>ผู้จัดการการตลาดทันตกรรมส่วนตัว (Dedicated Manager) 24/7</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-purple-500/20 text-[10px] sm:text-xs text-purple-300 font-semibold mt-3">
                    <span>เหมาะสำหรับ: คลินิกขนาดใหญ่ หรือคลินิกที่มีหลายสาขา</span>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#071626] via-[#0b282c] to-[#061523] p-3 sm:p-3.5 border border-[#2bccaf]/50 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-200">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> ถูกกฎหมาย พรบ.สถานพยาบาล 100%
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1.5 text-[#6fffe9] font-bold">
                      <BarChart3 className="w-4 h-4 text-[#2bccaf]" /> วัดผลโปร่งใส เช็กยอดโทร & LINE ได้จริง
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Zap className="w-4 h-4 text-amber-400" /> ไม่มีสัญญาผูกมัดระยะยาว
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs text-[#2bccaf] font-black italic shrink-0">
                    *ปิดเคสรากฟันเทียมได้เพียง 1 เคส ก็คุ้มค่าการลงทุนแล้ว
                  </div>
                </div>
              </div>

              {/* Slide 16:9 Footer Bar */}
              <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[#2bccaf] font-bold">💡 Dental Practice Growth:</span>
                  <span>ตัวเลขราคาสามารถปรับแต่งตามสเกลและเป้าหมายของคลินิกทันตกรรมได้</span>
                </div>
                <div className="text-[#2bccaf] font-bold font-mono text-[10px] shrink-0 self-end sm:self-auto">
                  DENTAL CLINICAL EXCELLENCE • PITCH DECK SLIDE 05
                </div>
              </div>
            </div>
        
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Presentation Control Bar */}
      <div className="glass-panel-3d rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Presentation Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3be2c4] to-[#178a74] text-[#041f1b] flex items-center justify-center font-black shadow-[0_0_15px_rgba(43,204,175,0.4)] shrink-0">
            <Presentation className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                Sales Pitch Presentation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#2bccaf]/20 text-[#6fffe9] border border-[#2bccaf]/40">
                16:9 Keynote Deck
              </span>
            </div>
            <span className="text-xs text-slate-300">
              {currentSlide === 1 && "สไลด์ 01: ทำไมคลินิกทันตกรรมต้องมีเว็บไซต์ทางการแพทย์ (Why Clinics Need a Website)"}
              {currentSlide === 2 && "สไลด์ 02: FB/IG vs LINE OA vs Website (3 เครื่องมือทำหน้าที่ต่างกันอย่างไร)"}
              {currentSlide === 3 && "สไลด์ 03: SEO + AEO + GEO คืออะไร? (3 มิติการค้นหาของคนไข้ยุค AI)"}
              {currentSlide === 4 && "สไลด์ 04: ทำไมคลินิกทันตกรรมต้องใช้บริการ Google Ads (High-Intent Acquisition)"}
              {currentSlide === 5 && "สไลด์ 05: แพ็กเกจและราคาการให้บริการ (Dental Practice Service Packages)"}
            </span>
          </div>
        </div>

        {/* Right: Slide Selector Pills & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Quick Slide Selector Pills */}
          <div className="flex items-center gap-1 bg-[#06101e]/90 p-1 rounded-2xl border border-[#2bccaf]/30 shadow-inner">
            {[1, 2, 3, 4, 5].map((sNum) => (
              <button
                key={sNum}
                onClick={() => setCurrentSlide(sNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentSlide === sNum
                    ? "bg-[#2bccaf] text-[#041f1b] shadow-[0_0_12px_#2bccaf]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                title={`ไปที่สไลด์ ${sNum}`}
              >
                สไลด์ {sNum}
              </button>
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
              disabled={currentSlide === 1}
              className="glass-card-3d p-2 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              title="สไลด์ก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides))}
              disabled={currentSlide === totalSlides}
              className="glass-card-3d p-2 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              title="สไลด์ถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Speaker Notes Toggle Button */}
          <button
            onClick={() => setShowSpeakerNotes((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              showSpeakerNotes
                ? "bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                : "glass-card-3d text-slate-300 hover:text-white"
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>{showSpeakerNotes ? "ซ่อนบทพูดเซลล์" : "ดูบทพูดนำเสนอ"}</span>
          </button>
        </div>
      </div>

      {/* Speaker Notes Drawer (Toggled) */}
      {showSpeakerNotes && (
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#171408] via-[#241d0b] to-[#141208] border-2 border-amber-400/70 shadow-[0_10px_30px_rgba(251,191,36,0.2)] animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
              <MessageSquareQuote className="w-4 h-4 text-amber-400" />
              {speakerNotesData[currentSlide]?.title || "บทพูดแนะนำสำหรับเซลล์:"}
            </div>
            <p className="text-xs md:text-sm text-amber-100/90 italic leading-relaxed">
              {speakerNotesData[currentSlide]?.script}
            </p>
          </div>

          {/* Reference Cheat Sheet for Sales Rep */}
          {speakerNotesData[currentSlide]?.cheatSheet && (
            <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-400/30">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>{speakerNotesData[currentSlide].cheatSheet?.title}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-amber-100/85">
                {speakerNotesData[currentSlide].cheatSheet?.items.map((item, idx) => (
                  <div key={idx} className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-400/20">
                    <span className="font-bold text-amber-300 block mb-0.5">{item.label}</span>
                    {item.desc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide Canvas: 3D Holographic Presentation Panel */}
      <div className="relative w-full glass-panel-3d rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-[#2bccaf]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] min-h-[620px] md:min-h-[660px] flex flex-col justify-between overflow-hidden">
        {/* Ambient Hologram Orbs inside Canvas */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#2bccaf]/14 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#14b8a6]/12 blur-[130px]" />

        {/* DENTAL HOLOGRAPHIC BACKGROUND BLUEPRINT (SUBTLE & FAINT) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-[0.14] z-0">
          {/* Dental 3D Tooth Blueprint (Molar Wireframe) on the right */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-[480px] h-[520px]">
            <svg
              viewBox="0 0 400 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full stroke-[#2bccaf] drop-shadow-[0_0_20px_#2bccaf]"
            >
              {/* Tooth Crown & Enamel Contour */}
              <path
                d="M100 90 C120 40, 180 50, 200 70 C220 50, 280 40, 300 90 C320 140, 315 200, 285 240 C260 270, 255 350, 245 410 C240 430, 220 430, 215 400 C205 340, 205 310, 200 310 C195 310, 195 340, 185 400 C180 430, 160 430, 155 410 C145 350, 140 270, 115 240 C85 200, 80 140, 100 90 Z"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              {/* Internal Wireframe & Root Lines */}
              <path
                d="M140 130 Q200 170 260 130"
                strokeWidth="2.5"
              />
              <path
                d="M200 70 V310"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M165 240 Q175 330 170 380"
                strokeWidth="2"
              />
              <path
                d="M235 240 Q225 330 230 380"
                strokeWidth="2"
              />
              {/* Dental Implant / Precision Grid Rings */}
              <ellipse cx="200" cy="110" rx="60" ry="22" strokeWidth="1.5" />
              <ellipse cx="200" cy="160" rx="75" ry="25" strokeWidth="1.5" strokeDasharray="3 3" />
              <ellipse cx="200" cy="220" rx="55" ry="18" strokeWidth="1.5" />
              <circle cx="200" cy="70" r="6" fill="#2bccaf" fillOpacity="0.4" />
              <circle cx="155" cy="410" r="4" fill="#2bccaf" fillOpacity="0.4" />
              <circle cx="245" cy="410" r="4" fill="#2bccaf" fillOpacity="0.4" />

              {/* Technical Coordinates Callouts */}
              <line x1="40" y1="90" x2="100" y2="90" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="300" y1="90" x2="360" y2="90" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="40" y1="240" x2="115" y2="240" strokeWidth="1.5" strokeDasharray="2 2" />
              <line x1="285" y1="240" x2="360" y2="240" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Subtle Smile Curve Arc (Center-Bottom) */}
          <div className="absolute bottom-12 left-1/4 w-[500px] h-[120px]">
            <svg viewBox="0 0 500 120" fill="none" className="w-full h-full stroke-[#2bccaf]/40">
              <path
                d="M10 20 Q250 110 490 20"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <circle cx="250" cy="65" r="4" fill="#2bccaf" />
            </svg>
          </div>
        </div>

        {/* Active Slide Presentation Content */}
        {renderSlideContent(currentSlide)}
      </div>
    </div>
  );
}
