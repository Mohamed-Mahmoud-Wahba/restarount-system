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
                  <h1>Update Item</h1>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <input type="text" class=" w250" id="floatItemName" placeholder="Enter Item Name"  v-model.trim="itemsName">
                        <span class="error-feedback" v-if="v$.itemsName.$error">
                            {{ v$.itemsName.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <input type="number" class=" w250" id="floatItemPrice" placeholder="Enter Item price"  v-model.trim="itemprice">
                        <span class="error-feedback" v-if="v$.itemprice.$error">
                            {{ v$.itemprice.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <input type="number" class=" w250" id="floatItemQty" placeholder="Enter Item Quantities" v-model.trim="itemsQty">
                        <span class="error-feedback" v-if="v$.itemsQty.$error">
                            {{ v$.itemsQty.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <textarea class=" w250 h200" placeholder="Enter Item Descriptions" id="floatItemDescriptions" v-model.trim="descriptions"></textarea>
                        <span class="error-feedback" v-if="v$.descriptions.$error">
                            {{ v$.descriptions.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{'form-group-error': v$.pickedCategory.$error}">
                        <select class="w250 " id="floatItemCategory" v-model.trim="pickedCategory">
                            <option v-for="(cat, i) in ListOfCategories" :key="i" :value="cat.id">{{ cat.name }}</option>
                          </select>
                        <span class="error-feedback" v-if="v$.pickedCategory.$error">
                            {{ v$.pickedCategory.$errors[0].$message }}
                          </span> 
                    </div>
                </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto" v-if="(successMassage.length > 0)">
                <!-- {{ successMassage }} -->
                <div>
                  <div class="spinner"></div>
                </div>
              
                </div>
                <div class="col-auto d-block mx-auto alert alert-danger" v-if="(errorMassage.length > 0)">
                  {{ errorMassage }}
                  </div>
              </div><br />
              <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                <button type="button" class="btn btn-warning w250" @click="UpdateItem()">Update Now</button>
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
  name: 'UpdateItem',
  components:{
    Navbar
  },
  data(){
    return {
      v$: useVuelidate(),
      userId: "",
      userName: "",
      locationId: this.$route.params.locationID,
      itemId: this.$route.params.itemId,
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
this.canUserAccessThisItem({
  userIdIs: this.userId, 
  locationIdIs: this.locationId, 
  itemIdIs: this.itemId,
  redirecToPage: 'home',
});
      this.getLocationInfo(this.userId, this.locationId) ;
      this. getItemInfo(this.userId, this.locId, this.itemId);
     }
    },
  methods:{
    ...mapMutations(["isLoggedInUser", "disblayAllCatogries", "canUserAccessThisLocation", "canUserAccessThisItem"]),
    ...mapActions(["redirecTo"]),
    async getItemInfo(userId, locId, itemId){
  let result = await axios.get(`http://localhost:3000/items?userId=${userId}&locationId=${locId}&id=${itemId}`);
  let resultData = result.data[0];
  if(result.status == 200 ){
    this.descriptions = resultData.descriptions;
    this.itemsName = resultData.name;
    this.itemsQty = resultData.qty;
    this.itemprice = resultData.price;
    this.pickedCategory = resultData.catId;
  }

},
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
    async UpdateItem(){
        this.v$.$validate();
        if(!this.v$.$error){
        console.log("validated");
       let results = await axios.put(`http://localhost:3000/items/${this.itemId}`, {
        name: this.itemsName,
        price: parseFloat(this.itemprice).toFixed(2),
        descriptions: this.descriptions,
        qty: parseInt(this.itemsQty,10),
        userId: this.userId,
        locId: parseInt( this.locationId, 10),
        catId: this.pickedCategory,
        // pickedCategory: this.pickedCategory,
        
       });
       if(results.status == 200){
        // this.userNotFoundErr = "Good Job!";
        // this.redirecTo({val: "home"});
        this.errorMassage = "";

        this.successMassage = "Item Updated Successfully...";
        // setTimeout( () => {
          this.$router.push({ name: "hello"})
        // }, 2000);
        console.log("Item Updated Successfully...");
       }else{
        this.successMassage = "";
        this.errorMassage = "Something went wrong, please try again";

        console.log("Failed Updating this Item");
       }
      }else{
        this.successMassage = "";
        this.errorMassage = "You must fill in all required fields!";
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
  svg.spinner {
    animation: 2s linear infinite svg-animation;
  }
  
  @keyframes svg-animation {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
  
  .spinner{
  
    -webkit-animation:spin 1.5s linear infinite;
    -moz-animation:spin 1.5s linear infinite;
    animation:spin 1.5s linear infinite;

    width: auto;
    margin: 20px auto;
    animation: spin 1.5s linear infinite;
    width: 80px;
    height: 80px;
    border-radius: 50px;
    border: 10px dotted darkblue;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
input, select{
  background-color: #fff;
  border: 1px solid;
  padding: 14px;
  border-radius: 4px;
}
textarea{
  background-color: #ffff;
  padding: 14px 15px 0 15px;
}
  </style>