import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { EmailOtpType } from "@supabase/supabase-js";
import { passwordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";

export const loader = async ({ 
  request 
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") ?? "email") as EmailOtpType;
  const next = url.searchParams.get("next") ?? url.origin;

  // Create redirect link without the token
  const redirectTo = new URL(next);

  let { supabase, headers } = createServerClient(request, new Headers());

  if (token_hash && type) {
    if (type === 'recovery') {
      headers = await passwordUpdateRequired(request, headers)
    }
    await supabase.auth.verifyOtp({ type, token_hash });
  }

  return redirect(redirectTo.toString(), { headers });
};
  