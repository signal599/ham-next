import { redirect } from "next/navigation";
import { getLatestSlug } from "@/lib/blog";

// Temporary redirect, not permanent: the newest post changes each time one is
// added, so this must not be cached.
export default function Page() {
  redirect(`/blog/${getLatestSlug()}`);
}
