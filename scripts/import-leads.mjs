import fs from "fs";
import path from "path";
import crypto from "crypto";
import { parse } from "csv-parse/sync";
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.mjs";

const CSV_FILENAME = "medical_dental_beauty_clinics_leads - medical_dental_beauty_clinics_leads.csv";
const COLLECTION_NAME = "clinics";
const BATCH_SIZE = 450; // Firestore max batch size is 500

function generateDocId(row, index) {
  const gmapsUrl = row["ลิงก์GoogleMaps"] || "";
  const cidMatch = gmapsUrl.match(/cid=(\d+)/);
  if (cidMatch && cidMatch[1]) {
    return `cid_${cidMatch[1]}`;
  }
  const uniqueKey = `${row["ชื่อคลินิก_สถานพยาบาล"] || ""}_${row["ละติจูด"] || ""}_${row["ลองจิจูด"] || ""}_${index}`;
  const hash = crypto.createHash("md5").update(uniqueKey).digest("hex").substring(0, 16);
  return `clinic_${hash}`;
}

function mapRowToLead(row, index) {
  const parseNum = (val) => {
    if (val === undefined || val === null || val === "") return null;
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  };

  return {
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
    updatedAt: new Date().toISOString()
  };
}

async function importLeads() {
  const csvPath = path.resolve(process.cwd(), CSV_FILENAME);
  console.log(`📂 กำลังอ่านไฟล์: ${csvPath}`);

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ ไม่พบไฟล์: ${csvPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true
  });

  console.log(`📊 พบข้อมูลทั้งหมด ${records.length.toLocaleString()} รายการ`);
  console.log(`🚀 เริ่มนำเข้าข้อมูลไปยัง Cloud Firestore (Collection: "${COLLECTION_NAME}")...`);

  let totalImported = 0;
  const totalBatches = Math.ceil(records.length / BATCH_SIZE);

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;

    chunk.forEach((row, idx) => {
      const globalIndex = i + idx;
      const docId = generateDocId(row, globalIndex);
      const leadData = mapRowToLead(row, globalIndex);
      const docRef = doc(collection(db, COLLECTION_NAME), docId);
      batch.set(docRef, leadData, { merge: true });
    });

    await batch.commit();
    totalImported += chunk.length;
    const percent = ((totalImported / records.length) * 100).toFixed(1);
    console.log(`✅ Batch ${currentBatchNum}/${totalBatches} สำเร็จ — นำเข้าแล้ว ${totalImported.toLocaleString()}/${records.length.toLocaleString()} รายการ (${percent}%)`);
  }

  console.log(`\n🎉 นำเข้าข้อมูลเสร็จสมบูรณ์ทั้งหมด ${totalImported.toLocaleString()} รายการ!`);
  process.exit(0);
}

importLeads().catch((err) => {
  console.error("\n❌ เกิดข้อผิดพลาดในการนำเข้าข้อมูล:", err.message || err);
  if (err.code === "permission-denied") {
    console.error("💡 คำแนะนำ: ตรวจสอบ Firestore Security Rules ใน Firebase Console ว่าอนุญาตให้เขียนข้อมูล (allow read, write: if true;) หรือเปิดใช้งานฐานข้อมูล Cloud Firestore แล้วหรือยัง");
  }
  process.exit(1);
});
