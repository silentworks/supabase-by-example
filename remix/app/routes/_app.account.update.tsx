import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { isUserAuthorized, isPasswordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, getProfile, success } from "~/lib/utils";
import { UpdateProfileSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof UpdateProfileSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers } = await isUserAuthorized(request)
  await isPasswordUpdateRequired(request)

  const { supabase } = createServerClient(request, request.headers);
  const { profile, profileInfo } = await getProfile(supabase);
  
	return json({ user, profile, profileInfo }, { headers });
}

export const action = async ({ 
  request 
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const displayName = formData.get('displayName') as string;
  const bio = formData.get('bio') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const dob = formData.get('dob') as string;
  const profileLocation = formData.get('profileLocation') as string;
  
  try {
    UpdateProfileSchema.parse({
      displayName,
      bio,
      firstName,
      lastName,
      dob,
      profileLocation
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = formatError(err) as FormData;
      return json(fault({ data: { 
        displayName,
        bio,
        firstName,
        lastName,
        dob,
        profileLocation 
      }, errors }));
    }
  }

  const { supabase, headers } = createServerClient(request, new Headers());
  
  const { error } = await supabase.rpc('update_profile', {
    display_name: displayName,
    bio,
    first_name: firstName,
    last_name: lastName,
    dob,
    profile_location: profileLocation
  });

  if (error) {
    let errorMessage = 'Server error. Try again later.';
    let displayNameError = "";
    if (error.message.includes('duplicate')) {
      displayNameError = 'Display Name is already in use, please choose a different name';
      errorMessage = '';
    }

    return json(fault({ message: errorMessage, errors: {
      displayName: displayNameError
    }, data: {
      displayName,
      bio,
      firstName,
      lastName,
      dob,
      profileLocation
    } }), { headers });
  }

  return json(success({ 
    message: "Your email was updated successfully.", 
    data: {
      displayName,
      bio,
      firstName,
      lastName,
      dob,
      profileLocation
    } 
  }), { headers });
};

export default function UpdateEmail() {
  const actionData = useActionData<typeof action>();
  const { user, profile, profileInfo } = useLoaderData<typeof loader>();
  
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
          <label htmlFor="first_name" className="label">
            First Name
          </label>
          <input
            id="first_name"
            name="firstName"
            type="text"
            defaultValue={actionData?.data?.firstName || (profileInfo?.first_name ?? "")}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.firstName ? (
          <InputErrorMessage>{actionData.errors.firstName}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="last_name" className="label">
            Last Name
          </label>
          <input
            id="last_name"
            name="lastName"
            type="text"
            defaultValue={actionData?.data.lastName || (profileInfo?.last_name ?? "")}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.lastName ? (
          <InputErrorMessage>{actionData.errors.lastName}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="display_name" className="label">
            Display Name
          </label>
          <input
            id="display_name"
            name="displayName"
            type="text"
            defaultValue={actionData?.data.displayName || (profile?.display_name ?? "")}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.displayName ? (
          <InputErrorMessage>{actionData.errors.displayName}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="bio" className="label">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            className="textarea textarea-bordered textarea-lg w-full"
            defaultValue={actionData?.data.bio || (profile?.bio ?? "")}
          />
        </div>
        {actionData?.errors?.bio ? (
          <InputErrorMessage>{actionData.errors.bio}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="dob" className="label">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="text"
            defaultValue={actionData?.data.dob || (profileInfo?.dob ?? "")}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.dob ? (
          <InputErrorMessage>{actionData.errors.dob}</InputErrorMessage>
        ) : null}
        <div className="form-control">
          <label htmlFor="profile_location" className="label">
            Location
          </label>
          <input
            id="profile_location"
            name="profileLocation"
            type="text"
            defaultValue={actionData?.data.profileLocation || (profileInfo?.profile_location ?? "")}
            className="input input-bordered"
          />
        </div>
        {actionData?.errors?.profileLocation ? (
          <InputErrorMessage>{actionData.errors.profileLocation}</InputErrorMessage>
        ) : null}
        <div className="form-control mt-6">
          <button className="btn btn-primary no-animation">
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
  