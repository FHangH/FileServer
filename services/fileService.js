const fs = require('fs');
const path = require('path');
const serverConfig = require('../config/server');

class FileService {
    constructor() {
        this.publicPath = path.join(__dirname, '..', 'public', serverConfig.PORT.toString());
    }

    /**
     * 获取所有文件列表
     * @param {string} baseUrl - 基础URL
     * @returns {object} 文件列表对象
     */
    getAllFiles(baseUrl) {
        const result = {
            videos: [],
            images: [],
            audios: [],
            documents: []
        };

        serverConfig.UPLOAD_TYPES.forEach(type => {
            const typePath = path.join(this.publicPath, type);

            if (fs.existsSync(typePath)) {
                const files = fs.readdirSync(typePath);
                result[type] = files.map(file => `${baseUrl}/${type}/${file}`);
            }
        });

        return result;
    }

    /**
     * 处理文件上传结果
     * @param {object} file - 上传的文件对象
     * @param {string} type - 文件类型
     * @returns {object} 上传结果
     */
    handleUploadResult(file, type) {
        return {
            message: '文件上传成功',
            filename: file.filename,
            type: type,
            size: file.size,
            url: `/files/${type}/${file.filename}`
        };
    }

    /**
     * 删除指定文件
     * @param {string} type - 文件类型
     * @param {string} filename - 文件名
     * @returns {object} 删除结果
     */
    deleteFile(type, filename) {
        const filePath = path.join(this.publicPath, type, filename);
        
        try {
            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    message: '文件不存在'
                };
            }
            
            fs.unlinkSync(filePath);
            
            return {
                success: true,
                message: '文件删除成功'
            };
            
        } catch (error) {
            return {
                success: false,
                message: `删除失败: ${error.message}`
            };
        }
    }
}

module.exports = new FileService();
