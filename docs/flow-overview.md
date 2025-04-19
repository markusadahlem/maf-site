# Flow Overview

```mermaid
flowchart TD
    A[Symptom Selection (Criterion B)] --> B{Does the symptom match known types?}
    B -- Yes --> C[Continue to Aura Characteristics (Criterion C)]
    B -- No --> D[Other Modality Path]

    A --> B --> C
    C -->|Yes, only other| D
    C -->|Yes, both| E
    C -->|No| F --> G --> H
