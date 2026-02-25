"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkItem {
  name: string;
  href: string;
}

interface NavLinksProps {
  links: NavLinkItem[];
  classes: string;
}

export default function NavLinks({
  links,
  classes,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={classes}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.name}>
            <Link href={link.href}
            className={isActive ? "underline underline-offset-8 decoration-blue-800 decoration-2" : ""}
            >{link.name}</Link>
          </li>
        );
      })}
    </ul>
  );
}
