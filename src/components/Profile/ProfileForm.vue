 <template>
    <div>
        <div class="container">
            <Navbar />
            <form @click.prevent>
                <div class="row g-3 align-items-center">
                  <div class="col-auto d-block mx-auto">
                    <h1>Update Profile</h1>
                    <input type="text" class="form-control" disabled placeholder="Enter Your Name" v-model="name">
                  </div>
                </div>
                <br />
                <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto">
                      <input type="email" class="form-control" disabled placeholder="Enter Your Email" v-model="email">
                    </div>
                  </div>
                  <br />
                <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto">
                      <input type="password" class="form-control" disabled placeholder="Enter Your Password" v-model="pass">

                    </div>
                  </div>
                  <br />
                  <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto">
                  <button type="submit" @click="updateProfile()" class="btn btn-primary">update Profile Now</button>;                          
                    </div>
                  </div>
            </form>
        </div>
    </div>
 </template>
 
 <script>
 import Navbar from '../Header/Navbar.vue';
import { mapActions } from 'vuex';

 export default {
 name: 'ProfileForm',
 components: {
    Navbar
 },
 data(){
 return {
  name: '',
  email: '',
  pass: '',
 };
 },
 mounted() {
  let user = localStorage.getItem("User-info");
    if(user){
    this.name = JSON.parse(user).name;
    this.email = JSON.parse(user).email;
    this.pass = JSON.parse(user).pass;
    }else{
      this.redirecTo({val: "Signup"});   
    }
 },
 methods:{
  ...mapActions(["redirecTo"]),
  updateProfile(){
    this.redirecTo({val: "UpdateProfile"})
  },
 }
 }
 </script>
 
 <style>
 
 </style>