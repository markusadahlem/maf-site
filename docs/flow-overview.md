# Flow Overview

```mermaid
flowchart TD
    A --> B --> C
    C -->|Yes, only other| D
    C -->|Yes, both| E
    C -->|No| F --> G --> H
