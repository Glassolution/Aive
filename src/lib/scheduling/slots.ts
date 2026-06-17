import { schedulingConfig } from "./config";
import type { Slot, SlotsResponse } from "./types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  hour: "2-digit",
  minute: "2-digit",
});

function zonedParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: schedulingConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function zonedDateKey(date: Date) {
  const parts = zonedParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function zonedLocalToUtc(year: number, month: number, day: number, hour: number, minute: number) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const actual = zonedParts(guess);
  const wantedUtc = Date.UTC(year, month - 1, day, hour, minute);
  const actualUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute);
  return new Date(guess.getTime() + wantedUtc - actualUtc);
}

function addDaysInZone(date: Date, days: number) {
  const parts = zonedParts(date);
  return zonedLocalToUtc(parts.year, parts.month, parts.day + days, 0, 0);
}

export function isAllowedSlot(startAt: string, now = new Date()) {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return false;

  const parts = zonedParts(start);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: schedulingConfig.timezone,
    weekday: "short",
  }).format(start);
  const weekdayNumber = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const minimumStart = now.getTime() + schedulingConfig.minimumNoticeMinutes * 60_000;

  return (
    schedulingConfig.weekdays.includes(weekdayNumber) &&
    (parts.hour * 60 + parts.minute - schedulingConfig.workdayStartHour * 60) %
      schedulingConfig.slotDurationMinutes ===
      0 &&
    parts.hour >= schedulingConfig.workdayStartHour &&
    start.getTime() >= minimumStart &&
    start.getTime() + schedulingConfig.slotDurationMinutes * 60_000 <=
      zonedLocalToUtc(parts.year, parts.month, parts.day, schedulingConfig.workdayEndHour, 0).getTime()
  );
}

export function generateAvailableSlots(bookedStartTimes: string[], now = new Date()): SlotsResponse {
  const booked = new Set(bookedStartTimes);
  const days: SlotsResponse["days"] = [];
  const minimumStart = now.getTime() + schedulingConfig.minimumNoticeMinutes * 60_000;

  for (let offset = 0; offset < schedulingConfig.daysToShow; offset += 1) {
    const day = addDaysInZone(now, offset);
    const dayParts = zonedParts(day);
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: schedulingConfig.timezone,
      weekday: "short",
    }).format(day);
    const weekdayNumber = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);

    if (!schedulingConfig.weekdays.includes(weekdayNumber)) continue;

    const slots: Slot[] = [];
    const endOfDay = zonedLocalToUtc(
      dayParts.year,
      dayParts.month,
      dayParts.day,
      schedulingConfig.workdayEndHour,
      0,
    ).getTime();

    for (
      let minutes = schedulingConfig.workdayStartHour * 60;
      minutes + schedulingConfig.slotDurationMinutes <= schedulingConfig.workdayEndHour * 60;
      minutes += schedulingConfig.slotDurationMinutes
    ) {
      const start = zonedLocalToUtc(
        dayParts.year,
        dayParts.month,
        dayParts.day,
        Math.floor(minutes / 60),
        minutes % 60,
      );
      const end = new Date(start.getTime() + schedulingConfig.slotDurationMinutes * 60_000);

      if (start.getTime() < minimumStart || end.getTime() > endOfDay) continue;
      if (booked.has(start.toISOString())) continue;

      slots.push({
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        dateLabel: dateFormatter.format(start).replace(".", ""),
        timeLabel: timeFormatter.format(start),
      });
    }

    if (slots.length > 0) {
      days.push({
        date: zonedDateKey(day),
        label: dateFormatter.format(day).replace(".", ""),
        slots,
      });
    }
  }

  return {
    timezone: schedulingConfig.timezone,
    slotDurationMinutes: schedulingConfig.slotDurationMinutes,
    minimumNoticeMinutes: schedulingConfig.minimumNoticeMinutes,
    days,
  };
}
