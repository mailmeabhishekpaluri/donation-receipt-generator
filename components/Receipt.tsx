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
    fontSize: 9,
    color: BLACK,
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
  },

  // ── Header ───────────────────────────────────────────────────
  header: {
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 78,
  },
  logoWrap: {
    backgroundColor: WHITE,
    borderRadius: 4,
    padding: 5,
    marginRight: 14,
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
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    textAlign: "center",
    marginBottom: 3,
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
    marginTop: 2,
  },

  // ── Body ─────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 6,
    flex: 1,
  },

  // Receipt No / Date row
  receiptDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  receiptNo: { fontSize: 9, fontFamily: "Helvetica-Bold" },

  // ── Form field helpers ────────────────────────────────────────
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 9 },
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
    paddingBottom: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minHeight: 14,
  },
  fieldSub: { fontSize: 6.5, color: "#555", textAlign: "center", marginTop: 1 },
  spacer: { width: 10 },

  // Name sub-labels row
  nameRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 2 },
  nameLabels: { flexDirection: "row", marginBottom: 9 },
  nameLabel: { flex: 1, fontSize: 6.5, color: "#555", textAlign: "center" },

  // Divider
  divider: { borderBottomWidth: 1, borderBottomColor: BLACK, marginVertical: 6 },

  // 80G row
  g80Row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BLACK,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },
  circleText: { fontSize: 6.5, fontFamily: "Helvetica-Bold" },

  // Registration box
  regBox: {
    borderWidth: 1,
    borderColor: BLACK,
    backgroundColor: LIGHT,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  regItem: { fontSize: 7.5, fontFamily: "Helvetica-Bold", textAlign: "center" },

  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: { flex: 1, paddingRight: 20 },
  footerText: { fontSize: 7.5, marginBottom: 4 },
  footerBold: { fontFamily: "Helvetica-Bold" },
  footerRight: { alignItems: "center", minWidth: 110 },
  sigLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 2 },
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
      <Page size="A4" orientation="landscape" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Logo on white card */}
          <View style={s.logoWrap}>
            {useRealAssets ? (
              <Image
                src={`${ORIGIN}/assets/HUManity logo.png`}
                style={{ width: 110, height: 42 }}
              />
            ) : (
              <View style={{ width: 110, height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: BLUE }}>HUManity</Text>
                <Text style={{ fontSize: 7, color: "#555" }}>Humanity Uplifting Mankind</Text>
              </View>
            )}
          </View>

          {/* Centre */}
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
            <View style={{ width: 67 }} />
            <Text style={[s.nameLabel, { flex: 1 }]}>(First name)</Text>
            <Text style={[s.nameLabel, { flex: 2 }]}>(Last name)</Text>
            <View style={{ width: 72 }} />
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
                We hereby confirm that the aforementioned donation has been received by HUManity
                organisation, {foundation.city}.
              </Text>
              <Text style={s.footerText}>
                In case of queries, reach out to us at{" "}
                <Text style={s.footerBold}>{foundation.email}</Text>
                {" "}or visit{" "}
                <Text style={s.footerBold}>{foundation.website}</Text>
              </Text>
            </View>

            {/* Stamp + Signature */}
            <View style={s.footerRight}>
              {useRealAssets ? (
                <Image
                  src={`${ORIGIN}/assets/humanity_donation_stamp.png`}
                  style={{ width: 82, height: 82 }}
                />
              ) : (
                <View style={{
                  width: 82, height: 82, borderRadius: 41,
                  borderWidth: 2, borderColor: BLUE,
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Text style={{ fontSize: 5.5, color: BLUE, textAlign: "center" }}>
                    {"HUMANITY\nUPLIFTING\nMANKIND\nFOUNDATION\nNGO REG."}
                  </Text>
                </View>
              )}
              {useRealAssets ? (
                <Image
                  src={`${ORIGIN}/assets/Abhishek Sign - Edited.png`}
                  style={{ width: 82, height: 34, marginTop: 4 }}
                />
              ) : (
                <View style={{ width: 82, height: 34, marginTop: 4 }} />
              )}
              <Text style={s.sigLabel}>Authorised Signature</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
