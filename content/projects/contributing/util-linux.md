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

## rename

`rename` replaces part of a file's name. My port is the whole of rename(1): every option, the three operands, and the documented exit statuses, checked against util-linux 2.42.2 and 2.40.4 by comparing stdout, stderr, exit status, and the resulting directory tree over roughly a thousand invocations.

The hard part was names that aren't valid Unicode, which are exactly the names people reach for `rename` to fix. A Rust `String` would quietly turn them into replacement characters, so the names stay `OsStr` from argv to the rename call, the substitution engine works on raw code units, and even the error messages are written as bytes, because a `Display` impl can only write UTF-8.

## ionice

`ionice` shows or changes a process's I/O scheduling class and priority. The port covers all of ionice(1), checked against four util-linux releases by comparing output, exit status, and the arguments of the `ioprio_get` and `ioprio_set` syscalls themselves.

The hard part was that util-linux doesn't enforce its own documented ranges. The kernel takes the class from three bits and the level modulo eight, so `ionice -c 99` quietly runs idle, `-n 8192` changes the class outright, and `-n 8` means the highest best-effort priority, not one past the lowest. Copying that faithfully would have meant copying a trap, so I asked the maintainers ([#624](https://github.com/uutils/util-linux/issues/624)), and the port now rejects values outside the documented ranges instead.

## chrt

`chrt` reads or sets a process's real-time scheduling policy and priority, or runs a command under one. It's what I'm working on now; there's no pull request yet.

The hard part is everything chrt(1) does that its man page never mentions. Under `-a` it walks a process's threads in the order `/proc/<pid>/task` lists them, which matches sorting by thread id only until the ids wrap, and it rereads that list as it goes, so a thread that exits mid-walk doesn't fail the run and one that starts mid-walk still gets set. On musl, `sched_setscheduler` returns `ENOSYS` without calling the kernel, so the port sets the scheduler through the raw syscall to behave the same under both libcs.

## chcpu

`chcpu` enables, disables, and configures CPUs. My first contribution here fixed it printing every failure twice, once without the program-name prefix. The second, still in review, fixes a CPU-list range as wide as the integer type taking hours, because the tool checked every index one at a time.

The hard part of the second was choosing a bound that can never refuse an operation that would have worked. `/sys/devices/system/cpu/present` changes when CPUs are hot-added, but `possible` is fixed at boot, and nothing above it can come online for the life of the boot. Stopping the walk there turns `0-18446744073709551615` into a run of about 2 ms.

## lscpu

`lscpu` displays information about the CPU architecture. It panicked on machines where a CPU's `physical_package_id` reads `-1`, which the kernel documents as the fallback when an architecture doesn't define that topology value, as on ppc64.

The hard part was reproducing a ppc64 failure on an x86 machine. I bind-mounted a file containing `-1` over every `physical_package_id` inside an unprivileged mount namespace (`unshare -Urm`), which reproduced the panic without root or new hardware, and confirmed that after the fix the port reports the same topology as util-linux's `lscpu` under the same conditions.
