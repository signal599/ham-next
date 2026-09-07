import { notFound } from "next/navigation";
import MarkdownArticle from "@/components/markdown-article";
import { getPost } from "@/lib/news";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  return { title: post ? post.heading : "News and Info" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return <MarkdownArticle title={post.heading} body={post.body} />;
}
