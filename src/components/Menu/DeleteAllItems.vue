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
               <p class="text-danger">Are you sure you want to delete All Items For above Location?</p>
               <hr>
  
          </div>
         </div>
         <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
         <button class="btn btn-info" @click="goBack()">Go Back</button> &nbsp;&nbsp;&nbsp;
         <button class="btn btn-danger" @click="deleteAllItem()">Delete Now</button>
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
  name: "DeleteAllItems",
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
    myResult: "",

  }
  },
  async mounted() {
    let user = localStorage.getItem('User-info');
    if(!user){
      this.redirecTo({val: "Signup"});
    }else{
     this.userId = JSON.parse(user).id;
     this.canCurrentUserAccessThisLocation();
     let result = await axios.get(`http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}`);
   this.myResult = result.data;
   let resultLen = this.myResult.length;
   for(var i = 0; i< resultLen; i++){
    this.allItemsIdIs.push(result.data[i].id);
   }
   console.table(this.allItemsIdIs)
    }
  },
  methods: {
    ...mapActions(["redirecTo"]),
    ...mapMutations(["canUserAccessThisItem"]),
    goBack(){
        this.$router.push({ name: "Menu", params: {locationID: this.locationId}});
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

    async deleteAllItem(){
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