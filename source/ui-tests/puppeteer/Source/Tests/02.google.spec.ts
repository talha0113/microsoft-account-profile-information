import { Browser, Page } from "puppeteer";

const timeout = 5000;

describe('Google', () => {
    let browser: Browser;
    let page: Page;
    const width: number = 1920;
    const height: number = 1080;

    beforeAll(async () => {
        page = await globalThis.__BROWSER__.newPage();
        await page.goto('https://google.com')
        await page.setViewport({ width, height });
    }, timeout);

    test("Render title", async () => {
        await page.goto("https://www.google.dk");
        await page.waitForSelector(".gLFyf");
        const title: string = await page.title();
        expect(title).toBe("Google");
    }, timeout);

    afterAll(async () => {
        await page.close();
    }, timeout)
});
