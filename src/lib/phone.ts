/** Build a tel: href from a human-readable phone string. */
export function phoneToHref(display: string): string {
  const digits = display.replace(/\D/g, "");
  if (!digits) return "tel:";
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return `tel:+${normalized}`;
}
