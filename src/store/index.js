import { createStore } from 'vuex'
import axios from 'axios'
import router from '../router/index'
export default createStore({
  state: {
    isUserLoggedIn: "",
    LoggedInUserId: "",
    numOfCategories: "",
    ListOfCategories: [],
    ListOfLocations: [],
    ListOfItems: [],
  },
  getters: {
  },
  mutations: {
    redirecTo(state, payload){
      router.push({ name: payload})
    },
    isLoggedInUser(state){
      let user = localStorage.getItem('User-info');
      if(user){
        state.isUserLoggedIn = true;
        state.LoggedInUserId = JSON.parse(user).id;
      }else{
        state.isUserLoggedIn = false;

      }
    },
async disblayAllCatogries(state, payload){
  let result = await axios.get(`http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}`);
  if(result.status == 200 ){
    state.ListOfCategories = result.data; //Array
    state.numOfCategories = state.ListOfCategories.length;
  }

},
async canUserAccessThisLocation(state, payload) {
  let result = await axios.get(
    `http://localhost:3000/locations?userId=${payload.userIdIs}&id=${payload.locationIdIs}`);
if(result.status == 200) {
  state.ListOfLocations = result.data;
  if(state.ListOfLocations.length !== 1){
        this.commit("redirecTo", payload.redirecToPage);
  }
}
},
async canUserAccessThisCategory(state, payload){
  let result = await axios.get(`http://localhost:3000/categories?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.catIdIs}`);
  if(result.status == 200 ){
    state.ListOfCategories = result.data; //Array
    if(state.ListOfLocations.length !== 1){
      this.commit("redirecTo", payload.redirecToPage);
    }
  }

},
async canUserAccessThisItem(state, payload){
  let result = await axios.get(`http://localhost:3000/items?userId=${payload.userIdIs}&locationId=${payload.locationIdIs}&id=${payload.itemIdIs}`);
  if(result.status == 200 ){
    state.ListOfItems = result.data; //Array
    if(state.ListOfItems.length < 1){
      this.commit("redirecTo", payload.redirecToPage);
    }
  }

},
  },
  actions: {
    redirecTo({commit}, payload){
      commit('redirecTo',payload.val)
    }
  },
  modules: {
  }
}) 
