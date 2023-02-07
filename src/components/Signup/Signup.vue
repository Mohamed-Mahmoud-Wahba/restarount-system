<template>
    <div>
        <form @click.prevent>
            <div class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto">
                <h1>Sign Up</h1>
                <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name">
                <span class="error-feedback" v-if="v$.name.$error">
                  {{ v$.name.$errors[0].$message }}
                </span>
              </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                  <input type="email" class="form-control" placeholder="Enter Your Email" v-model="email">
                  <span class="error-feedback" v-if="v$.email.$error">
                    {{ v$.email.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                  <input type="password" class="form-control" placeholder="Enter Your Password" v-model="pass">
                  <span class="error-feedback" v-if="v$.pass.$error">
                    {{ v$.pass.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <br />
              <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
              <button type="submit" @click="SingUpNow()" class="btn btn-primary">Sing Up Now</button>  &nbsp;&nbsp;&nbsp;             
              <button type="button" class="btn btn-info" @click="redirecTo({val: 'Login'})">Have an acount</button>              
                </div>
              </div>
        </form>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
export default {
    name: "SingUp",
    data() {
        return {
            v$: useValidate(),
            name: '',
            pass: '',
            email: '',
        }
    },
    validations(){
       return {
       name: {required, minLength:minLength(10) },
       pass: {required, minLength:minLength(8) },
       email: {required, email},
       };
    },
    mounted() {
   let user = localStorage.getItem('User-info');
   if(user){
    this.redirecTo({val: "home"})
   }
    },
    methods: {
      ...mapActions(['redirecTo']),
        // signUpPage(){
        //     this.$router.push({ name: "Login"})
        // }
      async SingUpNow(){
       this.v$.$validate();
       if(!this.v$.$error){
        console.log("Form Valideted Successfully");
        let result = await axios.post('http://localhost:3000/users' ,{
          name: this.name,
          pass: this.pass,
          email: this.email,
        }) ;
        if(result.status == 201){
        console.log("Added New User Successfully");
        localStorage.setItem("User-info", JSON.stringify(result.data));
        console.log(result);
        console.log(JSON.stringify(result.data));
        this.redirecTo({val: "home"})
        }else{
        console.log("Error on Added New User");
        }
       }else{
        console.log("Form Validetion Failed")
       }
        },
    }
}
</script>
<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 0.85em;
} 
</style>