const multer = require('multer');

function errorHandler(error, req, res, next) {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制（最大10GB）' });
        }
    }
    
    console.error('服务器错误:', error);
    res.status(500).json({ error: error.message || '服务器内部错误' });
}

module.exports = errorHandler;
