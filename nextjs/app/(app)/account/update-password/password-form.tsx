"use client";
import { useActionState } from "react";
import { initialFormState, UserInfo } from "@/lib/utils";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import { passwordUpdate } from "../actions";

export default function PasswordForm({ user, profile }: UserInfo) {
  const [state, formAction] = useActionState(passwordUpdate, initialFormState())

  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {state.message ? (
        <Alert
          className={`${state.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {state.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Update Password</h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, Enter your new password below and confirm it
      </p>
      <form action={formAction}>
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
        <div className="form-control">
          <label htmlFor="password_confirm" className="label">
            Confirm Password
          </label>
          <input
            id="password_confirm"
            name="password_confirm"
            type="password"
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.passwordConfirm ? (
          <InputErrorMessage>{state.errors.passwordConfirm}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
