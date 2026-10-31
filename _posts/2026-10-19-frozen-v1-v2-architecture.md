---
layout: post
title: "An Attempt to Understand Google's 'Frozen' v1 and v2 Architecture"
date: 2026-10-19
published: false
description: "A source-driven dig into Google's 'Frozen' chip — collecting the academic and primary sources on its architecture and piecing together what the v1/v2 designs actually do."
wip: true
wip_note: "Research scaffold / source dump, not a finished post — it collects every source I could find on Google's \"Frozen\" chip so I can rewrite this in the style of my Taalas HC1 post."
tags: [asic, llm, hardware]
---

# The one thing you have to know before reading

Unlike Taalas, **there are no "Frozen" patents and no "Frozen" papers.** Frozen is an unannounced, internal Google project that is only known to the public through a single piece of reporting (The Information, July 20, 2026) and the wave of secondary coverage that followed it. Google has not confirmed it, has published nothing on it, and the chip isn't expected to deploy until ~2028.

So this post can't be "here are the nine patents, let me read them to you" the way the Taalas post was. Instead the sources split cleanly into two buckets, and I've organized everything that way:

1. **Primary reporting** — the only Frozen-*specific* sources that exist. These establish the facts (what it is, who proposed it, the v1→v2 pivot, the efficiency claim, the timeline).
2. **Academic/patent scaffolding** — the published computer-architecture and ML literature that the *concept* rests on. Frozen didn't invent "bake a model into silicon"; it's a specific point on a well-documented design-space spectrum, and the papers/patents below are what let us reason about how it would actually work.

I'll summarize each source and flag what is reported-fact vs. my own inference, so that when I rewrite this I know exactly which claims I can stand behind.

---

# Bucket 1: Primary reporting (Frozen-specific)

The entire factual basis for Frozen traces back to **The Information's July 20, 2026 report** (paywalled). Everything else is secondary coverage of that report. The consistent, load-bearing facts across all of it:

- Google is building a server chip, internally called **"Frozen,"** that hardwires part of its Gemini model into the silicon.
- The idea originated with **Jeff Dean** (Google DeepMind chief scientist).
- **Frozen v1** (the original concept): burn the trained **weights** straight into the circuitry. **Scrapped** — a chip tied to one weight snapshot is obsolete in months and the ASIC NRE can't amortize on that timetable.
- **Frozen v2** (the current project): freeze the **architecture** (the model "blueprint" / dataflow) into transistors while leaving the **weights updatable**, so the chip survives across Gemini releases.
- Projected **6–10× more tokens per watt** than Google's latest TPUs.
- Targeted deployment **~2028**; a **separate silicon line from the TPU**, not a replacement; **smaller production volume**, for **internal use**, aimed at cutting Gemini inference cost.
- As of the report, **how much** of the architecture gets hardcoded was **not yet finalized**.

Sources (all restate the above; useful for cross-checking wording and for the analytical framing):

- The Information (original, paywalled) — reported July 20, 2026.
- [Reuters/Yahoo Finance — "Google plans new chip to run Gemini models more efficiently, the Information reports"](https://finance.yahoo.com/technology/ai/articles/google-plans-chip-run-gemini-135751706.html)
- [TechCrunch — "Google is working on a new AI chip designed to make Gemini more efficient" (Jul 20, 2026)](https://techcrunch.com/2026/07/20/google-is-working-on-a-new-ai-chip-designed-to-make-gemini-more-efficient/)
- [CNBC — "Alphabet stock pops on report it's developing a more efficient AI chip"](https://www.cnbc.com/2026/07/20/alphabet-googl-stock-ai-chip-report.html)
- [The Decoder — "Google's 'Frozen v2' chip reportedly bakes Gemini's architecture directly into silicon"](https://the-decoder.com/googles-frozen-v2-chip-reportedly-bakes-geminis-architecture-directly-into-silicon-for-efficiency-gains/) — cleanest statement of the v1 (weights) vs v2 (architecture) distinction.
- [Tom's Hardware — "…6 to 10 times more tokens per watt than latest TPUs"](https://www.tomshardware.com/tech-industry/google-reportedly-developing-frozen-v2-chip-with-geminis-architecture-etched-into-the-silicon)
- [The New Stack — "Google just bet its inference future on a chip built for one model"](https://thenewstack.io/google-frozen-gemini-chip/)
- [FourWeekMBA — "Google's 'Frozen' Chip … Bets That Model Architecture Is Starting to Settle"](https://fourweekmba.com/ai-google-frozen-chip-gemini-silicon-inference-efficiency/) — best "architecture is converging, so you can afford to freeze it" analysis angle (currently 403s to automated fetch; read in browser).
- [getreadyforagents.com](https://www.getreadyforagents.com/news/google-frozen-v2-silicon-gemini-integration/), [sentisight.ai](https://www.sentisight.ai/alphabet-frozen-v2-chip-gemini/), [aibase](https://news.aibase.com/news/29729) — additional restatements.

**Takeaway for the rewrite:** I should be upfront that bucket 1 is journalism, not engineering disclosure. The *interesting* content — how you'd actually freeze a transformer's architecture into silicon and why that buys 6–10× — has to be reconstructed from bucket 2.

---

# Bucket 2: The academic / patent scaffolding

Here's the conceptual ladder I think the rewrite should climb, each rung backed by real published sources.

## 2.1 Why specialize silicon at all: domain-specific architectures

The whole premise — that you win big by narrowing a chip to one workload — is the central thesis of modern computer architecture, and the two canonical sources both come from people adjacent to this project.

- **Hennessy & Patterson, "A New Golden Age for Computer Architecture"** (Turing Lecture, ISCA 2018; CACM, Feb 2019). Argues Domain-Specific Architectures (DSAs) are the path forward post-Dennard/Moore. Frozen is a DSA taken to its logical extreme — not just "a chip for ML" but "a chip for *one model family's* dataflow." [CACM](https://cacm.acm.org/research/a-new-golden-age-for-computer-architecture/) · [PDF](https://www.doc.ic.ac.uk/~wl/teachlocal/arch/papers/cacm19golden-age.pdf)
- **Jeff Dean, "The Deep Learning Revolution and Its Implications for Computer Architecture and Chip Design"** (ISSCC 2020 keynote; [arXiv:1911.05289](https://arxiv.org/abs/1911.05289)). This is the single most relevant academic source, because Dean is the originator of Frozen. The paper lays out his view that ML models should drive the hardware, that inference ASICs can cut energy/MAC roughly 20×→1 pJ, and (critically) that models are becoming stable enough targets to justify co-design. The v1→v2 pivot is basically this paper's thesis colliding with the reality that *weights* move faster than *architecture*.

**Rewrite note:** The honest spine of this post is "Frozen = Jeff Dean's own ISSCC 2020 argument, four years later, with the hard lesson that you freeze the *slow-changing* part (architecture) and not the *fast-changing* part (weights)."

## 2.2 The baseline being beaten: the TPU

The "6–10× tokens/watt" claim is explicitly *vs. TPUs*, so the rewrite needs the TPU as the reference point.

- **Jouppi et al., "In-Datacenter Performance Analysis of a Tensor Processing Unit"** (ISCA 2017; [arXiv:1704.04760](https://arxiv.org/pdf/1704.04760)). The TPU v1: a large **weight-stationary systolic array** driven by a coarse-grained instruction stream + compiler. Reported 15–30× perf and 30–80× perf/watt over contemporary CPUs/GPUs. The key point for Frozen: the TPU is *general across* NN models — it reads an instruction stream and streams weights. Frozen's efficiency bet is that a TPU "wastes" energy on that generality (instruction fetch/decode, flexible dataflow, data movement) and you reclaim it by hardwiring the one dataflow you actually run.

**Rewrite note:** Contrast "TPU = programmable matrix engine, architecture lives in software/instructions" vs. "Frozen = architecture lives in the wires." That's the whole story of where the power savings come from.

## 2.3 What is actually being "frozen": the Transformer / Gemini architecture

"Freeze the architecture" only means something if you know what the architecture *is*.

- **Vaswani et al., "Attention Is All You Need"** (NeurIPS 2017; [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)). The transformer block — attention + FFN, residuals, norms — is the structure that would get etched. The parts that are *stable across Gemini versions* (the block topology, the dataflow, the sequence of ops) are exactly what v2 can safely freeze; the parts that change (weights, possibly layer counts / expert counts) are what it leaves soft.
- **Gemini technical reports** — the specific architecture Google would freeze. [Gemini 2.5 report (arXiv:2507.06261)](https://arxiv.org/html/2507.06261v1) and successor model cards describe a **Mixture-of-Experts (MoE)**, natively multimodal design. MoE matters a lot here: routing/expert structure is a big, regular, hardwireable dataflow, but *which* experts and *how many* may change release-to-release — a concrete example of the "how much do we dare freeze?" tension the reporting says is unresolved.

**Rewrite note:** Good place to speculate concretely: attention pattern, normalization placement, residual routing, MoE dispatch/combine topology, and the per-layer op schedule are all plausibly "frozen"; weights, and maybe expert count / context length, stay "soft."

## 2.4 The real-world existence proofs: Taalas is v1, Etched is v2

Neither Frozen variant is hypothetical — both already shipped, from *other* companies. This is the single most useful reframing to come out of the research, because it means I can reason about Frozen v1 and v2 by pointing at real silicon instead of guessing. The whole v1-vs-v2 distinction maps cleanly onto two existing chips:

### v1 = weights-in-silicon = Taalas HC1 (and the "MSIC" class)

My own [Taalas HC1 post]({% post_url 2026-10-16-taalas-architecture %}) is the detailed version; the relevance here is sharp:

- The HC1 bakes **Llama 3.1 8B's weights** into mask ROM and hits ~16,960 tok/s by never moving weights across a bus. That's *exactly* Frozen v1.
- The HC1's core limitation is *exactly* why Google scrapped v1: a mask set is good for **one model**, so you re-spin silicon every time the model changes. Taalas even has patents (the codebook-pointer scheme, US 2026/0023566) whose whole purpose is to make the baked weights *swappable at tape-out* — an admission that "weights in silicon" is too rigid without an escape hatch.
- Industry has a name for this class now — **MSIC (Model-Specific Integrated Circuit)** — and the approach is validating commercially: [AMD acquired Taalas in August 2026](https://happyrock.cloud/blog/2026-08-07_amd_taalas_acquisition_msic_inference_architecture_deep_dive_model_etched_into_silicon_en/) (that deep-dive also cleanly describes the HC1 as mask-ROM etched weights + SRAM for the updatable KV cache / LoRA).

### v2 = architecture-in-silicon, weights loaded = Etched "Sohu"

This is the find that most changes the post. **[Etched's Sohu](https://www.spheron.network/blog/etched-ai-sohu-vs-nvidia-transformer-asic-inference/)** is, to a first approximation, Frozen v2 built by a startup:

- It hardwires the **transformer architecture only** — "transformer attention as fixed-function silicon rather than programmable matrix-multiply instructions." Physical circuits implement QKV projections, multi-head attention over the KV cache, and the FFN directly. There is **no general-purpose matmul unit**.
- Crucially, **weights are NOT baked in** — they load into 144 GB of HBM3E per chip, "just like on GPUs." The *compute path* is fixed; the *weights* are soft. That is precisely the Frozen v2 split (freeze architecture, keep weights updatable).
- Claimed ~500,000 tok/s across an 8-chip server on Llama 70B (~62,500/chip at batch 1) vs. ~700 tok/s for an H100 at batch 1. (Caveat per the source: the gap shrinks at high batch sizes, and Etched hasn't published batch-32/256 numbers.)
- The cost of freezing the architecture is total rigidity: Sohu "cannot run MoE, multimodal, or any non-transformer architecture" — there's nothing to compile a conv, SSM scan, or diffusion U-Net onto. **This is the single most important warning for Frozen v2:** Gemini is MoE + multimodal, so Google has to freeze a *richer* architecture than Sohu did, and every bet about "what stays stable across Gemini releases" is a bet Sohu didn't have to make.

**Rewrite note — this is the new spine of the post:** *Frozen v1 is the Taalas HC1; Frozen v2 is Etched's Sohu — except Google is doing v2 for a far more complex, MoE/multimodal architecture (Gemini) and doing it in-house.* Google looked at the HC1's "one model per mask set" wall, blinked, and landed on the Sohu-style compromise: freeze the slow-changing dataflow, keep the fast-changing weights in normal memory.

## 2.5 What "freezing architecture, not weights" means technically: spatial/dataflow specialization

This is the rung where the engineering actually lives, and it's well-covered academically. Freezing architecture = fixing the **dataflow / spatial structure** in hardware while weights stream in from memory.

- **Chen et al., "Eyeriss: A Spatial Architecture for Energy-Efficient Dataflow for CNNs"** (ISCA 2016; [PDF](https://eems.mit.edu/wp-content/uploads/2016/04/eyeriss_isca_2016.pdf)). Makes dataflow choice (weight-stationary / row-stationary / output-stationary) a first-class, energy-dominating design decision. Frozen v2 is essentially "pick the one dataflow this architecture needs and hardwire it," so the taxonomy here is the right vocabulary.
- **Sze, Chen, Yang, Emer — DNN accelerator / dataflow tutorials & "Full Stack Optimization of Transformer Inference: A Survey"** ([arXiv:2302.14017](https://arxiv.org/pdf/2302.14017)). Maps the spectrum from fully programmable to fully hardwired, specifically for transformers, including attention's irregular, length-dependent dataflow across the softmax boundary. Directly relevant to which transformer sub-ops are cleanly freezable and which (attention scoring, KV cache growth) stay awkward — same issue I hit in the Taalas post's scheduling section.
- **"Evaluating Spatial Accelerator Architectures with Tiled Matrix-Matrix Multiplication"** ([arXiv:2106.10499](https://arxiv.org/pdf/2106.10499)) and **Tensorlib** ([PDF](https://woset-workshop.github.io/PDFs/2022/7-jia.pdf)) — on generating spatial dataflow hardware from a fixed algebraic structure, i.e. the mechanics of turning "this architecture" into "these wires."

Three 2026-era papers are especially on-point and should be read for the rewrite:

- **"The Immutable Tensor Architecture: A Pure Dataflow Approach for Secure, Energy-Efficient AI Inference"** ([arXiv:2511.22889](https://arxiv.org/pdf/2511.22889)). The academic statement of **Frozen v1**: weights baked into metal interconnect / logic gates on mature-node ASICs (28/40nm), no DRAM weight fetch at all. Uses a "Split-Brain" design — host CPU handles dynamic state (KV cache) while the ASIC is a "stateless, ROM-embedded dataflow engine." This is the clean academic mirror of Taalas, and its split (frozen compute + external dynamic state) is also the right mental model for how v2 would offload KV cache.
- **"From LLM to Silicon: RL-Driven ASIC Architecture Exploration for On-Device AI Inference"** ([arXiv:2604.07526](https://arxiv.org/abs/2604.07526)). Model-specific ASIC design via RL over a joint PPA space (mesh topology, per-core microarch, operator placement), validated on Llama 3.1 8B (29,809 tok/s at 3nm). Relevant as the "how you'd actually co-design the silicon to one model's architecture" methodology, and it explicitly leans on weights being frozen during inference.
- **"Flex-TPU: A Flexible TPU with Runtime Reconfigurable Dataflow Architecture"** ([arXiv:2407.08700](https://arxiv.org/pdf/2407.08700)). The deliberate *counterpoint* — keeping the dataflow reconfigurable at runtime. Useful to frame exactly what Frozen gives up (flexibility) to win efficiency, and to argue the spectrum: Flex-TPU (fully soft dataflow) → TPU (compiler-fixed) → Frozen v2 / Sohu (hardwired dataflow) → Taalas / Immutable Tensor (hardwired weights too).

Two more transformer-ASIC datapoints for breadth: [Transformer Accelerator (TFA), macro-op INT8 (arXiv:2608.23582)](https://arxiv.org/pdf/2608.23582) and [CHIPSMORE, compute-in-interconnect chiplets (arXiv:2608.30509)](https://arxiv.org/pdf/2608.30509).

**Rewrite note:** The power argument to make here: a TPU pays, every cycle, for *being able to run any dataflow* (instruction fetch/decode, configurable interconnect, general buffering). If the dataflow is fixed, all of that control overhead and data-movement flexibility collapses into fixed wiring — that's the plausible source of 6–10× tokens/watt, and it's the same "don't pay for generality you don't use" logic as Taalas, just applied to the *dataflow* instead of the *weights*.

## 2.6 Patents in the neighborhood (no Frozen patent exists, these are the closest analogs)

Since there's no Frozen patent, these are the published patents that describe the *mechanisms* Frozen v2 would use. None are confirmed to be Frozen; treat them as "how one would build this."

- **US20250028563A1 — "Accelerator Architecture For A Transformer Machine Learning Model"** ([Google Patents](https://patents.google.com/patent/US20250028563A1/en)). ⚠️ Assignee is **University of Michigan** (Lu, Wu, Wang), *not* Google — it's "PIM-GPT," a processing-in-memory + ASIC-controller transformer accelerator. Useful as a worked example of hardware specialized to the transformer dataflow with *configurable* mapping/tiling (i.e. architecture-fixed, model-size-flexible), which is conceptually the v2 pattern. Do not cite as a Google/Frozen source.
- **US10740433B2 — "Universal transformers"** (Google) ([Google Patents](https://patents.google.com/patent/US10740433B2/en)) — a Google patent on the transformer model itself; worth a look since it's Google-owned IP on the very architecture that would be frozen.
- **US20250173194A1 — "Preemption in a machine learning hardware accelerator"** (Google) ([Google Patents](https://patents.google.com/patent/US20250173194A1/en)) and **WO2024073115A1 — "AI inference compiler and runtime tool chain"** (Google) ([Google Patents](https://patents.google.com/patent/WO2024073115A1)) — show Google's broader ML-accelerator patent activity and the compiler/runtime layer that a frozen-architecture chip would still need for weight loading.
- For Jeff Dean's own patent trail (none Frozen-specific, but confirms the inventor): [Justia — Jeffrey Adgate Dean patents](https://patents.justia.com/inventor/jeffrey-adgate-dean).
- General surveys for grounding: [Hardware Accelerators for AI (arXiv:2411.13717)](https://arxiv.org/pdf/2411.13717), [AI HW Accelerators for LLMs: Architectures and the Memory Wall (arXiv:2608.28048)](https://arxiv.org/pdf/2608.28048), [LLM Inference Acceleration: A Comprehensive Hardware Perspective (arXiv:2410.04466)](https://arxiv.org/pdf/2410.04466).

**Rewrite note:** Be explicit that this bucket is weaker than the Taalas post's patent section — there, the patents *were* the company's own disclosures. Here, there's no Google patent I can tie to Frozen, so these are analogies, clearly labeled.

---

# My current reading (to be fleshed out in the rewrite)

Putting the two buckets together, here's the thesis I think the finished post should argue:

1. **Frozen is Jeff Dean's ISSCC-2020 DSA argument, productized.** The academic case for baking ML into silicon is a decade old and partly his; Frozen is what it looks like when you stop writing papers and tape out.
2. **v1 = Taalas's HC1 and v2 = Etched's Sohu — both already exist.** Google flinched at the same wall Taalas lives with (one model per mask set) and landed on the Sohu-style compromise. The novelty of Frozen isn't the idea; it's doing the Sohu move *in-house, for an MoE/multimodal frontier model (Gemini)* rather than for a fixed vanilla transformer.
3. **v2's insight is a separation of timescales.** Architecture changes slowly (the transformer block has been stable since 2017; Gemini's blueprint changes far slower than its weights). Weights change fast. So freeze the slow thing into wires, keep the fast thing in normal memory. This is the single idea that distinguishes Frozen v2 from both the HC1 and the TPU — and the Sohu precedent shows it's buildable, while the Sohu *limitation* (can't run MoE/multimodal) shows exactly where Gemini makes it harder.
4. **The 6–10×/watt is the "don't pay for generality" tax refund,** collected on the *dataflow* layer: no instruction fetch/decode for a fixed op schedule, no configurable interconnect, minimal data movement — the Eyeriss/dataflow literature is where to ground that number (and where to hedge it, since it's a projection, not a measurement).
5. **The unresolved question — "how much to freeze" — is real and technical,** and the MoE structure of Gemini is the sharpest example: routing topology is temptingly hardwireable, expert count/context length are temptingly *not*. That's the knob that decides whether v2 is brittle like v1 or durable like a TPU.

# Open questions / what I could not find

- **No primary-source numbers.** No die size, process node, clock, dataflow description, or MLPerf-style measurement exists — the 6–10× is an unverified projection attributed to engineers.
- **No confirmation Frozen uses any specific patent or technique.** Everything in bucket 2 is "the literature a design like this would draw on," not "the design."
- **No detail on the weight-loading path** — the whole v2 pivot hinges on weights being updatable, but nothing reported says whether that's HBM, on-package DRAM, SRAM recall fabric (Taalas-style), or something else. This is the most important missing piece and the best place for honest speculation.
- **Whether "Frozen v1" ever existed in silicon** or was only ever a scrapped design concept. Reporting implies the latter.

---

## Full source list

**Primary reporting:** The Information (orig., paywalled, Jul 20 2026) · [Reuters/Yahoo](https://finance.yahoo.com/technology/ai/articles/google-plans-chip-run-gemini-135751706.html) · [TechCrunch](https://techcrunch.com/2026/07/20/google-is-working-on-a-new-ai-chip-designed-to-make-gemini-more-efficient/) · [CNBC](https://www.cnbc.com/2026/07/20/alphabet-googl-stock-ai-chip-report.html) · [The Decoder](https://the-decoder.com/googles-frozen-v2-chip-reportedly-bakes-geminis-architecture-directly-into-silicon-for-efficiency-gains/) · [Tom's Hardware](https://www.tomshardware.com/tech-industry/google-reportedly-developing-frozen-v2-chip-with-geminis-architecture-etched-into-the-silicon) · [The New Stack](https://thenewstack.io/google-frozen-gemini-chip/) · [FourWeekMBA](https://fourweekmba.com/ai-google-frozen-chip-gemini-silicon-inference-efficiency/) · [getreadyforagents](https://www.getreadyforagents.com/news/google-frozen-v2-silicon-gemini-integration/)

**Academic / foundational:** [Hennessy & Patterson, New Golden Age (CACM 2019)](https://cacm.acm.org/research/a-new-golden-age-for-computer-architecture/) · [Dean, DL Revolution & Chip Design (arXiv:1911.05289)](https://arxiv.org/abs/1911.05289) · [Jouppi et al., In-Datacenter TPU (arXiv:1704.04760)](https://arxiv.org/pdf/1704.04760) · [Vaswani et al., Attention Is All You Need (arXiv:1706.03762)](https://arxiv.org/abs/1706.03762) · [Gemini 2.5 report (arXiv:2507.06261)](https://arxiv.org/html/2507.06261v1) · [Chen et al., Eyeriss (ISCA 2016)](https://eems.mit.edu/wp-content/uploads/2016/04/eyeriss_isca_2016.pdf) · [Full Stack Transformer Inference Survey (arXiv:2302.14017)](https://arxiv.org/pdf/2302.14017) · [Spatial Accelerators / Tiled MatMul (arXiv:2106.10499)](https://arxiv.org/pdf/2106.10499)

**Most directly analogous architectures (read these first for the rewrite):** [Immutable Tensor Architecture — weights in silicon = v1 (arXiv:2511.22889)](https://arxiv.org/pdf/2511.22889) · [From LLM to Silicon: RL-driven model-specific ASIC (arXiv:2604.07526)](https://arxiv.org/abs/2604.07526) · [Flex-TPU: reconfigurable dataflow, the counterpoint (arXiv:2407.08700)](https://arxiv.org/pdf/2407.08700) · [TFA transformer ASIC (arXiv:2608.23582)](https://arxiv.org/pdf/2608.23582) · [CHIPSMORE (arXiv:2608.30509)](https://arxiv.org/pdf/2608.30509)

**Commercial existence proofs:** [Etched Sohu — architecture baked, weights loaded = v2](https://www.spheron.network/blog/etched-ai-sohu-vs-nvidia-transformer-asic-inference/) · [AMD acquires Taalas / MSIC deep-dive = v1](https://happyrock.cloud/blog/2026-08-07_amd_taalas_acquisition_msic_inference_architecture_deep_dive_model_etched_into_silicon_en/)

**Patents (analogs, not confirmed Frozen):** [US10740433B2 — Universal transformers (Google)](https://patents.google.com/patent/US10740433B2/en) · [US20250028563A1 — Transformer accelerator (UMich, PIM-GPT)](https://patents.google.com/patent/US20250028563A1/en) · [US20250173194A1 — ML accelerator preemption (Google)](https://patents.google.com/patent/US20250173194A1/en) · [WO2024073115A1 — AI inference compiler/runtime (Google)](https://patents.google.com/patent/WO2024073115A1) · [Justia — Jeffrey A. Dean patents](https://patents.justia.com/inventor/jeffrey-adgate-dean)

**My related post:** [An Attempt to understand Taalas' HC1 Architecture]({% post_url 2026-10-16-taalas-architecture %})
</content>
</invoke>
