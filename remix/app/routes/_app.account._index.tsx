import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { isUserAuthorized, isPasswordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { getProfile } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers } = await isUserAuthorized(request)
  await isPasswordUpdateRequired(request)

  const { supabase } = createServerClient(request, request.headers);
  const { profile } = await getProfile(supabase);

	return json({ user, profile }, { headers });
}

export default function Account() {
  const { user, profile } = useLoaderData<typeof loader>();
  
  return (
    <div className="w-11/12 px-6 rounded-lg sm:w-8/12 md:w-6/12 2xl:w-3/12 sm:px-10">
      <h2 className="font-semibold text-4xl mb-4">Account</h2>
      <p className="font-medium mb-4">
        Hi {profile?.display_name ?? user?.email}, you can update your email or password from here
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
  