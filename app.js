const express = require('express');
const path = require('path');
require('dotenv').config();

const serverConfig = require('./config/server');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initializePortDirectory } = require('./utils/directoryUtils');

const app = express();
const { PORT, HOST } = serverConfig;

// 初始化目录结构
initializePortDirectory(PORT);

// 中间件配置
app.set('trust proxy', true);
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ extended: true, limit: '10gb' }));

// 静态文件服务
app.use('/files', express.static(path.join(__dirname, 'public', PORT.toString())));

// 路由配置
app.use('/', fileRoutes);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});

module.exports = app;
