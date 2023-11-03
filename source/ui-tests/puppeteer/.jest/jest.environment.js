import { TestEnvironment } from 'jest-environment-node';
import { readFile } from 'node:fs/promises';
import { connect } from 'puppeteer';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');

class JestEnvironment extends TestEnvironment {
    constructor(config, context) {
        super(config, context);
    }

    async setup() {
        await super.setup();
        const wsEndpoint = await readFile(join(DIR, 'wsEndpoint'), 'utf8');
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found');
        }
        this.global.__BROWSER__ = await connect({
            browserWSEndpoint: wsEndpoint
        });
    }

    async teardown() {
        await super.teardown();
    }

    getVmContext() {
        return super.getVmContext();
    }
}

module.exports = JestEnvironment;