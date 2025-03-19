import SignInForm from "./sign-in-form";

export default function SignIn({ searchParams } : {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = searchParams.type as string
  return <SignInForm auth_type={type} />;
}
