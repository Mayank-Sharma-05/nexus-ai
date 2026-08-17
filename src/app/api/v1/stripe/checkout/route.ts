import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/clerk";
import { stripe, SUBSCRIPTION_PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { tier = "PRO" } = await req.json();
    const plan = tier === "ENTERPRISE" ? SUBSCRIPTION_PLANS.ENTERPRISE : SUBSCRIPTION_PLANS.PRO;
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Nexus AI — ${plan.name}`,
              description: `Unlimited AI creation & priority compute (${plan.tokenAllowance.toLocaleString()} tokens/mo)`,
            },
            unit_amount: plan.price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email,
      metadata: {
        userId: user.id,
        tier,
      },
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/billing?payment=canceled`,
    });

    return NextResponse.json({ success: true, data: { url: session.url } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
