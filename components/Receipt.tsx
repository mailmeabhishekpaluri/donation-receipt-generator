/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { Donor, FoundationInfo } from "@/lib/types";
import { amountInWords, formatIndianCurrency } from "@/lib/indic";

const BLUE  = "#3191c2";
const WHITE = "#ffffff";
const BLACK = "#000000";
const LIGHT = "#daeef8";
const GRAY  = "#555555";

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: BLACK,
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
  },

  // ── Header ───────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 16,
    minHeight: 100,
  },
  logoCard: {
    backgroundColor: WHITE,
    borderRadius: 6,
    padding: 10,           // generous white space on all sides
    marginRight: 18,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    textAlign: "center",
    marginBottom: 4,
  },
  orgSub: {
    fontSize: 8,
    color: WHITE,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  orgAddr: {
    fontSize: 7.5,
    color: WHITE,
    textAlign: "center",
    marginTop: 3,
  },

  // ── Body ─────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 10,
    flex: 1,
  },

  // Receipt No / Date
  receiptDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  receiptNo: { fontSize: 10, fontFamily: "Helvetica-Bold" },

  // ── Vertical field block ──────────────────────────────────────
  // label above, underline below
  fieldBlock: { marginBottom: 12 },
  fieldLabel: {
    fontSize: 8,
    color: GRAY,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  fieldLine: {
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
    paddingBottom: 3,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    minHeight: 16,
  },
  fieldHint: {
    flexDirection: "row",
    marginTop: 2,
  },
  fieldHintText: {
    flex: 1,
    fontSize: 6.5,
    color: GRAY,
    textAlign: "center",
  },

  // Two-column row (for fields that naturally pair)
  twoCol: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  colHalf: { flex: 1 },

  // Three-column row (mode / details / PAN)
  threeCol: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  colThird: { flex: 1 },

  smallLabel: {
    fontSize: 7.5,
    color: GRAY,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  smallLine: {
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
    paddingBottom: 3,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    minHeight: 15,
    textAlign: "center",
  },

  // Divider
  divider: { borderBottomWidth: 1, borderBottomColor: "#cccccc", marginVertical: 10 },

  // 80G row
  g80Row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  g80Label: { fontSize: 8.5, fontFamily: "Helvetica-Bold", marginRight: 4 },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.2,
    borderColor: BLACK,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },
  circleText: { fontSize: 7, fontFamily: "Helvetica-Bold" },

  // Registration box
  regBox: {
    borderWidth: 1,
    borderColor: BLACK,
    backgroundColor: LIGHT,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 7,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  regItem: { fontSize: 7.5, fontFamily: "Helvetica-Bold", textAlign: "center" },

  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: { flex: 1, paddingRight: 16 },
  footerText: { fontSize: 8, color: BLACK, marginBottom: 4, lineHeight: 1.4 },
  footerBold: { fontFamily: "Helvetica-Bold" },
  footerRight: { alignItems: "center", minWidth: 120 },
  sigLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 4,
  },
});

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";

interface Props {
  donor: Donor;
  foundation: FoundationInfo;
  useRealAssets?: boolean;
}

export function ReceiptDoc({ donor, foundation, useRealAssets = false }: Props) {
  const d = new Date(donor.date);
  const monthYear = d
    .toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    .replace(" ", "-");

  const paymentDetails = donor.chequeNo
    ? `${donor.chequeNo}${donor.bankName ? " / " + donor.bankName : ""}`
    : donor.bankName ?? "";

  return (
    <Document>
      {/* Portrait A4 */}
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* New square logo with white card + generous padding */}
          <View style={s.logoCard}>
            {useRealAssets ? (
              <Image
                src={`${ORIGIN}/assets/Logos-2.png`}
                style={{ width: 72, height: 72 }}
              />
            ) : (
              <View style={{ width: 72, height: 72, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: BLUE }}>HUM</Text>
                <Text style={{ fontSize: 7, color: "#555", textAlign: "center" }}>Humanity{"\n"}Uplifting Mankind</Text>
              </View>
            )}
          </View>

          <View style={s.headerCenter}>
            <Text style={s.orgName}>{foundation.name}</Text>
            <Text style={s.orgSub}>{foundation.subTagline}</Text>
            <Text style={s.orgAddr}>{foundation.address}</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={s.body}>

          {/* Receipt No / Date */}
          <View style={s.receiptDateRow}>
            <Text style={s.receiptNo}>Receipt No: {donor.receiptNumber}</Text>
            <Text style={s.receiptNo}>Date: {monthYear}</Text>
          </View>

          {/* Donated by — full width */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Donated by</Text>
            <Text style={s.fieldLine}>{donor.name}</Text>
            <View style={s.fieldHint}>
              <Text style={s.fieldHintText}>(First name)</Text>
              <Text style={[s.fieldHintText, { flex: 2 }]}>(Last name)</Text>
            </View>
          </View>

          {/* Place + Email side by side */}
          <View style={s.twoCol}>
            <View style={s.colHalf}>
              <Text style={s.fieldLabel}>Place</Text>
              <Text style={s.fieldLine}>{donor.city ?? ""}</Text>
            </View>
            <View style={s.colHalf}>
              <Text style={s.fieldLabel}>Phone</Text>
              <Text style={s.fieldLine}>{donor.phone ?? ""}</Text>
            </View>
          </View>

          {/* Email — full width */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Email id</Text>
            <Text style={s.fieldLine}>{donor.email ?? ""}</Text>
          </View>

          {/* Amount — full width */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Amount Received</Text>
            <Text style={s.fieldLine}>Rs {formatIndianCurrency(donor.amount)}/-</Text>
          </View>

          {/* In words — full width */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>In Words</Text>
            <Text style={s.fieldLine}>{amountInWords(donor.amount)}</Text>
          </View>

          <View style={s.divider} />

          {/* Mode / Details / PAN — three columns */}
          <View style={s.threeCol}>
            <View style={s.colThird}>
              <Text style={s.smallLabel}>Mode of Payment</Text>
              <Text style={s.smallLine}>{donor.mode ?? "Cash"}</Text>
            </View>
            <View style={s.colThird}>
              <Text style={s.smallLabel}>Details</Text>
              <Text style={s.smallLine}>{paymentDetails}</Text>
            </View>
            <View style={s.colThird}>
              <Text style={s.smallLabel}>PAN Card No</Text>
              <Text style={s.smallLine}>{donor.pan ?? ""}</Text>
            </View>
          </View>

          {/* 80G */}
          <View style={s.g80Row}>
            <Text style={s.g80Label}>80 G tax exemption:</Text>
            <View style={s.circle}><Text style={s.circleText}>Yes</Text></View>
            <Text style={{ fontSize: 9 }}> / No</Text>
            <Text style={{ fontSize: 8, marginLeft: 10 }}>
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
                We hereby confirm that the aforementioned donation has been received by
                HUManity organisation, {foundation.city}.
              </Text>
              <Text style={s.footerText}>
                In case of queries, reach out to us at{" "}
                <Text style={s.footerBold}>{foundation.email}</Text>
                {"\n"}or visit{" "}
                <Text style={s.footerBold}>{foundation.website}</Text>
              </Text>
            </View>

            {/* Stamp (large) + Signature (large) stacked */}
            <View style={s.footerRight}>
              {useRealAssets ? (
                <Image
                  src={`${ORIGIN}/assets/humanity_donation_stamp.png`}
                  style={{ width: 115, height: 115 }}
                />
              ) : (
                <View style={{
                  width: 115, height: 115, borderRadius: 57.5,
                  borderWidth: 2, borderColor: BLUE,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Text style={{ fontSize: 6, color: BLUE, textAlign: "center" }}>
                    {"HUMANITY\nUPLIFTING\nMANKIND\nFOUNDATION\nNGO REG."}
                  </Text>
                </View>
              )}
              {useRealAssets ? (
                <Image
                  src={`${ORIGIN}/assets/Abhishek Sign - Edited.png`}
                  style={{ width: 115, height: 48, marginTop: 6 }}
                />
              ) : (
                <View style={{ width: 115, height: 48, marginTop: 6 }} />
              )}
              <Text style={s.sigLabel}>Authorised Signature</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
