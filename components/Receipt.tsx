/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { Donor, FoundationInfo } from "@/lib/types";
import { amountInWords, formatIndianCurrency } from "@/lib/indic";

// ── Colour tokens (mirror the HTML :root vars) ────────────────
const BLUE    = "#3191C2";
const BLUE_DK = "#1e6a9a";
const BLUE_LT = "#e8f4fb";
const GOLD    = "#F5C518";
const INK     = "#1a1a2e";
const MUTED   = "#64748b";
const RULE    = "#d1e8f5";
const WHITE   = "#ffffff";

const s = StyleSheet.create({
  page: { fontSize: 9, fontFamily: "Helvetica", backgroundColor: WHITE },

  // ── Header ───────────────────────────────────────────────────
  header: { flexDirection: "row", minHeight: 88 },
  logoCell: {
    width: 104,
    backgroundColor: WHITE,
    borderRightWidth: 4,
    borderRightColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  headerText: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 22,
    paddingVertical: 14,
    justifyContent: "center",
  },
  orgName: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 3,
  },
  tagline: {
    fontSize: 8,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  address: { fontSize: 8, color: "rgba(255,255,255,0.85)" },

  // ── Receipt badge (gold bar) ─────────────────────────────────
  badge: {
    backgroundColor: GOLD,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 7,
  },
  badgeLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  badgeMeta: { flexDirection: "row", gap: 20 },
  badgeMetaText: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: INK },

  // ── Amount hero ──────────────────────────────────────────────
  amountHero: {
    backgroundColor: BLUE_LT,
    borderBottomWidth: 2,
    borderBottomColor: RULE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingVertical: 12,
    gap: 20,
  },
  amtBlock: { flex: 1 },
  amtLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  amtFigure: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: BLUE_DK,
    letterSpacing: -0.5,
    lineHeight: 1,
  },
  amtWords: { fontSize: 9, color: MUTED, marginTop: 5 },
  taxBadge: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: WHITE,
  },
  taxLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  taxVal: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE_DK,
    marginTop: 2,
  },
  taxSub: { fontSize: 7.5, color: MUTED, marginTop: 2 },

  // ── Body ─────────────────────────────────────────────────────
  body: { paddingHorizontal: 26, paddingTop: 14, paddingBottom: 8 },

  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: RULE,
    marginBottom: 9,
  },

  // Field helpers
  fieldRow: { flexDirection: "row", marginBottom: 10 },
  field: { flex: 1 },
  fieldGap: { width: 24 },
  fieldLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: INK,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: RULE,
    minHeight: 18,
  },
  fieldValueMuted: {
    fontSize: 10.5,
    color: MUTED,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: RULE,
    minHeight: 18,
  },

  // 80G exemption block
  exemptionBlock: {
    backgroundColor: BLUE_LT,
    borderWidth: 1.5,
    borderColor: RULE,
    borderRadius: 6,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 12,
  },
  exItem: { flex: 1 },
  exLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  exVal: { fontSize: 10, fontFamily: "Helvetica-Bold", color: BLUE_DK },

  // Declaration
  declaration: {
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.6,
    backgroundColor: "#fafafa",
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    marginBottom: 10,
  },

  // Footer signature row
  footerSig: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: RULE,
  },
  sigLeft: { flex: 1, paddingRight: 20 },
  sigLeftText: { fontSize: 8.5, color: MUTED, lineHeight: 1.7 },
  sigLeftBold: { fontFamily: "Helvetica-Bold", color: BLUE },
  sigRight: { alignItems: "center" },
  sigName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: INK,
    textAlign: "center",
    marginTop: 5,
  },
  sigDesignation: { fontSize: 8.5, color: MUTED, textAlign: "center" },

  // Bottom bar
  bottomBar: {
    backgroundColor: BLUE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  bottomContact: { fontSize: 8.5, color: "rgba(255,255,255,0.9)" },
  bottomContactBold: { color: WHITE, fontFamily: "Helvetica-Bold" },
  bottomThankyou: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.5,
  },
});

// ── Helper: one labelled field ────────────────────────────────
function Field({
  label,
  value,
  blank = false,
}: {
  label: string;
  value?: string;
  blank?: boolean;
}) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      {blank || !value ? (
        <Text style={s.fieldValueMuted}>—</Text>
      ) : (
        <Text style={s.fieldValue}>{value}</Text>
      )}
    </View>
  );
}

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

interface Props {
  donor: Donor;
  foundation: FoundationInfo;
  useRealAssets?: boolean;
}

export function ReceiptDoc({ donor, foundation, useRealAssets = false }: Props) {
  const d = new Date(donor.date);
  const monthYear = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }).replace(" ", " ");

  const paymentDetails = donor.chequeNo
    ? `${donor.chequeNo}${donor.bankName ? " / " + donor.bankName : ""}`
    : donor.bankName ?? "";

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Logo cell */}
          <View style={s.logoCell}>
            {useRealAssets ? (
              <Image src={`${ORIGIN}/assets/Logos-2.png`} style={{ width: 72, height: 72 }} />
            ) : (
              <View style={{
                width: 72, height: 72, backgroundColor: BLUE_LT, borderRadius: 6,
                alignItems: "center", justifyContent: "center",
              }}>
                <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: BLUE, textAlign: "center" }}>
                  {"HUM\nanity"}
                </Text>
              </View>
            )}
          </View>

          {/* Text cell */}
          <View style={s.headerText}>
            <Text style={s.orgName}>{foundation.name}</Text>
            <Text style={s.tagline}>For Children · For Change · For Humanity</Text>
            <Text style={s.address}>
              Registered under Section 8 Companies Act  |  {foundation.address}
            </Text>
          </View>
        </View>

        {/* ── RECEIPT BADGE ── */}
        <View style={s.badge}>
          <Text style={s.badgeLabel}>Donation Receipt</Text>
          <View style={s.badgeMeta}>
            <Text style={s.badgeMetaText}>Receipt No: {donor.receiptNumber}</Text>
            <Text style={s.badgeMetaText}>Date: {monthYear}</Text>
          </View>
        </View>

        {/* ── AMOUNT HERO ── */}
        <View style={s.amountHero}>
          <View style={s.amtBlock}>
            <Text style={s.amtLabel}>Amount Received</Text>
            <Text style={s.amtFigure}>Rs {formatIndianCurrency(donor.amount)}/-</Text>
            <Text style={s.amtWords}>{amountInWords(donor.amount)}</Text>
          </View>
          <View style={s.taxBadge}>
            <Text style={s.taxLabel}>Tax Exemption</Text>
            <Text style={s.taxVal}>80G</Text>
            <Text style={s.taxSub}>Eligible & Declared</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={s.body}>

          {/* Donor Details */}
          <Text style={s.sectionLabel}>Donor Details</Text>

          {/* Donated by — full width */}
          <View style={s.fieldRow}>
            <Field label="Donated By (Organisation / Name)" value={donor.name} />
          </View>

          {/* Place | Email */}
          <View style={s.fieldRow}>
            <Field label="Place" value={donor.city} />
            <View style={s.fieldGap} />
            <Field label="Email ID" value={donor.email} blank={!donor.email} />
          </View>

          {/* Phone | PAN */}
          <View style={[s.fieldRow, { marginBottom: 14 }]}>
            <Field label="Phone" value={donor.phone} blank={!donor.phone} />
            <View style={s.fieldGap} />
            <Field label="PAN Card No." value={donor.pan} blank={!donor.pan} />
          </View>

          {/* Payment Details */}
          <Text style={s.sectionLabel}>Payment Details</Text>

          {/* Mode | Bank | Ref */}
          <View style={[s.fieldRow, { marginBottom: 14 }]}>
            <Field label="Mode of Payment" value={donor.mode ?? "Cash"} />
            <View style={s.fieldGap} />
            <Field label="Bank / Details" value={paymentDetails} blank={!paymentDetails} />
            <View style={s.fieldGap} />
            <Field label="Transaction Ref." value={undefined} blank />
          </View>

          {/* 80G Exemption block */}
          <View style={s.exemptionBlock}>
            <View style={s.exItem}>
              <Text style={s.exLabel}>CIN</Text>
              <Text style={s.exVal}>{foundation.cin}</Text>
            </View>
            <View style={s.exItem}>
              <Text style={s.exLabel}>PAN Card Number</Text>
              <Text style={s.exVal}>{foundation.pan}</Text>
            </View>
            <View style={s.exItem}>
              <Text style={s.exLabel}>80G Number</Text>
              <Text style={s.exVal}>{foundation.reg80G}</Text>
            </View>
          </View>

          {/* Declaration */}
          <Text style={s.declaration}>
            We hereby confirm that the aforementioned donation has been received by HUManity
            Organisation, {foundation.city}. We declare that this donation is exempt from tax
            under Section 80G of the Income Tax Act.
          </Text>

          {/* Signature row */}
          <View style={s.footerSig}>
            <View style={s.sigLeft}>
              <Text style={s.sigLeftText}>
                For queries, reach us at{" "}
                <Text style={s.sigLeftBold}>{foundation.email}</Text>
                {"\n"}or visit{" "}
                <Text style={s.sigLeftBold}>{foundation.website}</Text>
              </Text>
            </View>

            <View style={s.sigRight}>
              {useRealAssets ? (
                <Image
                  src={`${ORIGIN}/assets/humanity_donation_stamp.png`}
                  style={{ width: 80, height: 80 }}
                />
              ) : (
                <View style={{
                  width: 80, height: 80, borderRadius: 40,
                  borderWidth: 2, borderColor: BLUE,
                  backgroundColor: BLUE_LT,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Text style={{ fontSize: 6, fontFamily: "Helvetica-Bold", color: BLUE, textAlign: "center", lineHeight: 1.5 }}>
                    {"DONATION\nACKNOWLEDGED\nHUManity\nFoundation"}
                  </Text>
                </View>
              )}
              {useRealAssets && (
                <Image
                  src={`${ORIGIN}/assets/Abhishek Sign - Edited.png`}
                  style={{ width: 90, height: 36, marginTop: 4 }}
                />
              )}
              <Text style={s.sigName}>Authorised Signature</Text>
              <Text style={s.sigDesignation}>HUManity Foundation</Text>
            </View>
          </View>

        </View>

        {/* ── BOTTOM BAR ── */}
        <View style={s.bottomBar}>
          <Text style={s.bottomContact}>
            <Text style={s.bottomContactBold}>{foundation.email}</Text>
            {"  |  "}
            {foundation.website}
          </Text>
          <Text style={s.bottomThankyou}>Thank you for your generous contribution.</Text>
        </View>

      </Page>
    </Document>
  );
}
