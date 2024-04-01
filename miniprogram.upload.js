/*eslint no-undef: "error"*/
/*eslint-env node*/
// "upload:mp-weixin:ztb": "cross-env version=1.0.0 desc=页面优化 node miniprogram.upload.js",
const miniprogramCI = require('miniprogram-ci');

async function bootstrap() {
  const { version = '1.0.0', desc = '页面优化', target = 'ztb' } = process.env;
  let miniConfig = {};
  switch (target) {
    case 'ztb': // 准题宝
      miniConfig = {
        appid: 'wx725144750f85c0b6',
        projectPath: `${__dirname}/dist/build/mp-weixin-ztb`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wx725144750f85c0b6.key`,
      };
      break;

    case 'ykmf': // 医考魔方
      miniConfig = {
        appid: 'wxe0763099749bcaf0',
        projectPath: `${__dirname}/dist/build/mp-weixin-ykmf`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wxe0763099749bcaf0.key`,
      };
      break;

    case 'zdytk': // 中大优题库
      miniConfig = {
        appid: 'wxc45bdadb49998e61',
        projectPath: `${__dirname}/dist/build/mp-weixin-zdytk`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wxc45bdadb49998e61.key`,
      };
      break;

    case 'zdycschool': // 中大英才学校
      miniConfig = {
        appid: 'wxd9d5bf1c8a87f4cd',
        projectPath: `${__dirname}/dist/build/mp-weixin-zdycschool`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wxd9d5bf1c8a87f4cd.key`,
      };
      break;

    case 'qysg': // 社赋社会工作平台
      miniConfig = {
        appid: 'wxc9e85aef03e51db7',
        projectPath: `${__dirname}/dist/build/mp-weixin-qysg`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wxc9e85aef03e51db7.key`,
      };
      break;

    case 'xjsg': // 新疆社工
      miniConfig = {
        appid: 'wx21b4505b127ad2bc',
        projectPath: `${__dirname}/dist/build/mp-weixin-xjsg`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wx21b4505b127ad2bc.key`,
      };
      break;

    case 'yiping': // 医聘网
      miniConfig = {
        appid: 'wxa3a43bafb52ead2e',
        projectPath: `${__dirname}/dist/build/mp-weixin-yiping`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wxa3a43bafb52ead2e.key`,
      };
      break;
    case 'yxb': // 医学宝
      miniConfig = {
        appid: 'wxb4bf18afd2eb9989',
        projectPath: `${__dirname}/dist/build/mp-weixin-yxb`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wxb4bf18afd2eb9989.key`,
      };
      break;
    case 'sxsg': // 山西铸仁社工课堂
      miniConfig = {
        appid: 'wx31fd09fe6223374e',
        projectPath: `${__dirname}/dist/build/mp-weixin-sxsg`,
        privateKeyPath: `${__dirname}/upload/privatekeys/private.wx31fd09fe6223374e.key`,
      };
      break;
    case 'xhsg': // 星河青少年社工
      miniConfig = {
        appid: 'wxf9d0ce35ff2a32b8',
        projectPath: `${__dirname}/dist/build/mp-weixin-sxsg`,
        privateKeyPath: `${__dirname}/upload/privatekeys/xhsg.key`,
      };
      break;
    default:
      break;
  }

  const miniprogramProject = new miniprogramCI.Project({
    type: 'miniProgram',
    ignores: ['node_modules/**/*'],
    ...miniConfig,
  });

  const uploadResult = await miniprogramCI.upload({
    project: miniprogramProject,
    version,
    desc,
    setting: {
      es6: true,
      es7: true,
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      minify: true,
    },
    onProgressUpdate: console.log,
  });

  console.log(uploadResult);
}

bootstrap();
