<template>
    <div>
      <Navbar />
      <form @click.prevent>
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
          <h1>Update New Restaurant</h1>
            </div>
          </div>
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
              <input type="text" class="form-control" placeholder="Restaurant Name" v-model="state.name">
              <span class="error-feedback" v-if="v$.name.$error">
                {{ v$.name.$errors[0].$message }}
              </span>
            </div>
          </div>
          <br />
          <div class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Phone Number" v-model="state.phone">
                <span class="error-feedback" v-if="v$.phone.$error">
                    {{ v$.phone.$errors[0].$message }}
                  </span>
            </div>
            </div>
            <br />
          <div class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Address" v-model="state.address">
                <span class="error-feedback" v-if="v$.address.$error">
                    {{ v$.address.$errors[0].$message }}
                  </span> 
            </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto alert alert-success" v-if="(successMassage.length > 0)">
                {{ successMassage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-danger" v-if="(errorMassage.length > 0)">
                  {{ errorMassage }}
                  </div>
              </div><br />
              <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                <button type="button" class="btn btn-success" @click="updateLocation()">Update Now</button>
              </div>
              </div>
            </form>
    </div>
  </template>
  
  <script>
  import Navbar from '../Header/Navbar.vue';
  import useVuelidate from '@vuelidate/core';
  import { required, minLength } from '@vuelidate/validators';
  import {reactive, computed } from "vue";
  import { mapActions } from 'vuex';
  import axios from 'axios';
  // import { json } from 'body-parser';
  export default {
  name: 'UpdateLocation',
  components:{
    Navbar
  },
  setup() {
      const state = reactive({
          name: "",
          phone: "",
          address: "",
      });
      const rules = computed( () => {
       return {
          name: { required, minLength: minLength(10) },
          phone: { required, minLength: minLength(11) },
          address: { required, minLength: minLength(10) },
       }
      });
      const v$ = useVuelidate(rules, state);
      return {
          state, v$
      }
  },
  data(){
      return{
          userId: "",
          successMassage: "",
          errorMassage: "",
          locationId: "",
           
      };
  },
  mounted() {
     let user = localStorage.getItem('User-info');
     if(!user){
      this.redirecTo({val: "Signup"});
     }else{
       this.userId = JSON.parse(user).id;
       this.locationId = this.$route.params.locationId;
      this.canCurrentUserAccessThisLocation();

     }
      },
  methods:{
      ...mapActions(["redirecTo"]),
      async canCurrentUserAccessThisLocation(){
      let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`);
      console.log(result)
      if (result.status === 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.state.name = this.locationData[0].name;
        this.state.address = this.locationData[0].address;
        this.state.phone = this.locationData[0].phone;
      } else{
        this.redirecTo({val: "home"});
      }
    console.log(result.locationId)
  },
       async updateLocation(){
        this.v$.$validate();
        if(!this.v$.$error){
          console.log("validated");
         let results = await axios.put(`http://localhost:3000/locations/${ this.locationId }`, {
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.address,
          userId: this.userId,
         });
         if(results.status == 200){
          // this.userNotFoundErr = "Good Job!";
          // this.redirecTo({val: "home"});
          this.errorMassage = "";
          this.successMassage = "Location is Updated ....";
          setTimeout( () => {
            this.redirecTo({val: "home"});
          }, 2000);
          console.log("Updated This Location Successfully");
         }else{
          this.successMassage = "";
          this.errorMassage = "Something went wrong, please try again";
  
          console.log("Failed Added New Location");
         }
        }else{
          this.successMassage = "";
          this.errorMassage = "You must in all required fields!";
        }
      },
  },
  }
  </script>
  
  <style lang="scss" scoped>
  .error-feedback {
      color: red;
      font-size: 0.85em;
    } 
  </style>