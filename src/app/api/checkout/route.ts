import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql, initOrdersTable } from "@/lib/db";

const PRICES: Record<string, number> = {
  California: 14900,
  Florida:    19900,
  "New York": 27900,
  Texas:      37900,
};

const STATE_FEE: Record<string, number> = {
  California: 7000,
  Florida:    12500,
  "New York": 20000,
  Texas:      30000,
};

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await req.json();
  const { companyId, userEmail, businessName, state, structure, organizerName, addressLine1, city, zip, phone } = body;

  const totalCents = PRICES[state];
  if (!totalCents) return NextResponse.json({ error: "Unsupported state" }, { status: 400 });

  await initOrdersTable();

  const [order] = await sql`
    INSERT INTO filing_orders
      (company_id, user_email, business_name, state, structure, organizer_name, address_line1, city, zip, phone, amount_cents)
    VALUES
      (${companyId}, ${userEmail}, ${businessName}, ${state}, ${structure}, ${organizerName}, ${addressLine1}, ${city}, ${zip}, ${phone ?? ""}, ${totalCents})
    RETURNING id
  `;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://themidnightfounder.com";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${state} LLC Filing — ${businessName}`,
            description: `Includes $${STATE_FEE[state] / 100} state filing fee + $79 service fee. We file on your behalf.`,
          },
          unit_amount: totalCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: userEmail,
    success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/guide`,
    metadata: { orderId: order.id },
  });

  await sql`
    UPDATE filing_orders SET stripe_session_id = ${session.id} WHERE id = ${order.id}
  `;

  return NextResponse.json({ url: session.url });
}
