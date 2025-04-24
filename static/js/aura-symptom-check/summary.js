document.addEventListener("DOMContentLoaded", () => {
  console.log("Script is loaded"); // Debugging line to confirm script is loaded

  const output = document.getElementById("summaryOutput");
  const continueBtn = document.getElementById("continueBtn");

  console.log("Output element:", output); // Debugging line
  console.log("Continue button element:", continueBtn); // Debugging line

  // Include other modules
  import("./dataRetrieval.js").then((module) => {
    const { getDataFromLocalStorage } = module;
    const data = getDataFromLocalStorage();

    import("./summaryGeneration.js").then((module) => {
      const { generateNarrativeSummary } = module;
      output.innerHTML = generateNarrativeSummary(data);
    });
  });

  continueBtn.addEventListener("click", () => {
    const next = continueBtn.getAttribute("data-next");
    window.location.href = next;
  });
});
