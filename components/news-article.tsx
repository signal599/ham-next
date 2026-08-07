import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import PageLayout from "@/components/page-layout";
import type { NewsPost } from "@/lib/news";

const components: Components = {
  // Internal links navigate client side. External links are left alone so they
  // open in the same tab.
  a({ href, title, children }) {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} title={title}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} title={title}>
        {children}
      </a>
    );
  },
};

export default function NewsArticle({ post }: { post: NewsPost }) {
  return (
    <PageLayout title={post.heading}>
      <Markdown components={components} rehypePlugins={[rehypeRaw]}>
        {post.body}
      </Markdown>
    </PageLayout>
  );
}
