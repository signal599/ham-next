import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";
import ExportForm from "./ExportForm";

export const metadata = { title: "Export" };

export default async function ExportPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  let email = "";
  if (token) {
    try {
      const payload = await verifySessionToken(token);
      email = payload.email;
    } catch {
      redirect("/login");
    }
  }

  return (
    <div className="not-prose p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Export to CSV</h1>
        {email && (
          <span className="text-sm text-base-content/60">Signed in as {email}</span>
        )}
      </div>

      <ExportForm />

      <div className="mt-6">
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="btn btn-ghost btn-sm">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
