#!/usr/bin/env node

const { CliInterface } = require('./src/interface/cli');
const { GitConfigManager } = require('./src/core/git-config-manager');
const { Logger } = require('./src/utils/logger');

async function main() {
    try {
        const userInput = await CliInterface.getUserInput();
        
        Logger.info('🔄 Processing Git configuration...');
        
        const gitConfigManager = new GitConfigManager(userInput.localProjectPath);
        const results = await gitConfigManager.addUrls(userInput.urls, userInput.position);
        
        CliInterface.displayResults(results);
        
        if (results.added.length > 0) {
            process.exit(0);
        } else if (results.skipped.length > 0 && results.errors.length === 0) {
            Logger.warning('No new URLs were added');
            process.exit(0);
        } else {
            Logger.error('Failed to add any URLs');
            process.exit(1);
        }
    } catch (error) {
        Logger.error(`Operation failed: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
