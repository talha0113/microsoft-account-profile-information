import { Browser, Page } from "puppeteer";

describe('Google', () => {
    let browser: Browser;
    let page: Page;
    const width: number = 1920;
    const height: number = 1080;

    beforeAll(async () => {
        page = await <Page>(((<any>global).__BROWSER__).newPage()); 
        await page.goto('https://google.com')
        await page.setViewport({ width, height });
    }, 30000);
    test("Render title", async () => {
        await page.goto("https://www.google.dk", {
            waitUntil: 'networkidle2',
            timeout: 3000000
        })
        await page.waitForSelector(".gsfi");
        let title: string = await page.title();
        expect(title).toBe("Google");
    }, 30000);
    afterAll(async () => {
        await page.close();
    }, 30000)
});
