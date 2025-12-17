import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
    port: 5173,
    open: true,
    host: true,
    // Permite que el historial de navegación funcione sin errores 404
    historyApiFallback: true,
    },
  // Configuración para Vitest (opcional, pero recomendada si usas `npm run test`)
    test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    }
});