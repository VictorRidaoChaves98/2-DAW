import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { listFiles, downloadFile, deleteFile, uploadFiles, viewFile, updateFile } from '../controllers/files.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Store files on disk under project files/ directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    let folder = 'others';
    if (ext === '.note') folder = 'notes';
    else if (ext === '.pdf') folder = 'pdf';
    const dest = path.join(process.cwd(), 'files', folder);
    try { if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true }); } catch (e) { /* ignore */ }
    cb(null, dest);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// List files
router.get('/', verifyToken, listFiles);

// Upload one or many files (any extension)
router.post('/upload', verifyToken, upload.array('files'), uploadFiles);

// Download by name or path (supports subfolders)
// Download via query parameter to avoid router wildcard issues
router.get('/download', verifyToken, downloadFile);

// View file content
router.get('/view', verifyToken, viewFile);

// Update file content
router.put('/update', verifyToken, updateFile);

// Delete (supports ?name=... for paths with subfolders)
router.delete('/', verifyToken, deleteFile);
// Backward-compatible single-segment delete
router.delete('/:name', verifyToken, deleteFile);

export default router;
