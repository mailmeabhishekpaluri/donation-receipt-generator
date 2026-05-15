/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { Donor, FoundationInfo } from "@/lib/types";
import { amountInWords, formatIndianCurrency } from "@/lib/indic";

const BLUE = "#3191c2";
const WHITE = "#ffffff";
const BLACK = "#000000";

const s = StyleSheet.create({
  page: {
    fontSize: 9,
    color: BLACK,
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
    paddingBottom: 0,
  },

  // ── Header band ──────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 72,
  },
  logoBox: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  logoInner: {
    backgroundColor: BLUE,
    borderWidth: 2,
    borderColor: WHITE,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  logoH: { fontSize: 22, fontFamily: "Helvetica-Bold", color: WHITE },
  logoU: { fontSize: 7, color: WHITE, marginTop: 1 },
  logoTagline: { fontSize: 6.5, color: WHITE, marginTop: 2, textAlign: "center" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  orgName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    textAlign: "center",
    marginBottom: 3,
  },
  orgSub: { fontSize: 8, color: WHITE, textAlign: "center", fontFamily: "Helvetica-Bold" },
  orgAddr: { fontSize: 8, color: WHITE, textAlign: "center", marginTop: 2 },
  handshakeBox: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    flexShrink: 0,
  },

  // ── Body ──────────────────────────────────────────────────────
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, flex: 1 },

  // Receipt No / Date row
  receiptDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  receiptNo: { fontSize: 9, fontFamily: "Helvetica-Bold" },

  // ── Form field helpers ────────────────────────────────────────
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 8 },
  label: { fontSize: 8.5, fontFamily: "Helvetica-Bold", marginRight: 4, whiteSpace: "nowrap" },
  field: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
    paddingBottom: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minHeight: 14,
  },
  fieldSub: { fontSize: 6.5, color: "#555", textAlign: "center", marginTop: 1 },
  spacer: { width: 10 },

  // ── Name row ─────────────────────────────────────────────────
  nameRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 2 },
  nameLabels: { flexDirection: "row", marginBottom: 8 },
  nameLabel: { flex: 1, fontSize: 6.5, color: "#555", textAlign: "center" },

  // ── Amount row ───────────────────────────────────────────────
  divider: { borderBottomWidth: 1, borderBottomColor: BLACK, marginVertical: 6 },

  // ── Registration box ─────────────────────────────────────────
  regBox: {
    borderWidth: 1,
    borderColor: BLACK,
    backgroundColor: "#daeef8",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  regItem: { fontSize: 7.5, fontFamily: "Helvetica-Bold", textAlign: "center" },

  // ── Footer text ───────────────────────────────────────────────
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  footerLeft: { flex: 1, paddingRight: 20 },
  footerText: { fontSize: 7.5, marginBottom: 3 },
  footerBold: { fontFamily: "Helvetica-Bold" },
  footerRight: { alignItems: "center", minWidth: 90 },
  sealBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  sealText: { fontSize: 5.5, color: BLUE, textAlign: "center" },
  sigLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", textAlign: "center" },

  // 80G row
  g80Row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  circle: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 1,
    borderColor: BLACK,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  circleText: { fontSize: 6, fontFamily: "Helvetica-Bold" },
});

// ── Underline field with centred value ───────────────────────
function Field({ value, flex = 1, sub }: { value?: string; flex?: number; sub?: string }) {
  return (
    <View style={{ flex, marginHorizontal: 2 }}>
      <View style={[s.field, { flex: undefined }]}>
        <Text>{value ?? ""}</Text>
      </View>
      {sub ? <Text style={s.fieldSub}>{sub}</Text> : null}
    </View>
  );
}

// ── Handshake placeholder (replaced by <Image> when PNG present) ──
function HandshakePlaceholder() {
  return (
    <View style={{ width: 52, height: 52, borderWidth: 2, borderColor: WHITE, borderRadius: 26, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, color: WHITE }}>🤝</Text>
    </View>
  );
}

function SealPlaceholder() {
  return (
    <View style={s.sealBox}>
      <Text style={s.sealText}>{"HUMANITY\nUPLIFTING\nMANKIND\nFOUNDATION"}</Text>
      <Text style={[s.sealText, { marginTop: 2 }]}>NGO REG.</Text>
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
  const monthYear = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }).replace(" ", "-");

  const paymentDetails =
    donor.chequeNo
      ? `${donor.chequeNo}${donor.bankName ? " / " + donor.bankName : ""}`
      : donor.bankName ?? "";

  const city = donor.city || "";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Logo */}
          <View style={s.logoBox}>
            {useRealAssets ? (
              <Image src={`${ORIGIN}/assets/logo.png`} style={{ width: 80, height: 55 }} />
            ) : (
              <View style={s.logoInner}>
                <Text style={s.logoH}>HUManity</Text>
                <Text style={s.logoTagline}>Humanity Uplifting Mankind</Text>
              </View>
            )}
          </View>

          {/* Centre text */}
          <View style={s.headerCenter}>
            <Text style={s.orgName}>{foundation.name}</Text>
            <Text style={s.orgSub}>{foundation.subTagline}</Text>
            <Text style={s.orgAddr}>{foundation.address}</Text>
          </View>

          {/* Handshake */}
          <View style={s.handshakeBox}>
            {useRealAssets ? (
              <Image src={`${ORIGIN}/assets/handshake.png`} style={{ width: 52, height: 52 }} />
            ) : (
              <HandshakePlaceholder />
            )}
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={s.body}>

          {/* Receipt No / Date */}
          <View style={s.receiptDateRow}>
            <Text style={s.receiptNo}>Receipt No: {donor.receiptNumber}</Text>
            <Text style={s.receiptNo}>Date: {monthYear}</Text>
          </View>

          {/* Donated by + Place */}
          <View style={s.nameRow}>
            <Text style={s.label}>Donated by:</Text>
            <Field value={donor.name} flex={3} />
            <View style={s.spacer} />
            <Text style={s.label}>Place:</Text>
            <Field value={city} flex={1} />
          </View>
          <View style={s.nameLabels}>
            {/* indent past the "Donated by:" label (~65pt) */}
            <View style={{ width: 65 }} />
            <Text style={[s.nameLabel, { flex: 1 }]}>(First name)</Text>
            <Text style={[s.nameLabel, { flex: 2 }]}>(Last name)</Text>
            <View style={{ width: 75 }} />
          </View>

          {/* Email / Phone */}
          <View style={s.row}>
            <Text style={s.label}>Email id:</Text>
            <Field value={donor.email} flex={3} />
            <View style={s.spacer} />
            <Text style={s.label}>Phone:</Text>
            <Field value={donor.phone} flex={1} />
          </View>

          {/* Amount */}
          <View style={s.row}>
            <Text style={s.label}>Amount Received:</Text>
            <Field value={`Rs ${formatIndianCurrency(donor.amount)}/-`} flex={2} />
            <View style={s.spacer} />
            <Text style={s.label}>In words:</Text>
            <Field value={amountInWords(donor.amount)} flex={3} />
          </View>

          {/* Divider */}
          <View style={s.divider} />

          {/* Mode / Details / PAN */}
          <View style={s.row}>
            <Text style={s.label}>Mode of Payment:</Text>
            <Field value={donor.mode ?? "Cash"} flex={1} />
            <View style={s.spacer} />
            <Text style={s.label}>Details:</Text>
            <Field value={paymentDetails} flex={1} />
            <View style={s.spacer} />
            <Text style={s.label}>PAN card No:</Text>
            <Field value={donor.pan} flex={1} />
          </View>

          {/* 80G */}
          <View style={s.g80Row}>
            <Text style={s.label}>80 G tax exemption:</Text>
            <View style={s.circle}><Text style={s.circleText}>Yes</Text></View>
            <Text style={{ fontSize: 8 }}> / No</Text>
            <Text style={{ fontSize: 7.5, marginLeft: 8 }}>
              If Yes, we declare that the donation to the organisation is exempt u/s 80G.
            </Text>
          </View>

          {/* Registration box */}
          <View style={s.regBox}>
            <Text style={s.regItem}>CIN: {foundation.cin}</Text>
            <Text style={s.regItem}>PAN CARD NUMBER: {foundation.pan}</Text>
            <Text style={s.regItem}>80G NUMBER: {foundation.reg80G}</Text>
          </View>

          {/* Footer */}
          <View style={s.footerRow}>
            <View style={s.footerLeft}>
              <Text style={s.footerText}>
                We hereby confirm that the aforementioned donation has been received by HUManity organisation, {foundation.city}.
              </Text>
              <Text style={s.footerText}>
                In case of queries, reach out to us at{" "}
                <Text style={s.footerBold}>{foundation.email}</Text>
                {" "}or visit{" "}
                <Text style={s.footerBold}>{foundation.website}</Text>
              </Text>
            </View>
            <View style={s.footerRight}>
              {useRealAssets ? (
                <Image src={`${ORIGIN}/assets/seal.png`} style={{ width: 64, height: 64, marginBottom: 4 }} />
              ) : (
                <SealPlaceholder />
              )}
              {useRealAssets ? (
                <Image src={`${ORIGIN}/assets/signature.png`} style={{ width: 70, height: 28, marginBottom: 2 }} />
              ) : null}
              <Text style={s.sigLabel}>Authorised Signature</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
