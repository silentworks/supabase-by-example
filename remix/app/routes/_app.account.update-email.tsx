import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { AuthApiError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { isUserAuthorized, isPasswordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, getProfile, success } from "~/lib/utils";
import { UpdateEmailSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof UpdateEmailSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers } = await isUserAuthorized(request)
  await isPasswordUpdateRequired(request)

  const { supabase } = createServerClient(request, request.headers);
  const { profile } = await getProfile(supabase);

	return json({ user, profile }, { headers });
}

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const emailConfirm = formData.get("emailConfirm") as string;
  
  try {
    UpdateEmailSchema.parse({ email, emailConfirm });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return json(fault({ data: { email, emailConfirm }, errors }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());
  
  const { error } = await supabase.auth.updateUser({
    email
  });

  if (error) {
    if (error instanceof AuthApiError && error.status === 400) {
      return json(fault({ message: "Invalid credentials.", data: { email: "", emailConfirm: "" } }), { headers });
    }
    return json(fault({ message: error.message, data: { email: "", emailConfirm: "" } }), { headers });
  }

  return json(success({ 
    message: "Your email was updated successfully.", 
    data: { email: "", emailConfirm: "" } 
  }), { headers });
};

export default function UpdateEmail() {
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
      <h2 className="font-semibold text-4xl mb-4">Update Email</h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, Enter your new email below and confirm it
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
        <div className="form-control">
          <label htmlFor="emailConfirm" className="label">
            Confirm Email
          </label>
          <input
            id="emailConfirm"
            name="emailConfirm"
            type="text"
            defaultValue={actionData?.data?.emailConfirm}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.emailConfirm ? (
          <InputErrorMessage>{actionData.errors.emailConfirm}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">
            Update Email
          </button>
        </div>
      </Form>
    </div>
  );
}
  