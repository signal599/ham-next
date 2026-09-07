import fs from "node:fs";
import path from "node:path";
import { parseMarkdown } from "@/lib/markdown";

const ABOUT_FILE = path.join(process.cwd(), "content/about.md");

export interface AboutPage {
  // Page heading and browser title.
  title: string;
  body: string;
}

export function getAbout(): AboutPage {
  const { fields, body } = parseMarkdown(
    "about.md",
    fs.readFileSync(ABOUT_FILE, "utf8"),
  );

  const title = fields.get("title");
  if (!title) {
    throw new Error("about.md has no title.");
  }

  return { title, body };
}
