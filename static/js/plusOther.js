document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const modalities = params.getAll("modality");

  const typical = modalities.filter((m) =>
    ["visual", "sensory", "speech", "motor", "brainstem", "retinal"].includes(
      m,
    ),
  );
  const hasOther = modalities.includes("other");

  document.getElementById("selectedTypical").textContent =
    typical.join(", ") || "[none]";

  if (!hasOther || typical.length === 0) {
    alert(
      "Something went wrong — expected both 'Other' and a typical modality.",
    );
    return;
  }

  const btn = document.getElementById("generatePdfBtn");
  btn.addEventListener("click", async () => {
    const otherText = document.getElementById("otherDescription").value;

    const data = {
      flowType: "plus-other",
      modalities: [...typical, "other"],
      otherDescription: otherText,
    };

    if (typeof generateAuraReport !== "function") {
      alert("generateAuraReport() not loaded.");
      return;
    }

    await generateAuraReport(data.flowType, data);
  });
});
