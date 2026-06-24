+++
title = "The Cardinality Trap: How One Label Blew Up a Metrics Bill"
date = 2026-06-24
description = "Why high-cardinality labels quietly multiply time-series storage — and how to size the damage before it sizes you."
+++

> **Placeholder content.** This is not original work. This article is a stand-in used to
> demonstrate Markdown rendering, layout, and typography in a Zola-based site. Content is
> fictional and for structural testing only.

A metrics system bills you for *series*, not for the requests you measure. That distinction
is easy to forget right up until the invoice arrives. A single innocent-looking label —
added to make a dashboard "a little more useful" — can turn one time series into hundreds of
thousands. This piece walks through how the multiplication works, makes it concrete with a
table, and shows the blow-up at a glance.

## What cardinality actually counts

A time series is uniquely identified by a metric name plus the full set of its label values.
Every distinct combination is its own series, stored and indexed independently. The total is
not additive — it is the **product** of the distinct values each label can take:

```
series = metrics × ∏ (distinct values per label)
```

So one metric with three labels of 4, 10, and 50 values is not `4 + 10 + 50 = 64` series.
It is `4 × 10 × 50 = 20,000`. Add a fourth label with a thousand values and you are at
twenty million. The cost is geometric, and it hides behind labels that each look reasonable
in isolation.

## Where the blow-up comes from

The table below tracks one `http_requests_total` metric as labels accrete. Each row adds a
label to the row above it; the rightmost column is the running product.

| Label set                                   | New label values | Total series |
| ------------------------------------------- | ---------------- | ------------ |
| `method`                                    | 5                | 5            |
| `+ status`                                  | 8                | 40           |
| `+ endpoint`                                | 30               | 1,200        |
| `+ region`                                  | 6                | 7,200        |
| `+ user_id`                                 | 50,000           | 360,000,000  |

The first four labels are bounded and well-behaved — 7,200 series is nothing. The fifth,
`user_id`, is **unbounded**: it grows with your user base and never stops. That one column is
the difference between a metric and an outage of your monitoring system.

## Visualizing the blow-up

Plotted on a log-ish scale, the first four rows are invisible next to the last. The bars
below are scaled to each row's series count:

```
http_requests_total — series by label set (log10 scale)

  method              ▏                 5
  + status            ▎                 40
  + endpoint          █▏                1,200
  + region            █▌                7,200
  + user_id           ████████▊         360,000,000
                      └────────────────────────────
                       10⁰  10²  10⁴  10⁶  10⁸
```

Four of the five label sets share the leftmost sliver of the chart. The unbounded label
alone spans the rest. This is the signature of a cardinality problem: not a steady climb, but
a flat line that suddenly goes vertical the moment an unbounded dimension enters.

## How to defuse it

The fixes are unglamorous and effective:

- **Never label by an unbounded identifier.** User IDs, request IDs, email addresses, and
  full URLs belong in logs or traces, not in metric labels.
- **Bucket instead of enumerate.** Replace `user_id` with `user_tier` (`free`, `pro`,
  `enterprise`) — three values, not fifty thousand.
- **Normalize high-variance strings.** Collapse `/users/8412/posts/93` to a templated
  `/users/{id}/posts/{id}` before it becomes a label.
- **Reach for exemplars and traces** when you genuinely need per-request detail. They attach
  to a low-cardinality metric without multiplying it.

Cardinality is a budget, not an afterthought. Decide what each label is worth in series
*before* you ship it, because the metrics system will happily charge you the product whether
you did the multiplication or not.
