## 2.4.3-20220505（2022-05-05）

- 秋云图表组件 修复开启 canvas2d 后将 series 赋值为空数组显示加载图标时，再次赋值后画布闪动的 bug
- 秋云图表组件 修复升级 hbx 最新版后 ECharts 的 highlight 方法报错的 bug
- uCharts.js 雷达图新增参数 opts.extra.radar.gridEval，数据点位网格抽希，默认 1
- uCharts.js 雷达图新增参数 opts.extra.radar.axisLabel， 是否显示刻度点值，默认 false
- uCharts.js 雷达图新增参数 opts.extra.radar.axisLabelTofix，刻度点值小数位数，默认 0
- uCharts.js 雷达图新增参数 opts.extra.radar.labelPointShow，是否显示末端刻度圆点，默认 false
- uCharts.js 雷达图新增参数 opts.extra.radar.labelPointRadius，刻度圆点的半径，默认 3
- uCharts.js 雷达图新增参数 opts.extra.radar.labelPointColor，刻度圆点的颜色，默认#cccccc
- uCharts.js 雷达图新增参数 opts.extra.radar.linearType，渐变色类型，可选值"none"关闭渐变,"custom"开启渐变
- uCharts.js 雷达图新增参数 opts.extra.radar.customColor，自定义渐变颜色，数组类型对应 series 的数组长度以匹配不同 series 颜色的不同配色方案，例如["#FA7D8D", "#EB88E2"]
- uCharts.js 雷达图优化支持 series.textColor、series.textSize 属性
- uCharts.js 柱状图中温度计式图标，优化支持全圆角类型，修复边框有缝隙的 bug，详见官网【演示】中的温度计图表
- uCharts.js 柱状图新增参数 opts.extra.column.activeWidth，当前点击柱状图的背景宽度，默认一个单元格单位
- uCharts.js 混合图增加 opts.extra.mix.area.gradient 区域图是否开启渐变色
- uCharts.js 混合图增加 opts.extra.mix.area.opacity 区域图透明度，默认 0.2
- uCharts.js 饼图、圆环图、玫瑰图、漏斗图，增加 opts.series[0].data[i].labelText，自定义标签文字，避免 formatter 格式化的繁琐，详见官网【演示】中的饼图
- uCharts.js 饼图、圆环图、玫瑰图、漏斗图，增加 opts.series[0].data[i].labelShow，自定义是否显示某一个指示标签，避免因饼图类别太多导致标签重复或者居多导致图形变形的问题，详见官网【演示】中的饼图
- uCharts.js 增加 opts.series[i].legendText/opts.series[0].data[i].legendText（与 series.name 同级）自定义图例显示文字的方法
- uCharts.js 优化 X 轴、Y 轴 formatter 格式化方法增加形参，统一为 fromatter:function(value,index,opts){}
- uCharts.js 修复横屏模式下无法使用双指缩放方法的 bug
- uCharts.js 修复当只有一条数据或者多条数据值相等的时候 Y 轴自动计算的最大值错误的 bug
- 【官网模板】增加外部自定义图例与图表交互的例子，[点击跳转](https://www.ucharts.cn/v2/#/layout/info?id=2)

## 注意：非 unimodules 版本如因更新 hbx 至 3.4.7 导致报错如下，请到码云更新非 unimodules 版本组件，[点击跳转](https://gitee.com/uCharts/uCharts/tree/master/uni-app/uCharts-%E7%BB%84%E4%BB%B6)

> Error in callback for immediate watcher "uchartsOpts": "SyntaxError: Unexpected token u in JSON at position 0"

## 2.4.2-20220421（2022-04-21）

- 秋云图表组件 修复 HBX 升级 3.4.6.20220420 版本后 echarts 报错的问题

## 2.4.2-20220420（2022-04-20）

## 重要！此版本 uCharts 新增了很多功能，修复了诸多已知问题

- 秋云图表组件 新增 onzoom 开启双指缩放功能（仅 uCharts），前提需要直角坐标系类图表类型，并且 ontouch 为 true、opts.enableScroll 为 true，详见实例项目 K 线图
- 秋云图表组件 新增 optsWatch 是否监听 opts 变化，关闭 optsWatch 后，动态修改 opts 不会触发图表重绘
- 秋云图表组件 修复开启 canvas2d 功能后，动态更新数据后画布闪动的 bug
- 秋云图表组件 去除 directory 属性，改为自动获取 echarts.min.js 路径（升级不受影响）
- 秋云图表组件 增加 getImage()方法及@getImage 事件，通过 ref 调用 getImage()方法获，触发@getImage 事件获取当前画布的 base64 图片文件流。
- 秋云图表组件 支付宝、字节跳动、飞书、快手小程序支持开启 canvas2d 同层渲染设置。
- 秋云图表组件 新增加【非 uniCloud】版本组件，避免有些不需要 uniCloud 的使用组件发布至小程序需要提交隐私声明问题，请到码云[【非 uniCloud 版本】](https://gitee.com/uCharts/uCharts/tree/master/uni-app/uCharts-%E7%BB%84%E4%BB%B6)，或 npm[【非 uniCloud 版本】](https://www.npmjs.com/package/@qiun/uni-ucharts)下载使用。
- uCharts.js 新增 dobuleZoom 双指缩放功能
- uCharts.js 新增山峰图 type="mount"，数据格式为饼图类格式，不需要传入 categories，具体详见新版官网在线演示
- uCharts.js 修复折线图当数据中存在 null 时 tooltip 报错的 bug
- uCharts.js 修复饼图类当画布比较小时自动计算的半径是负数报错的 bug
- uCharts.js 统一各图表类型的 series.formatter 格式化方法的形参为(val, index, series, opts)，方便格式化时有更多参数可用
- uCharts.js 标记线功能增加 labelText 自定义显示文字，增加 labelAlign 标签显示位置（左侧或右侧），增加标签显示位置微调 labelOffsetX、labelOffsetY
- uCharts.js 修复条状图当数值很小时开启圆角后样式错误的 bug
- uCharts.js 修复 X 轴开启 disabled 后，X 轴仍占用空间的 bug
- uCharts.js 修复 X 轴开启滚动条并且开启 rotateLabel 后，X 轴文字与滚动条重叠的 bug
- uCharts.js 增加 X 轴 rotateAngle 文字旋转自定义角度，取值范围(-90 至 90)
- uCharts.js 修复地图文字标签层级显示不正确的 bug
- uCharts.js 修复饼图、圆环图、玫瑰图当数据全部为 0 的时候不显示数据标签的 bug
- uCharts.js 修复当 opts.padding 上边距为 0 时，Y 轴顶部刻度标签位置不正确的 bug

## 另外我们还开发了各大原生小程序组件，已发布至码云和 npm

[https://gitee.com/uCharts/uCharts](https://gitee.com/uCharts/uCharts) [https://www.npmjs.com/~qiun](https://www.npmjs.com/~qiun)

## 对于原生 uCharts 文档我们已上线新版官方网站，详情点击下面链接进入官网

[https://www.uCharts.cn/v2/](https://www.ucharts.cn/v2/)

## 2.3.7-20220122（2022-01-22）

## 重要！使用 vue3 编译，请使用 cli 模式并升级至最新依赖，HbuilderX 编译需要使用 3.3.8 以上版本

- uCharts.js 修复 uni-app 平台组件模式使用 vue3 编译到小程序报错的 bug。

## 2.3.7-20220118（2022-01-18）

## 注意，使用 vue3 的前提是需要 3.3.8.20220114-alpha 版本的 HBuilder！

## 2.3.67-20220118（2022-01-18）

- 秋云图表组件 组件初步支持 vue3，全端编译会有些问题，具体详见下面修改：

1. 小程序端运行时，在 uni_modules 文件夹的 qiun-data-charts.js 中搜索 new uni_modules_qiunDataCharts_js_sdk_uCharts_uCharts.uCharts，将.uCharts 去掉。
2. 小程序端发行时，在 uni_modules 文件夹的 qiun-data-charts.js 中搜索 new e.uCharts，将.uCharts 去掉，变为 new e。
3. 如果觉得上述步骤比较麻烦，如果您的项目只编译到小程序端，可以修改 u-charts.js 最后一行导出方式，将 export default uCharts;变更为 export default { uCharts: uCharts }; 这样变更后，H5 和 App 端的 renderjs 会有问题，请开发者自行选择。（此问题非组件问题，请等待 DC 官方修复 Vue3 的小程序端）

## 2.3.6-20220111（2022-01-11）

- 秋云图表组件 修改组件 props 属性中的 background 默认值为 rgba(0,0,0,0)

## 2.3.6-20211201（2021-12-01）

- uCharts.js 修复 bar 条状图开启圆角模式时，值很小时圆角渲染错误的 bug

## 2.3.5-20211014（2021-10-15）

- uCharts.js 增加 vue3 的编译支持（仅原生 uCharts，qiun-data-charts 组件后续会支持，请关注更新）

## 2.3.4-20211012（2021-10-12）

- 秋云图表组件 修复 mac os x 系统 mouseover 事件丢失的 bug

## 2.3.3-20210706（2021-07-06）

- uCharts.js 增加雷达图开启数据点值（opts.dataLabel）的显示

## 2.3.2-20210627（2021-06-27）

- 秋云图表组件 修复 tooltipCustom 个别情况下传值不正确报错 TypeError: Cannot read property 'name' of undefined 的 bug

## 2.3.1-20210616（2021-06-16）

- uCharts.js 修复圆角柱状图使用 4 角圆角时，当数值过大时不正确的 bug

## 2.3.0-20210612（2021-06-12）

- uCharts.js 【重要】uCharts 增加 nvue 兼容，可在 nvue 项目中使用 gcanvas 组件渲染 uCharts，[详见码云 uCharts-demo-nvue](https://gitee.com/uCharts/uCharts)
- 秋云图表组件 增加 tapLegend 属性，是否开启图例点击交互事件
- 秋云图表组件 getIndex 事件中增加返回 uCharts 实例中的 opts 参数，以便在页面中调用参数
- 示例项目 pages/other/other.vue 增加 app 端自定义 tooltip 的方法，详见 showOptsTooltip 方法

## 2.2.1-20210603（2021-06-03）

- uCharts.js 修复饼图、圆环图、玫瑰图，当起始角度不为 0 时，tooltip 位置不准确的 bug
- uCharts.js 增加温度计式柱状图开启顶部半圆形的配置

## 2.2.0-20210529（2021-05-29）

- uCharts.js 增加条状图 type="bar"
- 示例项目 pages/ucharts/ucharts.vue 增加条状图的 demo

## 2.1.7-20210524（2021-05-24）

- uCharts.js 修复大数据量模式下曲线图不平滑的 bug

## 2.1.6-20210523（2021-05-23）

- 秋云图表组件 修复小程序端开启滚动条更新数据后滚动条位置不符合预期的 bug

## 2.1.5-2021051702（2021-05-17）

- uCharts.js 修复自定义 Y 轴 min 和 max 值为 0 时不能正确显示的 bug

## 2.1.5-20210517（2021-05-17）

- uCharts.js 修复 Y 轴自定义 min 和 max 时，未按指定的最大值最小值显示坐标轴刻度的 bug

## 2.1.4-20210516（2021-05-16）

- 秋云图表组件 优化 onWindowResize 防抖方法
- 秋云图表组件 修复 APP 端 uCharts 更新数据时，清空 series 显示 loading 图标后再显示图表，图表抖动的 bug
- uCharts.js 修复开启 canvas2d 后，x 轴、y 轴、series 自定义字体大小未按比例缩放的 bug
- 示例项目 修复 format-e.vue 拼写错误导致 app 端使用 uCharts 渲染图表

## 2.1.3-20210513（2021-05-13）

- 秋云图表组件 修改 uCharts 变更 chartData 数据为 updateData 方法，支持带滚动条的数据动态打点
- 秋云图表组件 增加 onWindowResize 防抖方法 fix by ど誓言，如尘般染指流年づ
- 秋云图表组件 H5 或者 APP 变更 chartData 数据显示 loading 图表时，原数据闪现的 bug
- 秋云图表组件 props 增加 errorReload 禁用错误点击重新加载的方法
- uCharts.js 增加 tooltip 显示 category（x 轴对应点位）标题的功能，opts.extra.tooltip.showCategory，默认为 false
- uCharts.js 修复 mix 混合图只有柱状图时，tooltip 的分割线显示位置不正确的 bug
- uCharts.js 修复开启滚动条，图表在拖动中动态打点，滚动条位置不正确的 bug
- uCharts.js 修复饼图类数据格式为 echarts 数据格式，series 为空数组报错的 bug
- 示例项目 修改 uCharts.js 更新到 v2.1.2 版本后，@getIndex 方法获取索引值变更为 e.currentIndex.index
- 示例项目 pages/updata/updata.vue 增加滚动条拖动更新（数据动态打点）的 demo
- 示例项目 pages/other/other.vue 增加 errorReload 禁用错误点击重新加载的 demo

## 2.1.2-20210509（2021-05-09）

秋云图表组件 修复 APP 端初始化时就传入 chartData 或 lacaldata 不显示图表的 bug

## 2.1.1-20210509（2021-05-09）

- 秋云图表组件 变更 ECharts 的 eopts 配置在 renderjs 内执行，支持在 config-echarts.js 配置文件内写 function 配置。
- 秋云图表组件 修复 APP 端报错 Prop being mutated: "onmouse"错误的 bug。
- 秋云图表组件 修复 APP 端报错 Error: Not Found：Page[6][-1,27] at view.umd.min.js:1 的 bug。

## 2.1.0-20210507（2021-05-07）

- 秋云图表组件 修复初始化时就有数据或者数据更新的时候 loading 加载动画闪动的 bug
- uCharts.js 修复 x 轴 format 方法 categories 为字符串类型时返回 NaN 的 bug
- uCharts.js 修复 series.textColor、legend.fontColor 未执行全局默认颜色的 bug

## 2.1.0-20210506（2021-05-06）

- 秋云图表组件 修复极个别情况下报错 item.properties undefined 的 bug
- 秋云图表组件 修复极个别情况下关闭加载动画 reshow 不起作用，无法显示图表的 bug
- 示例项目 pages/ucharts/ucharts.vue 增加时间轴折线图（type="tline"）、时间轴区域图（type="tarea"）、散点图（type="scatter"）、气泡图 demo（type="bubble"）、倒三角形漏斗图（opts.extra.funnel.type="triangle"）、金字塔形漏斗图（opts.extra.funnel.type="pyramid"）
- 示例项目 pages/format-u/format-u.vue 增加 X 轴 format 格式化示例
- uCharts.js 升级至 v2.1.0 版本
- uCharts.js 修复 玫瑰图面积模式点击 tooltip 位置不正确的 bug
- uCharts.js 修复 玫瑰图点击图例，只剩一个类别显示空白的 bug
- uCharts.js 修复 饼图类图点击图例，其他图表 tooltip 位置某些情况下不准的 bug
- uCharts.js 修复 x 轴为矢量轴（时间轴）情况下，点击 tooltip 位置不正确的 bug
- uCharts.js 修复 词云图获取点击索引偶尔不准的 bug
- uCharts.js 增加 直角坐标系图表 X 轴 format 格式化方法（原生 uCharts.js 用法请使用 formatter）
- uCharts.js 增加 漏斗图扩展配置，倒三角形（opts.extra.funnel.type="triangle"），金字塔形（opts.extra.funnel.type="pyramid"）
- uCharts.js 增加 散点图（opts.type="scatter"）、气泡图（opts.type="bubble"）
- 后期计划 完善散点图、气泡图，增加 markPoints 标记点，增加横向条状图。

## 2.0.0-20210502（2021-05-02）

- uCharts.js 修复词云图获取点击索引不正确的 bug

## 2.0.0-20210501（2021-05-01）

- 秋云图表组件 修复 QQ 小程序、百度小程序在关闭动画效果情况下，v-for 循环使用图表，显示不正确的 bug

## 2.0.0-20210426（2021-04-26）

- 秋云图表组件 修复 QQ 小程序不支持 canvas2d 的 bug
- 秋云图表组件 修复钉钉小程序某些情况点击坐标计算错误的 bug
- uCharts.js 增加 extra.column.categoryGap 参数，柱状图类每个 category 点位（X 轴点）柱子组之间的间距
- uCharts.js 增加 yAxis.data[i].titleOffsetY 参数，标题纵向偏移距离，负数为向上偏移，正数向下偏移
- uCharts.js 增加 yAxis.data[i].titleOffsetX 参数，标题横向偏移距离，负数为向左偏移，正数向右偏移
- uCharts.js 增加 extra.gauge.labelOffset 参数，仪表盘标签文字径向便宜距离，默认 13px

## 2.0.0-20210422-2（2021-04-22）

秋云图表组件 修复 formatterAssign 未判断 args[key] == null 的情况导致栈溢出的 bug

## 2.0.0-20210422（2021-04-22）

- 秋云图表组件 修复 H5、APP、支付宝小程序、微信小程序 canvas2d 模式下横屏模式的 bug

## 2.0.0-20210421（2021-04-21）

- uCharts.js 修复多行图例的情况下，图例在上方或者下方时，图例 float 为左侧或者右侧时，第二行及以后的图例对齐方式不正确的 bug

## 2.0.0-20210420（2021-04-20）

- 秋云图表组件 修复微信小程序开启 canvas2d 模式后，windows 版微信小程序不支持 canvas2d 模式的 bug
- 秋云图表组件 修改非 uni_modules 版本为 v2.0 版本 qiun-data-charts 组件

## 2.0.0-20210419（2021-04-19）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧绿色【使用 HBuilderX 导入插件】即可使用，示例项目请点击右侧蓝色按钮【使用 HBuilderX 导入示例项目】。

## 初次使用如果提示未注册&lt;qiun-data-charts&gt;组件，请重启 HBuilderX，如仍不好用，请重启电脑；

## 如果是 cli 项目，请尝试清理 node_modules，重新 install，还不行就删除项目，再重新 install。

## 此问题已于 DCloud 官方确认，HBuilderX 下个版本会修复。

## 其他图表不显示问题详见[常见问题选项卡](https://demo.ucharts.cn)

## <font color=#FF0000> 新手请先完整阅读帮助文档及常见问题 3 遍，右侧蓝色按钮示例项目请看 2 遍！ </font>

## [DEMO 演示及在线生成工具（v2.0 文档）https://demo.ucharts.cn](https://demo.ucharts.cn)

## [图表组件在项目中的应用参见 UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

- uCharts.js 修复混合图中柱状图单独设置颜色不生效的 bug
- uCharts.js 修复多 Y 轴单独设置 fontSize 时，开启 canvas2d 后，未对应放大字体的 bug

## 2.0.0-20210418（2021-04-18）

- 秋云图表组件 增加 directory 配置，修复 H5 端 history 模式下如果发布到二级目录无法正确加载 echarts.min.js 的 bug

## 2.0.0-20210416（2021-04-16）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧绿色【使用 HBuilderX 导入插件】即可使用，示例项目请点击右侧蓝色按钮【使用 HBuilderX 导入示例项目】。

## 初次使用如果提示未注册&lt;qiun-data-charts&gt;组件，请重启 HBuilderX，如仍不好用，请重启电脑；

## 如果是 cli 项目，请尝试清理 node_modules，重新 install，还不行就删除项目，再重新 install。

## 此问题已于 DCloud 官方确认，HBuilderX 下个版本会修复。

## 其他图表不显示问题详见[常见问题选项卡](https://demo.ucharts.cn)

## <font color=#FF0000> 新手请先完整阅读帮助文档及常见问题 3 遍，右侧蓝色按钮示例项目请看 2 遍！ </font>

## [DEMO 演示及在线生成工具（v2.0 文档）https://demo.ucharts.cn](https://demo.ucharts.cn)

## [图表组件在项目中的应用参见 UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

- 秋云图表组件 修复 APP 端某些情况下报错`Not Found Page`的 bug，fix by 高级 bug 开发技术员
- 示例项目 修复 APP 端 v-for 循环某些情况下报错`Not Found Page`的 bug，fix by 高级 bug 开发技术员
- uCharts.js 修复非直角坐标系 tooltip 提示窗右侧超出未变换方向显示的 bug

## 2.0.0-20210415（2021-04-15）

- 秋云图表组件 修复 H5 端发布到二级目录下 echarts 无法加载的 bug
- 秋云图表组件 修复某些情况下 echarts.off('finished')移除监听事件报错的 bug

## 2.0.0-20210414（2021-04-14）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧绿色【使用 HBuilderX 导入插件】即可使用，示例项目请点击右侧蓝色按钮【使用 HBuilderX 导入示例项目】。

## 初次使用如果提示未注册&lt;qiun-data-charts&gt;组件，请重启 HBuilderX，如仍不好用，请重启电脑；

## 如果是 cli 项目，请尝试清理 node_modules，重新 install，还不行就删除项目，再重新 install。

## 此问题已于 DCloud 官方确认，HBuilderX 下个版本会修复。

## 其他图表不显示问题详见[常见问题选项卡](https://demo.ucharts.cn)

## <font color=#FF0000> 新手请先完整阅读帮助文档及常见问题 3 遍，右侧蓝色按钮示例项目请看 2 遍！ </font>

## [DEMO 演示及在线生成工具（v2.0 文档）https://demo.ucharts.cn](https://demo.ucharts.cn)

## [图表组件在项目中的应用参见 UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

- 秋云图表组件 修复 H5 端在 cli 项目下 ECharts 引用地址错误的 bug
- 示例项目 增加 ECharts 的 formatter 用法的示例(详见示例项目 format-e.vue)
- uCharts.js 增加圆环图中心背景色的配置 extra.ring.centerColor
- uCharts.js 修复微信小程序安卓端柱状图开启透明色后显示不正确的 bug

## 2.0.0-20210413（2021-04-13）

- 秋云图表组件 修复百度小程序多个图表真机未能正确获取根元素 dom 尺寸的 bug
- 秋云图表组件 修复百度小程序横屏模式方向不正确的 bug
- 秋云图表组件 修改 ontouch 时，@getTouchStart@getTouchMove@getTouchEnd 的触发条件
- uCharts.js 修复饼图类数据格式 series 属性不生效的 bug
- uCharts.js 增加时序区域图 详见示例项目中 ucharts.vue

## 2.0.0-20210412-2（2021-04-12）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧绿色【使用 HBuilderX 导入插件】即可使用，示例项目请点击右侧蓝色按钮【使用 HBuilderX 导入示例项目】。

## 初次使用如果提示未注册&lt;qiun-data-charts&gt;组件，请重启 HBuilderX。如仍不好用，请重启电脑，此问题已于 DCloud 官方确认，HBuilderX 下个版本会修复。

## [DEMO 演示及在线生成工具（v2.0 文档）https://demo.ucharts.cn](https://demo.ucharts.cn)

## [图表组件在 uniCloudAdmin 中的应用 UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

- 秋云图表组件 修复 uCharts 在 APP 端横屏模式下不能正确渲染的 bug
- 示例项目 增加 ECharts 柱状图渐变色、圆角柱状图、横向柱状图（条状图）的示例

## 2.0.0-20210412（2021-04-12）

- 秋云图表组件 修复 created 中判断 echarts 导致 APP 端无法识别，改回 mounted 中判断 echarts 初始化
- uCharts.js 修复 2d 模式下 series.textOffset 未乘像素比的 bug

## 2.0.0-20210411（2021-04-11）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧绿色【使用 HBuilderX 导入插件】即可使用，示例项目请点击右侧蓝色按钮【使用 HBuilderX 导入示例项目】。

## 初次使用如果提示未注册<qiun-data-charts>组件，请重启 HBuilderX，并清空小程序开发者工具缓存。

## [DEMO 演示及在线生成工具（v2.0 文档）https://demo.ucharts.cn](https://demo.ucharts.cn)

## [图表组件在 uniCloudAdmin 中的应用 UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

- uCharts.js 折线图区域图增加 connectNulls 断点续连的功能，详见示例项目中 ucharts.vue
- 秋云图表组件 变更初始化方法为 created，变更 type2d 默认值为 true，优化 2d 模式下组件初始化后 dom 获取不到的 bug
- 秋云图表组件 修复左右布局时，右侧图表点击坐标错误的 bug，修复 tooltip 柱状图自定义颜色显示 object 的 bug

## 2.0.0-20210410（2021-04-10）

- 修复左右布局时，右侧图表点击坐标错误的 bug，修复柱状图自定义颜色 tooltip 显示 object 的 bug
- 增加标记线及柱状图自定义颜色的 demo

## 2.0.0-20210409（2021-04-08）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧【使用 HBuilderX 导入插件】即可体验，DEMO 演示及在线生成工具（v2.0 文档）[https://demo.ucharts.cn](https://demo.ucharts.cn)

## 图表组件在 uniCloudAdmin 中的应用 [UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

- uCharts.js 修复钉钉小程序百度小程序 measureText 不准确的 bug，修复 2d 模式下饼图类 activeRadius 为按比例放大的 bug
- 修复组件在支付宝小程序端点击位置不准确的 bug

## 2.0.0-20210408（2021-04-07）

- 修复组件在支付宝小程序端不能显示的 bug（目前支付宝小程不能点击交互，后续修复）
- uCharts.js 修复高分屏下柱状图类，圆弧进度条 自定义宽度不能按比例放大的 bug

## 2.0.0-20210407（2021-04-06）

## v1.0 版本已停更，建议转 uni_modules 版本组件方式调用，点击右侧【使用 HBuilderX 导入插件】即可体验，DEMO 演示及在线生成工具（v2.0 文档）[https://demo.ucharts.cn](https://demo.ucharts.cn)

## 增加 通过 tofix 和 unit 快速格式化 y 轴的 demo add by `howcode`

## 增加 图表组件在 uniCloudAdmin 中的应用 [UReport 数据报表](https://ext.dcloud.net.cn/plugin?id=4651)

## 2.0.0-20210406（2021-04-05）

# 秋云图表组件+uCharts v2.0 版本同步上线，使用方法详见https://demo.ucharts.cn帮助页

## 2.0.0（2021-04-05）

# 秋云图表组件+uCharts v2.0 版本同步上线，使用方法详见https://demo.ucharts.cn帮助页
