import PageLayout from "@/components/page-layout";
import Link from "next/link";

export const metadata = { title: "News and Info" };

export default function Page() {
  return (
    <PageLayout title="News and Info: April 2026">
      <p>
        This project continues to serve as a learning tool for me while
        hopefully providing some usefulness.
      </p>
      <p>
        I have rewritten the frontend using{" "}
        <a href="https://nextjs.org">Next.js</a>. I’ve been working with Drupal
        and PHP for many years so this is a new experience for me. Next.js is a
        combination of <a href="http://nodejs.org">Node.js</a> on the backend
        and <a href="https://react.dev">React</a> on the frontend and lots of
        magic to make it all work together. The language is TypeScript. Most of
        the backend is still happening in Drupal but I intend to move more of it
        into NextJS as time permits. A friend named Claude is providing some
        help along the way. <span className="text-2xl">🙂</span>
      </p>
      <p>
        I’m sure it’s not perfect so let me know if you find any problems. I can
        put the old Drupal version back quickly if there are any showstoppers.
      </p>
      <p>
        The code is still open source{" "}
        <a href="https://github.com/signal599/ham-next">here</a>. It is both an
        exciting and scary time to be web developer.
      </p>
      <p>
        73
        <br />
        Ross KT1F
      </p>
    </PageLayout>
  );
}
