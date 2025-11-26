import { createClient } from "@/lib/supabase/server";
import PasswordForm from "./password-form";
import { getProfile } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UpdatePassword() {
  const supabase = await createClient();
  const { profile, session } = await getProfile(supabase);

  return <PasswordForm profile={profile} user={session?.user} />;
}
