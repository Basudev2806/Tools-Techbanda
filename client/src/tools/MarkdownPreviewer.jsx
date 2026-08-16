import { useState } from "react";
import { marked } from "marked";

const SAMPLE = `# Heading

Some **bold** text and *italic* text.

- item one
- item two

\`\`\`js
console.log("code block");
\`\`\`

> a blockquote

[a link](https://tools.techbanda.com)`;

marked.setOptions({ breaks: true });

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE);

  let html = "";
  try {
    html = marked.parse(markdown);
  } catch {
    html = "<p>Could not render this markdown.</p>";
  }

  return (
    <div className="tool">
      <p className="tool__hint">Live markdown preview, rendered entirely in your browser.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="md-in">
            markdown
          </label>
          <textarea
            id="md-in"
            className="tool__textarea mono"
            spellCheck={false}
            rows={14}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label">preview</label>
          <div className="tool__markdown-preview" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
