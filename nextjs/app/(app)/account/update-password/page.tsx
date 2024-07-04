import { createClient } from "@/lib/supabase/server";
import PasswordForm from "./password-form";

export const dynamic = "force-dynamic";

export default async function UpdatePassword() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <PasswordForm user={session?.user} />;
}
