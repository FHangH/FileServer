const serverConfig = {
    PORT: process.env.PORT || 8277,
    HOST: process.env.HOST || '192.168.1.47',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 * 1024, // 10GB
    UPLOAD_TYPES: ['videos', 'images', 'audios', 'documents'],
    MIME_TYPES: {
        videos: ['video/'],
        images: ['image/'],
        audios: ['audio/'],
        documents: ['pdf', 'document', 'text', 'spreadsheet', 'presentation']
    }
};

module.exports = serverConfig;
