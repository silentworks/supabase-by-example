import { ActionFunctionArgs, LoaderFunctionArgs, Form, useActionData, useLoaderData, data } from "react-router";
import { AuthApiError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { isUserAuthorized, isPasswordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, getProfile, success } from "~/lib/utils";
import { UpdatePhoneSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof UpdatePhoneSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers } = await isUserAuthorized(request)
  await isPasswordUpdateRequired(request)

  const { supabase } = createServerClient(request, request.headers);
  const { profile } = await getProfile(supabase);

	return data({ user, profile }, { headers });
}

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const phoneConfirm = formData.get("phoneConfirm") as string;
  
  try {
    UpdatePhoneSchema.parse({ phone, phoneConfirm });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return data(fault({ data: { phone, phoneConfirm }, errors }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());
  
  const { error } = await supabase.auth.updateUser({
    phone
  });

  if (error) {
    if (error instanceof AuthApiError && error.status === 400) {
      return data(fault({ message: "Invalid credentials.", data: { phone: "", phoneConfirm: "" } }), { headers });
    }
    return data(fault({ message: error.message, data: { phone: "", phoneConfirm: "" } }), { headers });
  }

  return data(success({ 
    message: "Your phone number was updated successfully.", 
    data: { phone: "", phoneConfirm: "" } 
  }), { headers });
};

export default function UpdatePhone() {
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
      <h2 className="font-semibold text-4xl mb-4">Update Phone</h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, Enter your new phone below and confirm it
      </p>
      <Form method="post">
        <div className="form-control">
          <label htmlFor="phone" className="label">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            defaultValue={actionData?.data?.phone}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.phone ? (
          <InputErrorMessage>{actionData.errors.phone}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="phoneConfirm" className="label">
            Confirm Phone
          </label>
          <input
            id="phoneConfirm"
            name="phoneConfirm"
            type="text"
            defaultValue={actionData?.data?.phoneConfirm}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.phoneConfirm ? (
          <InputErrorMessage>{actionData.errors.phoneConfirm}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">
            Update Phone
          </button>
        </div>
      </Form>
    </div>
  );
}
  
