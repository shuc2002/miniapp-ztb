const state = {
  //做题记录
  userAnswer: [],
  showType: 0, //0正常、1解析模式、2错题模式
  code: '',
  subjectId: '',
  isCard: false, //是否百度卡片
  currentTab: 0, //当前tab
  pageTabList: [], //底部导航栏数据
};

const getters = {
  getUserAnswer: (state) => {
    return state.userAnswer;
  },
  getShowType: (state) => {
    return state.showType;
  },
  getExamCode: (state) => {
    return state.code;
  },
  // getProject: (state) => {
  //   return state.projectId;
  // },
  getSubject: (state) => {
    return state.subjectId;
  },
  getIsCard: (state) => {
    return state.isCard;
  },
  getCurrentTab: (state) => {
    return state.currentTab;
  },
  getPageTabList: (state) => {
    let result = {};
    /* #ifdef H5 */
    if (state.pageTabList?.tabList?.length > 0) {
      result = state.pageTabList;
    } else {
      result = uni.getStorageSync('pageTabList');
    }
    /* #endif */
    /* #ifndef H5 */
    result = state.pageTabList;
    /* #endif */
    return result;
  },
};

const actions = {
  userAnswerLoad(context, userAnswer) {
    context.commit('setUserAnswer', userAnswer);
  },
  examCodeLoad(context, code) {
    context.commit('setExamCode', code);
  },
  // projectIdLoad(context, projectId) {
  //   context.commit('setProject', projectId);
  // },
  subjectIdLoad(context, subjectId) {
    context.commit('setProject', subjectId);
  },
  isCardLoad(context, isCard) {
    context.commit('setIsCard', isCard);
  },
  currentTabLoad(context, currentTab) {
    context.commit('setCurrentTab', currentTab);
  },
  pageTabListLoad(context, pageTabList) {
    context.commit('setPageTabList', pageTabList);
  },
};

const mutations = {
  setUserAnswer(state, userAnswer) {
    state.userAnswer = userAnswer;
  },
  setShowType(state, showType) {
    state.showType = showType;
  },
  setExamCode: (state, code) => {
    state.code = code;
  },
  setIsCard: (state, isCard) => {
    state.isCard = isCard;
  },
  // setProject: (state, projectId) => {
  //   state.subjectId = projectId;
  // },
  setSubject: (state, subjectId) => {
    state.subjectId = subjectId;
  },
  setCurrentTab: (state, currentTab) => {
    state.currentTab = currentTab;
    // h5页面刷新处理
    /* #ifdef H5 */
    window.localStorage.setItem('currentTab', currentTab);
    /* #endif */
  },
  setPageTabList: (state, pageTabList) => {
    state.pageTabList = pageTabList;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
