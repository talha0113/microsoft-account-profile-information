import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            thresholds: {
                statements: 50,
                branches: 18,
                functions: 48,
                lines: 50
            }
        },
    },
});
