"use client";

import { toast } from "sonner";
import { Booking } from "@/lib/types";
import { money, prettyDate, prettyTime } from "@/lib/format";

/**
 * PDF booking invoice (optional requirement).
 * Uses jsPDF client-side so no server round trip is needed.
 */
export default async function downloadInvoice(booking: Booking, userName: string) {
  const [{ jsPDF }, autotableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = (autotableMod as any).default ?? (autotableMod as any).autoTable;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // ---------- Header band ----------
  doc.setFillColor(232, 89, 12); // brand orange
  doc.rect(0, 0, pageW, 92, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("StudioSpace", 40, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Creative Workspace & Production Studio Sharing", 40, 62);
  doc.setFontSize(13);
  doc.text("BOOKING INVOICE", pageW - 40, 44, { align: "right" });
  doc.setFontSize(9);
  doc.text(`Invoice #SS-${booking._id.slice(-8).toUpperCase()}`, pageW - 40, 62, {
    align: "right",
  });

  // ---------- Meta ----------
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  const metaRows: [string, string][] = [
    ["Billed to", `${userName} (${booking.userEmail})`],
    ["Studio host", booking.ownerEmail],
    ["Booking date", prettyDate(booking.date)],
    ["Time slot", `${prettyTime(booking.startTime)} – ${prettyTime(booking.endTime)}`],
    ["Status", booking.status],
    ["Generated", new Date().toLocaleString("en-US")],
  ];
  let y = 122;
  for (const [label, value] of metaRows) {
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", 40, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 150, y);
    y += 18;
  }

  // ---------- Line items ----------
  autoTable(doc, {
    startY: y + 10,
    head: [["Description", "Qty", "Unit price", "Amount"]],
    body: [
      [
        `${booking.studioTitle} — studio hire`,
        `${booking.hours} hr`,
        money(booking.totalPrice / booking.hours),
        money(booking.hours * (booking.totalPrice / booking.hours)),
      ],
      ["Booking service fee", "1", money(0), money(0)],
    ],
    theme: "striped",
    headStyles: { fillColor: [232, 89, 12], textColor: 255 },
    styles: { font: "helvetica", fontSize: 10 },
    margin: { left: 40, right: 40 },
  });

  // ---------- Total ----------
  const afterY = (doc as any).lastAutoTable?.finalY ?? y + 80;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total paid:", pageW - 160, afterY + 28);
  doc.setTextColor(232, 89, 12);
  doc.text(money(booking.totalPrice), pageW - 40, afterY + 28, { align: "right" });

  // ---------- Footer ----------
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "StudioSpace · 410 Studio Row, Brooklyn, NY · This invoice was generated automatically and is valid without signature.",
    40,
    780
  );

  doc.save(`studiospace-invoice-${booking._id.slice(-8)}.pdf`);
  toast.success("Invoice downloaded.");
}
