<template>
  <div>
    <Navbar />
    <div class="container">
      <div>
        <router-link :to="{name: 'ViewCategories', params: { locId: locationId}}">
          <button type="button" class="float-start btn btn-success">View/Add Categories</button>
        </router-link>
      <router-link :to="{name: 'AddNewItem'}">
        <button type="button" class="float-end btn btn-success"  v-if="(numOfCategories > 0)">Add New Items</button>
      </router-link>
      </div><br /><br />
    <div class="claerfix">
      <div class="text-center">
        <h1 class="mb-1">{{ locName }}</h1>
        <p  class="text-muted">{{ locAddress }}</p>
      </div>
      </div>
      <div class="claerfix"></div>
      <div class="each-category">
        <div class="" v-for="(cat, i) in ListOfUserCategories" :key="i">
         <div class="row">
          <div class="row col-12 catName"> 
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
             <div class="each-item" v-for="(item, h) in ListOfItems" :key="h" v-show="(cat.id == item.catId)" :class="{'col-xs-12 col-sm-4 px-4 ': cat.id == item.catId}">
              <div class="col-lg-12" v-if="(cat.id == item.catId)">
                <div class="">
                  <h4 class="item-name  float-start">{{ item .name }}</h4>
                </div><br /><br/>
              
               <div class="claerfix"></div> 
                <p class="item-description  text-muted">{{ item.descriptions }}</p>
                <div class="qty">
                  <p>Available  Qty: {{ numberWithCommas(item.qty) }}</p>
                  <p>Price: <b>{{  numberWithCommas(item.price) }}</b></p>
                </div>
                <div class="qty">
                  <div>
                    <router-link :to="{name: 'UpdateItem', params: { itemId: item.id, locationId: locationId}}">
                      <button type="button" class="float-end btn btn-info"> Update</button>
                    </router-link>
                  </div>
                  <div>
                    <router-link :to="{name: 'DeleteItem', params: { itemId: item.id, locationId: locationId}}">
                      <button type="button" class="float-end btn btn-danger">Delete</button>
                    </router-link>
                  </div>
                </div>
              </div>
              <hr />
             </div> 
         
        </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import Navbar from '../Header/Navbar.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import axios from 'axios';
export default {
name: 'Menu',
components:{
  Navbar
},
data(){
  return {
    userId: "",
    userName: "",
    locationId: this.$route.params.locationID,
    locName: "",
    locAddress:"",
    ListOfUserCategories: [],
    ListOfItems: [],
    ListOfUserItems: [],
  }
},
computed: {
...mapState(["isUserLoggedIn", "LoggedInUserId", "numOfCategories", "ListOfCategories"]),
},
async mounted() {
   let user = localStorage.getItem('User-info');
   if(!user){
    this.redirecTo({val: "Signup"});
   }else{
    this.userName = JSON.parse(user).name;
    this.userId = JSON.parse(user).id;
    this.isLoggedInUser();
    this.locationId = this.$route.params.locationID;
    console.log(this.userId, this.locationId)
    this.disblayAllCatogries({userIdIs: this.userId, locationIdIs: this.locationId});
    this.canUserAccessThisLocation({

      userIdIs: this.userId, 
      locationIdIs: this.locationId, 
      redirecToPage: 'home',
    });
    this.getLocationInfo(this.userId, this.locationId) ;
    this.getCurrentUserCategories(this.userId, this.locationId);
    this.getCurrentUserItems(this.userId, this.locationId)
   }
  },
methods:{
  ...mapMutations(["isLoggedInUser", "disblayAllCatogries", "canUserAccessThisLocation"]),
  ...mapActions(["redirecTo"]),

  async getCurrentUserCategories(userId, locId){
  let result = await axios.get(`http://localhost:3000/categories?userId=${userId}&locationId=${locId}`);
  if(result.status == 200 ){
    this.ListOfUserCategories = result.data; //Array
    console.table(this.ListOfUserCategories);
  }

},
async getCurrentUserItems(userId, locId){
  let result = await axios.get(`http://localhost:3000/items?userId=${userId}&locId=${locId}`);
  if(result.status == 200 ){
    this.ListOfItems = result.data; //Array
    console.table(this.ListOfItems);
  } 
},
numberWithCommas(n){
  return n.toString().replace(/\B(?<!\.\d*)(?=\d{3})+(?!\d)/g, ",");
},
  async getLocationInfo(userId, locId) {
  let result = await axios.get(`http://localhost:3000/locations?userId=${userId}&id=${locId}`);
  console.log(result)
  let locDetails = [];
  if(result.status == 200 && result.data.length > 0){
    locDetails = result.data;
    console.log(locDetails)
     this.locName = locDetails[0].name;
     this.locAddress = locDetails[0].address;
  }
  }
}
}
</script>

<style>
.qty{
  display: flex;
  justify-content: space-between;
}
</style>