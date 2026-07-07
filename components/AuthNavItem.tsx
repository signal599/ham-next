import Link from "next/link";

interface Props {
  isAuthenticated: boolean;
  menuItem?: boolean;
}

export default function AuthNavItem({ isAuthenticated, menuItem }: Props) {
  if (isAuthenticated) {
    return (
      <form action="/api/auth/logout" method="POST" className={menuItem ? "" : "flex items-center px-3"}>
        <button type="submit" className="link link-hover text-sm">
          Log out
        </button>
      </form>
    );
  }

  return (
    <Link href="/login" className={menuItem ? "" : "px-3 text-sm"}>
      Log in
    </Link>
  );
}
