import { Page } from "puppeteer";
import { environmentConfiguration } from "../../Configurations/environment.config";

export class ApplicationBase {
    private readonly width: number = 1920;
    private readonly height: number = 1080;

    public async basePageProcess(): Promise<Page> {
        let page: Page = await <Page>(((<any>globalThis).__BROWSER__).newPage());
        await page.goto(environmentConfiguration.url);
        await page.waitForSelector("button");
        await page.focus("button");
        return page;
    }

    public async loginPageProcess(loginPage: Page): Promise<void> {
        await loginPage.waitForSelector("input[name=loginfmt]");
        await loginPage.type("input[name=loginfmt]", environmentConfiguration.userName, { delay: 5 });
        await loginPage.keyboard.press("Enter");
        await loginPage.waitForSelector("#idBtn_Back");
        await loginPage.type("input[name=passwd]", environmentConfiguration.password, { delay: 5 });
        await loginPage.focus("#idSIButton9");
        await loginPage.keyboard.press("Enter");
        await loginPage.waitForSelector('.row #idBtn_Back');
        await loginPage.click('.row #idBtn_Back');
        await loginPage.waitForNavigation();
        return;
    }
}