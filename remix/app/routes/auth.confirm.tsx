import { LoaderFunctionArgs, createCookie, redirect } from "@remix-run/node";
import { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "~/lib/supabase";

export const loader = async ({ 
  request 
}: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "email") as EmailOtpType;
  const next = searchParams.get("next") ?? "/";

  const { supabase, headers } = createServerClient(request, new Headers());

  if (token_hash && type) {
    if (type === 'recovery') {
      const passwordUpdateRequired = createCookie("password_update_required", {
        maxAge: 604_800, // one week
      });
      headers.append('Set-Cookie', await passwordUpdateRequired.serialize({
        password_update_required: true
      }))
    }
    await supabase.auth.verifyOtp({ type, token_hash });
  }

  
  return redirect(next, { headers });
};
  