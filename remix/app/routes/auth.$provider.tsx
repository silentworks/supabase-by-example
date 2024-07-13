import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Provider } from "@supabase/supabase-js";
import { createServerClient } from "~/lib/supabase";
import { fault } from "~/lib/utils";

export const loader = async ({ 
  request, params 
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  let { supabase, headers } = createServerClient(request, new Headers());

  const provider = params.provider as Provider;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${url.origin}/auth/callback`
    }
  });

  if (error) {
    return json(fault({ message: 'Server error. Try again later.' }));
  }

  return redirect(data.url, { headers });
};
  