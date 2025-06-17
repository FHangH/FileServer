const fs = require('fs');
const path = require('path');

/**
 * 生成Windows风格的文件名（处理重名）
 * @param {string} uploadPath - 上传路径
 * @param {string} originalName - 原始文件名
 * @returns {string} 最终文件名
 */
function generateWindowsStyleFilename(uploadPath, originalName) {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    
    let finalName = originalName;
    let counter = 2;
    
    // 检查文件是否存在，如果存在则按Windows方式重命名
    while (fs.existsSync(path.join(uploadPath, finalName))) {
        finalName = `${nameWithoutExt} (${counter})${ext}`;
        counter++;
    }
    
    return finalName;
}

/**
 * 验证文件类型
 * @param {string} type - 文件类型类别
 * @param {string} mimeType - 文件MIME类型
 * @returns {boolean} 是否允许上传
 */
function validateFileType(type, mimeType) {
    const mimeConfig = {
        videos: ['video/'],
        images: ['image/'],
        audios: ['audio/'],
        documents: ['application/']
    };
    
    const allowedMimes = mimeConfig[type];
    if (!allowedMimes) return false;
    
    return allowedMimes.some(allowed => mimeType.includes(allowed));
}

module.exports = {
    generateWindowsStyleFilename,
    validateFileType
};
