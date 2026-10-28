import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyCzNTy3kvLaE91lmfWXS0eaSOwK_xR0IBU",
  authDomain: "clinic-crm-93b4f.firebaseapp.com",
  projectId: "clinic-crm-93b4f",
  storageBucket: "clinic-crm-93b4f.firebasestorage.app",
  messagingSenderId: "686142643127",
  appId: "1:686142643127:web:ba56a3f1e3a9b86285e632",
  measurementId: "G-YQWCEZNQ25"
};

// Initialize Firebase (prevent re-initialization in Next.js hot reload)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};
