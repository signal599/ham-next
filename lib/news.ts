import fs from "node:fs";
import path from "node:path";
import { parseMarkdown } from "@/lib/markdown";

const NEWS_DIR = path.join(process.cwd(), "content/news");

// Slugs are year-month, e.g. "2026-07". Anything else is not a news post.
const SLUG_PATTERN = /^\d{4}-\d{2}$/;

export interface NewsPost {
  slug: string;
  // Short label used in the nav, e.g. "July 2026".
  title: string;
  // Page heading and browser title, e.g. "News and Info: July 2026".
  heading: string;
  body: string;
}

export interface NewsLink {
  href: string;
  title: string;
}

function parse(slug: string, contents: string): NewsPost {
  const { fields, body } = parseMarkdown(`${slug}.md`, contents);

  const title = fields.get("title");
  if (!title) {
    throw new Error(`News post ${slug} has no title.`);
  }

  return {
    slug,
    title,
    heading: `News and Info: ${title}`,
    body,
  };
}

// Newest first. String sorting works because slugs are zero padded year-month.
export function getSlugs(): string[] {
  return fs
    .readdirSync(NEWS_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.slice(0, -".md".length))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort()
    .reverse();
}

export function getPost(slug: string): NewsPost | null {
  if (!SLUG_PATTERN.test(slug)) return null;

  const file = path.join(NEWS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  return parse(slug, fs.readFileSync(file, "utf8"));
}

// /news redirects here so that every post also has a permanent dated path.
export function getLatestSlug(): string {
  const slug = getSlugs()[0];
  if (!slug) throw new Error("There are no news posts.");

  return slug;
}

export function getNewsLinks(): NewsLink[] {
  return getSlugs().map((slug) => {
    const post = getPost(slug)!;

    return {
      href: `/news/${slug}`,
      title: post.title,
    };
  });
}
