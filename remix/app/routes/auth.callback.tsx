import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { EmailOtpType } from "@supabase/supabase-js";
import { passwordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";

export const loader = async ({ 
  request 
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  // Create redirect link without the token
  const redirectTo = url;
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('code');

  let { supabase, headers } = createServerClient(request, new Headers());

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.searchParams.delete('next')
      return redirect(redirectTo.toString(), { headers })
    }
  }

  redirectTo.searchParams.set('error_message', 'There was a problem with your authentication. Please report this to our support team.')
  redirectTo.pathname = '/auth/signin'
  return redirect(redirectTo.toString(), { headers });
};
  