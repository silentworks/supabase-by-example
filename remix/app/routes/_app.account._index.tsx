import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { AuthApiError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import Alert from "~/components/Alert";
import InputErrorMessage from "~/components/InputErrorMessage";
import { isUserAuthorized } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { fault, formatError, success } from "~/lib/utils";
import { UpdateEmailSchema } from "~/lib/validationSchema";

type FormData = z.infer<typeof UpdateEmailSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, headers } = await isUserAuthorized(request)

	// in order for the set-cookie header to be set,
	// headers must be returned as part of the loader response
	return json({ session, user }, { headers });
}

export default function Account() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div className="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6">
      <h2 className="font-semibold text-4xl mb-4">Account</h2>
      <p className="font-medium mb-4">
        Hi {user?.email}, you can update your email or password from here
      </p>

      <ul className="divide-y-2 divide-gray-200">
        <li className="flex justify-between hover:bg-blue-600 hover:text-blue-200">
          <Link className="block w-full p-3" to="/account/update">
            Update
          </Link>
        </li>
        <li className="flex justify-between hover:bg-blue-600 hover:text-blue-200">
          <Link className="block w-full p-3" to="/account/update-email">
            Update email
          </Link>
        </li>
        <li className="flex justify-between hover:bg-blue-600 hover:text-blue-200">
          <Link className="block w-full p-3" to="/account/update-password">
            Update password
          </Link>
        </li>
      </ul>
    </div>
  );
}
  