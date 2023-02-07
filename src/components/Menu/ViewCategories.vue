<template>
  <div>
      <Navbar />
      <div class="container">
        <router-link :to="{ name: 'AddNewCategory', params: {locationId: locationId }}">
            <button class="btn btn-info">Add Category</button>
         </router-link>&nbsp;&nbsp;
         <router-link :to="{ name: 'Menu', params: {locationId:  locationId}}">
            <button class="btn btn-success">Back To Mene</button>
         </router-link>
         <br />
         <div class="text-center">
            <h1 class="mb-1">{{ locName }}</h1>
            <p  class="text-muted">{{ locAddress }}</p>
          </div>
          <table class="table caption-top" v-if="numOfCategories > 0">
            <caption>
             <span>List Of Categories ({{ numOfCategories}})</span>
             <span class="float-end">
            <!-- <router-link :to="{ name: 'DeleteAllCategory', params: { locationId: locationId }}">
              <button class="btn btn-danger">Delete All</button>
           </router-link> &nbsp; -->
             </span>
           </caption>
            <thead class="table-dark">
                <tr>
                   <th scope="col">Name</th>
                   <th scope="col">Actions</th>
                </tr>
            </thead>  
            <tbody>
               <tr v-for="(cat, i) in ListOfCategories" :key="i">
                 <th scope="row"> {{ cat.name }} </th>
                 <td>
                  <router-link :to="{ name: 'UpdateCategory', params: {catId: cat.id, locationId: cat.locationId}}">
                    <button class="btn btn-info">Update</button>  
                 </router-link> &nbsp;
                  <router-link :to="{ name: 'DeleteCategory', params: {catId: cat.id, locationId: cat.locationId}}">
                      <button class="btn btn-danger">Delete</button>
                   </router-link> &nbsp;
                 </td>
               </tr>
            </tbody> 
           </table>
          <div v-else class="alert alert-warning mt-4" role="alert">No Categories Added Yet</div>
      </div>
  </div>
</template>

<script>
import Navbar from '../Header/Navbar.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import axios from 'axios';

export default {
name: 'ViewCategories',
components:{
    Navbar,
},
data(){
    return{
        locationId: this.$route.params.locationID,
        userId: "",
        locName: "",
        locAddress:"",
    }
},
computed: {
...mapState(["isUserLoggedIn", "LoggedInUserId", "numOfCategories", "ListOfCategories"]),
},
mounted() {
    let user = localStorage.getItem('User-info');
   if(!user){
    this.redirecTo({val: "Signup"});
   }else{
    this.userName = JSON.parse(user).name;
    this.userId = JSON.parse(user).id;
    this.canUserAccessThisLocation({
      userIdIs: this.userId, 
      locationIdIs: this.locationId, 
      redirecToPage: 'home',
    });
    this.disblayAllCatogries({userIdIs: this.userId, locationIdIs: this.locationId});
    this.getLocationInfo(this.userId, this.locationId) ;

   }
},
methods:{
  ...mapMutations(["isLoggedInUser", "disblayAllCatogries", "canUserAccessThisLocation"]),
  ...mapActions(["redirecTo"]),
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

</style>