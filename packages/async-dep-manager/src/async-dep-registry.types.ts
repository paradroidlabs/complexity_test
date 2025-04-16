/**
 * Registry of all dependencies in the system.
 * Consumers should extend this interface to define their dependencies.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DependencyRegistry {}

/**
 * Represents the state of a dependency in the system
 * - inactive: Defined but missing dependencies (not all dependencies are registered); race condition - auto resolved
 * - pending: Ready to load but waiting for dependencies to be loaded
 * - loading: Currently loading
 * - loaded: Successfully loaded
 * - error: Failed to load
 */
export type DependencyState =
  | "inactive"
  | "pending"
  | "loading"
  | "loaded"
  | "error";

/**
 * Dependency definition
 * This is used internally by the AsyncDependencyRegistry
 */
export interface Dependency<
  K extends keyof R,
  R extends DependencyRegistry = DependencyRegistry,
> {
  /** Unique identifier for this dependency */
  id: K;

  /** Array of dependency IDs that this dependency requires to load */
  dependencies: ReadonlyArray<keyof R>;

  /**
   * Function that loads the dependency
   * @param dependencyData Object containing the resolved values of all dependencies
   * this dependency depends on
   * @returns The loaded dependency value or a Promise that resolves to the loaded dependency value
   */
  loader: (dependencyData: Record<keyof R, unknown>) => R[K] | Promise<R[K]>;
}

/**
 * Helper type to extract the value type of a dependency from DependencyRegistry
 */
export type DependencyValue<
  T extends keyof R,
  R extends DependencyRegistry = DependencyRegistry,
> = R[T];

/**
 * Helper type for dependencies required by a dependency loader
 */
export type DependencyParams<
  TDeps extends readonly (keyof R)[],
  R extends DependencyRegistry = DependencyRegistry,
> = {
  [K in TDeps[number]]: R[K];
};
