<template>
    <div>
        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                  <h1>Log In</h1>
                  <input type="email" class="form-control" placeholder="Enter Your Email" v-model="state.email">

                  <span class="error-feedback" v-if="v$.email.$error">
                    {{ v$.email.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                  <input type="password" class="form-control" placeholder="Enter Your Password" v-model="state.pass">
                  
                  <span class="error-feedback" v-if="v$.pass.$error">
                    {{ v$.pass.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <br />
              <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
              <button type="submit" class="btn btn-primary" @click="userLogin()">Login</button> &nbsp;&nbsp;&nbsp;             
              <button type="button" class="btn btn-info" @click="redirecTo({val: 'Signup'})">Dont Have an acount</button>          
                </div>
              </div>
              <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto error-feedback1">
                {{ userNotFoundErr }}
                </div>
              </div>
        </form>
    </div>
</template>
<script>
import axios from "axios";
import { mapActions } from 'vuex'
import useValidate from "@vuelidate/core";
import { required, email, minLength} from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
    name: "Login",

    setup(){
      const state = reactive({
        pass: '',
        email: '',
      });
      const rules = computed(() => {
      return {
       pass: {required, minLength:minLength(8) },
       email: {required, email},
      }  
      });
     const v$ = useValidate(rules, state);
     return {
      state, v$
     }
    },
    data() {
        return {
          userNotFoundErr:"",
        }
    },
    mounted(){
      let user = localStorage.getItem('User-info');
   if(user){
    this.redirecTo({val: "home"})
   }
    },
    methods: {
      ...mapActions(['redirecTo']),
        // LoginPage(){
        //     this.$router.push({ name: "Signup"})
        // }
        async userLogin(){
          this.v$.$validate();
       if(!this.v$.$error){
        console.log("Form Valideted Successfully")
        let result = await axios.get(`http://localhost:3000/users?email=${this.state.email}&pass=${this.state.pass}`);
       if(result.status == 200 && result.data.length > 0){
        localStorage.setItem("User-info", JSON.stringify(result.data[0]));
        this.redirecTo({val: "home"});
       }else{
        this.userNotFoundErr = "User Not Found";
       }
        // console.log(result)
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
.error-feedback1{
  color: red;
  font-size: 0.85em;
  font-weight: 600;
  margin-top: -62px;
} 
</style>