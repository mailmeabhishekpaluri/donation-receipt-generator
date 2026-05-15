"use client";

import { useState } from "react";
import { Donor } from "@/lib/types";
import { formatIndianCurrency } from "@/lib/indic";

interface Props {
  donor: Donor;
  onSave: (updated: Donor) => void;
  onClose: () => void;
}

const FIELDS: { key: keyof Donor; label: string; type?: string }[] = [
  { key: "name", label: "Donor Name" },
  { key: "pan", label: "PAN" },
  { key: "address", label: "Address" },
  { key: "amount", label: "Amount (₹)", type: "number" },
  { key: "date", label: "Date", type: "date" },
  { key: "mode", label: "Payment Mode" },
  { key: "chequeNo", label: "Cheque / DD No." },
  { key: "bankName", label: "Bank Name" },
  { key: "receiptNumber", label: "Receipt Number" },
];

export function EditDonorModal({ donor, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Donor>({ ...donor });

  function update(key: keyof Donor, value: string) {
    setDraft((p) => ({
      ...p,
      [key]: key === "amount" ? parseFloat(value) || 0 : value,
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Edit Donor</h2>
            <p className="text-xs text-gray-400 mt-0.5">Changes apply only to this session</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview badge */}
        <div className="mx-6 mt-4 px-4 py-2.5 bg-[#1a6e9e]/8 rounded-xl flex items-center justify-between">
          <span className="text-xs text-gray-500">Donation amount</span>
          <span className="text-sm font-bold text-[#1a6e9e]">₹{formatIndianCurrency(draft.amount)}</span>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {FIELDS.map(({ key, label, type }) => (
            <div key={key} className={key === "address" || key === "receiptNumber" ? "col-span-2" : ""}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                type={type ?? "text"}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3191c2]/40 focus:border-[#3191c2]"
                value={draft[key] ?? ""}
                onChange={(e) => update(key, e.target.value)}
                step={key === "amount" ? "0.01" : undefined}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#1a6e9e] hover:bg-[#3191c2] rounded-lg transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
