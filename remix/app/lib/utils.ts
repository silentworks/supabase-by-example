import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { ZodError } from "zod";
import type { Database } from "./schema";
import get from "just-safe-get";

export const formatError = (zodError: ZodError) => {
  const formattedErrors: Record<string, string> = {};
  zodError.errors.forEach((err) => {
    const k = err.path.pop() as string;
    if (formattedErrors[k] == null) {
      formattedErrors[k] = err.message;
    }
  });
  return formattedErrors;
};

type SuccessFault<T, R = true | false> = {
  success: R;
  message: string;
  errors?: Record<string, string>;
  data: T
};

interface SuccessFaultArgs<T> {
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export const success = <T extends Record<string, unknown> | undefined>({
  message = "",
  data
}: SuccessFaultArgs<T>) => ({
  success: true,
  message,
  errors: undefined,
  data,
}) as SuccessFault<T, true>;

export const fault = <T extends Record<string, unknown> | undefined>({
  message = "",
  errors,
  data
}: SuccessFaultArgs<T>) => ({
  success: false,
  message,
  errors,
  data,
}) as SuccessFault<T, false>;

export type ProfileInfo = Database["public"]["Tables"]["profiles_info"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
export type Profile = Profiles & {
  profiles_info: ProfileInfo | ProfileInfo[] | null;
};

export interface UserInfo {
  user: User | undefined;
  profile: Profile;
}

export async function getProfile(
  supabase: SupabaseClient,
  slug: string | undefined = undefined
) {
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let match;
  if (slug !== undefined) {
    match = { slug };
  } else {
    match = { id: session?.user.id };
  }

  // get profile and profile_info
  const { data: profile } = await supabase
    .from("profiles")
    .select(`*, profiles_info(*)`)
    .match(match)
    .maybeSingle();

  const profileInfo = get(profile, "profiles_info") as ProfileInfo;
  
  return {
    profile,
    profileInfo,
    session,
  } as { profile: Profile; profileInfo: ProfileInfo; session: Session | null };
}
