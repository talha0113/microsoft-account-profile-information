import { Browser, launch, Page, ElementHandle, Target } from "puppeteer";
import { environmentConfiguration } from "../../Configurations/environment.config";

export class ApplicationBase {
    private readonly width: number = 1920;
    private readonly height: number = 1080;

    public async basePageProcess(): Promise<Page> {
        let page: Page = await <Page>(((<any>global).__BROWSER__).newPage());
        await page.goto(environmentConfiguration.url);
        await page.waitForSelector("button");
        await page.focus("button");
        return page;
    }

    public async loginPageProcess(): Promise<void> {
        let browser: Browser = (<Browser>(((<any>global).__BROWSER__)));
        let loginPagePromise: Promise<void> = new Promise<void>((resolve, reject) => {
            browser.once('targetcreated', async (e: Target) => {
                let loginPage: Page= await e.page()
                await loginPage.waitForSelector("input[name=loginfmt]");
                await loginPage.type("input[name=loginfmt]", environmentConfiguration.userName, { delay: 20 });
                await loginPage.keyboard.press("Enter");
                await loginPage.waitForSelector("#idBtn_Back");
                await (new Promise(resolve => setTimeout(resolve, 1000)));
                await loginPage.type("input[name=passwd]", environmentConfiguration.password, { delay: 40 });
                await loginPage.focus("#idSIButton9");
                await loginPage.keyboard.press("Enter");
                //await loginPage.waitForSelector("#KmsiCheckboxField");
                //await loginPage.click("#idBtn_Back");
                resolve();
            });
        });
        return loginPagePromise;
    }
}