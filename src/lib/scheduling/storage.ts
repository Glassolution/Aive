import { randomUUID } from "node:crypto";
import type { Booking, CreateBookingInput } from "./types";
import { schedulingConfig } from "./config";

type LocalStore = {
  bookings: Booking[];
};

function hasPostgresEnv() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

async function ensurePostgresTable() {
  const { sql } = await import("@vercel/postgres");
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT,
      start_at TIMESTAMPTZ NOT NULL UNIQUE,
      end_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    topic: row.topic == null ? null : String(row.topic),
    questionnaire: [],
    startAt: new Date(String(row.start_at)).toISOString(),
    endAt: new Date(String(row.end_at)).toISOString(),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

function questionnaireSummary(input: CreateBookingInput) {
  return (input.questionnaire ?? [])
    .filter((item) => item.resposta?.trim())
    .map((item) => `${item.categoria} - ${item.pergunta}: ${item.resposta}`)
    .join(" | ")
    .slice(0, 900);
}

async function readLocalStore(): Promise<LocalStore> {
  const { readFile, mkdir } = await import("node:fs/promises");
  const { dirname, join } = await import("node:path");
  const filePath = join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data", "bookings.local.json");

  try {
    const contents = await readFile(filePath, "utf8");
    return JSON.parse(contents) as LocalStore;
  } catch {
    await mkdir(dirname(filePath), { recursive: true }).catch(() => undefined);
    return { bookings: [] };
  }
}

async function writeLocalStore(store: LocalStore) {
  const { writeFile, mkdir } = await import("node:fs/promises");
  const { dirname, join } = await import("node:path");
  const filePath = join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data", "bookings.local.json");
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}

export async function listBookedStartTimes() {
  if (hasPostgresEnv()) {
    await ensurePostgresTable();
    const { sql } = await import("@vercel/postgres");
    const { rows } = await sql`
      SELECT start_at
      FROM bookings
      WHERE start_at >= NOW()
      ORDER BY start_at ASC;
    `;
    return rows.map((row) => new Date(String(row.start_at)).toISOString());
  }

  const store = await readLocalStore();
  return store.bookings
    .filter((booking) => new Date(booking.startAt).getTime() >= Date.now())
    .map((booking) => booking.startAt);
}

export async function createBooking(input: CreateBookingInput) {
  const endAt = new Date(new Date(input.startAt).getTime() + schedulingConfig.slotDurationMinutes * 60_000);
  const topic = questionnaireSummary(input) || input.topic?.trim() || null;

  if (hasPostgresEnv()) {
    await ensurePostgresTable();
    const { sql } = await import("@vercel/postgres");
    const id = randomUUID();
    const { rows } = await sql`
      INSERT INTO bookings (id, name, email, topic, start_at, end_at)
      VALUES (${id}, ${input.name}, ${input.email}, ${topic}, ${input.startAt}, ${endAt.toISOString()})
      ON CONFLICT (start_at) DO NOTHING
      RETURNING id, name, email, topic, start_at, end_at, created_at;
    `;

    return rows[0] ? { ...rowToBooking(rows[0]), questionnaire: input.questionnaire ?? [] } : null;
  }

  const store = await readLocalStore();
  if (store.bookings.some((booking) => booking.startAt === input.startAt)) {
    return null;
  }

  const booking: Booking = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    topic,
    questionnaire: input.questionnaire ?? [],
    startAt: input.startAt,
    endAt: endAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  store.bookings.push(booking);
  await writeLocalStore(store);
  return booking;
}
