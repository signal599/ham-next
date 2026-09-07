import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavLinks from "@/components/nav-links";
import AuthNavItem from "@/components/AuthNavItem";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";
import { DRAWER_ID } from "@/lib/drawer";

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
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <div className="drawer">
          <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <header className="navbar bg-base-300 w-full">
              <div className="flex-none md:hidden">
                <label
                  htmlFor={DRAWER_ID}
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
              <nav
                aria-label="Main"
                className="hidden flex-none md:flex md:items-center"
              >
                <NavLinks links={links} classes="menu menu-horizontal" />
                <AuthNavItem isAuthenticated={isAuthenticated} />
              </nav>
            </header>
            <main id="main-content" className="prose max-w-none">
              {children}
            </main>
          </div>
          <div className="drawer-side">
            <label
              htmlFor={DRAWER_ID}
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <nav
              aria-label="Main"
              className="menu bg-base-200 min-h-full w-48 p-4 flex flex-col"
            >
              {/* space-y-3 doubles the gap daisyUI's menu padding gives the links */}
              <NavLinks links={links} classes="flex-none space-y-3" inDrawer />
              {/* px-3 matches the inline padding daisyUI's menu gives the links above */}
              <div className="mt-4 px-3">
                <AuthNavItem isAuthenticated={isAuthenticated} menuItem />
              </div>
            </nav>
          </div>
        </div>
      </body>
    </html>
  );
}
