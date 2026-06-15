+++
title = "Hello, World!"
date = 2026-06-07
description = "Hello, World! How is my markdown generating?"
+++

> A comprehensive demonstration of standard Markdown features.

---

## Headings

# H1 — Page Title
## H2 — Major Section
### H3 — Subsection
#### H4 — Sub-subsection
##### H5 — Minor heading
###### H6 — Smallest heading

---

## Emphasis

Plain text, **bold text**, *italic text*, ***bold and italic***, and ~~strikethrough~~.

You can also use `inline code` to highlight short snippets.

---

## Lists

### Unordered

- Item one
- Item two
  - Nested item A
  - Nested item B
    - Deeply nested item
- Item three

### Ordered

1. First step
2. Second step
   1. Sub-step one
   2. Sub-step two
3. Third step

---

## Links & Images

[OpenStreetMap](https://www.openstreetmap.org) — an inline link.

[Anthropic][1] — a reference-style link.

[1]: https://www.anthropic.com

![Alt text for an image](https://via.placeholder.com/150 "Optional title")

---

## Code

### Inline

Use `println!("Hello, World!")` to print in Rust.

### Fenced Block (Rust)

```rust
fn main() {
    let greeting = "Hello, World!";
    println!("{}", greeting);
}
```

### Fenced Block (Python)

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))
```

### Fenced Block (Shell)

```sh
echo "Hello, World!"
```

---

## Tables

| Language | Paradigm        | Typing   | First Appeared |
|----------|-----------------|----------|----------------|
| Rust     | Multi-paradigm  | Static   | 2010           |
| Python   | Multi-paradigm  | Dynamic  | 1991           |
| Go       | Concurrent      | Static   | 2009           |
| SQL      | Declarative     | Static   | 1974           |

> Column alignment can be controlled with colons in the separator row:

| Left-aligned | Centered | Right-aligned |
|:-------------|:--------:|--------------:|
| Apple        |  Banana  |        Cherry |
| 1            |    2     |             3 |

---

## Blockquotes

> "The curious task of economics is to demonstrate to men how little they really know about what they imagine they can design."
>
> — F.A. Hayek, *The Fatal Conceit*

Nested blockquotes:

> Outer quote.
>
> > Inner quote nested one level.
> >
> > > Inner quote nested two levels.

---

## Horizontal Rules

Three or more hyphens, asterisks, or underscores on their own line:

---

***

___

---

## Task Lists

- [x] Write the Hello World template
- [x] Include code blocks
- [x] Add a table
- [ ] Render it in a Markdown viewer
- [ ] Extend with project-specific content

---

## Footnotes

Standard Markdown footnotes[^1] are supported in many renderers such as GitHub and Pandoc.[^2]

[^1]: This is the first footnote. It can contain **formatted text** and even `code`.
[^2]: Pandoc is a universal document converter — handy for converting `.md` to PDF, DOCX, and more.

---

## Escaping Special Characters

Use a backslash to escape Markdown syntax: \*not italic\*, \`not code\`, \[not a link\].

---

## HTML (where supported)

<details>
<summary>Click to expand a hidden section</summary>

Raw HTML can be embedded in Markdown where the renderer allows it. Useful for collapsible sections, colored text, or custom layouts.

</details>

---

*End of template. Happy writing!*
