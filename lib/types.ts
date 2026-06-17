export interface Donor {
  id: string;
  serial: number;
  name: string;
  pan?: string;
  address?: string;
  city?: string;
  email?: string;
  phone?: string;
  amount: number;
  date: string;
  mode?: string;
  chequeNo?: string;
  bankName?: string;
  receiptNumber: string;
}

export interface FoundationInfo {
  name: string;
  tagline: string;
  subTagline: string;
  address: string;
  city: string;
  cin: string;
  pan: string;
  reg80G: string;
  email: string;
  website: string;
  phone?: string;
}

export const DEFAULT_FOUNDATION: FoundationInfo = {
  name: "Humanity Uplifting Mankind Foundation",
  tagline: "Humanity Uplifting Mankind",
  subTagline: "Registered under section 8 companies act",
  address: "GF1, Kranthi Nivas 2, PM Palem Last Bus Stop, Visakhapatnam, 530041",
  city: "Visakhapatnam",
  cin: "U85190AP2021NPL120322",
  pan: "AAGCH0887D",
  reg80G: "AAGCH0887DF20225",
  email: "contact@humanityorg.foundation",
  website: "humanityorg.foundation",
  phone: "",
};
