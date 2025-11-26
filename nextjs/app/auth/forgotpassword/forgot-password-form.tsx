"use client";
import { useActionState } from "react";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import Link from "next/link";
import { forgot } from "../actions";
import { initialFormState } from "@/lib/utils";

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgot, initialFormState())

  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {state.message ? (
        <Alert
          className={`${state.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {state.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Forgot Password</h2>
      <p className="font-medium mb-4">
        Looks like you&apos;ve forgotten your password
      </p>
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
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Send</button>
        </div>
      </form>
      <div className="pt-4 text-center">
        Not registered yet?{" "}
        <Link href="/auth/signup" className="underline text-blue-500">
          Create an account
        </Link>
      </div>
    </div>
  );
}
