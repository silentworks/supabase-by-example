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
  const next = url.searchParams.get("next") ?? "/";

  const cookies = request.headers.get('Cookie')

  // Create redirect link without the token
  const redirectTo = url;
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('code');

  let { supabase, headers } = createServerClient(request, new Headers());

  if (token_hash && type) {
    if (type === 'recovery') {
      headers = await passwordUpdateRequired(headers)
    }
    await supabase.auth.verifyOtp({ type, token_hash });
  }

  
  return redirect(next, { headers });
};
  