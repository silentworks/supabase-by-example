import { EmailOtpType } from "@supabase/supabase-js";
import VerifyTokenForm from "./verifytokenform";

export default function VerifyToken({ searchParams } : {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = (searchParams.type ?? "email") as EmailOtpType;
  return <VerifyTokenForm auth_type={type} />;
}
