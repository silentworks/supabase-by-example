import Link from "next/link";

export const metadata = {
  title: "Supabase by example",
  description: "Supabase by example showcasing it's auth features.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main data-theme="winter">
      <div className="flex flex-col h-screen">
        <div className="navbar border-b border-gray-300 py-8 px-4">
          <div className="flex-1">
            <h1 className="font-semibold">
              <Link href="/">Supabase by example</Link>
            </h1>
          </div>
          <div className="flex-none space-x-10">
            <Link className="btn btn-outline no-animation" href="/account">
              Account
            </Link>

            <form className="block" action="/auth/signout" method="post">
              <button type="submit">Sign out</button>
            </form>
          </div>
        </div>
        <div className="grid place-items-center my-20 mx-2">{children}</div>
      </div>
    </main>
  );
}
