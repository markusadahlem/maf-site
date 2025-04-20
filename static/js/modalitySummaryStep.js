document.addEventListener("DOMContentLoaded", () => {
  const currentModalities = JSON.parse(
    localStorage.getItem("selectedModalities") || "[]",
  );

  console.log("✅ Modalities:", currentModalities);
  console.log("🧪 visualAura:", localStorage.getItem("visualAura"));

  const output = document.getElementById("summaryOutput");
  const continueBtn = document.getElementById("continueBtn");

  const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");

  if (!Object.keys(data).length) {
    output.innerHTML =
      "<p>❗ No data found. Please go through the previous steps first.</p>";
    continueBtn.style.display = "none";
    return;
  }

  const labels = {
    visual: "Visual Aura",
    retinal: "Retinal Aura",
    sensory: "Sensory Aura",
    speech: "Speech/Language Aura",
    motor: "Motor Aura",
    brainstem: "Brainstem Aura",
  };

  const html = Object.entries(data)
    .map(([modality, entry]) => {
      const title = labels[modality] || modality;
      const selectedItems = entry.selected || entry.symptoms || [];
      const description = entry.description || entry.otherDescription || "";

      const answers = selectedItems.map((v) => `<li>${v}</li>`).join("");
      let descHTML = "";
      if (description.trim()) {
        descHTML = `<p><em>Other:</em> ${description.trim()}</p>`;
      }

      return `
        <div class="modality-summary">
          <h3>${title}</h3>
          <ul>${answers}</ul>
          ${descHTML}
        </div>
      `;
    })
    .join("<hr>");

  output.innerHTML = html;

  continueBtn.addEventListener("click", () => {
    const next = continueBtn.getAttribute("data-next");
    window.location.href = next;
  });
});
