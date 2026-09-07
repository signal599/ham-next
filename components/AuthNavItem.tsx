"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { closeDrawer } from "@/lib/drawer";
import { ACTIVE_LINK_CLASSES } from "@/components/nav-links";

// Logging out is a POST, but the button has to sit directly inside the menu
// item to pick up daisyUI's padding and hover. So the form lives outside the
// nav and the buttons point at it by id. There are two copies of the nav and
// only ever one form.
const LOGOUT_FORM_ID = "logout-form";

export function LogoutForm() {
  return <form id={LOGOUT_FORM_ID} action="/api/auth/logout" method="POST" />;
}

interface Props {
  isAuthenticated: boolean;
  // Set on the copy inside the mobile drawer, so activating it dismisses it.
  inDrawer?: boolean;
}

export default function AuthNavItem({ isAuthenticated, inDrawer }: Props) {
  const pathname = usePathname();

  if (isAuthenticated) {
    return (
      <button
        type="submit"
        form={LOGOUT_FORM_ID}
        onClick={inDrawer ? closeDrawer : undefined}
      >
        Log out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      onClick={inDrawer ? closeDrawer : undefined}
      className={pathname.startsWith("/login") ? ACTIVE_LINK_CLASSES : ""}
    >
      Log in
    </Link>
  );
}
