const fs = require('fs').promises;
const path = require('path');
const { Logger } = require('../utils/logger');
const { Validator } = require('../utils/validator');

class GitConfigManager {
    constructor(projectPath) {
        this.projectPath = Validator.sanitizePath(projectPath);
        this.gitConfigPath = path.join(this.projectPath, '.git', 'config');
    }

    async validateGitRepository() {
        try {
            const gitDir = path.join(this.projectPath, '.git');
            const stat = await fs.stat(gitDir);
            
            if (!stat.isDirectory()) {
                throw new Error('Not a valid Git repository');
            }
            
            await fs.access(this.gitConfigPath, fs.constants.F_OK);
            return true;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Git repository not found at: ${this.projectPath}`);
            }
            throw new Error(`Cannot access Git config: ${error.message}`);
        }
    }

    async readConfig() {
        try {
            const data = await fs.readFile(this.gitConfigPath, 'utf8');
            return data;
        } catch (error) {
            throw new Error(`Failed to read Git config: ${error.message}`);
        }
    }

    async writeConfig(data) {
        try {
            await fs.writeFile(this.gitConfigPath, data, 'utf8');
            return true;
        } catch (error) {
            throw new Error(`Failed to write Git config: ${error.message}`);
        }
    }

    extractRemoteSection(configData) {
        const remoteMatch = /\[remote "origin"\][^\[]*/.exec(configData);
        if (!remoteMatch) {
            throw new Error('No [remote "origin"] section found in Git config');
        }
        return remoteMatch[0];
    }

    isUrlAlreadyExists(remoteSection, url) {
        return remoteSection.includes(url);
    }

    addUrlToRemoteSection(remoteSection, url, position) {
        if (position === 'before') {
            return remoteSection.replace(/(url = .+)/, `url = ${url}\n\t$1`);
        } else {
            return remoteSection.replace(/(url = .+?)(\n\tfetch = .+)/s, `$1\n\turl = ${url}$2`);
        }
    }

    async addUrls(urls, position = 'before') {
        await this.validateGitRepository();
        
        const configData = await this.readConfig();
        const remoteSection = this.extractRemoteSection(configData);
        
        let newRemoteSection = remoteSection;
        const results = {
            added: [],
            skipped: [],
            errors: []
        };

        for (const url of urls) {
            try {
                if (this.isUrlAlreadyExists(newRemoteSection, url)) {
                    results.skipped.push(url);
                    continue;
                }

                newRemoteSection = this.addUrlToRemoteSection(newRemoteSection, url, position);
                results.added.push(url);
            } catch (error) {
                results.errors.push({ url, error: error.message });
            }
        }

        if (results.added.length > 0) {
            const newConfigData = configData.replace(remoteSection, newRemoteSection);
            await this.writeConfig(newConfigData);
        }

        return results;
    }
}

module.exports = { GitConfigManager };