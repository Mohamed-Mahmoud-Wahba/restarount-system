<template>
    <div class="container">
      <Navbar />
     <form @click.prevent>
      <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
               <h1>Delete All Categories</h1>
               <hr>
               <p class="text-danger">Are you sure you want to delete All categories for This Location?</p>
               <br />
               <div class="text-center">
                  <h1 class="mb-1">{{ locName }}</h1>
                  <p  class="text-muted">{{ locAddress }}</p>
                </div>
               <br />
            
               <p class="text-danger">when Deletind All categories, thier releted menu items will be deleted as well...</p>
               <hr>
  
          </div>
         </div>
         <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
         <button class="btn btn-info" @click="goBack()">Go Back</button> &nbsp;&nbsp;&nbsp;
         <button class="btn btn-danger" @click="deleteAllCategory()">Delete All</button>
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
  import {  mapActions } from 'vuex';
  import axios from 'axios';
  export default {
  name: "DeleteAllCategory",
  components:{
      Navbar,
  },
  data(){
  return {
    locationId: this.$route.params.locationID,
    userId: "",
    locationData: [],
    successMessage: "",
    deleteLocationF: "",
    errorMessage: "",
    name:"",
    allItemsIdIs: [],
    allCatsIdIs: [],

    locName: "",
    locAddress:"",
  }
  },
  async mounted() {
    let user = localStorage.getItem('User-info');
    if(!user){
      this.redirecTo({val: "Signup"});
    }else{
     this.deleteLocationF = this.$route.params.locationId;
     this.userId = JSON.parse(user).id;
     this.canCurrentUserAccessThisLocation();
    this.getLocationInfo(this.userId, this.locationId) ;

    let result = await axios.get(`http://localhost:3000/items?locId=${this.locationId}`);
   console.log(result.data.length);
   let resultLen = result.data.length;
   for(var m = 0; m < resultLen; m++){
    this.allItemsIdIs.push(result.data[m].id);
   }
   let resultForCategories = await axios.get(`http://localhost:3000/categories?locationId=${this.locationId}`);
   console.log(result.data.length);
   let allCatsIdIsLen = resultForCategories.data.length;
   for(var i = 0; i< allCatsIdIsLen; i++){
    this.allCatsIdIs.push(resultForCategories.data[i].id);
   }
    }

  },
  methods: {
    ...mapActions(["redirecTo"]),

    goBack(){
        this.$router.push({ name: "ViewCategories", params: {locationID: this.locationId}});
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
  },
   async canCurrentUserAccessThisLocation(){
    let result = await axios.get(`http://localhost:3000/locations?id=${this.deleteLocationF}&userId=${this.userId}`);
        if (result.status == 200 ){
          this.locationData = result.data;
        //   this.name = this.locationData[0].name;
        //   this.phone = this.locationData[0].phone;
        //   this.address = this.locationData[0].address;
        }else{
          this.redirecTo({val: "home"});
        }
    },

    async deleteAllCategory(){
        let allCatsResult = [];
        for(var y = 0; y < allItemsIdIs.length; y++){
            let result = await axios.delete(`http://localhost:3000/categories/${this.allCatsIdIs[y]}`);
        if(result.status == 200){
            allCatsResult.push(true);
        } else{
            allCatsResult.push(false);
        }
        }
        let allItemResult = [];
        for(var z = 0; z < allItemsIdIs.length; z++){
            let result = await axios.delete(
        `http://localhost:3000/items/${this.allItemsIdIs[z]}`
        );
        if(result.status == 200){
            allItemResult.push(true);
        } else{
            allItemResult.push(false);
        }
        }
        if (!allCatsResult.includes(false) && !allItemResult.includes(false)) {
        this.successMessage = "Category and related items are deleted...";
        this.errorMessage = "";
        setTimeout( () => {
            this.$router.push({ name: "home"});
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