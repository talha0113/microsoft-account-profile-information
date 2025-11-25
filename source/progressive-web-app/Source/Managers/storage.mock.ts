import { vi } from 'vitest';

let store = {};
const mockLocalStorage = {
  getItem: (key: string): string => {
    return key in store ? store[key] : null;
  },
  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  },
};

export function setUpMock(): void {
  vi.spyOn(localStorage, 'getItem').mockImplementation(
    mockLocalStorage.getItem
  );
  vi.spyOn(localStorage, 'setItem').mockImplementation(
    mockLocalStorage.setItem
  );
  vi.spyOn(localStorage, 'removeItem').mockImplementation(
    mockLocalStorage.removeItem
  );
  vi.spyOn(localStorage, 'clear').mockImplementation(mockLocalStorage.clear);
  localStorage.clear();
}
