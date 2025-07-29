import '@testing-library/jest-dom';
import * as React from 'react';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');

  const createMockElement = (element: string) =>
    jest.fn(({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const framerMotionProps = [
        'initial',
        'animate',
        'exit',
        'transition',
        'variants',
        'whileHover',
        'whileTap',
        'whileInView',
        'viewport',
        'layoutId',
        'layout',
      ];

      const cleanProps = Object.keys(props).reduce(
        (acc, key) => {
          if (!framerMotionProps.includes(key)) {
            acc[key] = props[key];
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );

      return React.createElement(element, cleanProps, children);
    });

  return {
    ...actual,
    motion: {
      div: createMockElement('div'),
      button: createMockElement('button'),
      span: createMockElement('span'),
      p: createMockElement('p'),
      h1: createMockElement('h1'),
      h2: createMockElement('h2'),
      h3: createMockElement('h3'),
      section: createMockElement('section'),
      article: createMockElement('article'),
      nav: createMockElement('nav'),
      aside: createMockElement('aside'),
      header: createMockElement('header'),
      footer: createMockElement('footer'),
      img: createMockElement('img'),
      a: createMockElement('a'),
      ul: createMockElement('ul'),
      li: createMockElement('li'),
      form: createMockElement('form'),
      input: createMockElement('input'),
    },
    AnimatePresence: jest.fn(({ children }) => children),
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useMotionValue: () => ({
      get: jest.fn(),
      set: jest.fn(),
      on: jest.fn(),
      destroy: jest.fn(),
    }),
    useTransform: () => jest.fn(),
    useSpring: () => jest.fn(),
    useCycle: () => [0, jest.fn()],
  };
});

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: jest.fn(() => jest.fn()),
    useLocation: jest.fn(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    })),
    useParams: jest.fn(() => ({})),
    useSearchParams: jest.fn(() => [new URLSearchParams(), jest.fn()]),
    useOutletContext: jest.fn(() => ({})),
    Link: jest.fn(({ children, to, ...props }) =>
      React.createElement('a', { href: to, ...props }, children),
    ),
    NavLink: jest.fn(({ children, to, ...props }) =>
      React.createElement('a', { href: to, ...props }, children),
    ),
  };
});

const mockWindowAPIs = () => {
  Object.defineProperty(window, 'open', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      focus: jest.fn(),
      close: jest.fn(),
      closed: false,
    })),
  });

  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
  });

  Object.defineProperty(window, 'scroll', {
    writable: true,
    value: jest.fn(),
  });

  Element.prototype.scrollIntoView = jest.fn();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });
};

const mockObservers = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));

  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  global.MutationObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));
};

mockWindowAPIs();
mockObservers();

beforeEach(() => {
  jest.clearAllMocks();

  document.body.innerHTML = '';
  document.head.innerHTML = '';

  if (jest.isMockFunction(setTimeout)) {
    jest.clearAllTimers();
  }
});

afterEach(() => {});

jest.setTimeout(10000);
