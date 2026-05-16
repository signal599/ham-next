import PageLayout from "@/components/page-layout";
import Link from "next/link";

export const metadata = { title: "News and Info" };

export default function Page() {
  return (
    <PageLayout title="News and Info: May 2026">
      <p>
        All the live code involved in serving pages to visitors is now in
        TypeScript / Next.js. SQL queries use{" "}
        <a href="https://orm.drizzle.team">Drizzle</a>.
      </p>
      <p>
        The only Drupal / PHP code left is the weekly FCC updates and the
        geocoding. I will be converting those when time and motivation permits.
      </p>
      <p>
        73
        <br />
        Ross KT1F <br />
        Email: ross (at) earthbubble.com
      </p>
    </PageLayout>
  );
}
