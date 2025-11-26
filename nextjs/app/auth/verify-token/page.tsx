import { EmailOtpType } from "@supabase/supabase-js";
import VerifyTokenForm from "./verifytokenform";

export default async function VerifyToken(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const type = (searchParams.type ?? "email") as EmailOtpType;
  const next = searchParams.next as string
  return <VerifyTokenForm auth_type={type} next={next} />;
}
