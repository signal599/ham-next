"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { closeDrawer } from "@/lib/drawer";

// Shared with the auth item, which is a nav link that daisyUI's menu styles
// but that this component cannot render itself.
export const ACTIVE_LINK_CLASSES =
  "underline underline-offset-8 decoration-blue-800 decoration-2";

interface NavLinkItem {
  name: string;
  href: string;
}

interface NavLinksProps {
  links: NavLinkItem[];
  classes: string;
  // Set on the copy inside the mobile drawer, so following a link dismisses it.
  inDrawer?: boolean;
  // Rendered as a final item, for nav entries that are not plain links.
  children?: React.ReactNode;
}

export default function NavLinks({
  links,
  classes,
  inDrawer,
  children,
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
            className={isActive ? ACTIVE_LINK_CLASSES : ""}
            >{link.name}</Link>
          </li>
        );
      })}
      {children && <li>{children}</li>}
    </ul>
  );
}
