// text-size-sn: 小号
// text-size-main：中号
// text-size-xl：大号
const state = {
  socketMsg: {},
};

const getters = {
  getSocketMsg: (state) => {
    return state.socketMsg;
  },
};

const actions = {
  socketMsgLoad(context, socketMsg) {
    context.commit('setSocketMsg', socketMsg);
  },
};

const mutations = {
  setSocketMsg(state, socketMsg) {
    state.socketMsg = socketMsg;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
