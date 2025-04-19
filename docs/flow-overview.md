# Flow Overview

```mermaid
flowchart TD
    A[Symptom Selection (Criterion B)]
    B[Modality: Typical / Other / None]
    C{Other selected?}
    D[Route: Only Other → /other-modality/]
    E[Route: Other + Typical → /plus-other-modality-summary/]
    F[Route: Typical only → /aura-characteristics/]
    G[Criterion C Quiz]
    H[PDF Generation + Summary]

    A --> B --> C
    C -->|Yes, only other| D
    C -->|Yes, both| E
    C -->|No| F --> G --> H
