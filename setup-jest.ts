import 'jest-preset-angular/setup-jest';
import '@angular/localize/init';

// Mocking ResizeObserver
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
