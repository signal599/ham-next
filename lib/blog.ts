import fs from "node:fs";
import path from "node:path";
import { parseMarkdown } from "@/lib/markdown";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

// Slugs are year-month, e.g. "2026-07". Anything else is not a blog post.
const SLUG_PATTERN = /^\d{4}-\d{2}$/;

export interface BlogPost {
  slug: string;
  // Short label used in the nav, e.g. "July 2026".
  title: string;
  // Page heading and browser title, e.g. "Blog: July 2026".
  heading: string;
  body: string;
}

export interface BlogLink {
  href: string;
  title: string;
}

function parse(slug: string, contents: string): BlogPost {
  const { fields, body } = parseMarkdown(`${slug}.md`, contents);

  const title = fields.get("title");
  if (!title) {
    throw new Error(`Blog post ${slug} has no title.`);
  }

  return {
    slug,
    title,
    heading: `Blog: ${title}`,
    body,
  };
}

// Newest first. String sorting works because slugs are zero padded year-month.
export function getSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.slice(0, -".md".length))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort()
    .reverse();
}

export function getPost(slug: string): BlogPost | null {
  if (!SLUG_PATTERN.test(slug)) return null;

  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  return parse(slug, fs.readFileSync(file, "utf8"));
}

// /blog redirects here so that every post also has a permanent dated path.
export function getLatestSlug(): string {
  const slug = getSlugs()[0];
  if (!slug) throw new Error("There are no blog posts.");

  return slug;
}

export function getBlogLinks(): BlogLink[] {
  return getSlugs().map((slug) => {
    const post = getPost(slug)!;

    return {
      href: `/blog/${slug}`,
      title: post.title,
    };
  });
}
