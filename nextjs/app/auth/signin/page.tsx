import SignInForm from "./sign-in-form";

export default async function SignIn(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const type = searchParams.type as string
  return <SignInForm auth_type={type} />;
}
