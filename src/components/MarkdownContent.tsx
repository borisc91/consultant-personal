type MarkdownContentProps = {
  markdown: string;
};

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  const blocks = parseMarkdown(markdown);

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} className="font-display text-3xl md:text-4xl tracking-tight text-slate-900 pt-8">
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3 key={index} className="text-2xl font-display leading-tight text-slate-900 pt-4">
              {block.text}
            </h3>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={index} className="space-y-3 list-disc pl-6 text-slate-600 leading-relaxed">
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-lg text-slate-600 leading-relaxed">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function parseMarkdown(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: cleanInline(paragraph.join(" ")) });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list.map(cleanInline) });
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line === "---") {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: cleanInline(line.slice(3)) });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: cleanInline(line.slice(4)) });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-medium text-slate-900">{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function cleanInline(text: string) {
  return text.replace(/`/g, "").replace(/\s+/g, " ").trim();
}
