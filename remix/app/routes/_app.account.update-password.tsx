import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { AuthApiError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { isUserAuthorized, clearPasswordUpdateCookie } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, getProfile, success } from "~/lib/utils";
import { UpdatePasswordSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof UpdatePasswordSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers } = await isUserAuthorized(request)

  const { supabase } = createServerClient(request, request.headers);
  const { profile } = await getProfile(supabase);
  
	return json({ user, profile }, { headers });
}

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;
  
  try {
    UpdatePasswordSchema.parse({ password, passwordConfirm });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return json(fault({ data: { password, passwordConfirm }, errors }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());
  
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    if (error instanceof AuthApiError && error.status === 400) {
      return json(fault({ message: "Invalid credentials.", data: { password: "", passwordConfirm: "" } }), { headers });
    }
    return json(fault({ message: error.message, data: { password: "", passwordConfirm: "" } }), { headers });
  }

  await clearPasswordUpdateCookie(request, headers);

  return json(success({ 
    message: "Your password was updated successfully.", 
    data: { password: "", passwordConfirm: "" } 
  }), { headers });
};

export default function UpdatePassword() {
  const actionData = useActionData<typeof action>();
  const { user, profile } = useLoaderData<typeof loader>();
  
  return (
    <div className="w-11/12 px-6 rounded-lg sm:w-8/12 md:w-6/12 2xl:w-3/12 sm:px-10">
      {actionData?.message ? (
        <Alert
          className={`${actionData?.success ? "alert-info" : "alert-error"} mb-10`}
        >
          {actionData?.message}
        </Alert>
      ) : null}
      <h2 className="font-semibold text-4xl mb-4">Update Password</h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, Enter your new password below and confirm it
      </p>
      <Form method="post">
        <div className="form-control">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue={actionData?.data?.password}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.password ? (
          <InputErrorMessage>{actionData.errors.password}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="passwordConfirm" className="label">
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            defaultValue={actionData?.data?.passwordConfirm}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.passwordConfirm ? (
          <InputErrorMessage>{actionData.errors.passwordConfirm}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">
            Update Password
          </button>
        </div>
      </Form>
    </div>
  );
}
  