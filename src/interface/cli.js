const { prompt } = require('enquirer');
const { Logger, colors } = require('../utils/logger');
const { Validator } = require('../utils/validator');

class CliInterface {
    static async showWelcome() {
        Logger.title('🔗 Git Linker');
        Logger.info('A tool to simplify Git URL configuration');
        Logger.divider();
    }

    static async askProjectPath() {
        const response = await prompt({
            name: 'localProjectPath',
            type: 'input',
            message: `${colors.cyan}📂 Enter the local project path:${colors.reset}`,
            initial: '.',
            hint: '(default: current directory)',
            validate: (value) => {
                const path = value || '.';
                if (!Validator.isValidPath(path)) {
                    return 'Please enter a valid path';
                }
                return true;
            }
        });

        return response.localProjectPath || '.';
    }

    static async askPosition() {
        const response = await prompt({
            name: 'position',
            type: 'select',
            message: `${colors.cyan}📍 Add URLs before or after existing ones?${colors.reset}`,
            choices: [
                { name: 'before', message: '⬆️  Before existing URLs' },
                { name: 'after', message: '⬇️  After existing URLs' }
            ],
            initial: 0
        });

        return response.position;
    }

    static async askUrls() {
        const response = await prompt({
            name: 'urls',
            type: 'input',
            message: `${colors.cyan}🌐 Enter Git URLs (separated by commas):${colors.reset}`,
            hint: 'e.g., https://github.com/user/repo.git, https://gitee.com/user/repo.git',
            validate: (value) => {
                const validation = Validator.validateUrls(value);
                if (!validation.valid) {
                    return validation.error;
                }
                return true;
            }
        });

        return response.urls;
    }

    static async getUserInput() {
        try {
            await this.showWelcome();
            
            const localProjectPath = await this.askProjectPath();
            const position = await this.askPosition();
            const urlsString = await this.askUrls();
            
            const urlValidation = Validator.validateUrls(urlsString);
            if (!urlValidation.valid) {
                throw new Error(urlValidation.error);
            }

            Logger.newLine();
            return {
                localProjectPath,
                position,
                urls: urlValidation.urls
            };
        } catch (error) {
            if (error.name === 'cancelled') {
                Logger.warning('Operation cancelled by user');
                process.exit(0);
            }
            throw error;
        }
    }

    static displayResults(results) {
        Logger.divider();
        Logger.title('📊 Results');

        if (results.added.length > 0) {
            Logger.info(`${colors.green}Successfully added ${results.added.length} URL(s):${colors.reset}`);
            results.added.forEach(url => {
                Logger.success(url);
            });
            Logger.newLine();
        }

        if (results.skipped.length > 0) {
            Logger.info(`${colors.yellow}Skipped ${results.skipped.length} existing URL(s):${colors.reset}`);
            results.skipped.forEach(url => {
                Logger.warning(`${url} (already exists)`);
            });
            Logger.newLine();
        }

        if (results.errors.length > 0) {
            Logger.info(`${colors.red}Failed to process ${results.errors.length} URL(s):${colors.reset}`);
            results.errors.forEach(({ url, error }) => {
                Logger.error(`${url}: ${error}`);
            });
            Logger.newLine();
        }

        if (results.added.length > 0) {
            Logger.info(`${colors.cyan}💡 Tip: Run "git remote -v" to verify the configuration${colors.reset}`);
        }
        
        Logger.divider();
    }
}

module.exports = { CliInterface };