<template>
  <div class="container">
    <Navbar />
   <form @click.prevent>
    <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
             <h1>Delete Restaurant # {{ deleteLocationF }}</h1>
             <hr>
             <p class="text-danger">Are you sure you want to delete this location?</p>
             {{ name }}<br />
             {{ phone }}<br />
             {{ address }}<br />
             <hr>

        </div>
       </div>
       <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
       <button class="btn btn-info" @click="goBack()">Go Back</button> &nbsp;&nbsp;&nbsp;
       <button class="btn btn-danger" @click="deleteLocation()">Delete Now</button>
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
import { mapActions } from 'vuex';
import axios from 'axios';
export default {
name: "DeleteLocation",
components:{
    Navbar,
},
data(){
return {
  name: "", 
  phone: "", 
  address: "", 
  userId: "",
  deleteLocationF: "",
  locationData: [],
  successMessage: "",
  errorMessage: "",
  allItemsIdIs: [],
    allCatsIdIs: [],

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
    this.redirecTo({val: "home"});
  },

 async canCurrentUserAccessThisLocation(){
  let result = await axios.get(`http://localhost:3000/locations?id=${this.deleteLocationF}&userId=${this.userId}`);
      if (result.status == 200 && result.data.length > 0){
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.phone = this.locationData[0].phone;
        this.address = this.locationData[0].address;
      }else{
        this.redirecTo({val: "home"});
      }
  },

  async deleteLocation(){
    let result = await axios.delete(
      `http://localhost:3000/locations/${this.deleteLocationF}`
      );
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
    if (result.status == 200 ) {
      this.successMessage = "Location is deleted...";
      this.errorMessage = "";
      setTimeout( () => {
        this.redirecTo({ val: "home" });
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