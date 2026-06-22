import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import type { Booking, CreateBookingResult, Slot, SlotsResponse } from "@/lib/scheduling/types";

export const Route = createFileRoute("/book-a-call")({
  component: BookACallPage,
  head: () => ({
    meta: [
      { title: "Agende sua Sessao de Estrategia - Aive" },
      {
        name: "description",
        content:
          "Agende uma sessao gratuita de 45 minutos para mapear como conquistar 6-8 clientes de telhados por mes sem pagar investimento em anuncios.",
      },
    ],
  }),
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const timezoneOptions = [
  { value: "America/Sao_Paulo", label: "Brasilia (BRT)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Denver", label: "Denver (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Europe/Lisbon", label: "Lisboa" },
];

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const cells: Array<{ key: string; dayNumber: number | null; dateKey: string | null }> = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ key: `empty-${i}`, dayNumber: null, dateKey: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
    cells.push({ key: toDateKey(date), dayNumber: day, dateKey: toDateKey(date) });
  }

  return cells;
}

function BookACallPage() {
  const [slotsData, setSlotsData] = useState<SlotsResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartAt, setSelectedStartAt] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedTimezone, setSelectedTimezone] = useState("America/Sao_Paulo");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/scheduling");
        if (!response.ok) throw new Error("Falha ao carregar horarios.");
        const data = (await response.json()) as SlotsResponse;
        const firstDay = data.days[0];

        if (!cancelled) {
          setSlotsData(data);
          setSelectedDate("");
          setSelectedStartAt("");
          if (firstDay) setVisibleMonth(parseDateKey(firstDay.date));
        }
      } catch {
        if (!cancelled) setError("Nao foi possivel carregar os horarios disponiveis agora.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, []);

  const slotsByDate = useMemo(() => {
    return new Map((slotsData?.days ?? []).map((day) => [day.date, day.slots]));
  }, [slotsData]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    for (const day of slotsData?.days ?? []) {
      const date = parseDateKey(day.date);
      months.add(`${date.getFullYear()}-${date.getMonth()}`);
    }
    return months;
  }, [slotsData]);

  const selectedDaySlots = slotsByDate.get(selectedDate) ?? [];

  const selectedSlot = useMemo(() => {
    return selectedDaySlots.find((slot) => slot.startAt === selectedStartAt);
  }, [selectedDaySlots, selectedStartAt]);

  const calendarCells = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const currentMonthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`;
  const previousMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  const canGoPrevious = availableMonths.has(`${previousMonth.getFullYear()}-${previousMonth.getMonth()}`);
  const canGoNext = availableMonths.has(`${nextMonth.getFullYear()}-${nextMonth.getMonth()}`);

  function chooseDate(dateKey: string) {
    const slots = slotsByDate.get(dateKey) ?? [];
    setSelectedDate(dateKey);
    setSelectedStartAt(slots[0]?.startAt ?? "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedStartAt || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        startAt: selectedStartAt,
      };

      if (!payload.name || !payload.email) {
        setError("Preencha nome e e-mail antes de confirmar.");
        return;
      }

      const response = await fetch("/api/scheduling", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as CreateBookingResult;

      if (!result.ok) {
        if (result.error === "unavailable") {
          setError("Esse horario acabou de ser reservado. Escolha outro horario.");
        } else {
          setError("Revise seus dados e tente novamente.");
        }
        const refreshed = await fetch("/api/scheduling");
        if (refreshed.ok) setSlotsData((await refreshed.json()) as SlotsResponse);
        return;
      }

      setConfirmedBooking(result.booking);
    } catch {
      setError("Nao foi possivel concluir o agendamento. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div className="pt-3 lg:pt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">PASSO 1 DE 2</p>
            <h1 className="mt-4 max-w-md text-3xl font-medium leading-tight tracking-tight sm:text-[2.35rem]">
              Agende sua sessao de estrategia gratuita.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Uma chamada de 45 minutos onde vamos mapear exatamente como conseguir 6-8 clientes de telhados por
              mes, sem pagar investimento em anuncios.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-foreground sm:text-base">
              {["45 minutos, sem enrolacao", "Google Meet, com compartilhamento de tela", "Sem pressao, sem venda agressiva"].map(
                (item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-border bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full bg-[#ff6b00]/10" />
            {confirmedBooking ? (
              <Confirmation booking={confirmedBooking} timezone={slotsData?.timezone ?? "America/Sao_Paulo"} />
            ) : (
              <form className="relative z-10" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6b00]">
                  <CalendarDays className="h-4 w-4" />
                  Escolha seu horario
                </div>

                {isLoading ? (
                  <div className="mt-10 flex min-h-[420px] items-center justify-center rounded-3xl bg-[#f6f3f1] text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando horarios...
                  </div>
                ) : (
                  <>
                    <div className="relative z-0 mt-5">
                      {!selectedDate ? (
                        <div className="animate-in fade-in slide-in-from-left-3 duration-300">
                          <div className="rounded-[22px] border border-border bg-[#faf8f6] p-3 sm:p-4">
                            <div className="flex items-center justify-between gap-4">
                              <button
                                type="button"
                                onClick={() => setVisibleMonth(previousMonth)}
                                disabled={!canGoPrevious}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground transition hover:border-[#ff6b00] disabled:opacity-35"
                                aria-label="Mes anterior"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <p className="text-sm font-semibold capitalize text-foreground sm:text-base">
                                {monthFormatter.format(visibleMonth)}
                              </p>
                              <button
                                type="button"
                                onClick={() => setVisibleMonth(nextMonth)}
                                disabled={!canGoNext}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground transition hover:border-[#ff6b00] disabled:opacity-35"
                                aria-label="Proximo mes"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground sm:gap-2">
                              {weekdayLabels.map((label) => (
                                <span key={label}>{label}</span>
                              ))}
                            </div>

                            <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                              {calendarCells.map((cell) => {
                                const slots = cell.dateKey ? slotsByDate.get(cell.dateKey) : undefined;
                                const isAvailable = Boolean(slots?.length);

                                return (
                                  <button
                                    key={`${currentMonthKey}-${cell.key}`}
                                    type="button"
                                    disabled={!isAvailable}
                                    onClick={() => cell.dateKey && chooseDate(cell.dateKey)}
                                    className={`h-9 rounded-xl text-xs font-semibold transition sm:h-10 sm:rounded-2xl sm:text-sm ${
                                      isAvailable
                                        ? "border border-[#ff6b00]/25 bg-white text-foreground hover:border-[#ff6b00] hover:text-[#ff6b00]"
                                        : cell.dayNumber
                                          ? "bg-transparent text-muted-foreground/35"
                                          : "invisible"
                                    }`}
                                  >
                                    {cell.dayNumber}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="animate-in fade-in slide-in-from-right-3 duration-300">
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDate("");
                                setSelectedStartAt("");
                              }}
                              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-semibold text-foreground transition hover:border-[#ff6b00]"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Voltar
                            </button>
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">
                              Passo 2 de 2
                            </span>
                          </div>

                          <TimePicker
                            selectedDate={selectedDate}
                            selectedSlot={selectedSlot}
                            slots={selectedDaySlots}
                            timezone={selectedTimezone}
                            timezoneOptions={timezoneOptions}
                            onTimezoneChange={setSelectedTimezone}
                            onSelect={setSelectedStartAt}
                          />
                        </div>
                      )}
                    </div>

                    <div className="relative z-20 mt-6 grid gap-3">
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        className="h-13 rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-[#ff6b00]"
                        placeholder="Seu nome"
                      />
                      <input
                        name="email"
                        autoComplete="email"
                        required
                        type="email"
                        className="h-13 rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-[#ff6b00]"
                        placeholder="Seu e-mail"
                      />
                    </div>

                    {error ? <p className="mt-4 text-sm font-medium text-[#d9480f]">{error}</p> : null}

                    <button
                      type="submit"
                      disabled={!selectedStartAt || isSubmitting}
                      className="relative z-20 mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#111722] px-8 text-sm font-semibold text-white transition hover:bg-[#1a2230] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        "Confirmar agendamento"
                      )}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TimePicker({
  selectedDate,
  selectedSlot,
  slots,
  timezone,
  timezoneOptions,
  onTimezoneChange,
  onSelect,
}: {
  selectedDate: string;
  selectedSlot?: Slot;
  slots: Slot[];
  timezone: string;
  timezoneOptions: Array<{ value: string; label: string }>;
  onTimezoneChange: (timezone: string) => void;
  onSelect: (startAt: string) => void;
}) {
  const dateLabel = selectedDate ? dayFormatter.format(parseDateKey(selectedDate)).replace(".", "") : "";
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
      }),
    [timezone],
  );
  const selectedDateTimeLabel = useMemo(() => {
    if (!selectedSlot) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: timezone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
      .format(new Date(selectedSlot.startAt))
      .replace(".", "");
  }, [selectedSlot, timezone]);
  const selectedTimezoneLabel = timezoneOptions.find((option) => option.value === timezone)?.label ?? timezone;

  return (
    <div className="mt-5 rounded-[26px] border border-border bg-white p-4 sm:p-5">
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">Horarios disponiveis</p>
          <p className="mt-1 text-sm font-semibold capitalize text-foreground">
            {dateLabel || "Escolha um dia no calendario"}
          </p>
        </div>
      </div>

      {slots.length ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => (
            <button
              key={slot.startAt}
              type="button"
              onClick={() => onSelect(slot.startAt)}
              className={`inline-flex h-12 items-center justify-center rounded-full border text-sm font-semibold transition ${
                selectedSlot?.startAt === slot.startAt
                  ? "border-[#111722] bg-[#111722] text-white"
                  : "border-border bg-white text-foreground hover:border-[#ff6b00]"
              }`}
            >
              {timeFormatter.format(new Date(slot.startAt))}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-[#f6f3f1] p-4 text-sm text-muted-foreground">
          Selecione um dia disponivel para ver os horarios.
        </p>
      )}

      <label className="mt-5 block cursor-pointer rounded-3xl bg-[#f6f3f1] p-3 transition hover:bg-[#f1ece8] sm:p-4">
        <div className="flex flex-col gap-3 text-sm font-semibold text-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-[#ff6b00]" />
            <span>
              {selectedSlot ? selectedDateTimeLabel : "Selecione um horario"}
              <span className="ml-1 text-muted-foreground">em</span>
            </span>
          </div>
          <select
            value={timezone}
            onChange={(event) => onTimezoneChange(event.target.value)}
            className="w-full cursor-pointer rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-foreground outline-none transition focus:border-[#ff6b00] sm:w-auto"
            aria-label="Fuso horario"
          >
            {timezoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          Clique nesta barra para mudar o fuso horario. Exibindo em {selectedTimezoneLabel}.
        </p>
      </label>
    </div>
  );
}

function Confirmation({ booking, timezone }: { booking: Booking; timezone: string }) {
  return (
    <div className="relative flex min-h-[520px] flex-col justify-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6b00] text-white">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6b00]">Agendamento confirmado</p>
      <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        Sua call com a Aive esta marcada.
      </h2>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        Enviamos a confirmacao por e-mail. Guarde este horario:{" "}
        {new Intl.DateTimeFormat("pt-BR", {
          timeZone: timezone,
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date(booking.startAt))}
        .
      </p>
      <a
        href="/pre-call"
        className="mt-8 inline-flex h-14 w-fit items-center justify-center rounded-full bg-[#111722] px-8 text-sm font-semibold text-white transition hover:bg-[#1a2230]"
      >
        Continuar para preparacao
      </a>
    </div>
  );
}
