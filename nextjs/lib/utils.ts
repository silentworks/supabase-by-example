import { SupabaseClient, User } from "@supabase/supabase-js";
import type { ZodError } from "zod";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const initialFormState = <T>(): Results<T> => ({
  success: false,
  message: ''
})

type Results<T> = ({
  success: true;
  message: string;
  data: T | undefined;
} | {
  success: false;
  message: string;
  errors?: T;
})

export const formatError = <T extends Record<string, string>>(zodError: ZodError) => {
  const formattedErrors: Record<string, string> = {};
  zodError.errors.forEach((err) => {
    const k = err.path.pop() as string;
    if (formattedErrors[k] == null) {
      formattedErrors[k] = err.message;
    }
  });
  return formattedErrors as T;
};

export const fieldFault = <T>(
  errors: T,
): Results<T> => ({
  success: false,
  message: "",
  errors
});

export const success = <T>(
  message: string,
  data?: T
): Results<T> => ({
  success: true,
  message,
  data,
});

export const fault = <T>(
  message: string
): Results<T> => ({
  success: false,
  message,
});

export function waitload(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export interface UserInfo {
  user: User | undefined;
  profile: Profile;
}

export async function getProfile(
  supabase: SupabaseClient,
  slug: string | undefined = undefined
) {
  // Check if we have a session
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  let match;
  if (slug !== undefined) {
    match = { slug };
  } else {
    match = { id: user?.sub };
  }

  // get profile and profile_info
  const { data: profile } = await supabase
    .from("profiles")
    .select(`*, profiles_info(*)`)
    .match(match)
    .maybeSingle();

  return {
    profile,
  } as { profile: Profile; };
}
