import { createClient } from "@/lib/supabase/server";
import EmailForm from "./email-form";
import { getProfile } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UpdateEmail() {
  const supabase = createClient();
  const { profile, session } = await getProfile(supabase);

  return <EmailForm profile={profile} user={session?.user} />;
}
