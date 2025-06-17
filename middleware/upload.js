const multer = require('multer');
const path = require('path');
const serverConfig = require('../config/server');
const { generateWindowsStyleFilename, validateFileType } = require('../utils/fileUtils');

// 配置multer存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.params.type;
        const uploadPath = path.join(__dirname, '..', 'public', serverConfig.PORT.toString(), type);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // 获取原始文件名
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const type = req.params.type;
        const uploadPath = path.join(__dirname, '..', 'public', serverConfig.PORT.toString(), type);
        
        // 生成Windows风格的文件名
        const finalName = generateWindowsStyleFilename(uploadPath, originalName);
        
        cb(null, finalName);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    const type = req.params.type;
    const mimeType = file.mimetype;
    
    if (validateFileType(type, mimeType)) {
        cb(null, true);
    } else {
        cb(new Error(`不支持的文件类型: ${mimeType} 用于 ${type} 类别`), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: serverConfig.MAX_FILE_SIZE
    }
});

module.exports = upload;
