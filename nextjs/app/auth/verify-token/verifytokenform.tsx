"use client";
import { initialFormState } from "@/lib/utils";
import { EmailOtpType } from "@supabase/supabase-js";
import { useFormState } from 'react-dom';
import Alert from "@/components/Alert";
import InputErrorMessage from "@/components/InputErrorMessage";
import { verify } from "../actions";

export default function VerifyTokenForm({ auth_type, next }: { auth_type: EmailOtpType, next: string }) {
  const [state, formAction] = useFormState(verify, initialFormState())

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
          <label htmlFor="token" className="label">
            Token
          </label>
          <input
            id="token"
            name="token"
            type="text"
            className="input input-bordered"
          />
        </div>
        {!state.success && state.errors?.token ? (
          <InputErrorMessage>{state.errors.token}</InputErrorMessage>
        ) : null}
        <input type="hidden" name="auth_type" value={auth_type} />
        <input type="hidden" name="next" value={next} />
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Sign in</button>
        </div>
      </form>
    </div>
  );
}
