#!/usr/bin/env node

const fs = require('fs').promises;
const { prompt } = require('enquirer');

const askQuestions = async () => {
    const questions = [
        {
            name: 'localProjectPath',
            type: 'input',
            message: '\x1b[36mPlease enter the local project path (default . for current path):\x1b[0m',
            initial: '.',
        },
        {
            name: 'position',
            type: 'select',
            message: '\x1b[36mDo you want to add the URLs before or after existing ones?\x1b[0m',
            choices: ['before', 'after'],
            initial: 'before',
        },
        {
            name: 'urls',
            type: 'input',
            message: '\x1b[36mPlease enter the git URLs (separated by commas):\x1b[0m',
        },
    ];

    return await prompt(questions);
};

const updateGitConfig = async () => {
    try {
        const answers = await askQuestions();
        const localProjectPath = answers.localProjectPath.trim();
        const position = answers.position;
        const urls = answers.urls.split(/[,，]/).map(url => url.trim());

        const gitConfigPath = `${localProjectPath.replace(/\\\\/g, '/')}/.git/config`;

        const data = await fs.readFile(gitConfigPath, 'utf8');
        let newData = data;
        const remoteMatch = /\[remote "origin"\][^\[]*/.exec(data);
        if (remoteMatch) {
            let remoteSection = remoteMatch[0];

            for (let url of urls) {
                if (!remoteSection.includes(url)) {
                    if (position === 'before') {
                        remoteSection = remoteSection.replace(/(url = .+)/, `url = ${url}\n\t$1`);
                    } else {
                        remoteSection = remoteSection.replace(/(url = .+?)(\n\tfetch = .+)/s, `$1\n\turl = ${url}$2`);
                    }

                    console.log('\x1b[32m%s\x1b[0m', `Successfully added URL: ${url}`);
                } else {
                    console.log('\x1b[31m%s\x1b[0m', `The URL ${url} already exists in the config file.`);
                }
            }

            newData = newData.replace(remoteMatch[0], remoteSection);
        }

        await fs.writeFile(gitConfigPath, newData, 'utf8');
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', `Error: ${err.message}`);
    }
};

updateGitConfig();
