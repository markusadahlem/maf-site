// File: /js/aura-symptom-check/modality/dataRetrieval.js

export function getDataFromLocalStorage() {
  try {
    const data = JSON.parse(localStorage.getItem("criterionBAnswers") || "{}");
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const acuteChronicData = JSON.parse(
      localStorage.getItem("acuteChronic") || "{}",
    );
    const acuteChronicAnswers = JSON.parse(
      localStorage.getItem("acuteChronicAnswers") || "{}",
    );
    const auraCharacteristicsAnswers = JSON.parse(
      localStorage.getItem("auraCharacteristicsAnswers") || "[]",
    );

    console.log(
      "Raw Data from localStorage (criterionBAnswers):",
      localStorage.getItem("criterionBAnswers"),
    );
    console.log(
      "Raw Data from localStorage (userInfo):",
      localStorage.getItem("userInfo"),
    );
    console.log(
      "Raw Data from localStorage (acuteChronic):",
      localStorage.getItem("acuteChronic"),
    );
    console.log(
      "Raw Data from localStorage (acuteChronicAnswers):",
      localStorage.getItem("acuteChronicAnswers"),
    );
    console.log(
      "Raw Data from localStorage (auraCharacteristicsAnswers):",
      localStorage.getItem("auraCharacteristicsAnswers"),
    );

    console.log("Parsed Data from localStorage (criterionBAnswers):", data);
    console.log("Parsed Data from localStorage (userInfo):", userInfo);
    console.log(
      "Parsed Data from localStorage (acuteChronic):",
      acuteChronicData,
    );
    console.log(
      "Parsed Data from localStorage (acuteChronicAnswers):",
      acuteChronicAnswers,
    );
    console.log(
      "Parsed Data from localStorage (auraCharacteristicsAnswers):",
      auraCharacteristicsAnswers,
    );

    return {
      data,
      userInfo,
      acuteChronicData,
      acuteChronicAnswers,
      auraCharacteristicsAnswers,
    };
  } catch (error) {
    console.error("Error retrieving data from localStorage:", error);
    return {};
  }
}
