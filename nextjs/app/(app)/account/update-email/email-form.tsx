"use client";
import { useFormState } from "react-dom";
import { initialFormState, UserInfo } from "@/lib/utils";
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import { emailUpdate, FormDataUpdateEmail } from "../actions";

export default function EmailForm({ user, profile }: UserInfo) {
  const [state, formAction] = useFormState(emailUpdate, initialFormState())

  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {state.message ? (
        <Alert
          className={`${state.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {state.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Update Email</h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, Enter your new email below and confirm it
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
        <div className="form-control">
          <label htmlFor="email_confirm" className="label">
            Confirm Email
          </label>
          <input
            id="email_confirm"
            name="email_confirm"
            type="email"
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.emailConfirm ? (
          <InputErrorMessage>{state.errors.emailConfirm}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Update Email</button>
        </div>
      </form>
    </div>
  );
}
