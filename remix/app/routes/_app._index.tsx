import type { MetaFunction } from "@remix-run/node";
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { isUserAuthorized } from "~/lib/session";
import { createServerClient } from "~/lib/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, headers } = await isUserAuthorized(request)

	// in order for the set-cookie header to be set,
	// headers must be returned as part of the loader response
	return json({session}, { headers });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Supabase by example" },
    { name: "description", content: "Supabase by example showcasing it's auth features." },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
