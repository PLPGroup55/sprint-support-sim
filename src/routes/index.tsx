import { createFileRoute, Link } from "@tanstack/react-router";
import { ChatWidget } from "@/components/ChatWidget";
import { ORDERS, STOCK } from "@/lib/deflection";
import { PackageSearch, Undo2, Boxes, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northstar Sprint — Support Deflection MVP" },
      {
        name: "description",
        content:
          "A one-week MVP for Northstar Retail Co.: a support assistant that auto-resolves order status, returns & refunds, and stock availability tickets.",
      },
      { property: "og:title", content: "Northstar Sprint — Support Deflection MVP" },
      {
        property: "og:description",
        content:
          "Demoable chatbot deflecting order status, returns and stock questions before they reach a human agent.",
      },
    ],
  }),
  component: Index,
});

const COVERAGE = [
  {
    icon: PackageSearch,
    title: "Order status",
    line: "Looks up an order number and returns carrier, status and ETA.",
  },
  { icon: Undo2, title: "Returns & refunds", line: "Explains policy, exchange windows and refund timelines." },
  { icon: Boxes, title: "Stock availability", line: "Checks restock state, sizes and colours, then guides checkout." },
];

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm font-semibold tracking-tight text-secondary-foreground">
            northstar<span className="text-accent">/</span>sprint
          </span>
          <Link
            to="/readiness"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            Go-live readiness note <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Week 1 · Client engagement</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl">
          Support deflection MVP for Northstar Retail Co.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Northstar's support team is drowning in three repetitive ticket types. This prototype takes all three off
          their queue end-to-end, and hands anything it can't answer to a human with the transcript attached.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {COVERAGE.map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-5">
              <c.icon className="size-5 text-accent" />
              <h2 className="mt-3 text-sm font-semibold text-card-foreground">{c.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[1.4fr_1fr]">
        <ChatWidget />

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground">Test data — orders</h3>
            <ul className="mt-3 space-y-3">
              {ORDERS.map((o) => (
                <li key={o.id} className="text-sm">
                  <span className="font-mono text-xs text-accent">{o.id}</span>
                  <p className="text-muted-foreground">
                    {o.item} · <span className="capitalize">{o.status}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground">Test data — catalogue</h3>
            <ul className="mt-3 space-y-3">
              {STOCK.map((s) => (
                <li key={s.name} className="text-sm">
                  <p className="capitalize text-card-foreground">{s.name}</p>
                  <p className="text-muted-foreground">
                    {s.inStock ? `${s.sizes.join(", ")} · ${s.colours.join(", ")}` : "Out of stock"}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-dashed border-border p-5">
            <h3 className="text-sm font-semibold text-foreground">Demo script</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ask about shoes ordered on Thursday, give order number B1432VSWE345, then ask about the return policy,
              exchange timing, and whether the woolen jacket is back in stock.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
