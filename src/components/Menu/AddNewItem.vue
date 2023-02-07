<template>
    <div>
      <Navbar />
      <div class="container">
      <div class="claerfix"> </div>
      <router-link :to="{name: 'Menu', params: { locId: locationId}}">
        <button type="button" class="float-start btn btn-info">Back To Menu</button>
      </router-link>
        <div class="text-center">
          <h1 class="mb-1">{{ locName }}</h1>
          <p  class="text-muted">{{ locAddress }}</p>
        </div>
        <form @click.prevent>
            <div class="row g-3 align-items-center">
               <div class="col-auto d-block mx-auto">
                  <hr />
                  <h1>Add New Item</h1>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <input type="text" class="form-control w250" id="floatItemName" placeholder="Enter Item Name"  v-model.trim="itemsName">
                        <label for="floatItemName">Enter Item Name</label>
                        <span class="error-feedback" v-if="v$.itemsName.$error">
                            {{ v$.itemsName.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <input type="number" class="form-control w250" id="floatItemPrice" placeholder="Enter Item price"  v-model.trim="itemprice">
                        <label for="floatItemPrice">Enter Item Price</label>
                        <span class="error-feedback" v-if="v$.itemprice.$error">
                            {{ v$.itemprice.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <input type="number" class="form-control w250" id="floatItemQty" placeholder="Enter Item Quantities" v-model.trim="itemsQty">
                        <label for="floatItemQty">Enter Item Quantities</label>
                        <span class="error-feedback" v-if="v$.itemsQty.$error">
                            {{ v$.itemsQty.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <textarea class="form-control w250 h200" placeholder="Enter Item Descriptions" id="floatItemDescriptions" v-model.trim="descriptions"></textarea>
                        <label for="floatItemDescriptions">Enter Item Descriptions</label>
                        <span class="error-feedback" v-if="v$.descriptions.$error">
                            {{ v$.descriptions.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <select class="w250 form-select" id="floatItemCategory" v-model.trim="pickedCategory">
                            <option v-for="(cat, i) in ListOfCategories" :key="i" :value="cat.id">{{ cat.name }}</option>
                          </select>
                        <label for="floatItemCategory">Select Category Name</label>
                        <span class="error-feedback" v-if="v$.pickedCategory.$error">
                            {{ v$.pickedCategory.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
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
                <button type="button" class="btn btn-primary w250" @click="addNewItem()">Add Now</button>
              </div>
              </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength, between } from '@vuelidate/validators';
  import Navbar from '../Header/Navbar.vue';
  import { mapActions, mapState, mapMutations } from 'vuex';
  import axios from 'axios';
  export default {
  name: 'AddNewItem',
  components:{
    Navbar
  },
  data(){
    return {
      v$: useVuelidate(),
      userId: "",
      userName: "",
      locationId: this.$route.params.locationID,
      locName: "",
      locAddress:"",
      pickedCategory: "",
      successMassage: "",
      errorMassage: "",
      itemsName: "",
      itemsQty: 1,
      descriptions: "",
      itemprice: "",
    }
  },
  computed: {
  ...mapState(["isUserLoggedIn", "LoggedInUserId", "numOfCategories", "ListOfCategories"]),
  },
  validations(){
    return {
        itemsName: { required, minLength: minLength(6) },
        descriptions: { required, minLength: minLength(6), maxLength:maxLength(120) },
        itemsQty: { required, between: between(0,1000000) },
        itemprice: { required, between: between(1,100000) },
        pickedCategory: { required },
    }
  },
  async mounted() {
     let user = localStorage.getItem('User-info');
     if(!user){
      this.redirecTo({val: "Signup"});
     }else{
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
      this.isLoggedInUser();
      this.locationId = this.$route.params.locationID;
      console.log(this.userId, this.locationId)
      this.disblayAllCatogries({userIdIs: this.userId, locationIdIs: this.locationId});
      this.canUserAccessThisLocation({
  
        userIdIs: this.userId, 
        locationIdIs: this.locationId, 
        redirecToPage: 'home',
      });
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
    },
    async addNewItem(){
        this.v$.$validate();
        if(!this.v$.$error){
        console.log("validated");
       let results = await axios.post(`http://localhost:3000/items`, {
        name: this.itemsName,
        price: parseFloat(this.itemprice).toFixed(2),
        descriptions: this.descriptions,
        qty: parseInt(this.itemsQty,10),
        userId: this.userId,
        locId: parseInt( this.locationId, 10),
        catId: this.pickedCategory,
        // pickedCategory: this.pickedCategory,
        
       });
       if(results.status == 201){
        // this.userNotFoundErr = "Good Job!";
        // this.redirecTo({val: "home"});
        this.errorMassage = "";
        this.successMassage = "Added New Item";
        setTimeout( () => {
          this.$router.push({ name: "Menu", params: {locationId: this.locationID}})
        }, 2000);
        console.log("Added New Item Successfully");
       }else{
        this.successMassage = "";
        this.errorMassage = "Something went wrong, please try again";

        console.log("Failed Added New Item");
       }
      }else{
        this.successMassage = "";
        this.errorMassage = "You must in all required fields!";
      }
    },
    }
  }
  
  </script>
  
  <style lang="scss">
  .mb{
    margin-bottom: 0;
  }
  .w250{
    min-width: 250px;
  }
  .h200{
    min-height: 200px !important;
  }
  .form-group-error{
    color: red;
    input, select, textarea{
        border-color: red;
    }
  }
  
  </style>