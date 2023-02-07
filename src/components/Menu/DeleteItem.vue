<template>
    <div class="container">
      <Navbar />
     <form @click.prevent>
        <router-link :to="{name: 'Menu', params: { locId: locationId}}">
            <button type="button" class="float-start btn btn-info">Back To Menu</button>
          </router-link>
          <div class="claerfix"></div>
      <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div class="claerfix">
                <div class="text-center">
                  <h1 class="mb-1">{{ locName }}</h1>
                  <p  class="text-muted">{{ locAddress }}</p>
                </div>
                </div>
               <h4>Item Name: {{ itemsName }}</h4>
               <hr>
               <p class="text-danger">Are you sure you want to delete this Item?</p>
               <hr>
  
          </div>
         </div>
         <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
         <button class="btn btn-info" @click="goBack()">Go Back</button> &nbsp;&nbsp;&nbsp;
         <button class="btn btn-danger" @click="deleteItem()">Delete Now</button>
          </div>
         </div>
         <div class="col-auto d-block mx-auto mt-5 alert alert-success" v-if="(successMessage.length > 0)">
          {{ successMessage }}
          </div>
          <div class="col-auto d-block mx-auto alert alert-danger" v-if="(errorMessage.length > 0)">
            {{ errorMessage }}
            </div>
     </form>
    </div>
  </template>
  
  <script>
  import Navbar from '../Header/Navbar.vue';
  import { mapMutations, mapActions } from 'vuex';
  import axios from 'axios';
  export default {
  name: "DeleteItem",
  components:{
      Navbar,
  },
  data(){
  return {
    locationId: this.$route.params.locationID,
    itemId: this.$route.params.itemId,
    userId: "",
    locationData: [],
    successMessage: "",
    deleteLocationF: "",
    errorMessage: "",
    locName: "",
    locAddress: "",
    allItemsIdIs: [],
    itemsName: "",
    itemsQty: 1,
    descriptions: "",
    itemprice: "",
    pickedCategory: "",

  }
  },
  async mounted() {
    let user = localStorage.getItem('User-info');
    if(!user){
      this.redirecTo({val: "Signup"});
    }else{
     this.userId = JSON.parse(user).id;
     this.canCurrentUserAccessThisLocation();
     this.canUserAccessThisItem({
  userIdIs: this.userId, 
  locationIdIs: this.locationId, 
  itemIdIs: this.itemId,
  redirecToPage: 'home',
});
this. getItemInfo(this.userId, this.locId, this.itemId);

    this.getCategoryName(this.userId, this.locationId, this.catId);
    let result = await axios.get(`http://localhost:3000/items?catId=${this.catId}`);
   console.log(result.data.length);
   let resultLen = result.data.length;
   for(var i = 0; i< resultLen; i++){
    this.allItemsIdIs.push(result.data[i].id);
   }
    }
  },
  methods: {
    ...mapActions(["redirecTo"]),
    ...mapMutations(["canUserAccessThisItem"]),
    goBack(){
        this.$router.push({ name: "Menu", params: {locationID: this.locationId}});
    },
    async getItemInfo(userId, locId, itemId){
  let result = await axios.get(`http://localhost:3000/items?userId=${userId}&locationId=${locId}&id=${itemId}`);
  let resultData = result.data[0];
  if(result.status == 200 ){
    this.descriptions = resultData.descriptions;
    this.itemsName = resultData.name;
    this.itemsQty = resultData.qty;
    this.itemprice = resultData.price;
    this.pickedCategory = resultData.catId;
  }

},
   async canCurrentUserAccessThisLocation(){
    let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`);
        if (result.status == 200 ){
          this.locationData = result.data;
          this.locName = this.locationData[0].name;
          this.locAddress = this.locationData[0].address;
        }else{
          this.redirecTo({val: "home"});
        }
    },
    async getCategoryName(userId, locId, catId){
  let result = await axios.get(`http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`);
  if(result.status == 200 ){
    this.categoryName = result.data; //Array
    if(this.categoryName.length > 0){
      this.name = this.categoryName[0].name;
    }
  }

},
    async deleteItem(){
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemId}`
        );
        // let allResult = [];
        // for(var i = 0; i < allItemsIdIs.length; i++){
        //     let result = await axios.delete(
        // `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        // );
        // if(result.status == 200){
        //     allResult.push(true);
        // } else{
        //     allResult.push(false);
        // }
        // }
        if (result.status == 200) {
        this.successMessage = "Item is deleted...";
        this.errorMessage = "";
        setTimeout( () => {
            this.$router.push({ name: "Menu", params: {locationID: this.locationId}});
        }, 2000)
      } else {
        this.successMessage = "",
        this.errorMessage = "Something Went Wrong, try again";
        console.log("Something Went Wrong, try again")
      }
      
    },
  },
  }
  </script>
  
  <style>
  
  </style>