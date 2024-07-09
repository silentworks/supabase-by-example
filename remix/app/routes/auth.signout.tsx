import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createServerClient } from "~/lib/supabase";

export const loader = async () => {
  return redirect('/');
};

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const { supabase, headers } = createServerClient(request, new Headers());
  await supabase.auth.signOut();
  return redirect('/', { headers });
};
  