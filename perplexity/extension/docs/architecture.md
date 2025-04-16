# Architecture

This is a browser extension that heavily modifies (monkey-patches) Perplexity AI web pages to enhance functionality. Modularity is key to the extension's design; in other words, each feature (plugin) should be able to work with as few dependencies as possible.

## Core Architecture Components

### Contexts

The extension operates in FOUR execution contexts:

- **Extension UI** - User interfaces like options page, popup, and sidepanel
- **Background Service Worker** - Long-running script that handles tasks even when the extension UI is not open
- **Content Scripts** - Scripts injected into Perplexity AI web pages to enhance functionality
- **Main-world Content Scripts** - Scripts that run in Perplexity AI web pages' document Javascript context (able to access low level objects like the `next` router, and the React fiber tree)

Communication between these contexts is facilitated by `webext-bridge` (100% type safety).

### Directory Structure

```
src/
├── assets/         # Static assets
├── components/     # Shared UI components
├── data/           # Shared data sources and constants
├── entrypoints/    # Entry points for different contexts
│   ├── background/       # Background service worker
│   ├── content-scripts/  # Content scripts
│   └── options-page/     # Options page UI
├── hooks/          # Shared React hooks
├── plugins/        # Modular feature implementations
│   ├── _api/       # Core Abstractions
│   ├── _core/      # Core Plugins
│   └── */          # Individual plugins
├── services/       # Shared services
├── types/          # Shared TypeScript type definitions
└── utils/          # Shared utility functions
```

## Plugin System

The architecture uses a modular plugin system to implement features independently:

- Each plugin resides in its own directory under `src/plugins/`.
- Plugins can be enabled/disabled. When a plugin is disabled, its side effects should be unloaded and any dependent plugins should also be disabled.
- Plugins use a centralized registry system for discovery, configuration, and dependency management.
  - [Plugin Registry](../src/data/plugin-registry/index.ts)
  - [Plugin Loaders Registry](../src/entrypoints/content-scripts/loaders.ts)
  - [Settings UI](../src/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader.ts)
  - Refer to [Build your own plugin](./build-your-own-plugin.md) for more details

### Plugin Structure

The folder structure is similar to a typical feature-based structure, where each feature folder contains its own components, hooks, services, types, utils, and data:

```
plugins/feature-name/
├── components/   # UI components
├── hooks/        # React hooks
├── index.ts      # Entry point
├── store.ts      # State management
├── utils.ts      # Utility functions
└── types.ts      # Type definitions
```

## Dependency Boundaries

The project enforces strict dependency boundaries via ESLint:

1. **Shared** - Common code including components, hooks, services, types, utils, and data
2. **Entrypoint** - Entry points for different contexts (background, content scripts, options)
3. **Core Plugin** - Core plugin functionality and APIs
4. **Plugin** - Individual feature implementations

Dependency flow is strictly controlled:

`A → A, B`: A can only import dependencies from itself or B

- `Shared` → `Shared`, `Core Plugin`
- `Entrypoint` → `Entrypoint`, `Shared`, `Core Plugin`, `Plugin`
- `Core Plugin` → `Shared`, `Core Plugin`, `Plugin`
- `Plugin` → `Shared`, `Core Plugin`, `Plugin`

```mermaid
flowchart TD
    Entrypoint([Entrypoint])
    Shared([Shared])
    CorePlugin([Core Plugin])
    Plugin([Plugin])

    subgraph Layer1["Layer 1"]
        direction LR
        Entrypoint
    end

    subgraph Layer2["Layer 2"]
        direction LR
        Shared --- CorePlugin
    end

    subgraph Layer3["Layer 3"]
        direction LR
        Plugin
    end

    Entrypoint -->|imports| Shared
    Entrypoint -->|imports| CorePlugin
    Entrypoint -->|imports| Plugin

    Plugin -->|imports| Shared
    Plugin -->|imports| CorePlugin

    CorePlugin -->|imports| Shared
    CorePlugin -->|imports| Plugin

    Shared -->|imports| CorePlugin

    classDef entrypoint fill:#d4f1f9,stroke:#1a6f85,stroke-width:2px,color:#333
    classDef shared fill:#d5f5e3,stroke:#1e8449,stroke-width:2px,color:#333
    classDef coreplugin fill:#fcf3cf,stroke:#b7950b,stroke-width:2px,color:#333
    classDef plugin fill:#f5d5f0,stroke:#884ea0,stroke-width:2px,color:#333
    classDef layer fill:none,stroke:#999,stroke-dasharray:5 5,color:#666

    class Entrypoint entrypoint
    class Shared shared
    class CorePlugin coreplugin
    class Plugin plugin
    class Layer1,Layer2,Layer3 layer
```

Files are categorized based on their location:

- Shared: `src/*.ts`, `src/components/**/*`, `src/assets/**/*`, `src/hooks/**/*`, `src/services/**/*`, `src/types/**/*`, `src/utils/**/*`, `src/data/**/*`
- Entrypoint: `src/entrypoints/**/*`
- Core Plugin: `src/plugins/_api/**/*`, `src/plugins/_core/**/*`
- Plugin: `src/plugins/<plugin-name>/**/*`

## Data

- Persistence via Extension's Storage and IndexedDB

## Technology Stack

See [Tech Stack](./tech-stack.md)
