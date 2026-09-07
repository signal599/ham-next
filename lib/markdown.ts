export interface MarkdownDoc {
  fields: Map<string, string>;
  body: string;
}

// Pull the frontmatter out of a markdown file. Only simple "key: value" lines
// are supported which is all the content here needs. `name` only appears in
// error messages, to say which file is at fault.
export function parseMarkdown(name: string, contents: string): MarkdownDoc {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    throw new Error(`Markdown file ${name} has no frontmatter.`);
  }

  const fields = new Map<string, string>();

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`Markdown file ${name} has an invalid frontmatter line: ${line}`);
    }

    fields.set(
      line.slice(0, separator).trim(),
      line.slice(separator + 1).trim(),
    );
  }

  return { fields, body: contents.slice(match[0].length) };
}
