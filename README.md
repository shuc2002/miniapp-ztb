# applets

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 目录架构说明

> src

```js
├─api               //后端接口API
│  ├─messageInfo    //提示信息设置
│  ├─modules        //模块化
│  └─request        //请求
│    ├─helper       //白名单
│    ├─newIndex     //请求方法
│    └─upload       //图片请求
│
├─build             //渠道、版本号、环境基本信息配置
│  └─index
│
├─common
│  ├─icon           //阿里巴巴矢量图标库文件,运行方式：在本地文件夹git base后输入iconfont -tools
│  └─css            //公共样式文件
│
├─components        //全局组件文件夹
│
├─enums             //各个渠道资源地址存放
│
├─static            //静态图片资源
│
├─store             //vuex文件
│
├─pages             //存放页面文件
│  ├─business
│  ├─page_commodity // 商品、订单相关页面
│  ├─page_material
│  └─page_mockExam  // 考试页面
│
├─utils             //工具类、方法|根据业务开发
│  ├─common
│  ├─pay            // 支付方法
│  ├─public         // 防抖与节流
│  └─routerLink     // 跳转方法
│
│ manifest.json     // 设置发布信息
│ pages.json        // 页面分包与导航栏信息设置
│ gitignore         // git信息配置
```

## 打包

热更新：dev:mp-baidu dev:mp-toutiao dev:mp-weixin 打包：build:mp-baidu build:mp-toutiao build:mp-weixin 不同渠道需修改 src/manifest.json 文件和 build/index.ts 文件的相关配置,渠道配置相关信息在 enums/msgEnum.ts 文件中 H5 打包自动发布到https://ztb-h5-test.wangxiao.cn

## commit

npm run commit
