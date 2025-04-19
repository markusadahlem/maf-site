# Hugo Component Locations

- **Symptom Selection**:  
  File: `/content/aura-symptom-check/criterionb.md`  
  JS: inline script, updates `localStorage.setItem('selectedModalities')`

- **Other Flow Check**:  
  File: `/content/aura-symptom-check/plus-other-modality-summary.md`  
  LocalStorage used: `selectedModalities`, `otherDescription`, `otherSymptomIsSimilar`

- **PDF Logic**:  
  Shared JS: `/static/js/generateAuraReport.js`

- **Quiz Logic (C-Criterion)**:  
  File: `criterioncmeet.md` and `criterioncnotmeet.md`  
  JS stores: `auraCharacteristicsAnswers`
