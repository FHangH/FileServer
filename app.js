const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8277;
const HOST = '0.0.0.0';

// 信任代理，适用于云平台部署
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 静态文件服务
app.use('/files', express.static(path.join(__dirname, 'public')));

// 根路由：返回所有文件的 JSON 列表
app.get('/', (req, res) => {
    const publicPath = path.join(__dirname, 'public');
  
    // 优化 URL 构建逻辑，支持代理环境
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}/files`;
    
    const result = {
      videos: [],
      images: [],
      audios: [],
      documents: []
    };
    
  // 获取各类型文件
  const fileTypes = ['videos', 'images', 'audios', 'documents'];
  
  fileTypes.forEach(type => {
    const typePath = path.join(publicPath, type);
    
    if (fs.existsSync(typePath)) {
      const files = fs.readdirSync(typePath);
      result[type] = files.map(file => `${baseUrl}/${type}/${file}`);
    }
  });

  // 设置正确的 Content-Type 让浏览器显示 JSON
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
