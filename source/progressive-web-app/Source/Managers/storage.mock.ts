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
  spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
  spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
  spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  localStorage.clear();
}
