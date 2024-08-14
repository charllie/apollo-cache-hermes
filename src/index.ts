import { assertValidEnvironment } from './environment';

// Try to detect environment misconfiguration early.
assertValidEnvironment();

export { Hermes } from './apollo';
export { Cache, MigrationMap } from './Cache';
export { ConsoleTracer } from './context/ConsoleTracer';
export * from './errors';
export { selectionSetIsStatic } from './util';
