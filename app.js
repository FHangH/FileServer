const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8277;
const HOST = '0.0.0.0';

// 初始化端口对应的文件夹结构
function initializePortDirectory(port) 
{
    const portDir = path.join(__dirname, 'public', port.toString());
    const subDirectories = ['videos', 'images', 'audios', 'documents'];
    
    console.log(`检查端口 ${port} 对应的目录结构...`);
    
    // 检查端口号文件夹是否存在
    if (!fs.existsSync(portDir)) 
    {
        console.log(`端口目录 ${portDir} 不存在，正在创建...`);
        fs.mkdirSync(portDir, { recursive: true });
        console.log(`端口目录 ${portDir} 创建成功`);
    } 
    else 
    {
        console.log(`端口目录 ${portDir} 已存在`);
    }
    
    // 检查并创建子目录
    subDirectories.forEach(subDir => 
    {
        const fullPath = path.join(portDir, subDir);
        if (!fs.existsSync(fullPath)) 
        {
            console.log(`子目录 ${subDir} 不存在，正在创建...`);
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`子目录 ${subDir} 创建成功`);
        } 
        else 
        {
            console.log(`子目录 ${subDir} 已存在`);
        }
    });
    
    console.log(`端口 ${port} 的目录结构初始化完成`);
}

initializePortDirectory(PORT);

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 静态文件服务 - 修改为根据端口号提供对应目录的文件
app.use('/files', express.static(path.join(__dirname, 'public', PORT.toString())));

// 根路由：返回所有文件的 JSON 列表
app.get('/', (req, res) => 
{
    const publicPath = path.join(__dirname, 'public', PORT.toString());
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}/files`;
    
    const result = 
    {
        videos: [],
        images: [],
        audios: [],
        documents: []
    };
    
    const fileTypes = ['videos', 'images', 'audios', 'documents'];

    fileTypes.forEach(type => 
    {
        const typePath = path.join(publicPath, type);

        if (fs.existsSync(typePath)) 
        {
            const files = fs.readdirSync(typePath);
            result[type] = files.map(file => `${baseUrl}/${type}/${file}`);
        }
    }); 

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(result);
});

app.listen(PORT, () => 
{
    console.log(`Server running at http://${HOST}:${PORT}`);
});
