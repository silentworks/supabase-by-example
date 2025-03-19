"use client";
import { useState } from "react";
import { useFormState } from "react-dom";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import Link from "next/link";
import { login } from "../actions";
import { initialFormState } from "@/lib/utils";

interface PasswordFieldType {
  passwordError?: string;
}

const PasswordField = ({passwordError}: PasswordFieldType) => {
  return <>
    <div className="form-control">
      <label htmlFor="password" className="label">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className="input input-bordered"
      />
    </div>
    {passwordError ? (
      <InputErrorMessage>{passwordError}</InputErrorMessage>
    ) : null}
  </>
}

export default function SignInForm({ auth_type }: { auth_type: string }) {
  const [state, formAction] = useFormState(login, initialFormState())
  const [magicLink, setMagicLink] = useState(auth_type == 'magic-link');

  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {state.message ? (
        <Alert
          className={`${state.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {state.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Sign in</h2>
      <p className="font-medium mb-4">Hi, Welcome back</p>
      <div className="space-y-2">
        <a
          className="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case no-animation"
          href="/auth/github"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlinkHref="#img-github"></use>
          </svg>
          Continue with GitHub
        </a>
        <a
          className="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case no-animation"
          href="/auth/google"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlinkHref="#img-google"></use>
          </svg>
          Continue with Google
        </a>
      </div>
      <div className="divider text-gray-400 text-sm">or continue with Email</div>
      <form action={formAction}>
        <div className="form-control">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.email ? (
          <InputErrorMessage>{state.errors.email}</InputErrorMessage>
        ) : null}
        {!magicLink ? (
          <PasswordField passwordError={!state.success ? state.errors?.password : undefined} />
        ) : null}
        <div className="form-control flex-row justify-between pt-4">
          <label className="label justify-start cursor-pointer gap-2 text-gray-500">
            <input
              name="magic_link"
              type="checkbox"
              className="toggle toggle-xs"
              defaultChecked={magicLink}
              onChange={(ev) => {
                setMagicLink(!magicLink)
              }}
            />
            Magic link login
          </label>
          {!magicLink ? (
            <Link
              className="block py-2 text-blue-500"
              href="/auth/forgotpassword"
            >
              Forgot Password?
            </Link>
          ) : null}
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Sign in</button>
        </div>
      </form>
      {!magicLink ? (
        <div className="pt-4 text-center">
          Not registered yet?{" "}
          <Link href="/auth/signup" className="underline text-blue-500">
            Create an account
          </Link>
        </div>
      ) : null}
    </div>
  );
}
