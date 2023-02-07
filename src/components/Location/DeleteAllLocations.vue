<template>
  <div class="container">
    <Navbar />
    <form @click.prevent>
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                 <h1>Delete All Locations </h1>
                 <hr>
                 <p class="text-danger">Are you sure you want to delete all location?</p>
                 <hr>
            </div>
           </div>
           <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
           <button class="btn btn-info" @click="goBack()">Go Back</button> &nbsp;&nbsp;&nbsp;
           <button class="btn btn-danger" @click="deleteAllLocation()">Delete All </button>
            </div>
           </div>
           <div class="col-auto d-block mx-auto alert alert-success mt-5" v-if="(successMessage.length > 0)">
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
name: 'DeleteAllLocations',
components:{
    Navbar,
},
data(){
return{
  userId: "",
  successMessage: "",
  errorMessage: "",
  allLocationId: [],
}
},
async mounted() {
  let user = localStorage.getItem('User-info');
  if(!user){
    this.redirecTo({val: "Signup"});
  }else{
   this.userId = JSON.parse(user).id;
   let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`);
   console.log(result.data.length);
   let resultLen = result.data.length;
   for(var i = 0; i<resultLen; i++){
    this.allLocationId.push(result.data[i].id);
   }
   console.table(this.allLocationId);
  }
},
methods: {
  ...mapActions(["redirecTo"]),
  goBack(){
    this.redirecTo({val: "home"});
  },
  async deleteAllLocation(){
  let allResults = []
   for(var i = 0; i< this.allLocationId.length; i++){
  let result = await axios.delete(`http://localhost:3000/locations/${this.allLocationId[i]}`);
  if (result.status == 200 ) {
    allResults.push(true)
  }else{
    allResults.push(false)
  }
}
console.table(allResults)

  if (!allResults.includes(false)) {
      this.successMessage = "All Locations are deleted...";
      this.errorMessage = "";
      setTimeout( () => {
        this.redirecTo({ val: "home" });
      }, 2000)
    } else {
      this.successMessage = "",
      this.errorMessage = "Something Went Wrong, try again";
    }
   
  },
},
}
</script>

<style>

</style>