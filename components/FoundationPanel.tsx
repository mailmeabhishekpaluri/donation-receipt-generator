"use client";

import { useState } from "react";
import { FoundationInfo, DEFAULT_FOUNDATION } from "@/lib/types";

const LS_KEY = "humanity_foundation_info";

export function loadFoundation(): FoundationInfo {
  if (typeof window === "undefined") return DEFAULT_FOUNDATION;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_FOUNDATION, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_FOUNDATION;
}

export function saveFoundation(info: FoundationInfo) {
  localStorage.setItem(LS_KEY, JSON.stringify(info));
}

interface Props {
  info: FoundationInfo;
  onChange: (info: FoundationInfo) => void;
}

const fields: { key: keyof FoundationInfo; label: string }[] = [
  { key: "name", label: "Foundation Name" },
  { key: "tagline", label: "Tagline (under logo)" },
  { key: "subTagline", label: "Sub-tagline (e.g. Registered under...)" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "cin", label: "CIN" },
  { key: "pan", label: "PAN Card Number" },
  { key: "reg80G", label: "80G Registration Number" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
  { key: "phone", label: "Phone" },
];

export function FoundationPanel({ info, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FoundationInfo>(info);

  function handleSave() {
    saveFoundation(draft);
    onChange(draft);
    setOpen(false);
  }

  function handleReset() {
    setDraft(DEFAULT_FOUNDATION);
  }

  if (!open) {
    return (
      <button
        onClick={() => { setDraft(info); setOpen(true); }}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#3191c2] text-[#3191c2] rounded-lg hover:bg-[#3191c2]/10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Customize Foundation Info
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Foundation Information</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3191c2]/40 focus:border-[#3191c2]"
                value={draft[key] ?? ""}
                onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Reset to defaults
          </button>
          <div className="flex gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1a6e9e] hover:bg-[#3191c2] rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
