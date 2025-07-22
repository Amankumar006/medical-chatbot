// Security Utilities
class SecurityManager {
    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static validateFileType(file) {
        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'image/jpeg',
            'image/png'
        ];
        return allowedTypes.includes(file.type);
    }

    static encryptData(data, key) {
        // Implement encryption logic
        try {
            return btoa(JSON.stringify(data));
        } catch (error) {
            console.error('Encryption failed:', error);
            return null;
        }
    }

    static decryptData(encryptedData, key) {
        try {
            return JSON.parse(atob(encryptedData));
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }
}

export default SecurityManager;