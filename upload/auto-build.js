/* eslint-disable no-undef */
const fs = require('fs');
const { execSync } = require('child_process');
const channelconfig = require('./config');

// 匹配名称
const searchPattern1 = /准题宝/g;
// 更新appid
const searchPattern2 = /wx725144750f85c0b6/g;
//
const searchPattern3 = /ZHUNTIBAO/g;

const { target = 'ztb' } = process.env;

// 替换文件内容
function replaceContent(replaceFilePath) {
  const data = fs.readFileSync(replaceFilePath, 'utf8');
  // 匹配内容
  let modifiedContent =
    data &&
    data
      .replaceAll(searchPattern1, channelconfig[target]['replacementText1'])
      .replaceAll(searchPattern2, channelconfig[target]['replacementText2'])
      .replaceAll(searchPattern3, channelconfig[target]['replacementText3']);
  fs.writeFileSync(replaceFilePath, modifiedContent, 'utf8');
}

// 替换文件内容
const replaceFilePath1 = `${__dirname}/../src/manifest.json`;
const replaceFilePath2 = `${__dirname}/../src/pages.json`;
const replaceFilePath3 = `${__dirname}/../src/build/index.ts`;
replaceContent(replaceFilePath1);
replaceContent(replaceFilePath2);
replaceContent(replaceFilePath3);

// 构建
execSync(channelconfig[target]['script']);
// 上传
execSync(channelconfig[target]['upload']);

// 回滚修改的代码
execSync('git reset --hard');
