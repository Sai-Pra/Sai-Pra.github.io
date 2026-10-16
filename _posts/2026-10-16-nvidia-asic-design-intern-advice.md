---
layout: post
title: "Advice for NVIDIA ASIC Design Internship Interviews"
date: 2026-10-16
---


Hello there!

If you are seeing this, you are one of the people who emailed or messaged me to ask for advice on interviewing for the ASIC Design Internship Program at NVIDIA. Congrats on landing the interview! Unfortunately, I am really busy this week and don't have the time to answer everyone's specific questions individually, so I've put together this general guide. I'll keep it short and sweet, but feel free to ask me more about any of the specifics I mention here.

I had three rounds. The first was one-on-one, the second was with three different people, and the final round was with one last person. It can be very intensive, so make sure you build up the stamina to answer a lot of questions back to back!

## Write efficient RTL

The first piece of advice I have is that you need to know how to write efficient RTL, and know it really well. That doesn't just mean clean syntax; it means designing an efficient *algorithm* first and then expressing it in hardware.

Here's an example I actually got asked on one of my NVIDIA ASIC interviews: design a module that, every cycle, outputs an incrementing perfect square. The naive solution is to keep a counter and drop it into a multiplier. The real question comes right after: now do it *without* a multiplier.

When I first hit this, I had ZERO clue how to attack it. The trick for questions like these is to stop trying to see the whole answer at once, write the pattern out, and build it up from basic blocks. Every cycle after reset, the module should output 0², 1², 2², 3², and so on, which is 0, 1, 4, 9, 16, .... Staring at those numbers directly, the pattern is hard to see. So let's break it down.

The key realization is that we're producing one value every cycle, and we already have the *previous* cycle's value sitting in a register. So instead of asking "what is n²?", ask "how do I get from one square to the next?":

- 0 → 1 is +1
- 1 → 4 is +3
- 4 → 9 is +5
- 9 → 16 is +7

Those deltas, 1, 3, 5, 7, ..., are just the odd numbers: start at 1 and increment by 2 each cycle. So the whole thing collapses into two registers and two adders: one register holds the running square and accumulates the current delta, and the other holds the delta and bumps itself by 2 every cycle. No multiplier in sight.

This is a dead-simple question once it's written out, but doing that breakdown live, with someone watching, is the hard part. Practice the *process* of decomposing a pattern into previous-state-plus-an-update, not just this specific problem.

## Get comfortable with FSMs

My next recommendation is to get really comfortable with FSM design. If you've taken any sort of algorithms or digital design class, problems like building an FSM for division by a constant, or one that recognizes a particular bit pattern in a serial stream (say, detecting `1011` with overlaps), are a great way to practice. Across the whole process I got something like three different FSM design questions, so this is not a corner you want to cut.

I'd also strongly suggest drilling computer architecture concepts like pipelining, hazards and forwarding, and out-of-order execution. Genuinely understanding *how* these work, not just memorizing definitions, pays off the moment a conceptual question shows up. Finally, brush up on the low-power fundamentals like clock gating and power gating; it's easy to overlook, but it's definitely important in ASIC design, and at least one person will ask about it.

This is my advice for general ASIC interviews at NVIDIA. Depending on which ASIC team you're interviewing with, it's worth studying more targeted topics too, such as interconnect/NoC modeling, SM internals, or broader GPU design.

Anyway, good luck! Let me know if you have any questions or want one-on-one help with interview prep.

Best,
Sai




