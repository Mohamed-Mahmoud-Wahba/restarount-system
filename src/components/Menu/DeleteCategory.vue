<template>
    <div class="container">
      <Navbar />
     <form @click.prevent>
      <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
               <h1>Delete Category #{{ catId }}</h1>
               <h4>Category Name: {{ name }}</h4>
               <hr>
               <p class="text-danger">Are you sure you want to delete this category?</p>
               <hr>
  
          </div>
         </div>
         <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
         <button class="btn btn-info" @click="goBack()">Go Back</button> &nbsp;&nbsp;&nbsp;
         <button class="btn btn-danger" @click="deleteCategory()">Delete Now</button>
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
  name: "DeleteCategory",
  components:{
      Navbar,
  },
  data(){
  return {
    locationId: this.$route.params.locationID,
    catId: this.$route.params.catId,
    userId: "",
    locationData: [],
    successMessage: "",
    deleteLocationF: "",
    errorMessage: "",
    name:"",
    allItemsIdIs: [],
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
     this.canUserAccessThisCategory({
        userIdIs: this.userId, 
        catIdIs: this.catId, 
        locationIdIs: this.locationId, 
        redirecToPage: 'home',
      });
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
    ...mapMutations(["canUserAccessThisCategory"]),
    goBack(){
        this.$router.push({ name: "ViewCategories", params: {locationID: this.locationId}});
    },
  
   async canCurrentUserAccessThisLocation(){
    let result = await axios.get(`http://localhost:3000/locations?id=${this.deleteLocationF}&userId=${this.userId}`);
        if (result.status == 200 ){
          this.locationData = result.data;
          this.name = this.locationData[0].name;
          this.phone = this.locationData[0].phone;
          this.address = this.locationData[0].address;
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
    async deleteCategory(){
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.catId}`
        );
        let allResult = [];
        for(var i = 0; i < allItemsIdIs.length; i++){
            let result = await axios.delete(
        `http://localhost:3000/items/${this.allItemsIdIs[i]}`
        );
        if(result.status == 200){
            allResult.push(true);
        } else{
            allResult.push(false);
        }
        }
        if (result.status == 200 && !allResult.includes(false)) {
        this.successMessage = "Category and related items are deleted...";
        this.errorMessage = "";
        setTimeout( () => {
            this.$router.push({ name: "ViewCategories", params: {locationID: this.locationId}});
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