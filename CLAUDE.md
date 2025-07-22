# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

git-linker is a Node.js CLI tool that simplifies Git URL configuration by allowing users to add multiple remote URLs to a Git repository's configuration file. The tool modifies the `.git/config` file to support pushing to multiple Git hosting platforms (GitHub, Gitee, etc.) simultaneously.

## Commands

### Installation and Usage
```bash
# Install globally
npm install -g git-linker
# or
pnpm install git-linker -g

# Run the tool
git-linker
```

### Development Commands
```bash
# Install dependencies
npm install

# Run the application locally
npm start
# or
node index.js

# Lint code (legacy ESLint config)
npx eslint index.js src/ --config .eslintrc.yml
```

## Architecture

The project has been refactored into a modular structure:

```
├── index.js                    # Main entry point
├── src/
│   ├── core/
│   │   └── git-config-manager.js   # Git configuration management
│   ├── interface/
│   │   └── cli.js                  # CLI interface and user interaction
│   └── utils/
│       ├── logger.js               # Enhanced logging with colors and symbols
│       └── validator.js            # Input validation utilities
```

### Key Modules

#### GitConfigManager (`src/core/git-config-manager.js`)
- Handles all Git configuration file operations
- Validates Git repository structure
- Manages URL addition with position control
- Provides comprehensive error handling

#### CliInterface (`src/interface/cli.js`)
- Enhanced user interface with colors and emojis
- Input validation and user guidance
- Beautiful result display with status indicators
- Graceful error handling and user cancellation

#### Logger (`src/utils/logger.js`)
- Colored console output with symbols
- Success, error, warning, and info message types
- Visual dividers and formatting utilities

#### Validator (`src/utils/validator.js`)
- Path validation and sanitization
- Git URL format validation
- Input sanitization and error reporting

### Enhanced Features

- **Beautiful CLI Interface**: Color-coded output with emojis and symbols
- **Input Validation**: Real-time validation of paths and Git URLs
- **Error Handling**: Comprehensive error messages and graceful failure
- **User Experience**: Clear prompts, hints, and progress indicators
- **Modular Architecture**: Separated concerns for better maintainability

## Dependencies

- **enquirer**: Interactive CLI prompts with enhanced features
- **fs/promises**: File system operations (Node.js built-in)
- **path**: Path manipulation utilities (Node.js built-in)

## Configuration

- **ESLint**: Uses Airbnb base configuration (`.eslintrc.yml`)
- **Node Version**: Requires Node.js >= 14.0.0
- **Package Type**: CommonJS (not ES modules)

## Development Notes

- The codebase follows modular design principles
- Error handling is comprehensive with user-friendly messages
- Input validation prevents common errors and security issues
- CLI interface provides clear feedback and guidance
- Code is organized by functionality for easy maintenance