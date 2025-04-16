# Dependency Manager

A lightweight, type-safe distributed dependency management utility.

## Features

- **Type-safe dependency injection**: First-class support for TypeScript
- **Dependency resolution**: Automatically resolves and loads dependencies in the correct order
- **Parallel loading**: Efficiently loads independent dependencies and dependency levels in parallel using `loadAll`
- **Circular dependency detection**: Detects and handles circular dependencies
- **Synchronous & asynchronous loaders**: Flexibility to use both synchronous and asynchronous dependency loaders
- **Multiple instances**: Create multiple AsyncDependencyRegistry instances for isolated dependency graphs
- **Configurable logging**: Control log verbosity with the verbose option, including detailed state transitions and timing metrics
- **Modular architecture**: Designed for dependencies to be distributed across multiple files and modules

## Usage

### Creating a Dependency Manager

First, define a registry file and extend the `DependencyRegistry` interface with your dependencies:

```typescript
// registry.ts
import { AsyncDependencyRegistry } from "@/async-dep-manager";
import { DependencyRegistry } from "@/async-dep-manager.types";

// Define your registry interface
export interface YourAppRegistry extends DependencyRegistry {
  // Your custom dependencies will be defined here
}

// Create a dependency manager instance with your registry type
export function createAsyncDependencyRegistry() {
  return AsyncDependencyRegistry.create<YourAppRegistry>({
    verbose: false, // Set to true for more detailed logging
  });
}
```

### Modular Dependency Registration

The AsyncDependencyRegistry is designed for a modular architecture where dependencies are defined and registered in their respective feature files. This approach provides several benefits:

- **Code organization**: Each feature manages its own dependencies
- **Separation of concerns**: Dependencies are defined close to where they're implemented
- **Improved maintainability**: Changes to a feature's dependencies only affect that feature's file
- **On-demand loading**: Features can be loaded only when needed

Here's how to extend your registry in feature-specific files:

```typescript
// feature-a-dependencies.ts
import { createAsyncDependencyRegistry } from "./registry";

// Extend the registry with this feature's dependencies
declare module "./registry" {
  interface YourAppRegistry {
    featureAConfig: { apiKey: string };
    featureAService: { getData: () => Promise<unknown> };
  }
}

// Get the dependency manager instance
const asyncDependencyRegistry = createAsyncDependencyRegistry();

// Register this feature's dependencies
asyncDependencyRegistry.register({
  id: "featureAConfig",
  dependencies: [],
  loader: () => ({ apiKey: "feature-a-api-key" }),
});

asyncDependencyRegistry.register({
  id: "featureAService",
  dependencies: ["featureAConfig"],
  loader: (deps) => ({
    getData: async () => {
      console.log(`Using API key: ${deps.featureAConfig.apiKey}`);
      return { result: "Feature A data" };
    },
  }),
});

// feature-b-dependencies.ts
import { createAsyncDependencyRegistry } from "./registry";

// Extend the registry with this feature's dependencies
declare module "./registry" {
  interface YourAppRegistry {
    featureBUtils: { formatData: (data: unknown) => string };
    featureBService: { processData: (input: string) => Promise<string> };
  }
}

// Get the dependency manager instance
const asyncDependencyRegistry = createAsyncDependencyRegistry();

// Register this feature's dependencies
asyncDependencyRegistry.register({
  id: "featureBUtils",
  dependencies: [],
  loader: () => ({
    formatData: (data) => JSON.stringify(data, null, 2),
  }),
});

asyncDependencyRegistry.register({
  id: "featureBService",
  dependencies: ["featureBUtils", "featureAService"], // Dependencies can cross features
  loader: async (deps) => ({
    processData: async (input) => {
      const data = await deps.featureAService.getData();
      return deps.featureBUtils.formatData({ input, data });
    },
  }),
});
```

In your application's entry point or component where you need the dependencies:

```typescript
// app.ts
import { createAsyncDependencyRegistry } from "./registry";
// Import all dependency registrations (which registers them with the manager)
import "./feature-a-dependencies";
import "./feature-b-dependencies";

async function startApp() {
  const asyncDependencyRegistry = createAsyncDependencyRegistry();

  // Load and use Feature B service which will automatically load all prerequisites
  const featureBService = await asyncDependencyRegistry.load("featureBService");
  const result = await featureBService.processData("test");
  console.log(result);

  // Or load all dependencies at once
  const allDeps = await asyncDependencyRegistry.loadAll();
  // Use any dependency from the loaded bundle
  const formatted = allDeps.featureBUtils.formatData({ hello: "world" });
}

startApp().catch(console.error);
```

### Creating Multiple Instances

You can create multiple instances for different parts of your application:

```typescript
// Create separate dependency managers for different subsystems
const authAsyncDependencyRegistry = AsyncDependencyRegistry.create<AuthRegistry>({
  verbose: true,
});

const dataAsyncDependencyRegistry = AsyncDependencyRegistry.create<DataRegistry>({
  verbose: false,
});

// Each instance manages its own dependencies independently
```

### Loading Dependencies

Load a single dependency:

```typescript
const myService = await asyncDependencyRegistry.load("myService");
// myService is fully typed based on YourAppRegistry definition
const data = await myService.getData();
```

Load multiple dependencies:

```typescript
await asyncDependencyRegistry.loadMultiple(["myConfig", "myService"]);
// This ensures that 'myConfig' and 'myService' (and their prerequisites) are loaded.
// You can then access them individually using `load` if needed, or rely on them being available for other dependencies.
```

Load all registered dependencies at once:

```typescript
const allDeps = await asyncDependencyRegistry.loadAll();
// allDeps contains all loaded dependencies with proper types
const { myConfig, myService, myConstant, myUtil } = allDeps;
```

### Controlling Verbosity

You can control the verbosity of logging at creation time or later:

```typescript
// Set verbose to false at creation time (only errors will be logged)
const quietManager = AsyncDependencyRegistry.create<YourAppRegistry>({
  verbose: false,
});

// Later change verbosity setting if needed
quietManager.setVerbose(true); // Now all messages will be logged
```

When verbose mode is enabled, the AsyncDependencyRegistry will:

- Log state transitions for each dependency (inactive, pending, loading, loaded, error)
- Record and display timing information showing how long each dependency took to load
- Provide detailed information about dependency relationships and loading issues

For example, with verbose logging enabled, you'll see output like:

```
Dependency "configService" state changed to: pending
Dependency "configService" state changed to: loading
Dependency "configService" state changed to: loaded
Dependency "configService" loaded in 125ms
Dependency "databaseService" state changed to: pending
Dependency "databaseService" state changed to: loading
Dependency "databaseService" state changed to: loaded
Dependency "databaseService" loaded in 347ms
```

This is particularly useful for debugging and optimizing your dependency loading performance.

## Running Tests

The project uses Vitest for testing:

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```
