import { createClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { passwordUpdateRequired } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  const next = searchParams.get("next") ?? "/";

  // Create redirect link without the code
  const redirectTo = new URL(next);
  redirectTo.searchParams.delete('code')

  if (token_hash && type) {
    if (type === 'recovery') {
      await passwordUpdateRequired()
    }
    const supabase = await createClient();
    await supabase.auth.verifyOtp({ type, token_hash });
  }

  return NextResponse.redirect(redirectTo);
}
