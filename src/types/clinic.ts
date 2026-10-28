export interface ClinicLead {
  id: string;
  name: string;
  category: string;
  searchKeyword: string;
  province: string;
  district: string;
  subdistrict: string;
  phone: string;
  email: string;
  websiteOrLine: string;
  salesStatus: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  reviewCount: number;
  googleMapsUrl: string;
  websiteStatus: string;
  rowNumber?: number;
  updatedAt?: string;
  notes?: string;
}
