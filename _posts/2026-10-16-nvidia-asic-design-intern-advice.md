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

When I first hit this, I had ZERO clue how to attack it. The trick for questions like these is to stop trying to see the whole answer at once, write the pattern out, and build it up from basic blocks. Every cycle after reset, the module should output 0², 1², 2², 3², and so on, which is 0, 1, 4, 9, 16, etc. Staring at those numbers directly, the pattern is hard to see. So let's break it down.

The key realization is that we're producing one value every cycle, and we already have the *previous* cycle's value sitting in a register. So instead of asking "what is n²?", ask "how do I get from one square to the next?":

- 0 → 1 is +1
- 1 → 4 is +3
- 4 → 9 is +5
- 9 → 16 is +7

Those deltas, 1, 3, 5, 7, ..., are just the odd numbers: start at 1 and increment by 2 each cycle. So the whole thing collapses into two registers and two adders: one register holds the running square and accumulates the current delta, and the other holds the delta and bumps itself by 2 every cycle.

This is a dead-simple question once it's written out, but doing that breakdown live with someone watching is the hard part.

The bigger questions work the same way, just with more moving parts. One of the things I actually had to design was a packetizer, which is a module that takes an incoming payload stream and frames it, prepending a header and emitting fixed-size packets downstream over a `valid`/`ready` interface.

The way to not drown in a problem like this is to split it in your head into a **datapath** (the registers and buses the payload actually flows through) and a **controller** (a tiny FSM that decides what goes on the output each cycle). Once you draw that line, the hard parts become specific, answerable questions:

- **Variable-length payload.** Frames aren't all the same size, so the header carries a length (a beat count). The clean way to handle it is a down-counter: load it from the length field when you start a frame, decrement it as you push each payload beat, and when it hits zero you know the frame is done. Now your controller doesn't need to "know" anything about the data; it just watches a counter.
- **Padding and alignment.** When a payload doesn't fill the final fixed-size packet (or a word boundary), you can't just emit a short beat with garbage in the top bits. You pad the remaining slots with a known value and keep the output width constant. This is usually a separate controller state, `PAD`, that you fall into once the payload counter is drained but the packet isn't full yet.
- **Backpressure.** Downstream `ready` can deassert in the middle of a frame. Your module has to freeze: hold the current beat on the output, hold the counter, hold the state, and resume cleanly when `ready` comes back. The golden rule is that you only advance state on a beat that actually completes, i.e. when `valid && ready` are both high. Get that wrong and you either drop a beat or duplicate one, and that's exactly the bug they're listening for.

So the whole thing collapses into a payload buffer plus a counter for the datapath, and a small controller that walks `IDLE → HEADER → PAYLOAD → PAD → IDLE`, gated everywhere by `valid && ready`. Same lesson as the perfect-square question: find the small amount of state you actually need to carry, and express everything else as an update on it.

## Get comfortable with FSMs

My next recommendation is to get really comfortable with FSM design. Across the whole process I got something like three different FSM design questions, so this is not a corner you want to cut. Two flavors show up constantly, and both reward the same habit: figure out the *minimal* piece of state you need to remember, and let everything else be a transition on it.

The first flavor is **serial pattern detection**. A classic is: a bit arrives every cycle, and you assert the output whenever you've just seen the pattern `1011`, *with overlaps allowed*. The trick is to make your state mean "the longest prefix of the pattern I've matched so far," which gives you five states: `S0` (nothing), `S1` (saw `1`), `S2` (saw `10`), `S3` (saw `101`), and `S4` (saw `1011`, assert output). Then you just ask, from each state, where each incoming bit sends you:

- `S0`: a `1` goes to `S1`, a `0` stays at `S0`.
- `S1` (saw `1`): a `0` goes to `S2` (now `10`), a `1` stays at `S1` (you've still only got a trailing `1`).
- `S2` (saw `10`): a `1` goes to `S3` (`101`), a `0` goes back to `S0` (the `100` is dead).
- `S3` (saw `101`): a `1` goes to `S4` (`1011`, match!), a `0` goes to `S2` (the trailing `10` is the start of a possible new match).
- `S4` (saw `1011`): and here's the overlap. A following `1` is *not* a dead end, because the final `1` of `1011` is also the first `1` of the next `1011`. So you fall back to `S1`, not `S0`. A `0` goes to `S2`.

That last transition is the whole point of the "with overlaps" wording, and it's exactly where people reflexively reset to `S0` and get it wrong. Walk the overlap case out loud and you'll catch it.

The second flavor is a **running-property detector**: bits stream in MSB first, and you assert the output whenever the number received *so far* is divisible by 5. Your first instinct might be to accumulate the whole number, but that needs unbounded width and is completely unnecessary. The key realization is that all you care about is the **remainder mod 5**, which is one of only five values, so you need exactly five states: `R0` through `R4`. Appending a bit to a binary number is `value = 2*value + bit`, so in remainder-land the transition is simply `r' = (2*r + bit) mod 5`. That gives a tidy 5×2 table:

- `R0`: bit `0` → `R0`, bit `1` → `R1`
- `R1`: bit `0` → `R2`, bit `1` → `R3`
- `R2`: bit `0` → `R4`, bit `1` → `R0`
- `R3`: bit `0` → `R1`, bit `1` → `R2`
- `R4`: bit `0` → `R3`, bit `1` → `R4`

The output is just "am I in `R0`?" The lesson generalizes to any divisibility or running-checksum question: don't carry the whole number, carry the smallest running quantity (here, a remainder) that lets you keep the state space finite.

I'd also strongly suggest drilling computer architecture concepts like pipelining, hazards and forwarding, and out-of-order execution. Understanding why these work, not just memorizing definitions, pays off the moment a conceptual question shows up.

## Know your low-power fundamentals

It's easy to treat power as an afterthought, but in ASIC design it's front and center, and at least one interviewer will ask about it. You don't need to be a device physicist, but you should be able to talk cleanly about the two kinds of power and which techniques attack which.

**Dynamic (switching) power** is the energy spent charging and discharging node capacitance every time a signal toggles. The mental model is `P_dynamic ∝ α · C · V² · f`: the activity factor `α` (how often nodes actually flip), the capacitance `C` being driven, the supply voltage `V` *squared*, and the clock frequency `f`. That `V²` term is why lowering voltage is such a powerful lever, and the `α` and `f` terms are why "stop things from toggling when you don't need them to" saves real power.

**Leakage (static) power** is current that flows even when nothing is switching, because transistors aren't perfect off-switches, a little current seeps through. It doesn't care about activity or frequency; it's burned as long as the block is powered on. It gets worse at higher temperatures and with more (and faster, lower-threshold) transistors, so in modern nodes it's a big deal.

Now the techniques line up naturally. **Clock gating** attacks *dynamic* power: you shut the clock off to registers that aren't doing useful work, which drops the activity factor `α` to zero on those flops instead of letting them toggle every cycle for nothing. **Power gating** and **multi-Vt cells** attack *leakage*: power gating cuts the supply to idle blocks entirely so they leak nothing, and using higher-threshold-voltage cells on non-timing-critical paths trades a little speed for much lower leakage.

This is my advice for general ASIC interviews at NVIDIA. Depending on which ASIC team you're interviewing with, it's worth studying more targeted topics too, such as interconnect/NoC modeling, SM internals, or broader GPU design.

Anyway, good luck! Let me know if you have any questions or want one-on-one help with interview prep.

Best,
Sai




