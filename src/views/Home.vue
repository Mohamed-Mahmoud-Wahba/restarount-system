<template>
  <div>
    <div class="container">
      <Navbar />
      <p class="text-end">Welcome User&nbsp;  <b class="text-success">{{ userName }}</b>&nbsp;&nbsp;
        <router-link :to="{ name: 'Profile'}">
          <button class="btn btn-info" type="button">Profile</button>
        </router-link>
      </p>
      <router-link :to="{ name: 'AddNewLocation'}">
      <button type="button" class="btn btn-primary">
        Add New Restaurant      
    </button>
  </router-link>
      <UserLocations :allLocations="listOflocations"/>
    </div>
  </div>

</template>

<script>
import Navbar from '@/components/Header/Navbar.vue';
import UserLocations from '../components/Location/UserLocations.vue';
// import { json } from 'body-parser';
import { mapActions } from 'vuex';
import axios from 'axios';
export default {
  name: 'Home',
  data(){
    return {
      userName: "",
      userId: "",
      listOflocations: [],
    }
  },
  components:{
    Navbar,
    
    UserLocations
  },
  async mounted() {
   let user = localStorage.getItem('User-info');
   if(!user){
    this.redirecTo({val: "Signup"});
   }else{
    this.userName = JSON.parse(user).name;
    this.userId = JSON.parse(user).id;
   }
   let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`);
   if(result.status == 200 && result.data.length > 0){
    console.log(result.data)
    this.listOflocations = result.data;
   }
  },
  methods:{
    ...mapActions(["redirecTo"])
  }
}
</script>

