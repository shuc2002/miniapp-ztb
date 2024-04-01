const state = {
  channel: 'ZHUNTIBAO',
  projectList: [],
};

const getters = {
  getProjectList: (state) => {
    state.projectList = uni.getStorageSync('projectList');
    return state.projectList;
  },
};

const actions = {
  channelLoad(context, channel) {
    context.commit('setChannel', channel);
  },
};

const mutations = {
  setChannel(state, channel) {
    state.channel = channel;
  },
  setProjectList(state, list) {
    uni.setStorageSync('projectList', list);
    state.projectList = list;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
