import Link from "next/link";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:flex">
    <div className="sm:flex-4">{children}</div>
    <div className="pl-5 sm:flex-1 sm:pl-0 sm:pt-8">
      <h2>Posts</h2>
      <ul>
        <li>
          <Link href="/news">April 2026</Link>
        </li>
        <li>
          <Link href="/news/2025-07">July 2025</Link>
        </li>
        <li>
          <Link href="/news/2024-11">November 2024</Link>
        </li>
        <li>
          <Link href="/news/2018-03">March 2018</Link>
        </li>
      </ul>
    </div>
    </div>
  )
}
