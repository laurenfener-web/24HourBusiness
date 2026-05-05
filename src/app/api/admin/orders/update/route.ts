import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const STATUS_EMAIL: Record<string, { subject: (name: string, state: string) => string; html: (name: string, state: string) => string }> = {
  filed: {
    subject: (name, state) => `Your ${name} LLC has been filed with ${state}`,
    html: (name, state) => `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h2 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px">Your LLC has been filed.</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px">
          We've submitted your <strong>${name}</strong> LLC Articles of Organization to the ${state} Secretary of State.
        </p>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px">
          Processing times vary by state. We'll send you another email as soon as your LLC is approved and your certificate is ready.
        </p>
        <p style="color:#888;font-size:13px;margin:0">— The Midnight Founder team</p>
      </div>
    `,
  },
  approved: {
    subject: (name) => `Your ${name} LLC is approved`,
    html: (name, state) => `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
        <h2 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px">Your LLC is officially approved.</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px">
          <strong>${name}</strong> is now a legally registered LLC in ${state}. Congratulations.
        </p>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px">
          Your Articles of Organization certificate is on the way. Keep it somewhere safe — you'll need it to open a business bank account and for other official purposes.
        </p>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0">
          Next step: if you haven't already, apply for your EIN at <a href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" style="color:#D4AF37">IRS.gov</a> — it's free and takes 10 minutes.
        </p>
        <p style="color:#888;font-size:13px;margin:16px 0 0">— The Midnight Founder team</p>
      </div>
    `,
  },
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.email !== "laurenfener@gmail.com") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { id, status, notes, confirmation_number } = body;

  if (notes !== undefined || confirmation_number !== undefined) {
    await sql`
      UPDATE filing_orders
      SET
        notes = ${notes ?? sql`notes`},
        confirmation_number = ${confirmation_number ?? sql`confirmation_number`},
        updated_at = NOW()
      WHERE id = ${id}
    `;
    return NextResponse.json({ ok: true });
  }

  const now = new Date().toISOString();
  const [order] = await sql`
    UPDATE filing_orders
    SET
      status = ${status},
      filed_at = ${status === "filed" ? now : sql`filed_at`},
      approved_at = ${status === "approved" ? now : sql`approved_at`},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  if (!order) return NextResponse.json({ ok: true });

  const emailDef = STATUS_EMAIL[status];
  if (emailDef && process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: "The Midnight Founder <noreply@themidnightfounder.com>",
        to: order.user_email,
        subject: emailDef.subject(order.business_name, order.state),
        html: emailDef.html(order.business_name, order.state),
      });
    } catch (e) {
      console.error("Failed to send customer email:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
