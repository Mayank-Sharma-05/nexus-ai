import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    // If webhook secret is not set in dev, acknowledge
    return NextResponse.json({ received: true });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier || "PRO";

      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: session.subscription,
            tier: tier as any,
            status: "ACTIVE",
          },
          update: {
            stripeSubscriptionId: session.subscription,
            tier: tier as any,
            status: "ACTIVE",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook verification error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
