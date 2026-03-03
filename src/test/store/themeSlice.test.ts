import { describe, it, expect, beforeEach, vi } from 'vitest';
import { THEME, STORAGE_KEYS } from '../../constants';

describe('themeSlice', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  const mockEnvironment = (stored?: string, prefersDark = false) => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (key === STORAGE_KEYS.THEME) {
        return stored ?? null;
      }
      return null;
    });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: prefersDark,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.spyOn(document.documentElement.classList, 'toggle');
  };

  const loadSlice = async () => {
    return await import('../../store/themeSlice');
  };

  // -----------------------------
  // Initial State Tests
  // -----------------------------

  describe('initial state', () => {
    it('should fallback to system dark preference', async () => {
      mockEnvironment(undefined, true);

      const { default: reducer } = await loadSlice();
      const state = reducer(undefined, { type: 'unknown' });

      expect(state.mode).toBe(THEME.DARK);
    });

    it('should fallback to light if no stored value and system is light', async () => {
      mockEnvironment(undefined, false);

      const { default: reducer } = await loadSlice();
      const state = reducer(undefined, { type: 'unknown' });

      expect(state.mode).toBe(THEME.LIGHT);
    });
  });

  // -----------------------------
  // Reducer Tests
  // -----------------------------

  describe('reducers', () => {
    it('should set theme explicitly', async () => {
      mockEnvironment();

      const { default: reducer, setTheme } = await loadSlice();

      const initialState = { mode: THEME.LIGHT };
      const newState = reducer(initialState, setTheme(THEME.DARK));

      expect(newState.mode).toBe(THEME.DARK);
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, THEME.DARK);
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
    });

    it('should toggle theme from light to dark', async () => {
      mockEnvironment();

      const { default: reducer, toggleTheme } = await loadSlice();

      const initialState = { mode: THEME.LIGHT };
      const newState = reducer(initialState, toggleTheme());

      expect(newState.mode).toBe(THEME.DARK);
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, THEME.DARK);
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
    });

    it('should toggle theme from dark to light', async () => {
      mockEnvironment();

      const { default: reducer, toggleTheme } = await loadSlice();

      const initialState = { mode: THEME.DARK };
      const newState = reducer(initialState, toggleTheme());

      expect(newState.mode).toBe(THEME.LIGHT);
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.THEME, THEME.LIGHT);
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    });
  });
});
