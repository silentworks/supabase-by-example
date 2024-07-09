import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AuthApiError, EmailOtpType } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError } from "~/lib/utils";
import { AuthUserWithTokenSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof AuthUserWithTokenSchema>;

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const type = (url.searchParams.get("type") ?? "email") as EmailOtpType;
  const nextUrl = url.searchParams.get("next") ?? "/";

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const token = formData.get("token") as string;
  
  try {
    AuthUserWithTokenSchema.parse({ email, token });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return json(fault({ data: { email, token }, errors }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());
  
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });

  if (error) {
    if (error instanceof AuthApiError && error.status === 400) {
      return json(fault({ message: "Invalid credentials.", data: { email, token: "" } }), { headers });
    }
    return json(fault({ message: error.message, data: { email, token: "" } }), { headers });
  }

  return redirect(nextUrl, {
    headers
  });
};

export default function VerifyToken() {
  const actionData = useActionData<typeof action>();
  
  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {actionData?.message ? (
        <Alert
          className={`${actionData?.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {actionData?.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Sign in</h2>
      <p className="font-medium mb-4">Hi, Welcome back</p>
      <Form method="post">
      <div className="form-control">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            defaultValue={actionData?.data?.email}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.email ? (
          <InputErrorMessage>{actionData.errors.email}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="token" className="label">
            Token
          </label>
          <input
            id="token"
            name="token"
            type="text"
            defaultValue={actionData?.data?.token}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.token ? (
          <InputErrorMessage>{actionData.errors.token}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Sign in</button>
        </div>
      </Form>
      <div className="pt-4 text-center">
        Not registered yet?{" "}
        <Link to="/auth/signup" className="underline text-blue-500">
          Create an account
        </Link>
      </div>
    </div>
  );
}
  