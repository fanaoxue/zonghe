const state = {
    token: '',
    aid: '',
    appVersion: "",
}
const getters = {}
const actions = {}
const mutations = {
    setToken(state, token) {
        state.token = token
    },
    setAid(state, aid) {
        state.aid = aid
    },
    setAppVersion(state, appVersion) {
        state.appVersion = appVersion
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
