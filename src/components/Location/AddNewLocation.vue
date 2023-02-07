<template>
  <div>
    <Navbar />
    <form @click.prevent>
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
              <button type="button" class="btn btn-primary" @click="addLocation()">Add Now</button>
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
name: 'AddNewLocation',
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
    };
},
mounted() {
   let user = localStorage.getItem('User-info');
   if(!user){
    this.redirecTo({val: "Signup"});
   }else{
     this.userId = JSON.parse(user).id;
   }
    },
methods:{
    ...mapActions(["redirecTo"]),
     async addLocation(){
      this.v$.$validate();
      if(!this.v$.$error){
        console.log("validated");
       let results = await axios.post(`http://localhost:3000/locations`, {
        name: this.state.name,
        phone: this.state.phone,
        address: this.state.address,
        userId: this.userId,
       });
       if(results.status == 201){
        // this.userNotFoundErr = "Good Job!";
        // this.redirecTo({val: "home"});
        this.errorMassage = "";
        this.successMassage = "Added New Location";
        setTimeout( () => {
          this.redirecTo({val: "home"});
        }, 2000);
        console.log("Added New Location Successfully");
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