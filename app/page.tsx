"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Donor, FoundationInfo } from "@/lib/types";
import { parseFile, buildSampleXLSX } from "@/lib/excel";
import { formatIndianCurrency } from "@/lib/indic";
import { FoundationPanel, loadFoundation } from "@/components/FoundationPanel";
import { EditDonorModal } from "@/components/EditDonorModal";
import { ReceiptDoc } from "@/components/Receipt";

export default function Home() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [foundation, setFoundation] = useState<FoundationInfo>(loadFoundation);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [busy, setBusy] = useState(false);
  const [useRealAssets, setUseRealAssets] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Re-sync from localStorage after hydration (loadFoundation reads window)
  useEffect(() => {
    setFoundation(loadFoundation());
  }, []);

  useEffect(() => {
    fetch("/assets/HUManity logo.png", { method: "HEAD" })
      .then((r) => { if (r.ok) setUseRealAssets(true); })
      .catch(() => {});
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer();
    const parsed = parseFile(buf);
    setDonors(parsed);
    setSelected(new Set(parsed.map((d) => d.id)));
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(donors.map((d) => d.id)) : new Set());
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  async function makePdfBlob(donor: Donor): Promise<Blob> {
    const renderer = await import("@react-pdf/renderer");
    const doc = <ReceiptDoc donor={donor} foundation={foundation} useRealAssets={useRealAssets} />;
    return renderer.pdf(doc).toBlob();
  }

  async function previewSingle(donor: Donor) {
    try {
      const blob = await makePdfBlob(donor);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      alert("PDF generation failed: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  async function downloadSelected() {
    const targets = donors.filter((d) => selected.has(d.id));
    if (!targets.length) return;
    setBusy(true);
    try {
      if (targets.length === 1) {
        const blob = await makePdfBlob(targets[0]);
        downloadBlob(blob, `Receipt_${targets[0].receiptNumber}.pdf`);
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (const donor of targets) {
          const blob = await makePdfBlob(donor);
          zip.file(`Receipt_${donor.receiptNumber}_${sanitise(donor.name)}.pdf`, blob);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `HUManity_Receipts_${Date.now()}.zip`);
      }
    } finally {
      setBusy(false);
    }
  }

  function downloadSample() {
    const buf = buildSampleXLSX();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    downloadBlob(blob, "HUManity_Donor_Template.xlsx");
  }

  function applyEdit(updated: Donor) {
    setDonors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setEditingDonor(null);
  }

  const selectedDonors = donors.filter((d) => selected.has(d.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#1a6e9e] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F5C518] rounded-lg flex items-center justify-center font-bold text-[#1a6e9e] text-xl select-none">H</div>
          <div>
            <div className="font-bold text-lg leading-tight">{foundation.name}</div>
            <div className="text-xs text-[#F5C518] tracking-widest uppercase">{foundation.tagline}</div>
          </div>
        </div>
        <FoundationPanel info={foundation} onChange={(f) => setFoundation(f)} />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Upload zone */}
        <section>
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[#3191c2]/40 rounded-2xl bg-white hover:bg-[#3191c2]/5 transition-colors cursor-pointer p-10 text-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#3191c2]/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#3191c2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Drop your donor file here</p>
                <p className="text-xs text-gray-400 mt-1">Supports Excel (.xlsx, .xls) and CSV files</p>
              </div>
              <span className="px-3 py-1.5 text-xs font-medium text-[#3191c2] border border-[#3191c2]/30 rounded-full hover:bg-[#3191c2]/10 transition-colors">
                Browse file
              </span>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
        </section>

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={downloadSample}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download sample template
            </button>
            {donors.length > 0 && (
              <span className="text-xs text-gray-400">{donors.length} donor{donors.length !== 1 ? "s" : ""} loaded</span>
            )}
          </div>
          {donors.length > 0 && (
            <button
              onClick={downloadSelected}
              disabled={!selectedDonors.length || busy}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1a6e9e] hover:bg-[#3191c2] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {busy ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {selectedDonors.length === 1 ? "Download PDF" : `Download ${selectedDonors.length} PDFs as ZIP`}
                </>
              )}
            </button>
          )}
        </div>

        {/* Donor table */}
        {donors.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Donors</h2>
              <span className="text-xs text-gray-400">{selected.size} of {donors.length} selected</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
                    <th className="w-10 pl-5 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#3191c2] focus:ring-[#3191c2]"
                        checked={selected.size === donors.length && donors.length > 0}
                        onChange={(e) => toggleAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-3 py-3 text-left">#</th>
                    <th className="px-3 py-3 text-left">Donor Name</th>
                    <th className="px-3 py-3 text-left">PAN</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-3 py-3 text-left">Date</th>
                    <th className="px-3 py-3 text-left">Mode</th>
                    <th className="px-3 py-3 text-left">Receipt No.</th>
                    <th className="px-3 py-3 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donors.map((d) => (
                    <tr
                      key={d.id}
                      className={`hover:bg-gray-50 transition-colors ${selected.has(d.id) ? "bg-blue-50/40" : ""}`}
                    >
                      <td className="pl-5 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#3191c2] focus:ring-[#3191c2]"
                          checked={selected.has(d.id)}
                          onChange={() => toggleOne(d.id)}
                        />
                      </td>
                      <td className="px-3 py-3 text-gray-400 tabular-nums">{d.serial}</td>
                      <td className="px-3 py-3 font-medium text-gray-900 max-w-[180px] truncate">{d.name}</td>
                      <td className="px-3 py-3 text-gray-500 font-mono text-xs">{d.pan || "—"}</td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-900 tabular-nums">
                        ₹{formatIndianCurrency(d.amount)}
                      </td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{d.date}</td>
                      <td className="px-3 py-3 text-gray-500">{d.mode ?? "Cash"}</td>
                      <td className="px-3 py-3 font-mono text-xs text-gray-500">{d.receiptNumber}</td>
                      <td className="px-3 py-3 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingDonor(d)}
                            className="p-1.5 text-gray-400 hover:text-[#3191c2] hover:bg-[#3191c2]/10 rounded-md transition-colors"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => previewSingle(d)}
                            className="p-1.5 text-gray-400 hover:text-[#3191c2] hover:bg-[#3191c2]/10 rounded-md transition-colors"
                            title="Preview PDF"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {donors.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Upload a donor file above to get started.
          </div>
        )}
      </main>

      {editingDonor && (
        <EditDonorModal
          donor={editingDonor}
          onSave={applyEdit}
          onClose={() => setEditingDonor(null)}
        />
      )}
    </div>
  );
}

function sanitise(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
