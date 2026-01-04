const experiences = [
    {
      role: "Incoming ASIC Design Intern",
      company: "NVIDIA",
      location: "Santa Clara, CA",
      time: "May 2026 – August 2026",
      bullets: [
        "Bullets to be formed after internship completion"
      ]
    },
    {
      role: "Computer Architecture (ECE 411) Course Staff",
      company: "UIUC Computer Organization and Design",
      location: "Champaign, IL",
      time: "August 2025 – Present",
      bullets: [
        "Trained students in designing and implementing out-of-order RISC-V processors with features like non-blocking pipeline caching, branch prediction & recovery, out-of-order load/store units, and superscalar execution",
        "Mentored students on RTL debugging across pipeline and cache projects, providing targeted design and verification support",
        "Orchestrated competition with fellow course staff to profile and test 30+ RISC-V processors, ranking them on Power, Performance, and Area (PPA)"
      ]
    },
    {
      role: "Graphics Engineering Intern",
      company: "Aechelon Technology",
      location: "Roeland Park, KS",
      time: "May 2025 – August 2025",
      bullets: [
        "Integrated SMPTE ST 2110-compliant UDP transmission into the pC-Nova platform via NVIDIA Rivermax SDK, using GPUDirect and RDMA to eliminate CPU bottlenecks",
        "Implemented 5 GPU kernels and custom fragment shaders to transform output media into multiple color spaces (YUV, sRGB) for heterogeneous display systems"
      ]
    },
    {
      role: "Returning Software Development Intern",
      company: "CME Group",
      location: "Chicago, IL",
      time: "May 2024 – November 2024",
      bullets: [
        "Led a team of 4 interns developing an application to monitor project deployments to on-prem and cloud servers for abnormal resource allocations and stalls",
        "Won first place in an internal CME Hackathon by developing a low-latency trading algorithm, earning $1000"
      ]
    },
    {
      role: "Engineering Tutor",
      company: "Eta Kappa Nu Honor Society (HKN)",
      location: "Champaign, IL",
      time: "January 2024 – Present",
      bullets: [
        "Inducted as a top 20% student in the department; tutor peers in LC-3 assembly, C programming, signal processing, multivariable calculus, and architecture design",
        "Create custom study guides and host review sessions across 5+ engineering courses, supporting 100+ students in exam preparation"
      ]
    },
    {
      role: "Software Development Intern",
      company: "CME Group",
      location: "Champaign, IL",
      time: "March 2023 – August 2023",
      bullets: [
        "Supervised a team of 5 interns in creating an internal C++ library to validate research papers predicting stock prices from future market data",
        "Configured a CME security-compliant remote development environment and integrated 3000+ lines into the CME codebase"
      ]
    },
    {
      role: "Social Chair",
      company: "Association for Computing Machinery (ACM)",
      location: "Champaign, IL",
      time: "May 2023 – May 2024",
      bullets: [
        "Organized and hosted 50+ social events connecting engineering students from freshmen to graduate levels",
        "Expanded organization membership by 300+ students via active community engagement and cross-disciplinary outreach",
        "Collaborated with 4+ campus organizations to plan minority-inclusive events and co-host a large-scale joint school dance",
        "Assisted in coordinating 12+ professional networking events enabling students to engage with industry professionals across computing disciplines"
      ]
    },
    {
      role: "Member",
      company: "SIGArch",
      location: "Champaign, IL",
      time: "January 2023 – Present",
      bullets: [
        "Facilitated technical discussions and reading groups on modern CPUs, GPUs, and emerging accelerator designs",
        "Coordinated architecture-focused talks and workshops featuring graduate students and faculty",
        "Collaborated with computing organizations to host events bridging architecture with systems, compilers, and hardware-software co-design",
        "Supported professional and academic networking events connecting undergraduates with graduate researchers and industry professionals"
      ]
    },
    {
      role: "Undergraduate Hardware Research Assistant",
      company: "PlatformX",
      location: "Champaign, IL",
      time: "December 2024 – Present",
      bullets: [
        "Designed architectural simulators to profile AI wafer-scale chip designs, improving bandwidth utilization and compute efficiency through heterogeneous core designs",
        "Extended GPGPU-Sim (cycle-accurate simulator) with C++ and automation scripts to enable detailed profiling of memory access patterns and interconnect bandwidth",
        "Applied simulator extensions to investigate architectural tradeoffs across high-speed interconnect designs in GPU Processing Clusters (GPCs), focusing on interactions between L1 cache slices and streaming multiprocessors optimized for AI workloads"
      ]
    }
  ];
  
  // ===== DOM =====
  const nodes = document.querySelectorAll(".timeline-node");
  const detail = document.getElementById("timeline-detail");
  
  // ===== Render Function =====
  function renderExperience(index) {
    const exp = experiences[index];
  
    // Active bulb
    nodes.forEach(n => n.classList.remove("active"));
    nodes[index].classList.add("active");
  
    // Render detail panel
    detail.innerHTML = `
      <div class="timeline-detail">
        <h3>${exp.role}</h3>
        <div class="org">${exp.company} — ${exp.location}</div>
        <div class="time">${exp.time}</div>
        <ul>
          ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
    `;
  
    // Persist last viewed experience (optional but good)
    sessionStorage.setItem("timelineIndex", index);
  }
  
  // ===== Event Binding =====
  nodes.forEach((node, index) => {
    node.addEventListener("mouseenter", () => renderExperience(index));
    node.addEventListener("click", () => renderExperience(index));
  });
  
  // ===== Init =====
  const savedIndex = sessionStorage.getItem("timelineIndex");
  const startIndex = savedIndex !== null ? Number(savedIndex) : 0;
  
  // NVIDIA loads by default
  renderExperience(startIndex);
  