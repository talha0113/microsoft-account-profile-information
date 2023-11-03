import { sync } from 'rimraf';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
    await globalThis.__BROWSER__.close();
    sync(DIR);
}