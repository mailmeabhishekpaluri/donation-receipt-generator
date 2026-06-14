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

const s = StyleSheet.create({
  page: {
    fontSize: 9.5,
    color: BLACK,
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
  },

  // ── Header ───────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 96,
  },
  // Logo on white card — generous white space around the image
  logoCard: {
    backgroundColor: WHITE,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 16,
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
    fontSize: 16,
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
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 8,
    flex: 1,
  },

  // Receipt No / Date row
  receiptDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  receiptNo: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },

  // ── Form field helpers ────────────────────────────────────────
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 10 },
  label: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    marginRight: 4,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  field: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: BLACK,
    paddingBottom: 2,
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minHeight: 15,
  },
  fieldSub: { fontSize: 6.5, color: "#555", textAlign: "center", marginTop: 1 },
  spacer: { width: 10 },

  // Name sub-labels
  nameRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 2 },
  nameLabels: { flexDirection: "row", marginBottom: 10 },
  nameLabel: { flex: 1, fontSize: 6.5, color: "#555", textAlign: "center" },

  // Divider
  divider: { borderBottomWidth: 1, borderBottomColor: BLACK, marginVertical: 8 },

  // 80G row
  g80Row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  circle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1,
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  regItem: { fontSize: 7.5, fontFamily: "Helvetica-Bold", textAlign: "center" },

  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: { flex: 1, paddingRight: 16 },
  footerText: { fontSize: 7.5, marginBottom: 4 },
  footerBold: { fontFamily: "Helvetica-Bold" },
  footerRight: { alignItems: "center", minWidth: 120 },
  sigLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 3,
  },
});

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
          {/* Logo — white card with ample padding so the logo breathes */}
          <View style={s.logoCard}>
            {useRealAssets ? (
              <Image
                src={`${ORIGIN}/assets/HUManity logo.png`}
                style={{ width: 130, height: 50 }}
              />
            ) : (
              <View style={{ width: 130, height: 50, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: BLUE }}>HUManity</Text>
                <Text style={{ fontSize: 7.5, color: "#555" }}>Humanity Uplifting Mankind</Text>
              </View>
            )}
          </View>

          {/* Centre text */}
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

          {/* Donated by + Place */}
          <View style={s.nameRow}>
            <Text style={s.label}>Donated by:</Text>
            <Field value={donor.name} flex={3} />
            <View style={s.spacer} />
            <Text style={s.label}>Place:</Text>
            <Field value={donor.city} flex={1} />
          </View>
          <View style={s.nameLabels}>
            <View style={{ width: 69 }} />
            <Text style={[s.nameLabel, { flex: 1 }]}>(First name)</Text>
            <Text style={[s.nameLabel, { flex: 2 }]}>(Last name)</Text>
            <View style={{ width: 70 }} />
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
            <Text style={{ fontSize: 8.5 }}> / No</Text>
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
                {" "}or visit{" "}
                <Text style={s.footerBold}>{foundation.website}</Text>
              </Text>
            </View>

            {/* Stamp (large) + Signature (large) */}
            <View style={s.footerRight}>
              {useRealAssets ? (
                <Image
                  src={`${ORIGIN}/assets/humanity_donation_stamp.png`}
                  style={{ width: 110, height: 110 }}
                />
              ) : (
                <View style={{
                  width: 110, height: 110, borderRadius: 55,
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
                  style={{ width: 110, height: 46, marginTop: 6 }}
                />
              ) : (
                <View style={{ width: 110, height: 46, marginTop: 6 }} />
              )}
              <Text style={s.sigLabel}>Authorised Signature</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
