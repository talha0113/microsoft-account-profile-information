import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
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
