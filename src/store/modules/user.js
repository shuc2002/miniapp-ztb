const state = {
  //上一次事件的时间戳
  token: '',
  nickName: '',
  avatar: '',
  projectId: '',
  projectName: '',
  currentSubjectId: '', // 当前科目id
  org: '',
  uid: '',
  system: false,
  channelId: '',
  tenantId: '',
  currentTab: 0, //当前导航栏
  subjectList: [], //科目列表数组
  displayDimensions: 1, //是否显示维度
  supplierId: '', // 供应商id
};

const getters = {
  getToken: (state) => {
    state.token = uni.getStorageSync('token');
    return state.token;
  },
  getNickName: (state) => {
    state.nickName = uni.getStorageSync('nickName');
    return state.nickName;
  },
  getAvatar: (state) => {
    state.avatar = uni.getStorageSync('avatar');
    return state.avatar;
  },
  getProjectId(state) {
    state.projectId = uni.getStorageSync('projectId');
    return state.projectId;
  },
  getProjectName(state) {
    state.projectName = uni.getStorageSync('projectName');
    return state.projectName;
  },
  getCurrentSubjectId(state) {
    state.currentSubjectId = uni.getStorageSync('currentSubjectId');
    return state.currentSubjectId;
  },
  getSubjectList(state) {
    state.subjectList = uni.getStorageSync('subjectList');
    return state.subjectList;
  },
  getOrg(state) {
    state.org = uni.getStorageSync('org');
    return state.org;
  },
  getUid(state) {
    state.uid = uni.getStorageSync('uid');
    return state.uid;
  },
  getSystem(state) {
    state.system = uni.getStorageSync('system');
    return state.system;
  },
  getChannelId(state) {
    state.channelId = uni.getStorageSync('channelId');
    return state.channelId;
  },
  getTenantId(state) {
    state.tenantId = uni.getStorageSync('tenantId');
    return state.tenantId;
  },
  getDisplayDimensions(state) {
    state.displayDimensions = uni.getStorageSync('displayDimensions');
    return state.displayDimensions;
  },
  // 获取供应商id
  getSupplierId: (state) => {
    state.supplierId = uni.getStorageSync('target-tenant-id');
    return state.supplierId;
  },
};

const actions = {
  tokenLoad(context, token) {
    context.commit('setToken', token);
  },
};

const mutations = {
  setToken(state, token) {
    uni.setStorageSync('token', token);
    state.token = token;
  },
  setSupplierId(state, id) {
    uni.setStorageSync('target-tenant-id', id);
    state.supplierId = id;
  },
  setNickName(state, nickName) {
    uni.setStorageSync('nickName', nickName);
    state.nickName = nickName;
  },
  setAvatar(state, avatar) {
    uni.setStorageSync('avatar', avatar);
    state.avatar = avatar;
  },
  setProjectId(state, projectId) {
    uni.setStorageSync('projectId', projectId);
    state.projectId = projectId;
  },
  setProjectName(state, projectName) {
    uni.setStorageSync('projectName', projectName);
    state.projectName = projectName;
  },
  setCurrentSubjectId(state, currentSubjectId) {
    uni.setStorageSync('currentSubjectId', currentSubjectId);
    state.currentSubjectId = currentSubjectId;
  },
  setSubjectList(state, subjectList) {
    uni.setStorageSync('subjectList', subjectList);
    state.subjectList = subjectList;
  },
  setOrg(state, org) {
    uni.setStorageSync('org', org);
    state.org = org;
  },
  setUid(state, uid) {
    uni.setStorageSync('uid', uid);
    state.uid = uid;
  },
  setSystem(state, system) {
    uni.setStorageSync('system', system);
    state.system = system;
  },
  setChannelId(state, channelId) {
    uni.setStorageSync('channelId', channelId);
    state.channelId = channelId;
  },
  setTenantId(state, tenantId) {
    uni.setStorageSync('tenantId', tenantId);
    state.tenantId = tenantId;
  },
  setDisplayDimensions(state, displayDimensions) {
    uni.setStorageSync('displayDimensions', displayDimensions);
    state.displayDimensions = displayDimensions;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
