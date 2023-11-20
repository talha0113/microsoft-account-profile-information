import { Page } from "puppeteer";
import { ApplicationBase } from "../Code/application.base";
import { environmentConfiguration } from "../../Configurations/environment.config";

const timeout = 5000;

describe('Microsoft Account Information Application', () => {

    let applicationBase: ApplicationBase = new ApplicationBase();
    let page: Page;

    beforeAll(async () => {
        page = await applicationBase.basePageProcess();
    }, timeout);

    test("Should be on login page", async () => {
        expect(page.url()).toContain("/login");
    }, timeout);
    
    test("Should render language flag", async () => {
        await page.waitForSelector('div > div > flag > a > img');        
        let altOriginal: string = await page.evaluate(() => document.querySelector('div > div > flag > a > img').getAttribute('alt'));
        await page.click('div > div > flag > a');
        await (new Promise(r => setTimeout(r, 350)));
        await page.waitForSelector('div > div > flag > a > img');        
        let alChanged: string = await page.evaluate(() => document.querySelector('div > div > flag > a > img').getAttribute('alt'));
        expect(altOriginal).not.toEqual(alChanged);
    }, timeout);

    test("Should not access protected pages", async () => {
        await page.goto(`${environmentConfiguration.url}/status`);
        expect(page.url()).toContain("/login");
    }, timeout);

    test("Should login", async () => {
        await page.waitForSelector('div > login > div > div > button');
        await page.click('div > login > div > div > button');
        await page.waitForNavigation();
        await applicationBase.loginPageProcess(page);

        await (new Promise(r => setTimeout(r, 1000)));
        expect(page.url()).toContain("/status");
    }, timeout);

    test("Should see profile", async () => {
        await page.waitForSelector('navigation > div > nav > span:nth-child(2) > a');
        await page.click('navigation > div > nav > span:nth-child(2) > a');
        await page.waitForSelector('profile > div > div > h3');
        let profileName: string = await page.evaluate(() => document.querySelector('profile > div > div > h3').textContent);
        expect(page.url()).toContain("/profile");
        expect(profileName).toContain("Service");
    }, timeout);

    test("Should logout", async () => {
        await page.waitForSelector('navigation > div > nav > span:nth-child(3) > a');
        await page.click('navigation > div > nav > span:nth-child(3) > a');
        await page.waitForSelector('div > div > logout > div > button');
        await page.click('div > div > logout > div > button');
        expect(page.url()).toContain("/login");
    }, timeout);

    afterAll(async () => {
        await page.close();
    }, timeout)
});
