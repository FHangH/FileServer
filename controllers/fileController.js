const fs = require('fs');
const path = require('path');
const fileService = require('../services/fileService');
const serverConfig = require('../config/server');

class FileController {
    /**
     * 显示主页
     */
    showHomePage(req, res) {
        const indexHtml = fs.readFileSync(
            path.join(__dirname, '..', 'views', 'index.html'), 
            'utf8'
        );
        res.send(indexHtml);
    }

    /**
 * 显示所有文件页面
 */
    showFilesPage(req, res) {
        const filesHtml = fs.readFileSync(
            path.join(__dirname, '..', 'views', 'files.html'), 
            'utf8'
        );
        res.send(filesHtml);
    }
    
    /**
     * 删除指定文件
     */
    deleteFile(req, res) {
        try {
            const { type, filename } = req.params;
            
            // 验证文件类型
            if (!serverConfig.UPLOAD_TYPES.includes(type)) {
                return res.status(400).json({ error: '无效的文件类型' });
            }
            
            const result = fileService.deleteFile(type, filename);
            
            if (result.success) {
                console.log(`文件删除成功: ${filename} 从 ${type} 目录`);
                res.json({ message: '文件删除成功' });
            } else {
                res.status(404).json({ error: result.message });
            }
            
        } catch (error) {
            console.error('文件删除错误:', error);
            res.status(500).json({ error: error.message });
        }
    }


    /**
     * 显示上传页面
     */
    showUploadPage(req, res) {
        const uploadHtml = fs.readFileSync(
            path.join(__dirname, '..', 'views', 'upload.html'), 
            'utf8'
        );
        res.send(uploadHtml);
    }

    /**
     * 处理文件上传
     */
    uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: '没有文件被上传' });
            }
            
            const type = req.params.type;
            
            if (!serverConfig.UPLOAD_TYPES.includes(type)) {
                return res.status(400).json({ error: '无效的文件类型' });
            }
            
            console.log(`文件上传成功: ${req.file.filename} 到 ${type} 目录`);
            
            const result = fileService.handleUploadResult(req.file, type);
            res.json(result);
            
        } catch (error) {
            console.error('文件上传错误:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 获取文件列表
     */
    getFileList(req, res) {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const baseUrl = `${protocol}://${host}/files`;
        
        const result = fileService.getAllFiles(baseUrl);
        
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(result);
    }
}

module.exports = new FileController();
