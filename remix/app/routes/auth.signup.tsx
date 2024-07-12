import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AuthApiError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, success } from "~/lib/utils";
import { AuthUserSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof AuthUserSchema>;

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  try {
    AuthUserSchema.parse({ email, password });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return json(fault({ errors, data: { email } }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    if (error instanceof AuthApiError && error.status === 400) {
      return json(fault({ message: "Invalid credentials.", data: { email } }), { headers });
    }
    return json(fault({ message: error.message, data: { email } }), { headers });
  }

  return json(success({ 
    message: "Please check your email for a magic link to log into the website.", 
    data: { email: "" } 
  }), { headers });
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  
  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {actionData?.message ? (
        <Alert
          className={`${actionData?.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {actionData.message}
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
      <Form method="post">
        <div className="form-control">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            defaultValue={actionData?.data?.email ?? ""}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.email ? (
          <InputErrorMessage>{actionData.errors.email}</InputErrorMessage>
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
        {actionData?.errors?.password ? (
          <InputErrorMessage>{actionData.errors.password}</InputErrorMessage>
        ) : null}
        <div className="form-control flex-row justify-end pt-4">
          <Link
            className="block py-2 text-blue-500"
            to="/auth/forgotpassword"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">Create account</button>
        </div>
      </Form>
      <div className="pt-4 text-center">
        Already have an account?{" "}
        <Link to="/auth/signin" className="underline text-blue-500">
          Sign In
        </Link>
      </div>
    </div>
  );
}
  