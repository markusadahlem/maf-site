const criterionBFlow = [
  {
    modality: "visual",
    title: "2.1 Visual aura",
    type: "checkbox",
    question: "Select any visual disturbances you have ever experienced:",
    options: [
      "Shimmering or flickering lights",
      "Zig‑zag or wavy lines",
      "Blurred or tunnel vision",
      "Blind spots (scotoma)",
      "Geometric shapes or patterns",
      "Other (describe below)",
    ],
    allowText: true,
  },
  {
    modality: "retinal",
    title: "2.2 Retinal aura",
    type: "radio",
    question:
      "Have you ever had temporary vision loss in one eye (lasting <60 minutes)?",
    options: ["Yes", "No", "Unsure"],
  },
  // ... repeat for sensory, speech, motor, brainstem
];
