<template>
  <div>
    <ul id="nav">
      <router-link
      tag="li" 
      :to="{ name: 'home', params: { pageTitle: 'Home Page' } }" 
      exact>
        <a>Home</a>
    </router-link> 
      <a href="#" @click="logMeOut()">Logout</a>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
name: "Navbar",
methods: {
    ...mapActions(["redirecTo"]),
    logMeOut(){
        localStorage.clear(); 
        this.redirecTo({val: "Login"})
    }
}
}
</script>

<style lang="scss" scoped>
$font-color: darkcyan;  
$nav-color: #525a5a;
ul{
    display: flex;
    justify-content: center;
    list-style: none;
    margin-bottom: 50px;
    a{
        text-decoration: none;
        font-weight: bold;
        color: $font-color;
        padding: 10px;
    }
}
a.router-link-exact-active a, ul a a:hover{
    color: $nav-color;
    box-shadow: 2px 2px 4px 0px $nav-color;
}
</style>