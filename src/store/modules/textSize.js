// text-size-sn: 小号
// text-size-main：中号
// text-size-xl：大号
const state = {
  textSize: 'text-size-sn',
};

const getters = {
  getTextSize: (state) => {
    state.textSize = uni.getStorageSync('textSize');
    return state.textSize;
  },
};

const actions = {
  textSizeLoad(context, textSize) {
    context.commit('setTextSize', textSize);
  },
};

const mutations = {
  setTextSize(state, textSize) {
    uni.setStorageSync('textSize', textSize);
    state.textSize = textSize;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
