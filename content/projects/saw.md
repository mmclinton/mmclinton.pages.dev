+++
title = "saw"
date = 2026-01-12
description = "A structured-log slicer for grep-weary afternoons."
[extra]
tags = ["go", "logs"]
repo = "https://codeberg.org/mmc/saw"
lang = "Go"
+++

`saw` reads JSON logs on stdin and lets you filter, project, and pretty-print
fields without remembering `jq` incantations. Built for tailing a noisy service
and seeing only what matters.
