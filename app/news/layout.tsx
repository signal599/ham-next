import NewsNav from "@/components/news-nav";

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
        <NewsNav />
      </div>
    </div>
  );
}
