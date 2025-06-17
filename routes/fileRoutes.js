const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middleware/upload');

// 主页路由
router.get('/', fileController.showHomePage);

// 上传页面路由
router.get('/upload', fileController.showUploadPage);

// 【新增】所有文件页面路由
router.get('/files', fileController.showFilesPage);

// 文件上传API
router.post('/upload/:type', upload.single('file'), fileController.uploadFile);

// 【修改】文件列表API - 改为 /api/files
router.get('/api/files', fileController.getFileList);

// 【新增】删除文件API
router.delete('/api/files/:type/:filename', fileController.deleteFile);

module.exports = router;
