import { mkdir, writeFile } from 'node:fs/promises';
import { launch } from 'puppeteer';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');
const width = 1920;
const height = 1080;

module.exports = async function () {
    const browser = await launch({
        timeout: 0,
        headless: 'new',
        slowMo: 20,
        dumpio: true,
        ignoreHTTPSErrors: true,
        args: [
            `--window-size=${width},${height}`,
            `--incognit`,
            `--no-sandbox`,
            `--disable-setuid-sandbox`,
            `--disable-dev-shm-usage`,
            `--disable-software-rasterizer`,
            `--disable-extensions`,
            `--detectOpenHandles`,
            `--np-gpu`
        ]
    });
    globalThis.__BROWSER__ = browser;
    await mkdir(DIR, { recursive: true });
    await writeFile(join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};