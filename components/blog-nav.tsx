"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BlogLink } from "@/lib/blog";

export default function BlogNav({ links }: { links: BlogLink[] }) {
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
