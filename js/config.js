// Configuration Management
class Config {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || '';
        this.apiUrl = process.env.API_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions';
        this.encryptionKey = process.env.ENCRYPTION_KEY || '';
    }

    validateConfig() {
        if (!this.apiKey) {
            throw new Error('GROQ API key is required');
        }
        return true;
    }
}

export default new Config();