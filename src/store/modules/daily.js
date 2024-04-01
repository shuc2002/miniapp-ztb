const state = {
  //做题记录
  analysis: [],
  code: '',
};

const getters = {
  getDailyAnalysis: (state) => {
    return state.analysis;
  },
  getDailyCode: (state) => {
    return state.code;
  },
};

const actions = {
  analysisLoad(context, analysis) {
    context.commit('setAnalysis', analysis);
  },
  codeLoad(context, code) {
    context.commit('setDailyCode', code);
  },
};

const mutations = {
  setDailyAnalysis(state, analysis) {
    state.analysis = analysis;
  },
  setDailyCode: (state, code) => {
    state.code = code;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
