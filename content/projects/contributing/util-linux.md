+++
title = "uutils/util-linux"
weight = 1
description = "Rust rewrites of the util-linux tools"
[extra]
upstream = "https://github.com/uutils/util-linux"

[[extra.tools]]
name = "rename"
summary = "Rename files by replacing part of their names"
work = [{ what = "Implement rename", pr = 632, state = "merged" }]

[[extra.tools]]
name = "ionice"
summary = "Set or get a process's I/O scheduling class and priority"
work = [{ what = "Implement ionice", pr = 637, state = "open" }]

[[extra.tools]]
name = "chrt"
summary = "Manipulate a process's real-time scheduling attributes"
work = [{ what = "Implement chrt", state = "in-progress" }]

[[extra.tools]]
name = "chcpu"
summary = "Configure CPUs"
work = [
  { what = "Report each error only once", pr = 617, state = "merged" },
  { what = "Bound the CPU list walk at the highest possible CPU", pr = 634, state = "open" },
]

[[extra.tools]]
name = "lscpu"
summary = "Display information about the CPU architecture"
work = [{ what = "Fix a panic when physical_package_id is -1", pr = 622, state = "merged" }]
+++

[uutils](https://github.com/uutils) rewrites core Unix tools in Rust, and its util-linux project does that for the util-linux suite: the commands for processes, CPUs, disks, and the rest of the system plumbing that ships on nearly every Linux machine. I contribute because these are tools I lean on, and matching a decades-old C implementation's behavior exactly is a demanding way to learn the kernel interfaces underneath them.
