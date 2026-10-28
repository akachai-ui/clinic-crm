import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ClinicLead } from "@/types/clinic";

const DB_NAME = "clinic_crm_cache_db";
const STORE_NAME = "clinics_store";
const CACHE_KEY = "all_clinics_v3";
const UPDATES_COLLECTION = "clinic_updates";

function openCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not supported"));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const dbInstance = request.result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedClinicsFromIDB(): Promise<{
  clinics: ClinicLead[];
  cachedAt: string;
} | null> {
  try {
    const idb = await openCacheDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(CACHE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function saveClinicsToIDB(clinics: ClinicLead[]): Promise<void> {
  try {
    const idb = await openCacheDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(
        {
          clinics,
          cachedAt: new Date().toISOString(),
        },
        CACHE_KEY
      );
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore IDB write errors
  }
}

/**
 * Loads all 8,050 baseline clinics from static asset / IndexedDB (0 Firebase Reads!)
 * and optionally merges only modified leads from the lightweight `clinic_updates` collection.
 */
export async function loadClinicsWithCache(syncDeltaUpdates = false): Promise<{
  clinics: ClinicLead[];
  deltaReadsUsed: number;
  cachedAt: string;
}> {
  let baseClinics: ClinicLead[] = [];

  // 1. Try IndexedDB first (0 Firebase reads)
  const cached = await getCachedClinicsFromIDB();
  if (cached && Array.isArray(cached.clinics) && cached.clinics.length > 0) {
    baseClinics = cached.clinics;
  } else {
    // 2. Load from static /data/clinics-master.json (0 Firebase reads, works on any CDN/hosting)
    const res = await fetch("/data/clinics-master.json");
    if (!res.ok) {
      throw new Error("Failed to load /data/clinics-master.json");
    }
    baseClinics = await res.json();
  }

  let deltaReadsUsed = 0;

  // 3. If requested, fetch ONLY modified clinic records from `clinic_updates` collection
  if (syncDeltaUpdates) {
    try {
      const snapshot = await getDocs(collection(db, UPDATES_COLLECTION));
      deltaReadsUsed = snapshot.size;
      if (snapshot.size > 0) {
        const updatesMap = new Map<string, Partial<ClinicLead>>();
        snapshot.docs.forEach((d) => {
          updatesMap.set(d.id, d.data() as Partial<ClinicLead>);
        });
        baseClinics = baseClinics.map((clinic) => {
          const patch = updatesMap.get(clinic.id);
          return patch ? { ...clinic, ...patch } : clinic;
        });
      }
    } catch (err) {
      console.warn("Delta sync skipped:", err);
    }
  }

  const now = new Date().toISOString();
  await saveClinicsToIDB(baseClinics);

  return {
    clinics: baseClinics,
    deltaReadsUsed,
    cachedAt: now,
  };
}

/**
 * Saves a single clinic's sales status or notes update to the lightweight `clinic_updates` collection
 * linked by `clinicId` (matching `id` in public/data/clinics-master.json).
 */
export async function saveClinicDeltaUpdate(
  clinicId: string,
  updates: Partial<ClinicLead>
): Promise<void> {
  const payload = {
    clinicId,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, UPDATES_COLLECTION, clinicId), payload, { merge: true });
}
