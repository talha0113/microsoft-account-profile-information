const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const DIR = path.join(os.tmpdir(), 'jest_global_setup');
const width = 1920;
const height = 1080;

module.exports = async function () {
    const browser = await puppeteer.launch({
        timeout: 0,
        headless: true,
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
            `--np-gpu`
        ]
    });
    global.__BROWSER__ = browser;
    mkdirp.sync(DIR);
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};