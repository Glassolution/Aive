function parseEmailList(value: string) {
  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export const schedulingConfig = {
  timezone: "America/Sao_Paulo",
  weekdays: [1, 2, 3, 4, 5],
  workdayStartHour: 9,
  workdayEndHour: 18,
  slotDurationMinutes: 45,
  minimumNoticeMinutes: 120,
  daysToShow: 21,
  ownerEmail: parseEmailList(process.env.SCHEDULING_OWNER_EMAIL ?? "lucassrby@gmail.com,xavierluisfelipe17@gmail.com"),
  fromEmail: process.env.RESEND_FROM_EMAIL ?? "Aive <agenda@aive.work>",
};
