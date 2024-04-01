/* eslint-disable no-undef */
const fs = require('fs');
const { execSync } = require('child_process');
const channelconfig = require('./config');

const searchPattern1 = /准题宝/g; // 替换名称
const searchPattern2 = /DEV|TEST|PRODUCTION/g; // 替换构建环境

const { target = 'h5', env = 'production' } = process.env;

// 替换文件内容
function replaceContent(formFilePath) {
  const data = fs.readFileSync(formFilePath, 'utf8');
  // 匹配内容
  let modifiedContent =
    data &&
    data
      .replaceAll(searchPattern1, channelconfig[target]['replacementText1'])
      .replaceAll(searchPattern2, env.toUpperCase());
  fs.writeFileSync(formFilePath, modifiedContent, 'utf8');
}

// 替换文件
const fromReplaceFilePath1 = `${__dirname}/../src/build/index.ts`; // 走不同的环境
const fromReplaceFilePath2 = `${__dirname}/../src/manifest.json`;
const fromReplaceFilePath3 = `${__dirname}/../src/pages.json`;

replaceContent(fromReplaceFilePath1);
replaceContent(fromReplaceFilePath2);
replaceContent(fromReplaceFilePath3);

// 构建
execSync(channelconfig[target]['script']);

// 回滚修改
execSync('git reset --hard');

console.log('执行完毕啦');
