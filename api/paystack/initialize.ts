type InitBody = {
  amount: number;
  email: string;
  name?: string;
  phone?: string;
  currency?: string;
};

type ReqLike = {
  method?: string;
  body?: any;
};

type ResLike = {
  status: (code: number) => ResLike;
  json: (payload: any) => void;
};

export default async function handler(req: ReqLike, res: ResLike) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      res.status(500).json({ error: "Missing PAYSTACK_SECRET_KEY" });
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL || "https://www.ncaa.org.ss";

    const rawBody = req.body ?? {};
    const body = (typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody) as Partial<InitBody>;

    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
    const email = typeof body.email === "string" ? body.email : "";
    const currencyFromBody = typeof body.currency === "string" ? body.currency.trim() : "";
    const currencyFromEnv = typeof process.env.PAYSTACK_CURRENCY === "string" ? process.env.PAYSTACK_CURRENCY.trim() : "";
    const currency = currencyFromBody || currencyFromEnv || undefined;

    if (!email || !email.includes("@")) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    const reference = `donation_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const payload: Record<string, any> = {
      email,
      amount: Math.round(amount * 100),
      reference,
      callback_url: `${frontendUrl.replace(/\/$/, "")}/donate?reference=${encodeURIComponent(reference)}`,
      metadata: {
        donorName: typeof body.name === "string" ? body.name : undefined,
        donorPhone: typeof body.phone === "string" ? body.phone : undefined,
        isDonation: true,
      },
    };

    if (currency) {
      payload.currency = currency;
    }

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const paystackText = await paystackRes.text();
    let paystackJson: any = null;
    try {
      paystackJson = paystackText ? JSON.parse(paystackText) : null;
    } catch {
      paystackJson = null;
    }

    if (!paystackRes.ok || !paystackJson?.status) {
      res.status(502).json({
        error: "Paystack initialize failed",
        paystackStatus: paystackRes.status,
        paystackBody: paystackJson ?? paystackText,
      });
      return;
    }

    res.status(200).json({
      authorization_url: paystackJson.data.authorization_url,
      reference,
    });
  } catch (e: any) {
    res.status(500).json({ error: "Server error", details: e?.message ?? String(e) });
  }
}
