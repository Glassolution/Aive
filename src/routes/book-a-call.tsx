import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Globe2, Loader2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import type { Booking, CreateBookingResult, Slot, SlotsResponse } from "@/lib/scheduling/types";

export const Route = createFileRoute("/book-a-call")({
  component: BookACallPage,
  head: () => ({
    meta: [
      { title: "Agende sua Sessão de Estratégia - Aive" },
      {
        name: "description",
        content:
          "Agende uma sessão gratuita de 45 minutos para mapear como conquistar 6-8 clientes de telhados por mês sem pagar investimento em anúncios.",
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

const bookingQuestions = [
  {
    id: 1,
    categoria: "Negócio",
    pergunta: "Quantos telhados você instala por mês hoje?",
    tipo: "multipla_escolha",
    opcoes: ["Menos de 5", "5 a 10", "11 a 20", "Mais de 20"],
  },
  {
    id: 2,
    categoria: "Negócio",
    pergunta: "Você trabalha mais com qual segmento?",
    tipo: "multipla_escolha",
    opcoes: ["Residencial", "Comercial", "Os dois"],
  },
  {
    id: 3,
    categoria: "Negócio",
    pergunta: "Como é sua equipe hoje?",
    tipo: "multipla_escolha",
    opcoes: ["Trabalho sozinho", "Tenho 1 a 3 funcionários", "Tenho 4 ou mais funcionários"],
  },
  {
    id: 4,
    categoria: "Problema",
    pergunta: "Qual é o seu maior desafio para fechar mais contratos hoje?",
    tipo: "texto_livre",
  },
  {
    id: 5,
    categoria: "Problema",
    pergunta: "Como você consegue a maioria dos seus clientes atualmente?",
    tipo: "multipla_escolha",
    opcoes: ["Indicação", "Redes sociais", "Google", "Panfleto / porta a porta", "Outro"],
  },
  {
    id: 6,
    categoria: "Qualificação",
    pergunta: "Você já tentou alguma estratégia de marketing antes?",
    tipo: "multipla_escolha",
    opcoes: ["Nunca tentei", "Tentei mas não funcionou", "Tenho algo rodando hoje"],
  },
  {
    id: 7,
    categoria: "Qualificação",
    pergunta: "O que te fez querer marcar essa sessão agora?",
    tipo: "texto_livre",
  },
  {
    id: 8,
    categoria: "Preparação",
    pergunta: "Tem algo específico que você quer sair sabendo depois da nossa conversa?",
    tipo: "texto_livre",
  },
] as const;

const bookingQuestionTopics = ["Negócio", "Problema", "Qualificação", "Preparação"] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleMeetLink = "https://meet.google.com/";

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonthTitle(date: Date) {
  const label = monthFormatter.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const choiceAnswersRef = useRef<Record<number, string>>({});
  const textAnswerElementsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const textAnswersRef = useRef<Record<number, string>>({});
  const [slotsData, setSlotsData] = useState<SlotsResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartAt, setSelectedStartAt] = useState("");
  const [choiceAnswers, setChoiceAnswers] = useState<Record<number, string>>({});
  const [activeQuestionTopicIndex, setActiveQuestionTopicIndex] = useState(0);
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
        if (!response.ok) throw new Error("Falha ao carregar horários.");
        const data = (await response.json()) as SlotsResponse;
        const firstDay = data.days[0];

        if (!cancelled) {
          setSlotsData(data);
          setSelectedDate("");
          setSelectedStartAt("");
          if (firstDay) setVisibleMonth(parseDateKey(firstDay.date));
        }
      } catch {
        if (!cancelled) setError("Não foi possível carregar os horários disponíveis agora.");
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
  const activeQuestionTopic = bookingQuestionTopics[activeQuestionTopicIndex];
  const activeTopicQuestions = bookingQuestions.filter((question) => question.categoria === activeQuestionTopic);
  const isLastQuestionTopic = activeQuestionTopicIndex === bookingQuestionTopics.length - 1;

  function clearQuestionStepAnswers() {
    if (nameInputRef.current) nameInputRef.current.value = "";
    if (emailInputRef.current) emailInputRef.current.value = "";
    choiceAnswersRef.current = {};
    textAnswersRef.current = {};
    for (const element of Object.values(textAnswerElementsRef.current)) {
      if (element) element.textContent = "";
    }
    textAnswerElementsRef.current = {};
    setChoiceAnswers({});
    setActiveQuestionTopicIndex(0);
    setError("");
  }

  function clearQuestionAnswersFromTopic(topicIndex: number) {
    const topicsToClear = new Set(bookingQuestionTopics.slice(topicIndex));
    const questionIdsToClear = bookingQuestions
      .filter((question) => topicsToClear.has(question.categoria))
      .map((question) => question.id);

    setChoiceAnswers((current) => {
      const next = { ...current };
      for (const id of questionIdsToClear) delete next[id];
      choiceAnswersRef.current = next;
      return next;
    });
    const nextTextAnswers = { ...textAnswersRef.current };
    for (const id of questionIdsToClear) delete nextTextAnswers[id];
    textAnswersRef.current = nextTextAnswers;
    for (const id of questionIdsToClear) {
      if (textAnswerElementsRef.current[id]) textAnswerElementsRef.current[id].textContent = "";
      textAnswerElementsRef.current[id] = null;
    }
    setError("");
  }

  function updateChoiceAnswer(questionId: number, value: string) {
    choiceAnswersRef.current = {
      ...choiceAnswersRef.current,
      [questionId]: value,
    };
    setChoiceAnswers(choiceAnswersRef.current);
  }

  function collectTextAnswers() {
    const next = { ...textAnswersRef.current };
    for (const [id, element] of Object.entries(textAnswerElementsRef.current)) {
      if (element) next[Number(id)] = element.textContent ?? "";
    }
    textAnswersRef.current = next;
    return next;
  }

  function chooseDate(dateKey: string) {
    setSelectedDate(dateKey);
    setSelectedStartAt("");
    clearQuestionStepAnswers();
  }

  function chooseStartAt(startAt: string) {
    setSelectedStartAt(startAt);
    setActiveQuestionTopicIndex(0);
  }

  function backToSchedule() {
    setSelectedStartAt("");
    clearQuestionStepAnswers();
  }

  function handleQuestionStepAction() {
    collectTextAnswers();

    const unansweredChoice = activeTopicQuestions.find(
      (question) => question.tipo === "multipla_escolha" && !choiceAnswersRef.current[question.id],
    );

    if (unansweredChoice) {
      setError("Responda as perguntas de múltipla escolha antes de continuar.");
      return;
    }

    setError("");

    if (!isLastQuestionTopic) {
      setActiveQuestionTopicIndex((current) => Math.min(current + 1, bookingQuestionTopics.length - 1));
      return;
    }

    void handleSubmit();
  }

  function backToPreviousQuestionTopic() {
    const previous = Math.max(activeQuestionTopicIndex - 1, 0);
    clearQuestionAnswersFromTopic(previous);
    setActiveQuestionTopicIndex(previous);
  }

  async function handleSubmit() {
    if (!selectedStartAt || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const currentTextAnswers = collectTextAnswers();
      const questionnaire = bookingQuestions.map((question) => ({
        id: question.id,
        categoria: question.categoria,
        pergunta: question.pergunta,
        resposta:
          question.tipo === "multipla_escolha"
            ? choiceAnswersRef.current[question.id] ?? ""
            : currentTextAnswers[question.id]?.trim() ?? "",
      }));
      const payload = {
        name: nameInputRef.current?.value.trim() ?? "",
        email: emailInputRef.current?.value.trim() ?? "",
        questionnaire,
        startAt: selectedStartAt,
      };

      const hasUnansweredRequiredChoice = bookingQuestions.some(
        (question) => question.tipo === "multipla_escolha" && !choiceAnswersRef.current[question.id],
      );

      if (hasUnansweredRequiredChoice) {
        setError("Responda todas as perguntas de múltipla escolha antes de confirmar.");
        return;
      }

      if (!payload.name || !payload.email) {
        setError("Preencha nome e e-mail antes de confirmar.");
        return;
      }

      if (!emailPattern.test(payload.email)) {
        setError("Digite um e-mail valido antes de confirmar.");
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
          setError("Esse horário acabou de ser reservado. Escolha outro horário.");
        } else {
          setError("Revise seus dados e tente novamente.");
        }
        const refreshed = await fetch("/api/scheduling");
        if (refreshed.ok) setSlotsData((await refreshed.json()) as SlotsResponse);
        return;
      }

      setConfirmedBooking(result.booking);
    } catch {
      setError("Não foi possível concluir o agendamento. Tente novamente em instantes.");
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
              Agende sua sessão de estratégia gratuita.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Uma chamada de 45 minutos onde vamos mapear exatamente como conseguir 6-8 clientes de telhados por
              mês, sem pagar investimento em anúncios.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-foreground sm:text-base">
              {["45 minutos, sem enrolação", "Google Meet, com compartilhamento de tela", "Sem pressão, sem venda agressiva"].map(
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
              <Confirmation
                booking={confirmedBooking}
                timezone={slotsData?.timezone ?? "America/Sao_Paulo"}
                meetLink={googleMeetLink}
              />
            ) : (
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6b00]">
                  <CalendarDays className="h-4 w-4" />
                  Escolha seu horário
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Escolha uma data e um horário disponíveis. Depois, preencha seu nome e e-mail antes de confirmar.
                </p>

                {isLoading ? (
                  <div className="mt-10 flex min-h-[420px] items-center justify-center rounded-3xl bg-[#f6f3f1] text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando horários...
                  </div>
                ) : (
                  <>
                    {!selectedStartAt ? (
                    <div className="relative z-40 mt-6 animate-in fade-in slide-in-from-left-6 duration-300">
                        <div className="mb-5 flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">
                          Passo 1 de 2
                        </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
                          <div className="rounded-[24px] bg-white">
                            <div className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setVisibleMonth(previousMonth)}
                                disabled={!canGoPrevious}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-[#fff1e8] hover:text-[#ff6b00] disabled:opacity-35"
                                aria-label="Mês anterior"
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </button>
                              <p className="text-center text-sm font-bold text-foreground sm:text-base">
                                {formatMonthTitle(visibleMonth)}
                              </p>
                              <button
                                type="button"
                                onClick={() => setVisibleMonth(nextMonth)}
                                disabled={!canGoNext}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#ff6b00] transition hover:bg-[#fff1e8] disabled:opacity-35"
                                aria-label="Próximo mês"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[#111722]">
                              {weekdayLabels.map((label) => (
                                <span key={label}>{label}</span>
                              ))}
                            </div>

                            <div className="mt-4 grid grid-cols-7 gap-2">
                              {calendarCells.map((cell) => {
                                const slots = cell.dateKey ? slotsByDate.get(cell.dateKey) : undefined;
                                const isAvailable = Boolean(slots?.length);
                                const isSelected = cell.dateKey === selectedDate;

                                return (
                                  <button
                                    key={`${currentMonthKey}-${cell.key}`}
                                    type="button"
                                    disabled={!isAvailable}
                                    onClick={() => cell.dateKey && chooseDate(cell.dateKey)}
                                  className={`relative mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-sm transition ${
                                    isSelected
                                      ? "bg-[#111722] font-semibold text-white"
                                      : isAvailable
                                        ? "bg-transparent font-semibold text-[#ff6b00] hover:bg-[#fff1e8]"
                                          : cell.dayNumber
                                            ? "bg-transparent text-[#7a8da5]/55"
                                            : "invisible"
                                    }`}
                                  >
                                    {cell.dayNumber}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="mt-8">
                              <p className="text-sm font-bold text-foreground">Fuso horário</p>
                              <TimezoneSelect
                                value={selectedTimezone}
                                options={timezoneOptions}
                                onChange={setSelectedTimezone}
                                compact
                              />
                            </div>
                          </div>

                          <TimePicker
                            selectedDate={selectedDate}
                            selectedSlot={selectedSlot}
                            slots={selectedDaySlots}
                            timezone={selectedTimezone}
                            onSelect={chooseStartAt}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-30 mt-6 animate-in fade-in slide-in-from-right-6 duration-300">
                        <button
                          type="button"
                          onClick={backToSchedule}
                          className="mb-5 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-semibold text-foreground transition hover:border-[#ff6b00]"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Voltar ao horário
                        </button>

                        <div className="rounded-[28px] border border-border bg-[#faf8f6] p-5 sm:p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">
                                Passo 2 de 2
                              </p>
                              <h2 className="mt-2 text-xl font-semibold text-foreground">Sobre você e sua empresa</h2>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Preencha seus dados para confirmarmos a call e prepararmos a conversa.
                          </p>

                          <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <input
                              ref={nameInputRef}
                              type="text"
                              className="block h-14 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground caret-[#111722] outline-none transition placeholder:text-muted-foreground/70 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/15"
                              placeholder="Seu nome"
                              autoComplete="name"
                            />
                            <input
                              ref={emailInputRef}
                              type="email"
                              className="block h-14 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground caret-[#111722] outline-none transition placeholder:text-muted-foreground/70 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/15"
                              placeholder="Seu e-mail"
                              autoComplete="email"
                            />
                          </div>

                          <div className="mt-7">
                            <div className="mb-4 flex items-center justify-between gap-4">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">
                                  Tópico {activeQuestionTopicIndex + 1} de {bookingQuestionTopics.length}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-foreground">{activeQuestionTopic}</h3>
                              </div>
                              {activeQuestionTopicIndex > 0 ? (
                                <button
                                  type="button"
                                  onClick={backToPreviousQuestionTopic}
                                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-[#ff6b00]"
                                >
                                  Voltar
                                </button>
                              ) : null}
                            </div>

                            <div
                              key={activeQuestionTopic}
                              className="space-y-5 animate-in fade-in slide-in-from-right-6 duration-300"
                            >
                            {activeTopicQuestions.map((question) => (
                              <div key={question.id} className="rounded-[22px] border border-border bg-white p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">
                                  {question.categoria}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold leading-snug text-foreground">
                                    {question.pergunta}
                                  </p>
                                  {question.tipo === "texto_livre" ? (
                                    <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ff6b00]">
                                      opcional
                                    </span>
                                  ) : (
                                    <span className="rounded-full bg-[#111722] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                                      obrigatório
                                    </span>
                                  )}
                                </div>

                                {question.tipo === "multipla_escolha" ? (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {question.opcoes.map((option) => {
                                      const isSelected = choiceAnswers[question.id] === option;
                                      return (
                                        <button
                                          key={option}
                                          type="button"
                                          onClick={() => updateChoiceAnswer(question.id, option)}
                                          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                            isSelected
                                              ? "border-[#111722] bg-[#111722] text-white"
                                              : "border-[#ff6b00]/25 bg-[#fff7f0] text-[#ff6b00] hover:border-[#ff6b00]"
                                          }`}
                                        >
                                          {option}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="relative mt-4">
                                    <div
                                      ref={(element) => {
                                        textAnswerElementsRef.current[question.id] = element;
                                      }}
                                      role="textbox"
                                      tabIndex={0}
                                      contentEditable
                                      suppressContentEditableWarning
                                      className="peer min-h-[112px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm leading-relaxed text-foreground caret-[#111722] outline-none transition empty:before:content-[''] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/15"
                                    >
                                      {textAnswersRef.current[question.id] ?? ""}
                                    </div>
                                    <span className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground/70 transition peer-focus:hidden peer-[&:not(:empty)]:hidden">
                                      Escreva aqui...
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {error ? <p className="mt-4 text-sm font-medium text-[#d9480f]">{error}</p> : null}

                    {selectedStartAt ? (
                      <button
                        type="button"
                        onClick={handleQuestionStepAction}
                        disabled={isSubmitting}
                        className="relative z-20 mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#111722] px-8 text-sm font-semibold text-white transition hover:bg-[#1a2230] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirmando...
                          </>
                        ) : (
                          isLastQuestionTopic ? "Confirmar agendamento" : "Próximo tópico"
                        )}
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TimezoneSelect({
  value,
  options,
  onChange,
  compact = false,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (timezone: string) => void;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div
      className={`relative ${isOpen ? "z-[80]" : "z-10"} ${compact ? "mt-3 w-fit" : "w-full sm:w-auto"}`}
      onBlur={(event) => {
        const nextFocusedElement = event.relatedTarget;
        if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-full font-semibold text-foreground outline-none transition focus:ring-2 focus:ring-[#ff6b00]/25 ${
          compact ? "bg-white py-1 text-sm" : "bg-[#fff1e8] px-4 py-3 text-xs"
        }`}
        aria-label="Fuso horário"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-2">
          {compact ? <Globe2 className="h-4 w-4 shrink-0 text-[#ff6b00]" /> : null}
          {selectedOption.label}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div
          className={`z-[120] min-w-full overflow-hidden rounded-2xl border border-border bg-white p-1 shadow-[0_18px_45px_rgba(15,23,42,0.22)] ring-1 ring-white ${
            compact ? "absolute bottom-[calc(100%+0.5rem)] left-0 w-48" : "absolute left-0 top-[calc(100%+0.5rem)]"
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`block w-full whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                option.value === value
                  ? "bg-[#111722] text-white"
                  : "text-foreground hover:bg-[#fff1e8] hover:text-[#ff6b00]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TimePicker({
  selectedDate,
  selectedSlot,
  slots,
  timezone,
  onSelect,
}: {
  selectedDate: string;
  selectedSlot?: Slot;
  slots: Slot[];
  timezone: string;
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
  return (
    <div className="rounded-[24px] bg-[#faf8f6] p-5 lg:bg-white lg:p-0">
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">Horários disponíveis</p>
          <p className="mt-1 text-sm font-semibold capitalize text-foreground">
            {dateLabel || "Escolha um dia no calendário"}
          </p>
        </div>
      </div>

      {slots.length ? (
        <div className="aive-hidden-scrollbar mt-6 grid max-h-[360px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
          {slots.map((slot) => (
            <button
              key={slot.startAt}
              type="button"
              onClick={() => onSelect(slot.startAt)}
              className={`inline-flex h-14 w-full items-center justify-center rounded-[18px] border text-sm font-semibold transition ${
                selectedSlot?.startAt === slot.startAt
                  ? "border-[#111722] bg-[#111722] text-white shadow-[0_10px_24px_rgba(17,23,34,0.12)]"
                  : "border-[#111722]/15 bg-white text-[#111722] hover:border-[#ff6b00] hover:text-[#ff6b00]"
              }`}
            >
              {timeFormatter.format(new Date(slot.startAt))}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-[#fff1e8] p-4 text-sm text-muted-foreground">
          Selecione um dia disponível para ver os horários.
        </p>
      )}
    </div>
  );
}

function Confirmation({ booking, timezone, meetLink }: { booking: Booking; timezone: string; meetLink: string }) {
  const formattedDateTime = new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(booking.startAt));
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    dateStyle: "full",
  }).format(new Date(booking.startAt));
  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(booking.startAt));

  return (
    <div className="relative flex min-h-[560px] flex-col justify-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6b00] text-white">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6b00]">Agendamento confirmado</p>
      <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        Sua call com a Aive está marcada.
      </h2>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        Enviamos a confirmação por e-mail para <span className="font-semibold text-foreground">{booking.email}</span>.
      </p>
      <div className="mt-6 rounded-[24px] border border-border bg-[#faf8f6] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b00]">Resumo</p>
        <dl className="mt-4 grid gap-4 text-sm">
          <div>
            <dt className="font-semibold text-muted-foreground">Data</dt>
            <dd className="mt-1 font-semibold capitalize text-foreground">{formattedDate}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted-foreground">Horário</dt>
            <dd className="mt-1 font-semibold text-foreground">{formattedTime}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted-foreground">E-mail</dt>
            <dd className="mt-1 break-all font-semibold text-foreground">{booking.email}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 rounded-[24px] border border-border bg-white p-5">
        <p className="text-sm font-semibold text-foreground">Próximos passos</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>Confira o e-mail de confirmação com os detalhes da call.</li>
          <li>Entre no Google Meet alguns minutos antes do horário marcado.</li>
          <li>Separe dúvidas, contexto do negócio e metas para a conversa.</li>
        </ul>
        <p className="mt-4 text-xs font-medium text-muted-foreground">Horário confirmado: {formattedDateTime}</p>
      </div>
      <a
        href={meetLink}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex h-14 w-fit items-center justify-center rounded-full bg-[#111722] px-8 text-sm font-semibold text-white transition hover:bg-[#1a2230]"
      >
        Abrir Google Meet
      </a>
    </div>
  );
}
