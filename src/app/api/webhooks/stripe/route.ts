import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) return NextResponse.json({ ok: true });

    const [order] = await sql`
      UPDATE filing_orders
      SET status = 'paid', updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `;

    if (!order) return NextResponse.json({ ok: true });

    // Notify ops
    await resend.emails.send({
      from: "The Midnight Founder <noreply@themidnightfounder.com>",
      to: "laurenfener@gmail.com",
      subject: `New filing order — ${order.business_name} (${order.state})`,
      html: `
        <h2>New Filing Order</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Business name</td><td style="padding:8px;border:1px solid #e5e7eb">${order.business_name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">State</td><td style="padding:8px;border:1px solid #e5e7eb">${order.state}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Structure</td><td style="padding:8px;border:1px solid #e5e7eb">${order.structure.toUpperCase()}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Organizer name</td><td style="padding:8px;border:1px solid #e5e7eb">${order.organizer_name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Address</td><td style="padding:8px;border:1px solid #e5e7eb">${order.address_line1}, ${order.city} ${order.zip}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #e5e7eb">${order.phone || "—"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Customer email</td><td style="padding:8px;border:1px solid #e5e7eb">${order.user_email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e7eb;font-weight:bold">Amount paid</td><td style="padding:8px;border:1px solid #e5e7eb">$${(order.amount_cents / 100).toFixed(2)}</td></tr>
        </table>
        <p style="margin-top:16px;font-family:sans-serif;font-size:14px;color:#6b7280">
          <a href="https://themidnightfounder.com/admin">View in admin panel →</a>
        </p>
      `,
    });

    // Confirm to customer
    await resend.emails.send({
      from: "The Midnight Founder <noreply@themidnightfounder.com>",
      to: order.user_email,
      subject: `We received your filing request for ${order.business_name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
          <h2 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px">We're on it.</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px">
            We received your filing request for <strong>${order.business_name}</strong> (${order.state} ${order.structure.toUpperCase()}) and payment of <strong>$${(order.amount_cents / 100).toFixed(0)}</strong>.
          </p>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px">
            We'll file your Articles of Organization shortly and send you another email once it's submitted to the state. You'll get a final confirmation once the state approves it.
          </p>
          <p style="color:#888;font-size:13px;margin:0">— The Midnight Founder team</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
