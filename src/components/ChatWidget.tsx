import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, RotateCcw } from "lucide-react";
import { respond, CATEGORY_LABEL, type Category, type OrderRecord } from "@/lib/deflection";

type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  category?: Category;
  deflected?: boolean;
  chips?: string[] | undefined;
};

const GREETING: Msg = {
  id: 0,
  from: "bot",
  text: "Welcome to Northstar Retail. How can we help you today?",
  category: "smalltalk",
  deflected: true,
  chips: [
    "I ordered shoes on Thursday — have they shipped?",
    "What is your return policy?",
    "Is the woolen jacket back in stock?",
  ],
};

export function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const memory = useRef<{ lastOrder?: OrderRecord }>({});
  const endRef = useRef<HTMLDivElement>(null);
  const counter = useRef(1);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: counter.current++, from: "user", text }]);
    setTyping(true);
    window.setTimeout(() => {
      const reply = respond(text, memory.current);
      setMessages((m) => [
        ...m,
        {
          id: counter.current++,
          from: "bot",
          text: reply.text,
          category: reply.category,
          deflected: reply.deflected,
          chips: reply.chips,
        },
      ]);
      setTyping(false);
    }, 550);
  };

  const answered = messages.filter((m) => m.from === "bot" && m.category !== "smalltalk");
  const deflected = answered.filter((m) => m.deflected).length;
  const rate = answered.length ? Math.round((deflected / answered.length) * 100) : 0;

  const lastChips = [...messages].reverse().find((m) => m.from === "bot")?.chips ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-panel)]">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-secondary-foreground">Northstar Support Assistant</p>
            <p className="text-xs text-muted-foreground">MVP v0.3 — deflection pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-accent">{rate}%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">deflected</p>
          </div>
          <button
            onClick={() => {
              memory.current = {};
              counter.current = 1;
              setMessages([GREETING]);
            }}
            aria-label="Restart conversation"
            className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </header>

      <div className="h-[26rem] space-y-4 overflow-y-auto bg-background px-5 py-5">
        {messages.map((m) => (
          <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`flex max-w-[85%] gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
              <span
                className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-full ${
                  m.from === "user" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {m.from === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
              </span>
              <div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm border border-border bg-card text-card-foreground"
                  }`}
                >
                  {m.text}
                </div>
                {m.from === "bot" && m.category && m.category !== "smalltalk" && (
                  <p className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {CATEGORY_LABEL[m.category]} ·{" "}
                    <span className={m.deflected ? "text-accent" : "text-destructive"}>
                      {m.deflected ? "auto-resolved" : "escalated"}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot className="size-4" /> typing…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {lastChips.length > 0 && !typing && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-secondary px-5 py-3">
          {lastChips.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-card-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about an order, a return, or stock…"
          aria-label="Message"
          className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          disabled={!input.trim()}
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
