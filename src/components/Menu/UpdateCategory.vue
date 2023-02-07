<template>
    <div>
      <Navbar />
      <div class="container">
          <router-link :to="{ name: 'ViewCategories', params: {locationId: locationId }}">
              <button class="btn btn-info">Back To Category</button>
           </router-link>&nbsp;&nbsp;
           <router-link :to="{ name: 'Menu', params: {locationId:  locationId}}">
              <button class="btn btn-success">Back To Mene</button>
           </router-link>
           <br />
           <div class="text-center">
            <h1 class="mb-1">{{ locName }}</h1>
            <p  class="text-muted">{{ locAddress }}</p>
          </div>
          <form @click.prevent>
            <div class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto">
                <h1>Update Category</h1>
              </div>
            </div>
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                  <input type="text" class="form-control" placeholder="Add Category Name" v-model="name">
                  <span class="error-feedback" v-if="v$.name.$error">
                    {{ v$.name.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <br />
  
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
                    <button type="button" class="btn btn-success" @click="updateCategory()">Update Now</button>
                  </div>
                  </div>
                </form>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../Header/Navbar.vue';
  import { mapActions, mapMutations } from 'vuex';
  import axios from 'axios';
  import useValidate from "@vuelidate/core";
  import { required, minLength, maxLength} from "@vuelidate/validators";
  export default {
  name: 'UpdateCategory',
  components:{
      Navbar,
  },
  data(){
      return{
        v$: useValidate(),
          locationId: this.$route.params.locationID,
          catId: this.$route.params.catId,
          userId: "",
          locName: "",
          locAddress:"",
          name:"",
          successMassage:"",
          errorMassage:"",
          ListofUserCategories: [],
          categoryName: [],  
      }
  },
  validations(){
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15)}
    }
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
      this.canUserAccessThisCategory({
        userIdIs: this.userId, 
        catIdIs: this.catId, 
        locationIdIs: this.locationId, 
        redirecToPage: 'home',
      });
      this.getLocationInfo(this.userId, this.locationId) ;
      this.displayUserCategories(this.userId, this.locationId);
      this.getCategoryName(this.userId, this.locationId, this.catId)
     }
  },
  methods:{
    ...mapMutations(["isLoggedInUser", "disblayAllCatogries", "canUserAccessThisLocation", "canUserAccessThisCategory"]),
    ...mapActions(["redirecTo"]),
    async displayUserCategories(userId, locId){
    let result = await axios.get(`http://localhost:3000/categories?userId=${userId}&locationId=${locId}`);
     if(result.status == 200){
      this.ListofUserCategories = result.data;
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
    async getCategoryName(userId, locId, catId){
  let result = await axios.get(`http://localhost:3000/categories?userId=${userId}&locationId=${locId}&id=${catId}`);
  if(result.status == 200 ){
    this.categoryName = result.data; //Array
    if(this.categoryName.length > 0){
      this.name = this.categoryName[0].name;
    }
  }

},
    async updateCategory() {
      this.v$.$validate();
      let filterCategoryName = this.ListofUserCategories.filter(  (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase() );
      console.table(this.ListofUserCategories);
  
      if(!this.v$.$error){
        if(filterCategoryName.length > 0){
        this.errorMassage = "Category Name aleady exists, try anthor name";
        this.successMassage = "";
      }else{
        let result = await axios.put(`http://localhost:3000/categories/${this.catId}`, {
      name: this.name,
      userId: this.userId,
      locationId:parseInt(this.locationId, 10),
    });
    if(result.status == 200){
        this.errorMassage = "";
        this.successMassage = "updated  Category Name Successfully ";
        setTimeout( () => {
          this.$router.push({ name: "ViewCategories", params: {locationID: this.locationId}});
  
        },2000)
    }else{
        this.successMassage = "";
        this.errorMassage = "Something Went Wrong Try again...";
    }
      }
  
      }else{
        this.successMassage = "";
        this.errorMassage = "You Must Fill in category name";
      }
  
  // if()
    },
  }
  }
  </script>
  
  <style>
  .error-feedback {
    color: red;
    font-size: 0.85em;
  } 
  </style>