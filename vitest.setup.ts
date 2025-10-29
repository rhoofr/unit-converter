import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock window.matchMedia for responsive tests
// Add CSS file mocking
vi.mock('react-datepicker/dist/react-datepicker.css', () => ({}));

// Add global mocks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock hasPointerCapture for Radix UI components
Object.defineProperty(Element.prototype, 'hasPointerCapture', {
  value: vi.fn().mockReturnValue(false),
  writable: true,
});

// Mock pointer events for better Radix UI support
Object.defineProperty(Element.prototype, 'setPointerCapture', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(Element.prototype, 'releasePointerCapture', {
  value: vi.fn(),
  writable: true,
});
