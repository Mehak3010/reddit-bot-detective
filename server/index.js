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
import supabase from './supabase.js';

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
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, verified, source, meta')
        .order('id', { ascending: false });
      if (error) throw error;
      const users = (data || []).map(r => ({
        id: r.id,
        username: r.username,
        verified: !!r.verified,
        source: r.source,
        meta: typeof r.meta === 'string' ? JSON.parse(r.meta || '{}') : (r.meta || {})
      }));
      return res.json({ users });
    }
    // Fallback to SQLite
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
  const datasetNameRaw = req.body?.datasetName || (req.file?.originalname || 'uploaded-dataset');
  const filePath = req.file?.path;
  const originalName = req.file?.originalname || 'dataset.csv';
  if (!filePath) return res.status(400).json({ error: 'No file provided' });

  try {
    const safeName = String(datasetNameRaw).replace(/[^a-zA-Z0-9-_]/g, '_');
    if (supabase) {
      // Store raw CSV file in Supabase Storage (bucket: datasets)
      const buffer = await fs.promises.readFile(filePath);
      const storagePath = `${safeName}/${Date.now()}-${originalName}`;
      const { error } = await supabase
        .storage
        .from('datasets')
        .upload(storagePath, buffer, { contentType: 'text/csv', upsert: true });
      if (error) throw error;
      const { data: pub } = supabase.storage.from('datasets').getPublicUrl(storagePath);
      fs.unlink(filePath, () => {});
      return res.json({ ok: true, datasetName: safeName, storagePath, publicUrl: pub?.publicUrl || null });
    }
    // Fallback: keep the uploaded file locally
    const newRel = path.join('uploads', `${Date.now()}-${safeName}-${originalName}`);
    const newAbs = path.join(__dirname, newRel);
    await fs.promises.rename(filePath, newAbs);
    return res.json({ ok: true, datasetName: safeName, localPath: newRel });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to store dataset file' });
  }
});

// Mark verified accounts
app.post('/verified-accounts', async (req, res) => {
  const usernames = Array.isArray(req.body?.usernames) ? req.body.usernames : [];
  if (!usernames.length) return res.status(400).json({ error: 'Provide usernames array' });
  try {
    if (supabase) {
      for (const u of usernames) {
        const { error } = await supabase
          .from('users')
          .upsert({ username: u, verified: true, source: 'manual-verified' }, { onConflict: 'username' });
        if (error) throw error;
      }
    } else {
      for (const u of usernames) {
        await db.run('INSERT INTO users (username, verified, source) VALUES (?, 1, ?) ON CONFLICT(username) DO UPDATE SET verified=1', [u, 'manual-verified']);
      }
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