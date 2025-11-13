import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import db from './sqlite.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ensure data folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const upload = multer({ dest: uploadsDir });

// Initialize DB tables
db.init();

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// List combined users
app.get('/users', async (req, res) => {
  try {
    const rows = await db.all('SELECT id, username, verified, source, meta FROM users ORDER BY id DESC');
    const users = rows.map(r => ({ id: r.id, username: r.username, verified: !!r.verified, source: r.source, meta: r.meta ? JSON.parse(r.meta) : {} }));
    res.json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Upload dataset CSV
app.post('/upload-dataset', upload.single('file'), async (req, res) => {
  const datasetName = req.body?.datasetName || (req.file?.originalname || 'uploaded-dataset');
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ error: 'No file provided' });

  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skip_empty_lines: true }));
  let inserted = 0, skipped = 0;
  try {
    for await (const record of parser) {
      // Try to guess username field
      const username = record.username || record.user || record.name || record.handle || null;
      if (!username) { skipped++; continue; }
      const meta = JSON.stringify(record);
      await db.run(
        `INSERT INTO users (username, verified, source, meta) VALUES (?, 0, ?, ?)
         ON CONFLICT(username) DO UPDATE SET source=excluded.source, meta=excluded.meta`,
        [username, datasetName, meta]
      );
      inserted++;
    }
    fs.unlink(filePath, () => {});
    res.json({ ok: true, datasetName, inserted, skipped });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to process CSV' });
  }
});

// Mark verified accounts
app.post('/verified-accounts', async (req, res) => {
  const usernames = Array.isArray(req.body?.usernames) ? req.body.usernames : [];
  if (!usernames.length) return res.status(400).json({ error: 'Provide usernames array' });
  try {
    for (const u of usernames) {
      await db.run('INSERT INTO users (username, verified, source) VALUES (?, 1, ?) ON CONFLICT(username) DO UPDATE SET verified=1', [u, 'manual-verified']);
    }
    res.json({ ok: true, count: usernames.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to mark verified accounts' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});