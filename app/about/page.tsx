import MarkdownArticle from "@/components/markdown-article";
import { getAbout } from "@/lib/about";

export const metadata = { title: "About" };

export default function Page() {
  const { title, body } = getAbout();

  return <MarkdownArticle title={title} body={body} />;
}
