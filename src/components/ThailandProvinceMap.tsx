"use client";

import { useEffect, useState, useMemo } from "react";
import { ClinicLead } from "@/types/clinic";
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from "lucide-react";

export interface ProvinceStat {
  province: string;
  count: number;
  lat: number;
  lng: number;
}

interface ThailandProvinceMapProps {
  provinceStats: ProvinceStat[];
  selectedProvince: string;
  onSelectProvince: (province: string) => void;
  clinicsInSelectedProvince: ClinicLead[];
}

// Mapping from GeoJSON English province names to Thai province names in CSV/Firestore
const EN_TO_TH_PROVINCE: Record<string, string> = {
  "Amnat Charoen": "อำนาจเจริญ",
  "Ang Thong": "อ่างทอง",
  "Bangkok Metropolis": "กรุงเทพมหานคร",
  "Bueng Kan": "บึงกาฬ",
  "Buri Ram": "บุรีรัมย์",
  "Chachoengsao": "ฉะเชิงเทรา",
  "Chai Nat": "ชัยนาท",
  "Chaiyaphum": "ชัยภูมิ",
  "Chanthaburi": "จันทบุรี",
  "Chiang Mai": "เชียงใหม่",
  "Chiang Rai": "เชียงราย",
  "Chon Buri": "ชลบุรี",
  "Chumphon": "ชุมพร",
  "Kalasin": "กาฬสินธุ์",
  "Kamphaeng Phet": "กำแพงเพชร",
  "Kanchanaburi": "กาญจนบุรี",
  "Khon Kaen": "ขอนแก่น",
  "Krabi": "กระบี่",
  "Lampang": "ลำปาง",
  "Lamphun": "ลำพูน",
  "Loei": "เลย",
  "Lop Buri": "ลพบุรี",
  "Mae Hong Son": "แม่ฮ่องสอน",
  "Maha Sarakham": "มหาสารคาม",
  "Mukdahan": "มุกดาหาร",
  "Nakhon Nayok": "นครนายก",
  "Nakhon Pathom": "นครปฐม",
  "Nakhon Phanom": "นครพนม",
  "Nakhon Ratchasima": "นครราชสีมา",
  "Nakhon Sawan": "นครสวรรค์",
  "Nakhon Si Thammarat": "นครศรีธรรมราช",
  "Nan": "น่าน",
  "Narathiwat": "นราธิวาส",
  "Nong Bua Lam Phu": "หนองบัวลำภู",
  "Nong Khai": "หนองคาย",
  "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Pattani": "ปัตตานี",
  "Phangnga": "พังงา",
  "Phatthalung": "พัทลุง",
  "Phayao": "พะเยา",
  "Phetchabun": "เพชรบูรณ์",
  "Phetchaburi": "เพชรบุรี",
  "Phichit": "พิจิตร",
  "Phitsanulok": "พิษณุโลก",
  "Phra Nakhon Si Ayutthaya": "พระนครศรีอยุธยา",
  "Phrae": "แพร่",
  "Phuket": "ภูเก็ต",
  "Prachin Buri": "ปราจีนบุรี",
  "Prachuap Khiri Khan": "ประจวบคีรีขันธ์",
  "Ranong": "ระนอง",
  "Ratchaburi": "ราชบุรี",
  "Rayong": "ระยอง",
  "Roi Et": "ร้อยเอ็ด",
  "Sa Kaeo": "สระแก้ว",
  "Sakon Nakhon": "สกลนคร",
  "Samut Prakan": "สมุทรปราการ",
  "Samut Sakhon": "สมุทรสาคร",
  "Samut Songkhram": "สมุทรสงคราม",
  "Saraburi": "สระบุรี",
  "Satun": "สตูล",
  "Si Sa Ket": "ศรีสะเกษ",
  "Sing Buri": "สิงห์บุรี",
  "Songkhla": "สงขลา",
  "Sukhothai": "สุโขทัย",
  "Suphan Buri": "สุพรรณบุรี",
  "Surat Thani": "สุราษฎร์ธานี",
  "Surin": "สุรินทร์",
  "Tak": "ตาก",
  "Trang": "ตรัง",
  "Trat": "ตราด",
  "Ubon Ratchathani": "อุบลราชธานี",
  "Udon Thani": "อุดรธานี",
  "Uthai Thani": "อุทัยธานี",
  "Uttaradit": "อุตรดิตถ์",
  "Yala": "ยะลา",
  "Yasothon": "ยโสธร",
};

// Thailand bounding box in lon/lat
const MIN_LON = 97.3;
const MAX_LON = 105.7;
const MIN_LAT = 5.6;
const MAX_LAT = 20.5;

const SVG_WIDTH = 520;
const SVG_HEIGHT = 920;

function projectPoint(lon: number, lat: number): [number, number] {
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * SVG_WIDTH;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * SVG_HEIGHT;
  return [x, y];
}

function ringsToSvgPath(rings: number[][][]): string {
  return rings
    .map((ring) => {
      if (!ring || ring.length === 0) return "";
      const pts = ring.map(([lon, lat]) => {
        const [x, y] = projectPoint(lon, lat);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      return `M${pts.join("L")}Z`;
    })
    .join(" ");
}

interface ParsedProvinceFeature {
  enName: string;
  thName: string;
  pathD: string;
  centerX: number;
  centerY: number;
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
}

export default function ThailandProvinceMap({
  provinceStats,
  selectedProvince,
  onSelectProvince,
  clinicsInSelectedProvince,
}: ThailandProvinceMapProps) {
  const [features, setFeatures] = useState<ParsedProvinceFeature[]>([]);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/data/thailand-provinces.json")
      .then((res) => res.json())
      .then((geojson) => {
        const parsed: ParsedProvinceFeature[] = geojson.features.map((f: any) => {
          const enName = f.properties?.name || "";
          const thName = EN_TO_TH_PROVINCE[enName] || enName;
          const geom = f.geometry;
          let pathD = "";
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

          const updateBounds = (rings: number[][][]) => {
            rings.forEach((ring) => {
              ring.forEach(([lon, lat]) => {
                const [x, y] = projectPoint(lon, lat);
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
              });
            });
          };

          if (geom.type === "Polygon") {
            pathD = ringsToSvgPath(geom.coordinates);
            updateBounds(geom.coordinates);
          } else if (geom.type === "MultiPolygon") {
            pathD = geom.coordinates
              .map((poly: number[][][]) => {
                updateBounds(poly);
                return ringsToSvgPath(poly);
              })
              .join(" ");
          }

          return {
            enName,
            thName,
            pathD,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
            bbox: { minX, minY, maxX, maxY },
          };
        });
        setFeatures(parsed);
      })
      .catch((err) => console.error("Failed to load Thailand GeoJSON:", err));
  }, []);

  // Build quick lookup of province -> count
  const countMap = useMemo(() => {
    const map: Record<string, number> = {};
    provinceStats.forEach((s) => {
      map[s.province] = s.count;
    });
    return map;
  }, [provinceStats]);

  const maxCount = useMemo(() => {
    return Math.max(...provinceStats.map((s) => s.count), 1);
  }, [provinceStats]);

  // Futuristic 3D Holographic #2bccaf Choropleth scale
  const getProvinceFill = (thName: string, count: number) => {
    const isSelected = selectedProvince === thName;
    const isHovered = hoveredProvince === thName;

    if (isSelected) return "#6fffe9"; // Hyper neon cyan-mint highlight
    if (isHovered) return "#3be8c8"; // Hover glow #2bccaf+

    if (count === 0) return "#0b192c"; // Deep cyber slate
    const ratio = count / maxCount;
    if (ratio >= 0.8) return "#2bccaf"; // Primary neon #2bccaf
    if (ratio >= 0.65) return "#22a890";
    if (ratio >= 0.5) return "#198572";
    if (ratio >= 0.35) return "#136356";
    return "#0e443d"; // Subtle dark teal
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const activeInfoProvince =
    hoveredProvince || (selectedProvince !== "all" ? selectedProvince : null);
  const activeCount = activeInfoProvince ? countMap[activeInfoProvince] || 0 : 0;

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-[radial-gradient(ellipse_at_center,_rgba(43,204,175,0.14)_0%,_rgba(6,15,28,0.92)_75%)] border border-[#2bccaf]/30 shadow-[inset_0_0_40px_rgba(43,204,175,0.08)] overflow-hidden select-none flex items-center justify-center">
      {/* Subtle 3D radar grid circles in map background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
        <div className="w-[260px] h-[260px] rounded-full border border-[#2bccaf]/30" />
        <div className="absolute w-[420px] h-[420px] rounded-full border border-[#2bccaf]/20 border-dashed" />
      </div>

      {/* Top-left Hover / Selected Province 3D Glass HUD Card */}
      <div className="absolute top-3.5 left-3.5 z-10 glass-card-3d rounded-xl px-4 py-3 min-w-[200px]">
        {activeInfoProvince ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#2bccaf] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#2bccaf]" />
              เขตพื้นที่จังหวัด
            </div>
            <div className="text-base font-extrabold text-white mt-0.5 tracking-wide">
              {activeInfoProvince}
            </div>
            <div className="text-sm font-bold text-[#2bccaf] mt-0.5">
              {activeCount.toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-300">คลินิก</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-300 leading-relaxed">
            ชี้หรือคลิกที่เขตจังหวัดบนแผนที่โฮโลแกรม
            <br />
            เพื่อดูจำนวนคลินิกและกรองข้อมูล
          </div>
        )}
      </div>

      {/* Top-right 3D Glass Zoom Controls */}
      <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5 glass-card-3d p-1.5 rounded-xl">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
          title="ซูมเข้า"
          className="p-1.5 rounded-lg hover:bg-[#2bccaf]/20 text-[#2bccaf] transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
          title="ซูมออก"
          className="p-1.5 rounded-lg hover:bg-[#2bccaf]/20 text-[#2bccaf] transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="รีเซ็ตมุมมอง"
          className="p-1.5 rounded-lg hover:bg-[#2bccaf]/20 text-[#2bccaf] transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Thailand Only 3D Holographic SVG Map with 77 Province Boundaries */}
      <div
        className={`w-full h-full flex items-center justify-center ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full max-h-[510px] transition-transform duration-150 ease-out drop-shadow-[0_12px_20px_rgba(43,204,175,0.28)]"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <g>
            {features.map((f) => {
              const count = countMap[f.thName] || 0;
              const isSelected = selectedProvince === f.thName;
              const fill = getProvinceFill(f.thName, count);

              return (
                <path
                  key={f.enName}
                  d={f.pathD}
                  fill={fill}
                  stroke={isSelected ? "#ffffff" : "rgba(43, 204, 175, 0.45)"}
                  strokeWidth={isSelected ? 1.8 : 0.75}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredProvince(f.thName)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProvince(isSelected ? "all" : f.thName);
                  }}
                >
                  <title>{`${f.thName}: ${count.toLocaleString()} คลินิก`}</title>
                </path>
              );
            })}

            {/* If a province is selected, also plot individual clinic dots inside it */}
            {selectedProvince !== "all" &&
              clinicsInSelectedProvince.map((clinic) => {
                if (!clinic.latitude || !clinic.longitude) return null;
                const [cx, cy] = projectPoint(clinic.longitude, clinic.latitude);
                let dotColor = "#fde047"; // neon yellow
                if (clinic.websiteStatus?.includes("ไม่มี")) {
                  dotColor = "#fb7185"; // rose
                } else if (clinic.websiteStatus?.includes("มีเว็บ")) {
                  dotColor = "#052e28"; // dark contrast dot on bright selected province
                }
                return (
                  <circle
                    key={clinic.id}
                    cx={cx}
                    cy={cy}
                    r={2.5 / Math.sqrt(zoom)}
                    fill={dotColor}
                    stroke="#ffffff"
                    strokeWidth={0.5 / Math.sqrt(zoom)}
                    className="pointer-events-none"
                  />
                );
              })}
          </g>
        </svg>
      </div>

      {/* Bottom-left Choropleth 3D Glass Legend */}
      <div className="absolute bottom-3.5 left-3.5 z-10 glass-card-3d rounded-xl p-3 text-[11px] space-y-1.5">
        <div className="font-bold text-[#2bccaf]">ความหนาแน่นจำนวนคลินิก</div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#2bccaf] shadow-[0_0_8px_#2bccaf] inline-block" />
          <span className="w-3.5 h-3.5 rounded bg-[#22a890] inline-block" />
          <span className="w-3.5 h-3.5 rounded bg-[#198572] inline-block" />
          <span className="w-3.5 h-3.5 rounded bg-[#136356] inline-block" />
          <span className="w-3.5 h-3.5 rounded bg-[#0e443d] inline-block" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-300">
          <span>มาก ({maxCount})</span>
          <span>น้อย</span>
        </div>
        {selectedProvince !== "all" && (
          <div className="pt-1 border-t border-[#2bccaf]/20 flex items-center gap-1.5 text-[#6fffe9] font-bold">
            <span className="w-3 h-3 rounded bg-[#6fffe9] shadow-[0_0_8px_#6fffe9] inline-block" />
            <span>เลือกอยู่: {selectedProvince}</span>
          </div>
        )}
      </div>
    </div>
  );
}
