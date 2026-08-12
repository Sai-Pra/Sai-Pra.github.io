---
layout: default
title: Research & Projects
---

<section class="section" style="margin-top:0; border-top:none; padding-top:2rem;">
  <h2 class="section-header">projects</h2>
  <ul class="project-list">

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">FORTE: Fault-Tolerant RISC-V Processor Tape-Out</span>
        <span class="project-date">Apr 2025 – present</span>
      </div>
      <div class="project-tech">Silicon Research Project · 65nm Tape-Out · SystemVerilog, VCS, Design Compiler, Verdi, Spyglass, Yosys</div>
      <ul class="project-bullets">
        <li>Designed and implemented fault-tolerance RTL on a CORE-V Wally (RV64IMA, Sv39 MMU, PMP, M/S-mode) baseline targeting 65nm tape-out; features include SECDED ECC across register file, L1 I/D-cache, PTW/TLB, a cacheline and CSR scrubbing FSM, and a shadow pipeline for redundant execution-unit fault detection</li>
        <li>Implemented clock integrity monitor (reference-oscillator comparison, glitch threshold, pipeline flush/reset response) and micro-TMR hardening for security-critical CSRs (mstatus, mepc, mtvec, PMP regs) to defend against physical fault-injection attacks</li>
        <li>Built complete hardware Root of Trust infrastructure: boot ROM with SHA-256/RSA-2048 image authentication, TRNG via prime-length ring oscillators (Zkr), and full Keystone TEE co-design (16 PMP CSRs, architectural state scrubbing on enclave entry/exit, debug port lockdown)</li>
        <li>Conducted area feasibility study using Synopsys VCS Design Compiler on TSMC 65nm PDK; designed AXI-Lite chip-to-board interface for FPGA-based bringup</li>
      </ul>
    </li>

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">RV-32IM Out-of-Order RISC-V Processor</span>
        <span class="project-date">Jan 2025 – May 2025</span>
      </div>
      <div class="project-tech">Computer Architecture Project · SystemVerilog, C++</div>
      <ul class="project-bullets">
        <li>Designed and verified a pipelined, out-of-order, N-way superscalar processor based on the RV32IM ISA, with explicit register renaming</li>
        <li>Implemented a split Load/Store Unit for speculative memory operations, branch predictors, and non-blocking pipelined cache, including functional coverage metrics to assess verification completeness</li>
        <li>Debugged RTL with waveform tracing using Verilator and Verdi; verification involved writing unit-level SystemVerilog testbenches and assertions to validate pipeline stages</li>
        <li>Performed synthesis and power-performance-timing (PPA) analysis using Synopsys Design Compiler; evaluated across multiple testcases for critical path delays, area constraints, and dynamic power efficiency</li>
      </ul>
    </li>

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">Graphics Engine</span>
        <span class="project-date">May 2024 – Aug 2024</span>
      </div>
      <div class="project-tech">Graphics Project · C++, Vulkan</div>
      <ul class="project-bullets">
        <li>Built a graphics pipeline from scratch using the Vulkan SDK, with over 6K lines of C++ code written across the entire codebase for low-latency rendering</li>
        <li>Implemented 5+ core graphics pipeline stages, including input assembly, rasterization, fragment shading, and framebuffer presentation</li>
        <li>Developed a system to automate Vulkan pipeline creation and manage 5+ shader modules across multiple render passes</li>
      </ul>
    </li>

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">Spiking Neural Network</span>
        <span class="project-date">Oct 2024 – Jan 2025</span>
      </div>
      <div class="project-tech">Hardware Synthesis & Neuromorphic Computing · SystemVerilog, FPGA</div>
      <ul class="project-bullets">
        <li>Researched neuromorphic architectures and deployed a spiking neural network on an FPGA trained on the Berkeley DROID Dataset for Robotic Manipulation</li>
        <li>Trained Leaky-Integrate-and-Fire (LIF) neuron weights in PyTorch, performed quantization for hardware compatibility, and mapped parameters to fixed-point representations</li>
        <li>Designed LIF neuron modules using shift-register counters to emulate membrane potential dynamics and developed inter-layer FIFO queues to stage asynchronous spike traffic</li>
        <li>Streamed multi-gigabyte testing data through the UART protocol to the FPGA and back, testing inference accuracy against PyTorch model</li>
      </ul>
    </li>

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">Audio Visualizer Theremin</span>
        <span class="project-date">Oct 2024 – Dec 2024</span>
      </div>
      <div class="project-tech">Hardware Synthesis & Verification · SystemVerilog, FPGA</div>
      <ul class="project-bullets">
        <li>Designed and implemented an FPGA-based SoC on Xilinx for real-time audio synthesis and VGA visualization, controlled via UART input; integrated a MicroBlaze soft processor with custom hardware modules (audio generator, VGA controller) for real-time processing</li>
        <li>Developed a modular SystemVerilog testbench framework for both component and SoC-level validation, featuring automated stimulus generation, self-checking monitors, and coverage tracking</li>
        <li>Validated and debugged designs in Vivado using assertions and waveform analysis</li>
      </ul>
    </li>

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">32-bit Operating System</span>
        <span class="project-date">Jan 2024 – May 2024</span>
      </div>
      <div class="project-tech">Systems Project · C, x86 Assembly, QEMU</div>
      <ul class="project-bullets">
        <li>Programmed a 32-bit Operating System with a 3-terminal interface for IA-32 architecture using x86 assembly and C</li>
        <li>Developed a 2-Radix Paging System and Allocator for both 4KB and 4MB pages</li>
        <li>Constructed a simple virtual file-system and over 10 system call handlers to interface with the kernel and the physical file-system</li>
        <li>Designed a Round Robin Scheduling algorithm for switching between various userspace programs</li>
      </ul>
    </li>

    <li class="project-item">
      <div class="project-meta">
        <span class="project-name">Convolutional Neural Network Optimization</span>
        <span class="project-date">Jan 2024 – May 2024</span>
      </div>
      <div class="project-tech">Parallel Algorithm & Profiling Project · CUDA, C++</div>
      <ul class="project-bullets">
        <li>Researched and implemented a scalable CNN forward pass layer using CUDA, and verified optimization efficiency through the use of Nvidia Nsight Systems and Compute</li>
        <li>Optimized convolutions through the use of streams, shared memory, constant memory, matrix unrolling, tensor cores, and custom half2 data types</li>
      </ul>
    </li>

  </ul>
</section>

<section class="section">
  <h2 class="section-header">skills</h2>
  <div class="skills-grid">
    <div class="skill-row">
      <span class="skill-label">languages</span>
      <span class="skill-value">SystemVerilog, Verilog, C, C++, CUDA C++, Python</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">eda & tools</span>
      <span class="skill-value">Synopsys Design Compiler, VCS, Verdi, Verilator, Yosys, Spyglass, CDC/RDC Analysis, Vivado, Vitis, Git, Docker</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">gpu & ml</span>
      <span class="skill-value">Nvidia Nsight Compute/Systems, PyTorch, CUDA, Vulkan</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">areas</span>
      <span class="skill-value">ASIC &amp; RTL Design, Hardware–Software Co-design, Computer Architecture, VLSI Design, Logic Synthesis, Parallel Programming</span>
    </div>
  </div>
</section>
