import BlogNav from "@/components/blog-nav";
import { getBlogLinks } from "@/lib/blog";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:flex">
      <div className="sm:flex-4">{children}</div>
      <div className="pl-5 sm:flex-1 sm:pl-0 sm:pt-8">
        <h2>Posts</h2>
        <BlogNav links={getBlogLinks()} />
      </div>
    </div>
  );
}
