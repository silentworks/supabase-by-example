import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AuthApiError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, success } from "~/lib/utils";
import { ForgotPasswordSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof ForgotPasswordSchema>;

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    ForgotPasswordSchema.parse({ email });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return json(fault({ data: { email, password }, errors }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/account/update-password`,
  });

  if (error) {
    if (error instanceof AuthApiError && error.status === 400) {
      return json(fault({ message: "Invalid credentials.", data: { email, password: "" } }), { headers });
    }
    return json(fault({ message: error.message, data: { email, password: "" } }), { headers });
  }

  return json(success({ 
    message: "Please check your email for a password reset link to log into the website.", 
    data: { email: "" } 
  }), { headers });
};

export default function ForgotPassword() {
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
      <h2 className="font-semibold text-4xl mb-4">Forgot Password</h2>
      <p className="font-medium mb-4">
        Looks like you've forgotten your password
      </p>
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
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Send</button>
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
  