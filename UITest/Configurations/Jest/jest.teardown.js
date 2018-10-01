const puppeteer = require('puppeteer');
const rimraf = require('rimraf');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_global_setup');

module.exports = async function () {
    await global.__BROWSER__.close();
    rimraf.sync(DIR);
}