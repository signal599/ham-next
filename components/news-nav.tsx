"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NewsLink } from "@/lib/news";

export default function NewsNav({ links }: { links: NewsLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="not-prose menu">
      {links.map((link) => {
        const isActive = link.href === pathname;

        return (
          <li key={link.href} className={isActive ? "menu-active" : ""}>
            <Link href={link.href}>{link.title}</Link>
          </li>
        );
      })}
    </ul>
  );
}
