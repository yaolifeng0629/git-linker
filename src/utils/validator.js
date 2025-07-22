const path = require('path');
const { Logger } = require('./logger');

class Validator {
    static isValidPath(filePath) {
        if (typeof filePath !== 'string' || filePath.trim() === '') {
            return false;
        }
        
        const normalizedPath = path.normalize(filePath);
        return !normalizedPath.includes('..');
    }

    static isValidGitUrl(url) {
        if (typeof url !== 'string' || url.trim() === '') {
            return false;
        }

        const gitUrlPatterns = [
            /^https?:\/\/.+\.git$/,
            /^git@.+:.+\.git$/,
            /^ssh:\/\/.+\.git$/
        ];

        return gitUrlPatterns.some(pattern => pattern.test(url.trim()));
    }

    static validateUrls(urlString) {
        if (!urlString || urlString.trim() === '') {
            return { valid: false, error: 'URLs cannot be empty' };
        }

        const urls = urlString.split(/[,，]/).map(url => url.trim()).filter(url => url);
        
        if (urls.length === 0) {
            return { valid: false, error: 'No valid URLs provided' };
        }

        const invalidUrls = urls.filter(url => !this.isValidGitUrl(url));
        
        if (invalidUrls.length > 0) {
            return { 
                valid: false, 
                error: `Invalid Git URLs: ${invalidUrls.join(', ')}`,
                invalidUrls
            };
        }

        return { valid: true, urls };
    }

    static sanitizePath(inputPath) {
        if (!inputPath || inputPath.trim() === '') {
            return '.';
        }
        
        return path.normalize(inputPath.trim()).replace(/\\\\/g, '/');
    }
}

module.exports = { Validator };