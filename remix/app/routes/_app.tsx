import { MetaFunction } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Supabase by example" },
    { name: "description", content: "Supabase by example showcasing it's auth features." },
  ];
};

export default function AppLayout() {
  return (
    <main data-theme="winter">
      <div className="flex flex-col h-screen">
        <div className="navbar border-b border-gray-300 px-4">
          <div className="flex-1">
            <h1 className="font-semibold">
              <Link to="/">Supabase by example</Link>
            </h1>
          </div>
          <div className="flex-none space-x-10">
            <Link className="btn btn-outline no-animation" to="/account">
              Account
            </Link>

            <Form className="block" action="/auth/signout" method="post">
              <button type="submit">Sign out</button>
            </Form>
          </div>
        </div>
        <div className="grid place-items-center my-10 mx-2">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
  