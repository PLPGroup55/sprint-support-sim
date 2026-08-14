export type Category = "order_status" | "returns" | "stock" | "handoff" | "smalltalk";

export type Reply = {
  text: string;
  category: Category;
  deflected: boolean;
  chips?: string[];
};

export type OrderRecord = {
  id: string;
  item: string;
  placed: string;
  status: "processing" | "shipped" | "delivered";
  carrier: string;
  etaDays: number;
};

export const ORDERS: OrderRecord[] = [
  {
    id: "B1432VSWE345",
    item: "Trailwind Runner shoes (UK 9)",
    placed: "Thursday",
    status: "shipped",
    carrier: "SwiftPost",
    etaDays: 3,
  },
  {
    id: "B9981QQLM220",
    item: "Merino wool socks (3-pack)",
    placed: "Monday",
    status: "processing",
    carrier: "SwiftPost",
    etaDays: 5,
  },
  {
    id: "B7745ZTRK118",
    item: "Canvas weekender bag",
    placed: "last Friday",
    status: "delivered",
    carrier: "SwiftPost",
    etaDays: 0,
  },
];

export type StockRecord = {
  name: string;
  inStock: boolean;
  sizes: string[];
  colours: string[];
};

export const STOCK: StockRecord[] = [
  {
    name: "woolen jacket",
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colours: ["black", "maroon", "blue"],
  },
  {
    name: "trailwind runner shoes",
    inStock: true,
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    colours: ["grey", "white"],
  },
  {
    name: "rain shell",
    inStock: false,
    sizes: [],
    colours: [],
  },
];

const ORDER_ID = /\b[A-Z]\d{4}[A-Z]{4}\d{3}\b/i;

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

export function respond(rawInput: string, memory: { lastOrder?: OrderRecord }): Reply {
  const t = rawInput.toLowerCase().trim();

  // 1. Order status ------------------------------------------------------
  const idMatch = rawInput.match(ORDER_ID);
  if (idMatch) {
    const order = ORDERS.find((o) => o.id.toLowerCase() === idMatch[0].toLowerCase());
    if (order) {
      memory.lastOrder = order;
      if (order.status === "shipped") {
        return {
          text: `Thank you. Order ${order.id} (${order.item}) placed ${order.placed} has been shipped with ${order.carrier}. It is expected to arrive in approximately ${order.etaDays} days — kindly confirm with us after this period.`,
          category: "order_status",
          deflected: true,
          chips: ["What's your return policy?", "Is the woolen jacket back in stock?"],
        };
      }
      if (order.status === "processing") {
        return {
          text: `Order ${order.id} (${order.item}) is still being prepared in our warehouse. It ships within 24 hours and should reach you in about ${order.etaDays} days.`,
          category: "order_status",
          deflected: true,
        };
      }
      return {
        text: `Order ${order.id} (${order.item}) was delivered. If it hasn't reached you, I can open a ticket with a human agent.`,
        category: "order_status",
        deflected: true,
        chips: ["Talk to a human"],
      };
    }
    return {
      text: `I couldn't find order ${idMatch[0]} in our system. Please double-check the number on your confirmation email, or I can pass you to an agent.`,
      category: "handoff",
      deflected: false,
      chips: ["Talk to a human"],
    };
  }

  if (
    has(t, ["shipped", "where is my order", "order status", "tracking", "track", "delivery", "delivered", "arrive", "ordered"])
  ) {
    return {
      text: "Happy to check that. Would you kindly provide your order number for confirmation? It looks like B1432VSWE345 and is on your confirmation email.",
      category: "order_status",
      deflected: true,
      chips: ["B1432VSWE345"],
    };
  }

  // 2. Returns & refunds --------------------------------------------------
  if (has(t, ["how soon", "feedback"]) && has(t, ["exchange", "refund", "return"])) {
    return {
      text: "You'll get feedback within 24 hours of us processing the condition of the returned order — we'll email you whether it's an exchange or a refund.",
      category: "returns",
      deflected: true,
    };
  }
  if (has(t, ["exchange"]) && has(t, ["how long", "wait", "when", "receive", "72"])) {
    return {
      text: "Exchanges are dispatched within 72 hours of us receiving the item and its receipt. If the replacement is out of stock we switch you to a refund, which also takes 72 hours to process.",
      category: "returns",
      deflected: true,
      chips: ["How soon will I know which one?"],
    };
  }
  if (has(t, ["refund", "money back", "when will i get"])) {
    return {
      text: "Refunds are processed within 72 hours of the returned item passing inspection, then land back on your original payment method in 3–5 working days.",
      category: "returns",
      deflected: true,
    };
  }
  if (has(t, ["return", "exchange", "policy", "don't like", "dont like", "send it back"])) {
    return {
      text: "Yes — our policy allows both an exchange and a refund, provided the goods are still intact and accompanied by the original receipt. You have 30 days from delivery.",
      category: "returns",
      deflected: true,
      chips: ["How long does an exchange take?", "When will I get my refund?"],
    };
  }

  // 3. Stock availability -------------------------------------------------
  const item = STOCK.find((s) => t.includes(s.name) || s.name.split(" ").every((w) => t.includes(w)));
  if (item || has(t, ["in stock", "back in stock", "available", "size", "colour", "color"])) {
    if (!item) {
      return {
        text: "Which item would you like me to check? For example: woolen jacket, trailwind runner shoes, or rain shell.",
        category: "stock",
        deflected: true,
        chips: ["Is the woolen jacket back in stock?"],
      };
    }
    if (!item.inStock) {
      return {
        text: `The ${item.name} is currently out of stock. I can email you the moment it's restocked — just reply "notify me".`,
        category: "stock",
        deflected: true,
      };
    }
    if (has(t, ["size", "colour", "color", "different"])) {
      return {
        text: `Yes — the ${item.name} is available in ${item.sizes.join(", ")} and in ${item.colours.length} colours: ${item.colours.join(", ")}. Which sizes and colours would you like?`,
        category: "stock",
        deflected: true,
        chips: ["Large in blue and medium in black"],
      };
    }
    return {
      text: `Yes, the ${item.name} is back in stock.`,
      category: "stock",
      deflected: true,
      chips: ["Do you have it in different sizes and colours?"],
    };
  }

  if (has(t, ["i want", "add to cart", "buy", "order two", "place my order"])) {
    return {
      text: "Great choice. Go to the home page and search 'woolen jackets', pick your size and colour, add them to your cart and place the order. You'll get a verification email with your invoice, choose a payment method, and after payment you'll receive a receipt with the items, amount paid, order number, tracking number and delivery date.",
      category: "stock",
      deflected: true,
    };
  }

  // Human handoff / small talk -------------------------------------------
  if (has(t, ["human", "agent", "person", "representative", "complaint"])) {
    return {
      text: "No problem — I've created ticket #NS-4471 with the transcript attached. A Northstar agent will reply by email within 4 working hours.",
      category: "handoff",
      deflected: false,
    };
  }
  if (has(t, ["thank", "thanks", "cheers", "asante"])) {
    return { text: "You are welcome. Anything else I can help with today?", category: "smalltalk", deflected: true };
  }
  if (has(t, ["hi", "hello", "hey", "good morning", "good afternoon"])) {
    return {
      text: "Hello! I can help with order status, returns and refunds, or stock availability. What do you need?",
      category: "smalltalk",
      deflected: true,
    };
  }

  return {
    text: "I can confidently handle order status, returns and refunds, and stock availability. That one is outside my scope, so I'm routing it to a human agent (ticket #NS-4472).",
    category: "handoff",
    deflected: false,
  };
}

export const CATEGORY_LABEL: Record<Category, string> = {
  order_status: "Order status",
  returns: "Returns & refunds",
  stock: "Stock availability",
  handoff: "Human handoff",
  smalltalk: "General",
};
