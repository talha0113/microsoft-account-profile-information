import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        pool: 'forks',
        singleFork: true, // moved from poolOptions.forks.singleFork
        coverage: {
            thresholds: {
                statements: 48,
                branches: 43,
                functions: 45,
                lines: 47
            }
        },
    },
});
