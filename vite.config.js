import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'admin-serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin/index.html';
          }
          next();
        });
      },
    },
  ],
});
