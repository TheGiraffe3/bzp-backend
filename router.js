import express from 'express';
import multer from 'multer';
import { login, logout } from './src/auth.js';
import { addPlugin, getPlugin, getPluginDownload, listPlugins, removePlugin, togglePluginStatus } from './src/plugins.js';

const upload = multer();
const router = express.Router();

router.post('/add-plugin', upload.single('file'), addPlugin);
router.delete('/remove-plugin', removePlugin);
router.get('/get-plugin', getPlugin);
router.get('/get-plugin-download', getPluginDownload);
router.get('/list-plugins', listPlugins);
router.patch('/toggle-plugin-status', togglePluginStatus);
router.post('/login', login);
router.post('/logout', logout);

export default router;
