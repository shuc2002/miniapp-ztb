import baseInfo from '@/build/index';

/**
 * @description: 小程序LOGO
 */
export enum ChannelLogo {
  ZHONGDAWANGXIAO = '../../static/img/logo/zaojia.png',
  ZHUNTIBAO = '../../static/img/logo.jpg',
  FANGGU = 'https://app.static.wangxiao.cn/ztb/fanggu.png',
  FANGJING = 'https://app.static.wangxiao.cn/ztb/fangjing.png',
  SHENJI = 'https://app.static.wangxiao.cn/ztb/shenji.png',
  ANQUAN = 'https://app.static.wangxiao.cn/ztb/anquan.png',
  ERJIAN = 'https://app.static.wangxiao.cn/ztb/erjian.png',
  JIANZAO = 'https://app.static.wangxiao.cn/ztb/jianzaoshi.png',
  SHEGONG = 'https://app.static.wangxiao.cn/ztb/shegong.png',
  ZAOJIA = 'https://app.static.wangxiao.cn/ztb/zaojia.png',
  XIAOFANG = 'https://app.static.wangxiao.cn/ztb/xiaofang.png',
  KUAIJI = 'https://app.static.wangxiao.cn/ztb/kuaiji.png',
  GUIHUA = 'https://app.static.wangxiao.cn/ztb/zaojia.png',
  JINGJI = 'https://app.static.wangxiao.cn/ztb/jinjishi.png',
  YIJIAN = 'https://app.static.wangxiao.cn/ztb/yijian.png',

  YIKAO = 'https://app.static.wangxiao.cn/ztb/yikao.png',
  YOUTIKU = '../../static/img/youtiku1.png', // 中大优题库(监理工程师)
  HENGQI = 'https://app.static.wangxiao.cn/ztb/hengqicaishui.png',

  ZHUNTIBAO2 = '../../static/img/logo.jpg',
}

/**
 * @description: 小程序LOGO
 */
export enum ChannelSingleLogo {
  ZHUNTIBAO = 't-icon-zhongdalogo',
  YIKAO = 't-icon-yikaologo',
  YOUTIKU = 't-icon-yikaologo', // ???
  HENGQI = 't-icon-hqlogo2',

  ZHUNTIBAO2 = 't-icon-zhongdalogo',
}

/**
 * @description: 小程序名称
 */
export enum ChannelName {
  ZHONGDAWANGXIAO = '中大网校',
  ZHUNTIBAO = '准题宝',
  FANGGU = '中大房地产估价师考试',
  FANGJING = '中大房产经纪人考试',
  SHENJI = '中大网校审计师',

  ANQUAN = '中大安全工程师考试',
  ERJIAN = '中大二建考试',
  JIANZAO = '中大建造师考试',
  SHEGONG = '中大社会工作者考试',
  ZAOJIA = '中大造价工程师考试',

  XIAOFANG = '中大消防工程师考试',
  KUAIJI = '中大会计在线',
  GUIHUA = '中大城乡规划师考试',
  JINGJI = '中大经济师考试',
  YIJIAN = '中大一建考试',

  YIKAO = '医考魔方',
  YOUTIKU = '中大优题库',
  HENGQI = '恒企财税',

  ZHUNTIBAO2 = '准题宝2',
  QINGYI = '社赋工作平台',
  ZHIBOYINGXIAO = '中大英才学校',
  YIXUEBAO = '医学宝',
  SXSG = '铸仁社工课',
  XHSG = '星河社工',
}

/**
 * @description: 小程序介绍
 */
export enum ChannelIntroduce {
  ZHONGDAWANGXIAO = '中大网校是一款自学考试题库学习小程序，主要涵盖二级建造师、社会工作者、护士资格，教师资格等考试项目的相关习题',
  ZHUNTIBAO = '准题宝隶属于中大英才，是一款适用于各类职业资格考试的题库学习小程序，主要涵盖二级建造师、社会工作者、教师资格、护士资格、会计职业资格等热门考试项目。准题宝为用户提供了历年考试真题、模拟试题、在线培训课程及报考指导等考证服务。用户进入小程序可进行每日刷题、章节练习，还可以使用积分兑换精品课程。同时准题宝可以准确的分析高频考点和高频易错题，能随时随地带给用户方便快捷的刷题体验。',
  FANGGU = '中大房地产估价师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  FANGJING = '中大房产经纪人考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  SHENJI = '中大网校审计师是中大网校关于xx、xx、xx、xx项目的刷题小程序',

  ANQUAN = '中大安全工程师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  ERJIAN = '中大二建考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  JIANZAO = '中大建造师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  SHEGONG = '中大社会工作者考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  ZAOJIA = '中大造价工程师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',

  XIAOFANG = '中大消防工程师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  KUAIJI = '中大会计在线是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  GUIHUA = '中大城乡规划师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  JINGJI = '中大经济师考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',
  YIJIAN = '中大一建考试是中大网校关于xx、xx、xx、xx项目的刷题小程序',

  YIKAO = '湖南医考魔方教育科技有限公司是中大英才（北京）网络教育科技有限公司旗下子公司，由上市公司作为支撑，具有雄厚的资金实力，市场广阔。公司成立于2020年，专业从事医学、护理、药学等在线职业教育的咨询、培训、在线学习和技术服务，致力于医学、护理、药学等互联网教育的改革与创新，为广大医药卫生考生提供一站式的终身学习解决方案。目前业务涵盖各医药卫生的执业资格、职称、考编、考研、考博、继续教育、规培辅导等领域。',
  YOUTIKU = '中大优题库是一款适用于各类职业资格考试的题库学习小程序，主要涵盖监理工程师、二级建造师、社会工作者、教师资格、护士资格、会计职业资格等热门考试项目。中大优题库为用户提供了历年真题、模拟试题及在线培训课程等考证服务。用户进入小程序可进行每日刷题、章节练习。同时中大优题库可以准确的分析高频考点和高频易错题，能随时随地带给用户方便快捷的刷题体验。',
  HENGQI = '恒企财税,学习有动力,考证有方法,就业有底气!拒绝死记硬背,枯燥无味!19年会计培训经验,率先开启情景体验式培训,在玩乐中学,在案例中学,在体验中学!',

  ZHUNTIBAO2 = '准题宝隶属于中大英才，是一款适用于各类职业资格考试的题库学习小程序，主要涵盖二级建造师、社会工作者、教师资格、护士资格、会计职业资格等热门考试项目。准题宝为用户提供了历年考试真题、模拟试题、在线培训课程及报考指导等考证服务。用户进入小程序可进行每日刷题、章节练习，还可以使用积分兑换精品课程。同时准题宝可以准确的分析高频考点和高频易错题，能随时随地带给用户方便快捷的刷题体验。',
}

/**
 * @description: 小程序渠道id
 */
export enum ChannelAppId {
  ZHONGDAWANGXIAO = '15189017',
  ZHUNTIBAO = '25689579',
  FANGGU = '25930053',
  FANGJING = '25930002',
  SHENJI = '25929205',

  ANQUAN = '25943171',
  ERJIAN = '25943887',
  JIANZAO = '25943562',
  SHEGONG = '25943353',
  ZAOJIA = '25942618',

  XIAOFANG = '25933687',
  KUAIJI = '25933566',
  GUIHUA = '25933538',
  JINGJI = '25944264',
  YIJIAN = '25944133',

  YIKAO = '25474770',
  YOUTIKU = '', // ?
  HENGQI = '28456434',
}
/**
 * @description: 小程序渠道id
 */
export enum DouyinAppId {
  ZHUNTIBAO = 'tt6b151da8f42c793301',
  YIKAO = 'tt4d033bbed23d05ed01',
  YOUTIKU = '',
}
/**
 * @description: 小程序渠道id
 */
export enum WeixinAppId {
  // 准题宝
  ZHUNTIBAO = 'wx725144750f85c0b6',
  // ZHUNTIBAO = 'wxd9d5bf1c8a87f4cd',
  // 医考魔方
  YIKAO = 'wxe0763099749bcaf0',
  // 中大优题库
  YOUTIKU = 'wxc45bdadb49998e61',

  ZHUNTIBAO2 = 'wx25b3a2767f44cab1',
  // 直播营销
  ZHIBOYINGXIAO = 'wxd9d5bf1c8a87f4cd',
  // 社赋社会工作平台(青翼社工)
  QINGYI = 'wxc9e85aef03e51db7',
  // 新疆社工
  XINGJIANG = 'wx21b4505b127ad2bc',
  // 医学宝
  YIXUEBAO = 'wxb4bf18afd2eb9989',
  // 山西社工
  SXSG = 'wx31fd09fe6223374e',
  // 星河社工-沈阳社工
  XHSG = 'wxf9d0ce35ff2a32b8',
}
/**
 * @description: 小程序ossUrl
 */
export enum ChannelProductId {
  ZHONGDAWANGXIAO = 'ZD27f7e6df27',
  ZHUNTIBAO = 'ZD738811d8df',
  FANGGU = '中大房地产估价师考试',
  FANGJING = '中大房产经纪人考试',
  SHENJI = '中大网校审计师',
  ANQUAN = '中大安全工程师考试',
  ERJIAN = 'ejjz27529b6916',
  JIANZAO = 'jzs47529b6916',
  SHEGONG = 'shgzz57529b6916',
  ZAOJIA = 'zjgcs87529b6916',
  XIAOFANG = 'xfgcs67529b6916',
  KUAIJI = 'kjzx37529b6916',
  GUIHUA = '中大城乡规划师考试',
  JINGJI = 'jjs17529b6916',
  YIJIAN = 'yjjz77529b6916',
}

/**
 * @description: 小程序oss测试环境Url
 */
export enum ChannelTestId {
  ZHONGDAWANGXIAO = 'ZD271759be1a',
  ZHUNTIBAO = 'ZD271759be1a',
  FANGGU = '中大房地产估价师考试',
  FANGJING = '中大房产经纪人考试',
  SHENJI = '中大网校审计师',
  ANQUAN = '中大安全工程师考试',
  ERJIAN = 'ejjz27529b6916',
  JIANZAO = 'jzs47529b6916',
  SHEGONG = 'shgzz57529b6916',
  ZAOJIA = 'zjgcs87529b6916',
  XIAOFANG = 'xfgcs67529b6916',
  KUAIJI = 'kjzx37529b6916',
  GUIHUA = '中大城乡规划师考试',
  JINGJI = 'jjs17529b6916',
  YIJIAN = 'yjjz77529b6916',
}

/**
 * @description: 百度小程序渠道id
 */
export const BaiduChannelId = {
  ZHUNTIBAO:
    baseInfo.ENV === 'TEST'
      ? 'f7rs2cg4arhul5pauvx9jxu'
      : baseInfo.ENV === 'DEV'
      ? 'c0v41op6ddbk5yg8vfx7pbg'
      : '94amu3n7ibu7u05cxniykxj',
  YIKAO: baseInfo.ENV === 'TEST' ? 'rc9gint1sc8qxzsl749rkkg' : 'jkmhrpkppl5l7alhpxgt1fj',
  YOUTIKU: baseInfo.ENV === 'TEST' ? 'f7rs2cg4arh6c0cjk7rulxp' : 'ppdq6rzt1txzs25r6k8jahy',
  HENGQI: baseInfo.ENV === 'TEST' ? 'ku0lpjmfcemanpmyfngo0l2' : '82dx9id73gxczftqxs0cpqc',
};

/**
 * @description: 抖音小程序渠道id
 */
export const DouyinChannelId = {
  ZHUNTIBAO:
    baseInfo.ENV === 'TEST'
      ? 'f7rs2cg4arh6c0cjk7rulxp'
      : baseInfo.ENV === 'DEV'
      ? 'c0v41op6ddbgezzswod2ydi'
      : '94amu3n7ibu2uc7hqa1an09',
  YIKAO: baseInfo.ENV === 'TEST' ? 'mpk9okklpocv2vr8m2m9byt' : 'jkmhrpkppl5ke2hxk54utfx',
  YOUTIKU: baseInfo.ENV === 'TEST' ? 'f7rs2cg4arh6c0cjk7rulxp' : 'ppdq6rzt1txzs25r6k8jahy',
};

/**
 * @description: H5渠道id
 */
export const H5ChannelId = {
  ZHUNTIBAO: '',
  YIKAO: '',
  YOUTIKU: '',
  ZHUNTIBAO2: '',
  ZHIBOYINGXIAO: '',
  QINGYI: '',
  XINGJIANG: '',
  YIXUEBAO: '',
};
/**
 * @description: 微信小程序渠道id
 */
export const WeixinChannelId = {
  ZHUNTIBAO:
    baseInfo.ENV === 'TEST'
      ? 'f7rs2cg4arhi2sqqke1o3j5'
      : baseInfo.ENV === 'DEV'
      ? 'c0v41op6ddbk5yg8vfx7pbg'
      : '94amu3n7ibufe47in199nd1',
  YIKAO: baseInfo.ENV === 'TEST' ? 'rc9gint1sc8qxzsl749rkkg' : 'jkmhrpkppl54wm4buur2jk1',
  YOUTIKU: baseInfo.ENV === 'TEST' ? 'f7rs2cg4arh6c0cjk7rulxp' : 'ppdq6rzt1txzs25r6k8jahy',

  ZHUNTIBAO2: baseInfo.ENV === 'TEST' ? '7fxqh63c76xmec35tjpavw2' : 'c0v41op6ddb5lqo9vsuxbkw',
  ZHIBOYINGXIAO: 'gestlwmr3wu8v6sh8ciyduw',
  QINGYI: '975fttbzd5kpxxbyf7gyv73',
  XINGJIANG: 'f7kp8yekwzb0gip5o21k354',
  YIXUEBAO: 'az1ye24unfxnegzta3tuqet',
  SXSG: '318221832134103521xceaxute8kvm',
  XHSG: '290762809130123312gif0ddd1s9yu',
};

/** 注册协议地址 */
export enum PrivacyUser {
  ZHUNTIBAO = 'https://develop.wangxiao.cn/h5/#/register',
  YIKAO = 'https://develop.wangxiao.cn/h5/#/ykmfRegister',
  YOUTIKU = 'https://develop.wangxiao.cn/h5/#/ykmfRegister',
  HENGQI = 'https://develop.wangxiao.cn/h5/#/register',
}

/** 隐私协议地址 */
export enum PrivacyAgreement {
  ZHUNTIBAO = 'https://develop.wangxiao.cn/h5/#/hidden',
  YIKAO = 'https://develop.wangxiao.cn/h5/#/ykmfHidden',
  YOUTIKU = 'https://develop.wangxiao.cn/h5/#/ykmfHidden',
  HENGQI = 'https://develop.wangxiao.cn/h5/#/hidden',
}
/** 信息标题 */
export enum TitleByEnum {
  ZHUNTIBAO = '准题宝',
  YIKAO = '医考魔方',
  YOUTIKU = '中大优题库',
  QINGYI = '社赋工作平台',
  ZHIBOYINGXIAO = '中大英才学校',
  YIXUEBAO = '医学宝',
}
/** 授权弹窗模板 */
// 1.打卡提醒
export enum dakaTip {
  ZHUNTIBAO = 'tdwc_wpjS_R9ygFqyDdYFwtwBtEqJbqwiQM_aMGcQVs',
  YIKAO = '2kpPEAGluCRS2yyz5SZGP62DRuF9fBnIxxs2Fpkw2rI',
  YOUTIKU = 'GQk8EEM1gX2D5b2OmFY5MD1rHcEL3VNMNWatzP3ZTDU',
  ZHUNTIBAO2 = 'ZeByDaf7itdl2iXIg4t9JPhZoW-eDNsiDAJd1KAzEHs',
}
// 2.组队申请结果通知
export enum applyTip {
  ZHUNTIBAO = 'zy9EbkxwetxNgs7rlaLBrD7RFV4e2dLmXu3Q-b19AiE',
  YIKAO = 'bRmOtQfwKEk4OVrm6byrNtWjZ-cIMm0VsWt-5H_sCRE',
  YOUTIKU = 'XQHo-wQ9ydzY8EngC5p6r0cI5I3mthiB3XlWbpTFZ14',
  ZHUNTIBAO2 = 'uUJKx6Tu3UVaUCklxX-RO9ITls55cH8yJqg1H57TZJQ',
}
// 3.开启小组打卡通知
export enum groupTip {
  ZHUNTIBAO = 'l-o9hIx5l2QYc6jP1ELqJpfdPdEEuEwqIc1m6lcdpiY',
  YIKAO = 'dDdiQeuT40JJeAgUbOOYQz9P6Cuuo7R13S2lBON21FM',
  YOUTIKU = 'bPfJX_T0rxyXa7w6S3SzBLXHpYDCtPpYl_rpHP0MuT8',
  ZHUNTIBAO2 = 'LIOiyCYYLVXNSNod2mo4445k5f8LPfWR5jamTeVRwsQ',
}
// 4.拼团失败通知
export enum failCollageTip {
  ZHUNTIBAO = 'Rsr2ZZoFSbmpBDDhElVMWkw44byl5u3eKgEeQCgH5Yc',
  YIKAO = 'FqYXdVaAjK_Cxqnb_WhMCx_FoCdByAe6FD27y4CTd4M',
  YOUTIKU = 'T4bqrw2oFo2gY0a3naYpm_NgPdjmnqHID1CnkS1ODTA',
  ZHUNTIBAO2 = '6dRmktJktzBZKUbH9wKtBHP3WskbOyZTbLEhw1S_XNc',
}
// 5.拼团成功通知
export enum sucCollageTip {
  ZHUNTIBAO = 'abYAakIVIH__QY5kOKeyDgT00LLKkj-nyq4wYUDZ2Is',
  YIKAO = '07sWg12ldHzZhpa7SWe32gu9o5ESTAsKDKVB3iAfnyA',
  YOUTIKU = 'qXYcDvCrFEh2x_baQjdH70ZkDfy4veRfnl4W9frPQT4',
  ZHUNTIBAO2 = '8V-BefdXd0-lqMsz62xEhrKGvYbt6RJXCXFDL6eLcR4',
}
// 6.购买成功通知
export enum sucBuyTip {
  ZHUNTIBAO = 'gotqgUHunOSYctcVTNS-AqeEQ9is7XfwRmAA3SNXTeE',
  YIKAO = 'vcRfc1e8sYg0M0OekiIdHOOOscLkLk9ZZ1NsQLOcO7A',
  YOUTIKU = 'CERL7mFdA5audDHCEh7IBdQF_tM2UnBwoRifXNNf5qo',
  ZHUNTIBAO2 = 'lzUDP11Y-f3rnJJ7jCeZqwrULtoscUoOQkp2LdQ8SqA',
}
// 7.退款成功通知
export enum sucRefundTip {
  ZHUNTIBAO = 'QV6yyi7QKHJavw5Y4WoWLVHLANxK1Ta9yowPMLRIpKU',
  YIKAO = '3c5-lJ5XXk4P6bo-yHo4wiMDPD_K_FIW8Wh2Q4bYsBc',
  YOUTIKU = 'q4C4pb_G2gsxZv6UKMKd-nMfcl_MXeoYlalSuRhNn-0',
  ZHUNTIBAO2 = 'WZrbUkR2H_vsSMv1TcEQmIjXWHyP7zOqxUwuiSVjcaE',
}

// 8.订单待付款提醒
export enum payoffTip {
  ZHUNTIBAO = 'yn9OgoIQZPwXhxEIPLv4gYuS4B1LJhQNdzAykI4WKbQ',
  YIKAO = '-8tbMFgquAmizs_CTm-7LRhTuVJQKbr3fC4FUyZgj1c',
  YOUTIKU = 'eJlfy60aLeW8BnxaRdthmS2QPpe_v2Ul9KLyYYXj0Ok',
  ZHUNTIBAO2 = 'BwX70RsrY-1X--z4-sF-ZooqWyhjdQxkg6hUep7zFFc',
}
// 9.卡券到期提醒
export enum matureTip {
  ZHUNTIBAO = 'Cv-OAN5nnguy3O1vjYTjiEvFWrL_aPPv8l3pDEh0fL4',
  YIKAO = 'psNThXONjtHop8T2qBSHZM5z5ToL20hZdC5A8U9iYiQ',
  YOUTIKU = 'I9X2Zoq-xHPZWSZNW5fhhGmUqLMFIT50bb6Hy11ePfY',
  ZHUNTIBAO2 = 'ZDcspsTO3U8u4OUQNa4gFABI5JoxwE8iWx0itloM4mA',
}
// 10.直播预约提醒
export enum liveRemindTip {
  ZHUNTIBAO = 'gwh2nfZIobe-e_GLQ_z1n5NUVzOxc1vgzxC8ydTmh0g',
}
