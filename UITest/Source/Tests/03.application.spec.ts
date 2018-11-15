import { Page, ElementHandle } from "puppeteer";
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
        await page.waitForSelector('div > login > div > div > button');
        await page.click('div > login > div > div > button');
        await page.waitForNavigation();
        await applicationBase.loginPageProcess(page);
        await page.waitFor(3000);
        expect(page.url()).toContain("/status");
    }, 30000);

    test("Should see profile", async () => {
        await page.waitForSelector('div > navigation > div > nav > a:nth-child(2)');
        await page.click('div > navigation > div > nav > a:nth-child(2)');
        await page.waitForSelector('profile > div > div > div > div > h3');
        let profileName: string = await page.evaluate(() => document.querySelector('profile > div > div > div > div > h3').textContent);
        expect(page.url()).toContain("/profile");
        expect(profileName).toContain("Talha");
    }, 30000);

    test("Should logout", async () => {
        await page.waitForSelector('div > navigation > div > nav > a:nth-child(3)');
        await page.click('div > navigation > div > nav > a:nth-child(3)');
        await page.waitForSelector('div > div > logout > div > button');
        await page.click('div > div > logout > div > button');
        expect(page.url()).toContain("/login");
    }, 30000);

    afterAll(async () => {
        await page.close();
    }, 30000)
});
