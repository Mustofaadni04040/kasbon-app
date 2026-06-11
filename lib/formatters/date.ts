const absoluteDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatAbsoluteDate(dateString: string): string {
  return absoluteDateFormatter.format(new Date(dateString));
}

export function formatRelativeDate(dateString: string): string {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const absDiff = Math.abs(diffMs);

  if (absDiff < minuteMs) {
    return "baru saja";
  }

  if (absDiff < hourMs) {
    const minutes = Math.round(absDiff / minuteMs);
    return diffMs < 0 ? `${minutes} menit lalu` : `${minutes} menit lagi`;
  }

  if (absDiff < dayMs) {
    const hours = Math.round(absDiff / hourMs);
    return diffMs < 0 ? `${hours} jam lalu` : `${hours} jam lagi`;
  }

  const days = Math.round(absDiff / dayMs);

  if (days === 1) {
    return diffMs < 0 ? "kemarin" : "besok";
  }

  if (days < 30) {
    return diffMs < 0 ? `${days} hari lalu` : `${days} hari lagi`;
  }

  return formatAbsoluteDate(dateString);
}
