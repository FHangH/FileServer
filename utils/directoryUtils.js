const fs = require('fs');
const path = require('path');

/**
 * 初始化端口对应的文件夹结构
 * @param {number} port - 端口号
 */
function initializePortDirectory(port) {
    const portDir = path.join(__dirname, '..', 'public', port.toString());
    const subDirectories = ['videos', 'images', 'audios', 'documents'];
    
    console.log(`检查端口 ${port} 对应的目录结构...`);
    
    // 检查端口号文件夹是否存在
    if (!fs.existsSync(portDir)) {
        console.log(`端口目录 ${portDir} 不存在，正在创建...`);
        fs.mkdirSync(portDir, { recursive: true });
        console.log(`端口目录 ${portDir} 创建成功`);
    } else {
        console.log(`端口目录 ${portDir} 已存在`);
    }
    
    // 检查并创建子目录
    subDirectories.forEach(subDir => {
        const fullPath = path.join(portDir, subDir);
        if (!fs.existsSync(fullPath)) {
            console.log(`子目录 ${subDir} 不存在，正在创建...`);
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`子目录 ${subDir} 创建成功`);
        } else {
            console.log(`子目录 ${subDir} 已存在`);
        }
    });
    
    console.log(`端口 ${port} 的目录结构初始化完成`);
}

module.exports = {
    initializePortDirectory
};
