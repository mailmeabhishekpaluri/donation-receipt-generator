export interface Donor {
  id: string;
  serial: number;
  name: string;
  pan?: string;
  address?: string;
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
  address: string;
  cin: string;
  pan: string;
  reg80G: string;
  email: string;
  website: string;
  phone?: string;
}

export const DEFAULT_FOUNDATION: FoundationInfo = {
  name: "HUManity Foundation",
  tagline: "Making Mankind Together",
  address: "123, Sector 18, Gurugram, Haryana – 122015",
  cin: "U85300HR2020NPL089123",
  pan: "AABCH1234A",
  reg80G: "AABCH1234AA20211",
  email: "info@humanityfoundation.org",
  website: "www.humanityfoundation.org",
  phone: "+91 98765 43210",
};
