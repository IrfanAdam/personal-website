import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        ds: fileURLToPath(new URL('./ds/index.html', import.meta.url)),
      },
      // Vendor split — marked is read by lazy portfolio routes + eager DS
      // specimens; one shared chunk instead of a copy in each entry.
      output: {
        manualChunks: {
          vendor: ['marked'],
        },
      },
    },
  },
  plugins: [
    {
      name: 'static-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html';
          if (req.url === '/admin/reorder' || req.url === '/admin/reorder/') req.url = '/admin/reorder.html';
          if (req.url === '/ds' || req.url === '/ds/') req.url = '/ds/index.html';
          next();
        });
      },
    },
    {
      name: 'admin-reorder',
      configureServer(server) {
        const root = dirname(fileURLToPath(import.meta.url));
        const dir = join(root, 'content/projects');
        const send = (res, code, obj) => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
        };
        const load = async () => {
          const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
          const items = await Promise.all(
            files.map(async (f) => {
              const j = JSON.parse(await readFile(join(dir, f), 'utf8'));
              return { slug: j.slug, title: j.title, order: j.order, image: j.image, tag: j.tag };
            }),
          );
          items.sort((a, b) => a.order - b.order);
          return items;
        };
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/__admin/projects') && req.method === 'GET') {
            try { send(res, 200, await load()); } catch (e) { send(res, 500, { error: String(e) }); }
            return;
          }
          if (req.url.startsWith('/__admin/reorder') && req.method === 'POST') {
            let body = '';
            req.on('data', (c) => { body += c; });
            req.on('end', async () => {
              try {
                const { order } = JSON.parse(body || '{}');
                if (!Array.isArray(order)) throw new Error('order[] required');
                for (let i = 0; i < order.length; i++) {
                  const slug = order[i];
                  const p = join(dir, `${slug}.json`);
                  const raw = await readFile(p, 'utf8');
                  const j = JSON.parse(raw);
                  j.order = i + 1;
                  const out = JSON.stringify(j, null, 2).replace(/\u2014/g, '\\u2014');
                  await writeFile(p, `${out}\n`);
                }
                send(res, 200, { ok: true });
              } catch (e) { send(res, 400, { error: String(e) }); }
            });
            return;
          }
          next();
        });
      },
    },
  ],
});
