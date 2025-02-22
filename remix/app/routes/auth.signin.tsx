import { ActionFunctionArgs, Form, Link, data, redirect, useActionData, useSearchParams } from "react-router";
import { AuthApiError } from "@supabase/supabase-js";
import { useState } from "react";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, success } from "~/lib/utils";
import { AuthUserSchema, ValidateEmailSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof AuthUserSchema>;

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const magicLink = formData.get("magiclink") as string;

  const { supabase, headers } = createServerClient(request, new Headers());
  
  if (!magicLink) {
    try {
      AuthUserSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatError(err) as FormData;
        return fault({ data: { email, password }, errors });
      }
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return data(fault({ message: "Invalid credentials.", data: { email, password: "" } }), { headers });
      }
      return data(fault({ message: error.message, data: { email, password: "" } }), { headers });
    }
  } else {
    // magic link sign in
    try {
      ValidateEmailSchema.parse({ email });
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatError(err) as FormData;
        return fault({ data: { email, password: "" }, errors });
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email
    })

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return data(fault({ message: "Invalid credentials.", data: { email, password: "" } }), { headers });
      }
      return data(fault({ message: error.message, data: { email, password: "" } }), { headers });
    }

    return data(success({ 
      message: "Please check your email for a magic link to log into the website.", 
      data: { email: "" } 
    }), { headers });
  }

  return redirect(`/`, {
    headers
  });
};

interface PasswordFieldType {
  password?: string;
  passwordError?: string; 
}

const PasswordField = ({ password, passwordError }: PasswordFieldType ) => {
  return <>
    <div className="form-control">
      <label htmlFor="password" className="label">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        defaultValue={password}
        className="input input-bordered"
      />
    </div>
    {passwordError ? (
      <InputErrorMessage>{passwordError}</InputErrorMessage>
    ) : null}
  </>
}

export default function SignIn() {
  const actionData = useActionData<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();

  const authType = searchParams.get('auth_type') as string;
  const errorMessage = searchParams.get('error_message') as string;
  const [magicLink, setMagicLink] = useState(authType == 'magic_link');
  
  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      {(actionData?.message ?? errorMessage) ? (
        <Alert
          className={`${actionData?.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {actionData?.message ?? errorMessage}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Sign in</h2>
      <p className="font-medium mb-4">Hi, Welcome back</p>
      <div className="space-y-2">
        <Link
          className="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case no-animation"
          to="/auth/github"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlinkHref="#img-github"></use>
          </svg>
          Continue with GitHub
        </Link>
        <Link
          className="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case no-animation"
          to="/auth/google"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlinkHref="#img-google"></use>
          </svg>
          Continue with Google
        </Link>
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
            defaultValue={actionData?.data?.email}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.email ? (
          <InputErrorMessage>{actionData.errors.email}</InputErrorMessage>
        ) : null}
        {!magicLink ? (
          <PasswordField password={actionData?.data.password} passwordError={actionData?.errors?.password} />
        ) : null}
        <div className="form-control flex-row justify-between pt-4">
          <label className="label justify-start cursor-pointer gap-2 text-gray-500">
            <input
              name="magiclink"
              type="checkbox"
              className="toggle toggle-xs"
              defaultChecked={magicLink}
              onChange={(event) => {
                setMagicLink(!magicLink)
                setSearchParams(
                  new URLSearchParams(event.currentTarget.checked ? {
                    auth_type: "magic_link",
                  } : {}).toString()
                );
              }}
            />
            Magic link login
          </label>
          {!magicLink ? (
            <Link
              to="/auth/forgotpassword"
              className="block py-2 text-blue-500"
            >
              Forgot Password?
            </Link>
          ) : null}
        </div>
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
  
