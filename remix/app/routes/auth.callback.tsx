import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createServerClient } from "~/lib/supabase";

export const loader = async ({ 
  request 
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? url.origin;

  // Create redirect link without the token
  const redirectTo = new URL(next);

  let { supabase, headers } = createServerClient(request, new Headers());

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(redirectTo.toString(), { headers })
    }
  }

  redirectTo.searchParams.set('error_message', 'There was a problem with your authentication. Please report this to our support team.')
  redirectTo.pathname = '/auth/signin'
  return redirect(redirectTo.toString(), { headers });
};
  