import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded media
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// API Router
app.use('/api', apiRouter);

// Serve Static Frontend SPA from dist/
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // In Express 5, fallback middleware handles client-side routing
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    code: 'RESQRA_SERVER_ERR'
  });
});

app.listen(PORT, () => {
  console.log(`🐾 ResQra AI Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/health`);

  // Auto Keep-Alive Heartbeat for Free Cloud Hosting (e.g. Render / Koyeb)
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL;
  if (externalUrl) {
    const PING_INTERVAL = 13 * 60 * 1000; // Ping every 13 mins (Render sleeps after 15 mins)
    console.log(`⏱️ Keep-alive heartbeat enabled for ${externalUrl}`);
    setInterval(async () => {
      try {
        const res = await fetch(`${externalUrl}/api/health`);
        if (res.ok) {
          console.log(`[Keep-Alive] Heartbeat pinged ${externalUrl}/api/health at ${new Date().toISOString()}`);
        }
      } catch (err: any) {
        console.warn('[Keep-Alive] Heartbeat warning:', err.message);
      }
    }, PING_INTERVAL);
  }
});
