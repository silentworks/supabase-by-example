import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const provider = params.slug as Provider;

  if (provider) {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${new URL(req.url).origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(new URL("/auth/signin", req.url));
}
