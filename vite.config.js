import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        ds: fileURLToPath(new URL('./ds/index.html', import.meta.url)),
      },
    },
  },
  plugins: [
    {
      name: 'static-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html';
          if (req.url === '/ds' || req.url === '/ds/') req.url = '/ds/index.html';
          next();
        });
      },
    },
  ],
});
