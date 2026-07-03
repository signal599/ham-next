import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavLinks from "@/components/nav-links";
import AuthNavItem from "@/components/AuthNavItem";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Amateur Radio License Map",
    default: "Amateur Radio License Map",
  },
  description: "An interactive map of amateur radio licensees in the USA.",
};

const links = [
  { name: "License Map", href: "/map" },
  { name: "Map Status", href: "/status" },
  { name: "News and Info", href: "/news" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isAuthenticated = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      await verifySessionToken(token);
      isAuthenticated = true;
    }
  } catch {
    // not authenticated
  }

  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="drawer">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <div className="navbar bg-base-300 w-full">
              <div className="flex-none md:hidden">
                <label
                  htmlFor="my-drawer-2"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <div className="mx-2 flex-1 px-2">
                <Link href="/map">Amateur Radio</Link>
              </div>
              <div className="hidden flex-none md:flex md:items-center">
                <NavLinks links={links} classes="menu menu-horizontal" />
                <AuthNavItem isAuthenticated={isAuthenticated} />
              </div>
            </div>
            <article className="prose max-w-none">{children}</article>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 min-h-full w-80 p-4 flex flex-col">
              <NavLinks links={links} classes="flex-none" />
              <div className="mt-2 px-4">
                <AuthNavItem isAuthenticated={isAuthenticated} menuItem />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
