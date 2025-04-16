# Build your own plugin

## Plugin Structure

## Entrypoints

## APIs

- This codebase provides a layer of abstraction to help you start building your own plugin without low-level headaches, APIs design follows the **Observer Pattern**.

- Capabilities:
  - Intercept network traffic, including blocking, logging, and modifying requests/responses payloads
  - Observe the page routing events
  - Observe common DOM elements (query boxes, homepage threads, etc.)
  - Interact with low-level DOM objects (the React fiber tree) to extract information that might not be rendered as html elements
