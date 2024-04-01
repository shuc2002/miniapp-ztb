const state = {
  //大纲结构
  outLine: [],
  //选中项目
  projectData: {},
  //选中的项目下的所有科目
  subjectsList: [],
  //选中的科目
  subjects: [],
  //选中类目下的项目
  projectList: [],
};

const getters = {
  // getOutLine: (state) => state.outLine,
  // getProjectName: (state) => state.projectName,
  // getSubjectsList: (state) => state.subjectsList,
  // getSubjects: (state) => state.subjects,
};

const actions = {
  outLineLoad(context, outLine) {
    context.commit('setOutLine', outLine);
  },
  projectDataLoad({ commit }, projectData) {
    commit('setProjectData', projectData);
  },
  subjectsListLoad(context, subjectsList) {
    context.commit('setSubjectsList', subjectsList);
  },
  subjectsLoad(context, subjects) {
    context.commit('setSubjectsList', subjects);
  },
  projectListLoad(context, projectList) {
    context.commit('setProjectList', projectList);
  },
};

const mutations = {
  setOutLine(state, outLine) {
    state.outLine = outLine;
  },
  setProjectData(state, projectData) {
    state.projectData = projectData;
  },
  setSubjectsList(state, subjectsList) {
    state.subjectsList = subjectsList;
  },
  setSubjects(state, subjects) {
    state.subjects = subjects;
  },
  setProjectList(state, projectList) {
    state.projectList = projectList;
  },
};
const namespace = 'outLine';
export default {
  namespace,
  state,
  getters,
  actions,
  mutations,
};
