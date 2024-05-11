const fs = require('fs').promises;

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = query => {
    console.log('\x1b[33m%s\x1b[0m', query);
    return new Promise(resolve => readline.question('\x1b[36m> \x1b[0m', resolve));
};

const updateGitConfig = async () => {
    try {
        const localProjectPath = await askQuestion('Please enter the local project path:');
        const newUrl = await askQuestion('Please enter the git url:');
        readline.close();

        const gitConfigPath = `${localProjectPath.replace(/\\\\/g, '/')}/.git/config`;

        const data = await fs.readFile(gitConfigPath, 'utf8');
        if (data.includes(newUrl)) {
            console.log('\x1b[31m%s\x1b[0m', 'The new URL already exists in the config file.');
            return;
        }

        const newData = data.replace(/\[remote "origin"\].*/, `[remote "origin"]\n\turl = ${newUrl}`);

        await fs.writeFile(gitConfigPath, newData, 'utf8');
        console.log('\x1b[32m%s\x1b[0m', 'Successfully configured..');
    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', `Error: ${err.message}`);
    }
};

updateGitConfig();
