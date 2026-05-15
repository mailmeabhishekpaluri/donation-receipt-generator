import * as XLSX from "xlsx";
import { Donor } from "./types";
import { generateReceiptNumber } from "./indic";

// Flexible column name matching
const COL_MAP: Record<string, string> = {
  // name
  name: "name", donor: "name", donorname: "name", "donor name": "name",
  "contributor name": "name", contributor: "name",
  // pan
  pan: "pan", "pan no": "pan", "pan number": "pan", pannumber: "pan",
  // address
  address: "address", addr: "address", "donor address": "address",
  // amount
  amount: "amount", donation: "amount", "amount donated": "amount",
  "donation amount": "amount", sum: "amount",
  // date
  date: "date", "donation date": "date", "receipt date": "date", donationdate: "date",
  // mode
  mode: "mode", "payment mode": "mode", paymentmode: "mode", "mode of payment": "mode",
  // cheque
  chequeno: "chequeNo", "cheque no": "chequeNo", "cheque number": "chequeNo",
  chequenumber: "chequeNo", cheque: "chequeNo", "dd no": "chequeNo",
  // bank
  bank: "bankName", bankname: "bankName", "bank name": "bankName",
};

function normalise(key: string): string {
  return key.toLowerCase().replace(/[^a-z ]/g, "").trim();
}

function mapRow(raw: Record<string, unknown>): Partial<Donor> {
  const out: Partial<Donor> = {};
  for (const [rawKey, val] of Object.entries(raw)) {
    const field = COL_MAP[normalise(rawKey)];
    if (!field) continue;
    if (field === "amount") {
      out.amount = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
    } else {
      (out as Record<string, unknown>)[field] = String(val ?? "").trim();
    }
  }
  return out;
}

export function parseFile(buffer: ArrayBuffer): Donor[] {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

  return rows
    .map((raw, i) => {
      const mapped = mapRow(raw);
      if (!mapped.name) return null;
      const serial = i + 1;
      const date = mapped.date ?? new Date().toISOString().slice(0, 10);
      return {
        id: `donor-${i}`,
        serial,
        name: mapped.name,
        pan: mapped.pan,
        address: mapped.address,
        amount: mapped.amount ?? 0,
        date,
        mode: mapped.mode ?? "Cash",
        chequeNo: mapped.chequeNo,
        bankName: mapped.bankName,
        receiptNumber: generateReceiptNumber(serial),
      } as Donor;
    })
    .filter((d): d is Donor => d !== null);
}

export function buildSampleCSV(): string {
  const header = "Donor Name,PAN,Address,Amount,Date,Payment Mode,Cheque No,Bank Name";
  const rows = [
    "Rajesh Kumar,ABCPK1234A,\"12 MG Road, Bengaluru 560001\",10000,2025-08-01,Cheque,123456,SBI",
    "Priya Sharma,BCDPS5678B,\"45 Park Street, Kolkata 700016\",25000,2025-08-02,NEFT,,HDFC Bank",
    "Anand Verma,,\"7 Nehru Nagar, Delhi 110019\",5000,2025-08-03,Cash,,",
  ];
  return [header, ...rows].join("\n");
}

export function buildSampleXLSX(): ArrayBuffer {
  const data = [
    ["Donor Name", "PAN", "Address", "Amount", "Date", "Payment Mode", "Cheque No", "Bank Name"],
    ["Rajesh Kumar", "ABCPK1234A", "12 MG Road, Bengaluru 560001", 10000, "2025-08-01", "Cheque", "123456", "SBI"],
    ["Priya Sharma", "BCDPS5678B", "45 Park Street, Kolkata 700016", 25000, "2025-08-02", "NEFT", "", "HDFC Bank"],
    ["Anand Verma", "", "7 Nehru Nagar, Delhi 110019", 5000, "2025-08-03", "Cash", "", ""],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Donors");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}
