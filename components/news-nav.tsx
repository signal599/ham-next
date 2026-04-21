"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NewsNav() {
  const links = [
    { href: "/news", title: "April 2026" },
    { href: "/news/2025-07", title: "July 2025" },
    { href: "/news/2024-11", title: "November 2024" },
    { href: "/news/2018-03", title: "March 2018" },
  ];

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
