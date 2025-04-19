# Modality Selection (Criterion B)

**Flow Start:** CTA button on homepage → `/aura-symptom-check/modality`

This page captures the user's self-reported aura symptoms using checkboxes (vision, sensory, etc.). It's implemented via a Hugo shortcode (`criterionB`) injected into `content/aura-symptom-check/modality.md`.

### Frontend
- Hugo `modality.md` → includes `{{< criterionB >}}` shortcode
- JavaScript logic evaluates selection and stores values:
  - `localStorage.setItem("selectedModalities", JSON.stringify(selected))`
  - Next step is set dynamically based on user input (core aura / other / none).

### Flow Logic
- **Core aura selected** → Continue to `/aura-symptom-check/aura-characteristics/`
- **Only other** → Go to `/aura-symptom-check/other-modality/`
- **Core + other** → Go to `/aura-symptom-check/plus-other-modality-summary/`
- **None** → Redirect to `/aura-symptom-check/no-aura/`

### Mermaid Diagram
```mermaid
flowchart TD
    A[Start: Homepage CTA] --> B[Modality Selection]
    B --> |Core Aura Only| C[Aura Characteristics]
    B --> |Core + Other| D[Plus-Other Summary]
    B --> |Only Other| E[Other Modality Flow]
    B --> |None| F[No Aura Message]
