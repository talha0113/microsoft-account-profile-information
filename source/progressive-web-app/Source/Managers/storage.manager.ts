export class StorageManager {
  static add<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static get<T>(key: string): T {
    if (localStorage.getItem(key) == null) {
      return null;
    } else {
      return <T>JSON.parse(localStorage.getItem(key));
    }
  }
}
