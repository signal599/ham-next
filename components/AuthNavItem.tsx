"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  isAuthenticated: boolean;
  menuItem?: boolean;
}

export default function AuthNavItem({ isAuthenticated, menuItem }: Props) {
  const pathname = usePathname();

  if (isAuthenticated) {
    return (
      <form action="/api/auth/logout" method="POST" className={menuItem ? "" : "flex items-center px-3"}>
        <button type="submit" className="link link-hover text-sm">
          Log out
        </button>
      </form>
    );
  }

  const isActive = pathname.startsWith("/login");

  return (
    <Link
      href="/login"
      className={`${menuItem ? "" : "px-3 text-sm"} ${isActive ? "underline underline-offset-8 decoration-blue-800 decoration-2" : ""}`}
    >
      Log in
    </Link>
  );
}
