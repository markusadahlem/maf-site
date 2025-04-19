document.addEventListener("DOMContentLoaded", async () => {
  const modalities = JSON.parse(
    localStorage.getItem("selectedModalities") || "[]",
  );

  const typical = modalities.filter((m) =>
    ["visual", "sensory", "speech", "motor", "brainstem", "retinal"].includes(
      m,
    ),
  );
  const hasOther = modalities.includes("other");

  document.getElementById("selectedTypical").textContent =
    typical.join(", ") || "[none]";

  const btn = document.getElementById("generatePdfBtn");

  btn.addEventListener("click", () => {
    const otherText = document.getElementById("otherDescription").value;

    // Save inputs to localStorage so generateAuraReport can use it later
    localStorage.setItem(
      "selectedModalities",
      JSON.stringify([...typical, "other"]),
    );
    localStorage.setItem("otherDescription", otherText);

    // Redirect to the next step
    window.location.href = "/aura-symptom-check/aura-characteristics/";
  });
});
