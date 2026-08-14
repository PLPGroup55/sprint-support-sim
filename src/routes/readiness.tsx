import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, AlertTriangle, KeyRound } from "lucide-react";

export const Route = createFileRoute("/readiness")({
  head: () => ({
    meta: [
      { title: "Go-Live Readiness Note — Northstar Sprint" },
      {
        name: "description",
        content:
          "One-page handover: what works, what's known-broken, and what Northstar's team needs to run the support deflection MVP without us.",
      },
      { property: "og:title", content: "Go-Live Readiness Note — Northstar Sprint" },
      {
        property: "og:description",
        content: "What works, what's known-broken, and what Northstar needs to take the MVP over.",
      },
    ],
  }),
  component: Readiness,
});

const WORKS = [
  "Order status lookup by order number: status, carrier, ETA, and a follow-up prompt.",
  "Returns & refunds: policy, 30-day window, 72-hour exchange dispatch, refund timing, 24-hour inspection feedback.",
  "Stock availability: restock state, size and colour options, and the order-to-receipt walkthrough.",
  "Confidence fallback: anything outside the three categories is escalated with a ticket reference instead of guessed at.",
  "Per-conversation deflection rate shown in the widget header for pilot reporting.",
];

const BROKEN = [
  "Data is a fixture set (3 orders, 3 SKUs) — no live OMS or inventory connection yet.",
  "Intent matching is keyword-based, so unusual phrasing falls through to human handoff (safe, but lowers deflection).",
  "No auth: anyone with an order number sees its status. Email/ZIP verification is required before public launch.",
  "Ticket references are simulated; nothing is written to the helpdesk.",
  "English only, and no conversation persistence across page reloads.",
];

const HANDOVER = [
  "Read access to the order API (status, carrier, ETA by order ID) and the inventory API (stock, sizes, colours by SKU).",
  "Helpdesk API credentials so escalations create real tickets with the transcript attached.",
  "A policy owner to sign off the returns copy — it is currently one editable file, no deploy needed to change wording.",
  "One engineer for ~2 days to swap the fixtures for live endpoints, plus a support lead to review the first week of escalations.",
  "Agreed pilot metric: deflection rate on the three categories, reviewed weekly.",
];

function Section({
  title,
  icon: Icon,
  items,
  tone,
}: {
  title: string;
  icon: typeof Check;
  items: string[];
  tone: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-card-foreground">
        <Icon className={`size-4 ${tone}`} /> {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span className={`mt-2 size-1.5 shrink-0 rounded-full ${tone.replace("text-", "bg-")}`} />
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Readiness() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-3.5" /> Back to prototype
          </Link>
          <span className="font-mono text-xs text-muted-foreground">1 page · handover</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-14">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Deliverable 2</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Go-live readiness note</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Support Deflection MVP · Northstar Retail Co. · end of week 1. This is an MVP that proves the approach,
            not a finished product. Everything below is what a Northstar engineer needs to pick it up cold.
          </p>
        </header>

        <Section title="What works today" icon={Check} items={WORKS} tone="text-accent" />
        <Section title="What is known-broken" icon={AlertTriangle} items={BROKEN} tone="text-destructive" />
        <Section title="What Northstar needs to take it over" icon={KeyRound} items={HANDOVER} tone="text-foreground" />

        <p className="text-xs text-muted-foreground">
          Collaboration audit trail: every change in this repo is committed per contributor with descriptive messages;
          the commit history is the procurement-office evidence pack.
        </p>
      </div>
    </main>
  );
}
