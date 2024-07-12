import type { MetaFunction } from "@remix-run/node";
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from "@remix-run/react";
import { isUserAuthorized, isPasswordUpdateRequired } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";
import { getProfile } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, headers } = await isUserAuthorized(request)
  await isPasswordUpdateRequired(request)

  const { supabase } = createServerClient(request, request.headers);
  const { profile, profileInfo } = await getProfile(supabase);
  const url = new URL(request.url).origin

	return json({ user, profile, profileInfo, url }, { headers });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Supabase by example" },
    { name: "description", content: "Supabase by example showcasing it's auth features." },
  ];
};

export default function Index() {
  const { profile, profileInfo, user, url } = useLoaderData<typeof loader>();
  
  return (
    <div className="card w-6/12 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          Welcome {profile?.display_name ?? user?.email}
        </h2>
        {profile?.display_name ? (
          <>
            <p>
              Name: {profileInfo?.first_name} {profileInfo?.last_name}
            </p>
            <p>Display Name: {profile.display_name}</p>
            <p>Dob: {profileInfo?.dob}</p>
            <p>Location: {profileInfo?.profile_location}</p>
            <h3 className="text-lg font-semibold mt-2">Bio</h3>
            <p>{profile?.bio}</p>
            <p className="text-right">
              <a
                href={`${url}/u/${profile?.slug}`}
                className="btn btn-md btn-outline"
              >
                View Profile
              </a>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
