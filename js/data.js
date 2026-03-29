// ============================================================
//  PORTFOLIO DATA — Edit everything here, nowhere else.
// ============================================================

// biome-ignore lint/correctness/noUnusedVariables: used by render.js
var PORTFOLIO = {

  // ── PERSONAL ──────────────────────────────────────────────
  name:       "Marcus Imbigula",
  initials:   "MGI",
  role:       "Mechanical Engineer",
  location:   "Nairobi, Kenya",
  email:      "imbigulamarcus99@gmail.com",
  github:     "https://github.com/ImTheMarcus",
  linkedin:   "https://linkedin.com/in/imbigula",
  bio: [
    "I'm a Mechanical Engineer with a deep focus on robotics, mechanical design, and electronic systems integration. With hands-on experience across the full engineering stack — from CAD modeling and FEA simulation to PCB design and firmware — I bring ideas from concept to working prototype.",
    "My work sits at the intersection of disciplines: writing code that controls hardware I've designed, running simulations that inform my builds, and iterating fast with a bias toward physical results."
  ],
  tagline: "Building What Others Only Imagine",

  // Typing animation phrases on the hero
  typingPhrases: [
    "Mechanical Engineer",
    "Robotics Designer",
    "Electronics Instructor",
    "Electronics Enthusiast",
    "Mechanical Systems Architect",
    "CAD & Simulation Expert"
  ],

  // ── STATS (hero section) ──────────────────────────────────
  stats: [
    { number: 2,   suffix: "+", label: "Years Experience" },
    { number: 5,  suffix: "+", label: "Projects Delivered" },
    { number: 3,   suffix: "",  label: "Disciplines" },
    { number: 100, suffix: "%", label: "Passion" }
  ],

  // ── ABOUT TAGS ────────────────────────────────────────────
  tags: [
    { label: "Robotics",          accent: true  },
    { label: "Mechanical Design", accent: true  },
    { label: "Electronics",       accent: true  },
    { label: "CAD / SolidWorks",  accent: false },
    { label: "FEA / CFD",         accent: false },
    { label: "PCB Design",        accent: false },
    { label: "Embedded Systems",  accent: false },
    { label: "ROS / ROS2",        accent: false },
    { label: "Python / C++",      accent: false },
    { label: "3D Printing",       accent: false },
  ],

  // ── SKILLS ────────────────────────────────────────────────
  skills: [
    {
      icon: "⚙️",
      title: "Mechanical Design",
      subtitle: "CAD · Simulation · Manufacturing",
      items: [
        { name: "SolidWorks / Fusion 360",   level: "full" },
        { name: "FEA & Structural Analysis", level: "full" },
        { name: "CFD / Thermal Simulation",  level: "med"  },
        { name: "GD&T & Tolerancing",        level: "full" },
        { name: "Machining & Sheet Metal",   level: "med"  },
        { name: "3D Printing / Prototyping", level: "full" },
      ]
    },
    {
      icon: "🤖",
      title: "Robotics",
      subtitle: "Kinematics · Control · Autonomy",
      items: [
        { name: "ROS / ROS2",               level: "full" },
        { name: "Robot Kinematics",         level: "full" },
        { name: "Motion Planning",          level: "med"  },
        { name: "Sensor Fusion",            level: "med"  },
        { name: "Servo & Stepper Control",  level: "full" },
        { name: "Computer Vision (OpenCV)", level: "med"  },
      ]
    },
    {
      icon: "⚡",
      title: "Electronics",
      subtitle: "PCB · Embedded · Firmware",
      items: [
        { name: "PCB Design (KiCad / Altium)", level: "full" },
        { name: "Embedded C / C++",            level: "full" },
        { name: "Arduino / STM32 / ESP32",     level: "full" },
        { name: "RTOS / Bare Metal",           level: "med"  },
        { name: "Power Electronics",           level: "med"  },
        { name: "Signal & System Analysis",    level: "full" },
      ]
    }
  ],

  // ── WORK HISTORY ──────────────────────────────────────────
  work: [
    {
      period:  "May 2025 — Present",
      role:    "Robotics & Electronics Instructor",
      company: "Ubunifu College · Full-time",
      desc:    "Leading design of automated mechanical systems for industrial applications. Responsible for end-to-end engineering: from concept design and FEA simulation to PCB layout, firmware, and system integration.",
      tags:    ["SolidWorks", "ROS2", "Altium", "Team Lead"]
    },
    {
      period:  "Jan 2024 — May 2024",
      role:    "Mechanical Engineering Internship",
      company: "Kenya Ports Authority · Internship",
      desc:    "Designed precision mechanical components for aerospace applications. Ran FEA studies, managed vendor relationships, and ensured GD&T compliance across multi-part assemblies.",
      tags:    ["FEA", "GD&T", "Fusion 360", "Aerospace"]
    },
    {
      period:  "Oct 2023 — Dec 2023",
      role:    "Mechanical Engineering Intern",
      company: "KIRDI · Internship",
      desc:    "Supported senior engineers on R&D projects. Built test rigs, wrote data acquisition scripts, and contributed to the mechanical design of a prototype UAV frame.",
      tags:    ["Python", "Prototyping", "UAV"]
    },
    {
      period:  "2021 — 2022",
      role:    "IBL Attachment",
      company: "The Technical University of Kenya · Attachment",
      desc:    "Supported senior engineers on R&D projects. Built test rigs, wrote data acquisition scripts, and contributed to the mechanical design of a prototype UAV frame.",
      tags:    ["Python", "Prototyping", "UAV"]
    }
  ],

  // ── PROJECTS ──────────────────────────────────────────────
  // Edit projects here. Optional detail-page fields (add to any project):
  //   year, liveUrl, overview (array of paragraphs), model (STL path),
  //   images (array of image paths), code or codeSnippet (see CONTENT-GUIDE.md)

  projects: [
    {
      emoji:    "🦾",
      tag:      "Robotics",
      category: "robotics",
      title:    "6-DOF Robotic Arm",
      status:   "Completed",
      wip:      false,
      year:     "2024",
      desc:     "Designed and built a 6-axis articulated robotic arm with custom servo controllers and a full ROS2 software stack. Capable of pick-and-place tasks with sub-millimeter repeatability.",
      overview: [
        "Designed and built a 6-axis articulated robotic arm with custom servo controllers and a full ROS2 software stack. Capable of pick-and-place tasks with sub-millimeter repeatability.",
        "Add more detail here about your process, challenges, and results. This is what visitors will read on the full project page."
      ],
      highlights: [
        "Custom PCB motor driver with current sensing",
        "Forward/inverse kinematics solver in C++",
        "ROS2 MoveIt2 integration for motion planning",
        "3D-printed structural components (PETG/CF)"
      ],
      stack:  ["ROS2", "C++", "SolidWorks", "KiCad"],
      github: "https://github.com/yourusername",
      link:   "#",
    },
    {
      emoji:    "🛞",
      tag:      "Robotics · Mechanical",
      category: "robotics mechanical",
      title:    "Autonomous Mobile Platform",
      status:   "Completed",
      wip:      false,
      desc:     "A differential-drive robot platform designed for indoor navigation research. Features a custom-welded aluminum chassis, onboard compute (Jetson Nano), and LiDAR-based autonomous navigation.",
      highlights: [
        "Welded aluminum chassis designed in Fusion 360",
        "SLAM-based mapping with Nav2 stack",
        "Custom power distribution board",
        "Integrated IMU + wheel odometry fusion"
      ],
      stack:  ["ROS", "SLAM", "Fusion 360"],
      github: "https://github.com/yourusername",
      link:   "#"
    },
    {
      emoji:    "⚡",
      tag:      "Electronics",
      category: "electronics",
      title:    "BLDC Motor Controller PCB",
      status:   "Completed",
      wip:      false,
      desc:     "4-layer PCB for high-power brushless DC motor control. Implements FOC with embedded STM32 microcontroller, CAN bus, and full thermal protection.",
      highlights: [
        "Field-Oriented Control (FOC) algorithm",
        "STM32G4 with hardware floating point",
        "CAN FD communication interface",
        "Overcurrent, overvoltage & thermal protection"
      ],
      stack:  ["KiCad", "STM32", "CAN FD"],
      github: "https://github.com/yourusername",
      link:   "#"
    },
    {
      emoji:    "🔩",
      tag:      "Mechanical Design",
      category: "mechanical",
      title:    "Precision Gripper Assembly",
      status:   "In Progress",
      wip:      true,
      desc:     "A compliant two-finger gripper designed for handling delicate objects using a flexure-based mechanism for soft, controlled grasping.",
      highlights: [
        "Flexure-based compliant mechanism",
        "FEA-validated stress distribution",
        "Single actuator design",
        "SLA-printed in Tough Resin"
      ],
      stack:  ["SolidWorks", "FEA", "SLA Print"],
      github: "",
      link:   "#"
    },
    {
      emoji:    "📡",
      tag:      "Electronics · Software",
      category: "electronics software",
      title:    "Wireless Sensor Network",
      status:   "Completed",
      wip:      false,
      desc:     "ESP32-based sensor nodes with custom PCBs that collect environmental data and transmit over MQTT to a central dashboard.",
      highlights: [
        "Custom ESP32 PCB with LiPo charging",
        "MQTT over WiFi / LoRa fallback",
        "Node-RED dashboard visualization",
        "Deep sleep for battery life optimization"
      ],
      stack:  ["ESP32", "MQTT", "KiCad"],
      github: "https://github.com/yourusername",
      link:   "#"
    },
    {
      emoji:    "🚁",
      tag:      "Mechanical · Robotics",
      category: "mechanical robotics",
      title:    "Custom UAV Frame",
      status:   "Completed",
      wip:      false,
      desc:     "Carbon fiber quadrotor frame optimized for payload capacity and vibration isolation, with integrated motor mount and gimbal isolation system.",
      highlights: [
        "Carbon fiber tube & plate construction",
        "FEA-optimized arm geometry",
        "Vibration-isolated electronics bay",
        "Modular payload attachment system"
      ],
      stack:  ["Fusion 360", "Carbon Fiber", "FEA"],
      github: "",
      link:   "#"
    }
  ],

  // ── BLOG POSTS ────────────────────────────────────────────
  posts: [
    {
      category: "Robotics",
      date:     "March 15, 2025",
      title:    "How I Built a 6-DOF Arm from Scratch: Lessons Learned",
      excerpt:  "Designing a robotic arm is part mechanical puzzle, part electrical headache, and fully humbling. Here's an honest breakdown of what went wrong, what worked, and what I'd do differently.",
      readTime: "12 min read",
      link:     "#",
      featured: true
    },
    {
      category: "Electronics",
      date:     "January 22, 2025",
      title:    "PCB Layout Rules I Wish I Knew Earlier",
      excerpt:  "Ground planes, trace width, and why impedance matching isn't just for RF engineers. Here are the layout principles I now consider non-negotiable.",
      readTime: "8 min read",
      link:     "#",
      featured: false
    },
    {
      category: "Mechanical",
      date:     "November 8, 2024",
      title:    "FEA Is Not a Magic Box",
      excerpt:  "Garbage in, garbage out. Here's how to set up your simulations so the results actually mean something.",
      readTime: "9 min read",
      link:     "#",
      featured: false
    },
    {
      category: "Robotics",
      date:     "September 3, 2024",
      title:    "Getting Started with ROS2: A Real Engineer's Perspective",
      excerpt:  "Most ROS2 tutorials assume a pristine Ubuntu install and infinite patience. Here's how I actually got productive with ROS2 on a real project.",
      readTime: "15 min read",
      link:     "#",
      featured: false
    },
    {
      category: "Design",
      date:     "July 17, 2024",
      title:    "The Case for Over-Engineering Your Prototypes",
      excerpt:  "Everyone says keep it simple. But there's a strong argument for building your first prototype to a higher spec than you think you need.",
      readTime: "6 min read",
      link:     "#",
      featured: false
    }
  ]

};