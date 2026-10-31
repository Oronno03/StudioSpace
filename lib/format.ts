// Small formatting / validation helpers shared across pages.

/** Currency with no decimals when whole: $65, $1,234.50 */
export function money(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** "2026-03-14" -> "Mar 14, 2026" */
export function prettyDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "2026-03-14T09:12:00Z" -> "Mar 14, 2026" */
export function prettyDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "14:05" -> "2:05 PM" */
export function prettyTime(t: string): string {
  const [hRaw, m] = t.split(":");
  const h = Number(hRaw);
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m} ${suffix}`;
}

/** Hours between "HH:MM" values (end must be after start). */
export function hoursBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) return 0;
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

/** Password rules from the assignment spec. */
export function passwordError(pw: string): string | null {
  if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter.";
  if (pw.length < 6) return "Password must be at least 6 characters long.";
  return null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Status pill classes (used on My Bookings and host views). */
export function statusClasses(status: string): string {
  switch (status) {
    case "Confirmed":
      return "bg-success-soft text-success";
    case "Completed":
      return "bg-info-soft text-info";
    case "Cancelled":
      return "bg-danger-soft text-danger";
    default:
      return "bg-warning-soft text-warning";
  }
}
