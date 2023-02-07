<template>
    <div>
        <div class="container">
            <Navbar />
            <form @click.prevent>
                <div class="row g-3 align-items-center">
                  <div class="col-auto d-block mx-auto">
                    <h1>Update Profile</h1>
                    <input type="text" class="form-control"  placeholder="Enter Your Name" v-model="name">
                    <span class="error-feedback" v-if="v$.name.$error">
                        {{ v$.name.$errors[0].$message }}
                      </span>  
                </div>
                </div>
                <br />
                <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto">
                      <input type="email" class="form-control"  placeholder="Enter Your Email" v-model="email">
                      <span class="error-feedback" v-if="v$.email.$error">
                        {{ v$.email.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                  <br />
                <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto">
                      <input type="password" class="form-control"  placeholder="Enter Your Password" v-model="pass">
                      <span class="error-feedback" v-if="v$.pass.$error">
                        {{ v$.pass.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                  <br />
                  <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto">
                  <button type="submit" @click="updateProfileNow()" class="btn btn-primary">update Profile Now</button>;                          
                    </div>
                  </div>
                  <div class="row g-3 align-items-center">
                    <div class="col-auto d-block mx-auto error-feedback1">
                    {{ updateErr }}
                    </div>
                  </div>
            </form>
        </div>
    </div>
 </template>
 
 <script>
 import Navbar from '../Header/Navbar.vue';
 import useVuelidate from '@vuelidate/core';
 import { required, email, minLength } from '@vuelidate/validators';
import axios from 'axios';
import { mapActions } from 'vuex';
 export default {
 name: 'UpdateProfile',
 components: {
    Navbar
 },
 data(){
 return {
v$: useVuelidate(),
  name: '',
  email: '',
  pass: '',
  userId: '',
  updateErr: '',
 };
 },
 validations(){
  return {
    name: { required, minLength: minLength(10) },
    email: { required, email },
    pass: { required, minLength: minLength(8) },
  }
 },
 mounted() {
  let user = localStorage.getItem("User-info");
    if(user){
    this.name = JSON.parse(user).name;
    this.email = JSON.parse(user).email;
    this.pass = JSON.parse(user).pass;
    this.userId = JSON.parse(user).id;
    }else{
        this.redirecTo({val: "Signup"});   
    }
 },
 methods:{
    ...mapActions(["redirecTo"]),
   async updateProfileNow(){
      this.v$.$validate();
      if(!this.v$.$error){
        console.log("validated");
       let result = await axios.put(`http://localhost:3000/users/${ this.userId }`, {
       name: this.name,
       email: this.email,
       pass: this.pass,
       });
       console.log(result)
       if(result.status == 200){
        console.log("Profile Is Updated Successfully");
       localStorage.setItem("User-info", JSON.stringify(result.data));
       this.redirecTo({val: "Profile"});   
    }else{
        console.warn("Profile Not Is Updated ");
        this.updateErr = "Something went wrong, try again!";

       }
      }else{
        this.updateErr = "Something went wrong, Refresh the page!";

      }
    }
 },
 }
 </script>
 
 <style lang="scss" scoped>
 .error-feedback {
    color: red;
    font-size: 0.85em;
  } 
  .error-feedback1{
    color: red;
    font-size: 0.85em;
    font-weight: 600;
    margin-top: -62px;
  } 
 </style>