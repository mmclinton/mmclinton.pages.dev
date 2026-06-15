# website

Personal site built with [Zola](https://www.getzola.org/), reproducible via Nix,
deployed to Cloudflare Pages. Content-first: writing, reading, and projects.

## Develop

Enter the dev shell (`nix develop`, or `direnv allow` if you use direnv), then:

| Command | What it does |
|---------|--------------|
| `zola serve` | Fast loop for layout/prose. Themed code works here; **math shows unrendered** (the post-build step doesn't run under serve). |
| `./scripts/build.sh` | Canonical build: `zola build` + the KaTeX/highlight post-build pass → `public/`. |
| `zola build --base-url http://127.0.0.1:8088 && node scripts/postbuild.mjs && miniserve public -p 8088` | Full-fidelity local preview (math + injected KaTeX CSS). |

## Authoring

Posts live in `content/writing/*.md` (one file per post), books in
`content/reading/*.md`, projects in `content/projects/*.md`. Front matter is TOML
between `+++` fences (`title`, `date`, `description`, …).

### Math (prerendered at build — zero KaTeX JS reaches readers)

- Inline: `{{ katex(tex="O(n \log n)") }}`
- Display:

  ```
  {% katex() %}
  x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
  {% end %}
  ```

  Shortcodes are used (not a ` ```katex ` fence) because Zola 0.22 flattens
  unknown fence languages to `data-lang="plain"`, which is indistinguishable from
  a real code block. The shortcode body is passed raw, so `a_i` stays a subscript
  instead of turning into markdown italics.

### Code

Standard fenced code blocks with a language tag. Highlighting is theme-aware and
follows the light/dark toggle. To change the theme, edit
`[markdown.highlighting]` in `config.toml`, then regenerate the scoped CSS:

```
zola build && node scripts/gen-syntax-css.mjs   # rewrites sass/_syntax.scss (commit it)
```
