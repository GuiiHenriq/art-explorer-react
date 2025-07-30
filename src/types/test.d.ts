import '@testing-library/jest-dom';

declare global {
  interface Window {
    matchMedia: jest.MockedFunction<typeof window.matchMedia>;
  }

  var IntersectionObserver: jest.MockedClass<typeof IntersectionObserver>;
  var ResizeObserver: jest.MockedClass<typeof ResizeObserver>;
}

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
