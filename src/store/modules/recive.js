const getDefaultReciveMsg = () => {
  return {
  
  };
};

const state = getDefaultReciveMsg();

const mutations = { 
  updateReciveMsg (state, payload) {
    state.reciveMsg = Object.assign({},payload)
  }
}
export default {
  state,
  mutations
}
