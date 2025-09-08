const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m'
};

const symbols = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    question: '?'
};

class Logger {
    static success(message) {
        console.log(`${colors.green}${symbols.success} ${message}${colors.reset}`);
    }

    static error(message) {
        console.log(`${colors.red}${symbols.error} ${message}${colors.reset}`);
    }

    static warning(message) {
        console.log(`${colors.yellow}${symbols.warning} ${message}${colors.reset}`);
    }

    static info(message) {
        console.log(`${colors.cyan}${symbols.info} ${message}${colors.reset}`);
    }

    static title(message) {
        console.log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}\n`);
    }

    static divider() {
        console.log(`${colors.gray}${'─'.repeat(50)}${colors.reset}`);
    }

    static newLine() {
        console.log('');
    }
}

module.exports = { Logger, colors, symbols };