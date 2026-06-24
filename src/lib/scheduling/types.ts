export type Booking = {
  id: string;
  name: string;
  email: string;
  topic: string | null;
  questionnaire?: QuestionnaireAnswer[];
  startAt: string;
  endAt: string;
  createdAt: string;
};

export type QuestionnaireAnswer = {
  id: number;
  categoria: string;
  pergunta: string;
  resposta: string;
};

export type Slot = {
  startAt: string;
  endAt: string;
  dateLabel: string;
  timeLabel: string;
};

export type SlotsResponse = {
  timezone: string;
  slotDurationMinutes: number;
  minimumNoticeMinutes: number;
  days: Array<{
    date: string;
    label: string;
    slots: Slot[];
  }>;
};

export type CreateBookingInput = {
  name: string;
  email: string;
  topic?: string;
  questionnaire?: QuestionnaireAnswer[];
  startAt: string;
};

export type CreateBookingResult =
  | { ok: true; booking: Booking; emailStatus: "sent" | "skipped" | "failed" }
  | { ok: false; error: "invalid" | "unavailable" | "storage" };
