export class BrowserManager {
  static add<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  static get isMobile(): boolean {
    if (
      /Android/i.exec(navigator.userAgent) ||
      /webOS/i.exec(navigator.userAgent) ||
      /iPhone/i.exec(navigator.userAgent) ||
      /iPad/i.exec(navigator.userAgent) ||
      /iPod/i.exec(navigator.userAgent) ||
      /BlackBerry/i.exec(navigator.userAgent) ||
      /Windows Phone/i.exec(navigator.userAgent)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
