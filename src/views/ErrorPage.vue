<template>
  <div>
    <div class="text-center pt-5 pb-5 notfound">

        <h1>
            404
        </h1>
        <p>Page not found</p>
        <router-link :to="{ name: 'home' }">
            <button class="btn btn-info">Visit Home Page</button>
        </router-link>
    </div>
    <!-- <img src="../assets/404-page-error.png" alt=""> -->

  </div>
</template>

<script>
;
export default {
name: "ErrorPage",

}
</script>

<style lang="scss" scoped>
img{
    width: 100%;
    height: 60rem;
}
.notfound{
    background: linear-gradient(245deg,#010184,#0819c9 25%,#0f1ff2 50%,#236af9 75%,#846b10);
h1{
    font-size: calc(2.6625rem + 16.41582vw);
 color: #fff;
 font-weight: bold;
}
p{
    font-size: calc(1.25625rem + 3.50128vw);
    margin-bottom: 0.5em;
    margin-left: auto;
    margin-right: auto;
    color: #fff;
}
}
</style>