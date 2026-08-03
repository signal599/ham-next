"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { closeDrawer } from "@/lib/drawer";

interface NavLinkItem {
  name: string;
  href: string;
}

interface NavLinksProps {
  links: NavLinkItem[];
  classes: string;
  // Set on the copy inside the mobile drawer, so following a link dismisses it.
  inDrawer?: boolean;
}

export default function NavLinks({
  links,
  classes,
  inDrawer,
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={classes}>
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <li key={link.name}>
            <Link href={link.href}
            onClick={inDrawer ? closeDrawer : undefined}
            className={isActive ? "underline underline-offset-8 decoration-blue-800 decoration-2" : ""}
            >{link.name}</Link>
          </li>
        );
      })}
    </ul>
  );
}
