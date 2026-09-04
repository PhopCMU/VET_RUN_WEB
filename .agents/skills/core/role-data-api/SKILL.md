---
name: role-data-api
description: How to design and place API clients and data services for this repo.
---

When to use

- Implement API clients or modify network logic.

Steps

- Create small, testable functions under `src/services/**` and expose a minimal surface for callers.

## Update notes

- When a form displays API-derived prices across multiple steps, calculate every line from its selected model ID and keep delivery-fee rules consistent in each view.
