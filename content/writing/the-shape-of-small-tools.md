+++
title = "The shape of small tools"
date = 2026-06-08
description = "A sample post exercising headings, code, and math end to end."
+++

A placeholder post with enough structure to exercise the table of contents,
themed code blocks, and prerendered math.

## Why small tools

Good tools do one thing. The cost of a tool is not its size but its surface
area — the number of ways it can surprise you. Inline math like
{{ katex(tex="O(n \log n)") }} should sit naturally in a sentence.

## A little code

```rust
fn main() {
    let xs = vec![3, 1, 2];
    let mut sorted = xs.clone();
    sorted.sort();
    println!("{sorted:?}");
}
```

## A little math

The quadratic formula, rendered to static HTML at build time:

{% katex() %}
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \quad\text{where}\quad a_i \neq b_j
{% end %}

## Closing

{{ image(src="static/img/sample.jpg", alt="A placeholder gradient", caption="A placeholder image — swap me for something real.") }}

That's the whole post. Three headings, one code block, one inline and one
display equation.
