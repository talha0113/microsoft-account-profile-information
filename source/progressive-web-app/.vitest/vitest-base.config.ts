import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        coverage: {
          enabled: true,
          provider: 'v8',
          reportsDirectory: 'Reports/Coverage',
          reporter: ['text', 'json', 'html', 'clover', 'lcov', 'cobertura', 'lcovonly', 'text-summary'],
          thresholds: {           
              statements: 50,
              branches: 18,
              functions: 48,
              lines: 50
          }
    },
  },
});
