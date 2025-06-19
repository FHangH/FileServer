const serverConfig = {
    PORT: process.env.PORT || 8277,
    HOST: process.env.HOST || '127.0.0.1',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 * 1024, // 10GB
    UPLOAD_TYPES: ['videos', 'images', 'audios', 'documents'],
    MIME_TYPES: {
        videos: ['video/'],
        images: ['image/'],
        audios: ['audio/'],
        documents: ['application/']
    }
};

module.exports = serverConfig;
