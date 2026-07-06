import PageLayout from "@/components/page-layout";
import Link from "next/link";

export const metadata = { title: "News and Info" };

export default function Page() {
  return (
    <PageLayout title="News and Info: July 2027">
      <p>
        The whole site is now written in TypeScript. It has been rewritten and migrated from Drupal which is in PHP. There are now two applications.
        <a href="https://github.com/signal599/ham-next">Ham-next</a> is the Next.js web application
        that you are looking at now. <a href="https://github.com/signal599/haminfo-cli">HamInfo-cli</a> is a Node.js cron driven
        app that handles importing data from the FCC, geocoding and data exports. It’s running on a low cost virtual server at Hetzner.
      </p>
      <p>
        It’s been a fun project and learning experience for me. Most of it is hand coded but I have made use of Claude Code
        in a few places which has been a big time saver. I don’t know where the whole AI coding trend is going but I am finding it to be
        a very useful tool when used carefully.
      </p>
      <p>
        Let me know if you find any issues.
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
