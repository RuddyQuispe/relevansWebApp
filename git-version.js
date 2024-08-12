
const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync, existsSync, mkdirSync } = require('fs-extra');

const gitInfo = gitDescribeSync({
    dirtyMark: false,
    dirtySemver: false
});

gitInfo.version = version;

if (!existsSync(__dirname + '/src/assets')) {
    mkdirSync(__dirname + '/src/assets');
}
const file = resolve(__dirname, 'src', 'assets', 'version.json');
writeFileSync(file,
`
${JSON.stringify(gitInfo, null, 4)}
`, { encoding: 'utf-8' });


const file2 = resolve(__dirname, 'src', 'environments', 'version.ts');
writeFileSync(file2,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
/* eslint-disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

console.log(`Wrote version info ${gitInfo.raw} to ${relative(resolve(__dirname, '..'), file)}`);
