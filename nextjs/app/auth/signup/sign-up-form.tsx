"use client";
import { useFormState } from "react-dom";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import Link from "next/link";
import { signup } from "../actions";
import { initialFormState } from "@/lib/utils";

export default function SignUpForm() {
  const [state, formAction] = useFormState(signup, initialFormState())

  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {state.message ? (
        <Alert
          className={`${state.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {state.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Sign up</h2>
      <p className="font-medium mb-4">Let&apos;s get started</p>
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
        {!state.success && state.errors?.password ? (
          <InputErrorMessage>{state.errors.password}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">
            Create account
          </button>
        </div>
      </form>
      <div className="pt-4 text-center">
        Already have an account?{" "}
        <Link href="/auth/signin" className="underline text-blue-500">
          Sign In
        </Link>
      </div>
    </div>
  );
}
