import { Page } from "puppeteer";
import { ApplicationBase } from "../Code/application.base";
import { environmentConfiguration } from "../../Configurations/environment.config";



describe('Microsoft Account Information Application', () => {

    let applicationBase: ApplicationBase = new ApplicationBase();
    let page: Page;

    beforeAll(async () => {
        page = await applicationBase.basePageProcess();
    }, 16000);

    test("Should be on login page", async () => {
        expect(page.url()).toContain("/login");
    }, 30000);

    test("Should not access protected pages", async () => {
        await page.goto(`${environmentConfiguration.url}/status`);
        expect(page.url()).toContain("/login");
    }, 30000);

    test("Should login", async () => {
        let waitForLoginProcessPromise: Promise<void> = applicationBase.loginPageProcess();
        await page.waitForSelector('div > login > div > div > button');
        await page.click('div > login > div > div > button');
        await waitForLoginProcessPromise;
        await page.waitForNavigation();
        expect(page.url()).toContain("/status");
    }, 30000);

    afterAll(async () => {
        await page.close();
    }, 30000)
});
