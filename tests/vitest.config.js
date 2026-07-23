import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        reporter: ['verbose'],
        // Log seed for PBT reproducibility (PBT-08)
        onConsoleLog: () => true
    }
});
