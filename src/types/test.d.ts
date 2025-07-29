// src/types/test.d.ts

// Extend the global Window interface for test mocks
declare global {
  interface Window {
    matchMedia: jest.MockedFunction<typeof window.matchMedia>;
  }

  // Mock implementations for APIs not available in jsdom
  var IntersectionObserver: jest.MockedClass<typeof IntersectionObserver>;
  var ResizeObserver: jest.MockedClass<typeof ResizeObserver>;
}

// Location mock type
interface MockLocation extends Omit<Location, 'assign' | 'replace' | 'reload'> {
  assign: jest.MockedFunction<typeof location.assign>;
  replace: jest.MockedFunction<typeof location.replace>;
  reload: jest.MockedFunction<typeof location.reload>;
}

declare global {
  interface Window {
    location: MockLocation;
  }
}

export {};
