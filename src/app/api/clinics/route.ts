import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { parse } from "csv-parse/sync";
import { ClinicLead } from "@/types/clinic";

const CSV_FILENAME = "medical_dental_beauty_clinics_leads - medical_dental_beauty_clinics_leads.csv";

let cachedClinics: ClinicLead[] | null = null;

function generateDocId(row: Record<string, string>, index: number): string {
  const gmapsUrl = row["ลิงก์GoogleMaps"] || "";
  const cidMatch = gmapsUrl.match(/cid=(\d+)/);
  if (cidMatch && cidMatch[1]) {
    return `cid_${cidMatch[1]}`;
  }
  const uniqueKey = `${row["ชื่อคลินิก_สถานพยาบาล"] || ""}_${row["ละติจูด"] || ""}_${row["ลองจิจูด"] || ""}_${index}`;
  const hash = crypto.createHash("md5").update(uniqueKey).digest("hex").substring(0, 16);
  return `clinic_${hash}`;
}

function parseNum(val: string | undefined): number | null {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val);
  return Number.isNaN(num) ? null : num;
}

export async function GET() {
  try {
    if (!cachedClinics) {
      const csvPath = path.resolve(process.cwd(), CSV_FILENAME);
      const fileContent = fs.readFileSync(csvPath, "utf-8");
      const records: Record<string, string>[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        trim: true,
      });

      cachedClinics = records.map((row, index) => ({
        id: generateDocId(row, index),
        name: (row["ชื่อคลินิก_สถานพยาบาล"] || "").trim(),
        category: (row["ประเภทคลินิก"] || "").trim(),
        searchKeyword: (row["คำค้นหาที่พบ"] || "").trim(),
        province: (row["จังหวัด"] || "").trim(),
        district: (row["อำเภอ_เขต"] || "").trim(),
        subdistrict: (row["ตำบล_แขวง"] || "").trim(),
        phone: (row["เบอร์โทรศัพท์"] || "").trim(),
        email: (row["อีเมล"] || "").trim(),
        websiteOrLine: (row["เว็บไซต์_Line"] || "").trim(),
        salesStatus: (row["สถานะการขาย"] || "ยังไม่ได้ติดต่อ").trim(),
        address: (row["ที่อยู่เต็ม"] || "").trim(),
        latitude: parseNum(row["ละติจูด"]),
        longitude: parseNum(row["ลองจิจูด"]),
        rating: parseNum(row["คะแนนรีวิว"]),
        reviewCount: parseNum(row["จำนวนรีวิว"]) ?? 0,
        googleMapsUrl: (row["ลิงก์GoogleMaps"] || "").trim(),
        websiteStatus: (row["สถานะเว็บไซต์"] || "").trim(),
        rowNumber: index + 1,
      }));
    }

    return NextResponse.json({ clinics: cachedClinics });
  } catch (err: any) {
    console.error("Failed to load local clinics cache:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load clinics" },
      { status: 500 }
    );
  }
}
