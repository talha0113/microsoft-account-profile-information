export class StorageManager {
  static add<T>(key: string, item: T | null): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item == null) {
      return null;
    } else {
      return <T>JSON.parse(item);
    }
  }
}
