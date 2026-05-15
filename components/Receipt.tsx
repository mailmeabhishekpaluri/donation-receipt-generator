/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Donor, FoundationInfo } from "@/lib/types";
import { amountInWords, formatIndianCurrency } from "@/lib/indic";

Font.register({
  family: "NotoSans",
  fonts: [
    { src: "https://fonts.gstatic.com/s/notosans/v28/o-0IIpQlx3QUlC5A4PNb4g.woff2" },
    {
      src: "https://fonts.gstatic.com/s/notosans/v28/o-0NIpQlx3QUlC5A4PNjXhFVatyBx2pqPIif.woff2",
      fontWeight: "bold",
    },
  ],
});

const BLUE = "#3191c2";
const DARK_BLUE = "#1a6e9e";
const YELLOW = "#F5C518";
const LIGHT_GRAY = "#f5f7fa";
const BORDER = "#dde3ea";

const s = StyleSheet.create({
  page: { fontFamily: "NotoSans", fontSize: 9, color: "#1a1a1a", backgroundColor: "#fff" },
  // Header band
  header: { backgroundColor: DARK_BLUE, paddingHorizontal: 28, paddingVertical: 14, flexDirection: "row", alignItems: "center" },
  logoBox: { width: 52, height: 52, marginRight: 14 },
  headerText: { flex: 1 },
  orgName: { fontSize: 17, fontWeight: "bold", color: "#fff", letterSpacing: 0.5 },
  tagline: { fontSize: 8, color: YELLOW, marginTop: 2, letterSpacing: 1 },
  headerRight: { alignItems: "flex-end" },
  receiptLabel: { fontSize: 10, color: YELLOW, fontWeight: "bold", letterSpacing: 1 },
  receiptNo: { fontSize: 14, color: "#fff", fontWeight: "bold", marginTop: 2 },
  // Yellow bar
  yellowBar: { backgroundColor: YELLOW, height: 3 },
  // Body
  body: { paddingHorizontal: 28, paddingTop: 14 },
  // Date row
  dateRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 12 },
  dateText: { fontSize: 8.5, color: "#555" },
  // Section title
  sectionTitle: { fontSize: 8, color: DARK_BLUE, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 },
  // Certified block
  certifiedBox: { backgroundColor: LIGHT_GRAY, borderLeft: `3 solid ${BLUE}`, padding: 10, marginBottom: 12 },
  certText: { lineHeight: 1.7 },
  highlight: { fontWeight: "bold", color: DARK_BLUE },
  // Info grid
  infoGrid: { flexDirection: "row", gap: 10, marginBottom: 12 },
  infoBox: { flex: 1, border: `1 solid ${BORDER}`, borderRadius: 4, padding: 8 },
  infoLabel: { fontSize: 7.5, color: "#888", marginBottom: 2 },
  infoValue: { fontSize: 9, fontWeight: "bold", color: "#1a1a1a" },
  // Amount box
  amountBox: { backgroundColor: DARK_BLUE, borderRadius: 6, padding: 12, marginBottom: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  amountLabel: { fontSize: 9, color: "#cce6f5" },
  amountValue: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  amountWords: { fontSize: 8, color: YELLOW, marginTop: 3 },
  // Purpose
  purposeRow: { flexDirection: "row", marginBottom: 12 },
  purposeBox: { flex: 1, border: `1 solid ${BORDER}`, borderRadius: 4, padding: 8, marginRight: 8 },
  // 80G note
  note80G: { backgroundColor: "#fffbea", border: `1 solid #f5c518`, borderRadius: 4, padding: 8, marginBottom: 12 },
  // Signature row
  sigRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, marginBottom: 12 },
  sigBox: { alignItems: "center" },
  sigImage: { width: 80, height: 36, marginBottom: 4 },
  sigLine: { width: 120, borderBottom: `1 solid #999`, marginBottom: 4 },
  sigLabel: { fontSize: 7.5, color: "#555" },
  sealBox: { alignItems: "center" },
  sealImage: { width: 56, height: 56 },
  // Footer
  footer: { backgroundColor: DARK_BLUE, paddingHorizontal: 28, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 7, color: "#cce6f5" },
  footerBold: { fontWeight: "bold", color: "#fff" },
  // Divider
  divider: { height: 1, backgroundColor: BORDER, marginBottom: 10 },
});

// Placeholder SVG-drawn assets (replaced by <Image> when real PNGs are present)
function LogoPlaceholder() {
  return (
    <View style={{ width: 52, height: 52, backgroundColor: YELLOW, borderRadius: 6, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontWeight: "bold", fontSize: 14, color: DARK_BLUE }}>H</Text>
    </View>
  );
}

function SealPlaceholder() {
  return (
    <View style={{ width: 56, height: 56, borderRadius: 28, border: `2 solid ${BLUE}`, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 7, color: BLUE, textAlign: "center" }}>OFFICIAL{"\n"}SEAL</Text>
    </View>
  );
}

function SignaturePlaceholder() {
  return (
    <View style={{ width: 80, height: 36, borderBottom: `1 solid #999` }}>
      <Text style={{ fontSize: 7, color: "#aaa", paddingTop: 12, paddingLeft: 6 }}>Authorised</Text>
    </View>
  );
}

function HandshakePlaceholder() {
  return (
    <View style={{ width: 32, height: 32, backgroundColor: YELLOW, borderRadius: 4, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 10 }}>🤝</Text>
    </View>
  );
}

const ASSET_BASE = typeof window !== "undefined" ? window.location.origin : "";

function assetUrl(path: string) {
  return `${ASSET_BASE}${path}`;
}

interface ReceiptProps {
  donor: Donor;
  foundation: FoundationInfo;
  // If true, use <Image> for assets (set to true when PNGs exist)
  useRealAssets?: boolean;
}

export function ReceiptDoc({ donor, foundation, useRealAssets = false }: ReceiptProps) {
  const formattedDate = new Date(donor.date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const paymentDetail =
    donor.mode && donor.mode !== "Cash"
      ? `${donor.mode}${donor.chequeNo ? ` No. ${donor.chequeNo}` : ""}${donor.bankName ? `, ${donor.bankName}` : ""}`
      : donor.mode ?? "Cash";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.logoBox}>
            {useRealAssets ? (
              <Image src={assetUrl("/assets/logo.png")} style={{ width: 52, height: 52 }} />
            ) : (
              <LogoPlaceholder />
            )}
          </View>
          <View style={s.headerText}>
            <Text style={s.orgName}>{foundation.name}</Text>
            <Text style={s.tagline}>{foundation.tagline.toUpperCase()}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.receiptLabel}>DONATION RECEIPT</Text>
            <Text style={s.receiptNo}>#{donor.receiptNumber}</Text>
          </View>
        </View>

        {/* Yellow accent bar */}
        <View style={s.yellowBar} />

        <View style={s.body}>
          {/* Date */}
          <View style={s.dateRow}>
            <Text style={s.dateText}>Date: <Text style={{ fontWeight: "bold" }}>{formattedDate}</Text></Text>
          </View>

          {/* Certified block */}
          <Text style={s.sectionTitle}>Certification</Text>
          <View style={s.certifiedBox}>
            <Text style={s.certText}>
              This is to certify that{" "}
              <Text style={s.highlight}>{donor.name}</Text>
              {donor.pan ? (
                <>
                  {" "}(PAN: <Text style={s.highlight}>{donor.pan}</Text>)
                </>
              ) : null}
              {donor.address ? (
                <>, residing at <Text style={s.highlight}>{donor.address}</Text>,</>
              ) : null}{" "}
              has made a donation of{" "}
              <Text style={s.highlight}>₹{formatIndianCurrency(donor.amount)}</Text>{" "}
              to <Text style={s.highlight}>{foundation.name}</Text> on{" "}
              <Text style={s.highlight}>{formattedDate}</Text> by {paymentDetail}.
            </Text>
          </View>

          {/* Info grid */}
          <View style={s.infoGrid}>
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>Donor Name</Text>
              <Text style={s.infoValue}>{donor.name}</Text>
            </View>
            {donor.pan && (
              <View style={s.infoBox}>
                <Text style={s.infoLabel}>PAN</Text>
                <Text style={s.infoValue}>{donor.pan}</Text>
              </View>
            )}
            <View style={s.infoBox}>
              <Text style={s.infoLabel}>Payment Mode</Text>
              <Text style={s.infoValue}>{paymentDetail}</Text>
            </View>
          </View>

          {/* Amount */}
          <View style={s.amountBox}>
            <View>
              <Text style={s.amountLabel}>Donation Amount</Text>
              <Text style={s.amountWords}>{amountInWords(donor.amount)}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 10, color: "#cce6f5" }}>₹</Text>
              <Text style={s.amountValue}>{formatIndianCurrency(donor.amount)}</Text>
            </View>
          </View>

          {/* Purpose + handshake */}
          <View style={s.purposeRow}>
            <View style={s.purposeBox}>
              <Text style={s.infoLabel}>Purpose</Text>
              <Text style={s.infoValue}>General Donation — Charitable Activities</Text>
            </View>
            <View style={{ justifyContent: "center", paddingLeft: 8 }}>
              {useRealAssets ? (
                <Image src={assetUrl("/assets/handshake.png")} style={{ width: 32, height: 32 }} />
              ) : (
                <HandshakePlaceholder />
              )}
            </View>
          </View>

          {/* 80G note */}
          <View style={s.note80G}>
            <Text style={{ fontSize: 8, color: "#7a5c00" }}>
              <Text style={{ fontWeight: "bold" }}>80G Exemption:</Text> This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.{" "}
              80G Reg. No.: <Text style={{ fontWeight: "bold" }}>{foundation.reg80G}</Text>
            </Text>
          </View>

          <View style={s.divider} />

          {/* Signature row */}
          <View style={s.sigRow}>
            <View style={s.sigBox}>
              {useRealAssets ? (
                <Image src={assetUrl("/assets/signature.png")} style={s.sigImage} />
              ) : (
                <SignaturePlaceholder />
              )}
              <Text style={s.sigLabel}>Authorised Signatory</Text>
              <Text style={{ fontSize: 7.5, color: "#555", marginTop: 1 }}>{foundation.name}</Text>
            </View>
            <View style={s.sealBox}>
              {useRealAssets ? (
                <Image src={assetUrl("/assets/seal.png")} style={s.sealImage} />
              ) : (
                <SealPlaceholder />
              )}
              <Text style={{ fontSize: 7, color: "#555", marginTop: 3 }}>Official Seal</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <View>
            <Text style={s.footerText}>
              <Text style={s.footerBold}>CIN:</Text> {foundation.cin}{"  "}
              <Text style={s.footerBold}>PAN:</Text> {foundation.pan}
            </Text>
            <Text style={[s.footerText, { marginTop: 2 }]}>{foundation.address}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.footerText}>{foundation.website}</Text>
            <Text style={[s.footerText, { marginTop: 2 }]}>{foundation.email}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
