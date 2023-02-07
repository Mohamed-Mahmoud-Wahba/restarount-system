import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import UpdateProfile from '../components/Profile/updateProfile.vue';
import AddNewLocation from '../components/Location/AddNewLocation.vue';
import DeleteLocation from '../components/Location/DeleteLocation.vue';
import DeleteAllLocations from '../components/Location/DeleteAllLocations.vue';
import UpdateLocation from '../components/Location/UpdateLocation.vue';
import UserLocations from '../components/Location/UserLocations.vue';
import Mune from '../components/Menu/Menu.vue';
import AddNewCategory from '../components/Menu/AddNewCategory.vue';
import ViewCategories from '../components/Menu/ViewCategories.vue';
import UpdateCategory from '../components/Menu/UpdateCategory.vue';
import DeleteCategory from '../components/Menu/DeleteCategory.vue';
import DeleteAllCategory from '../components/Menu/DeleteAllCategory.vue';
import AddNewItem from '../components/Menu/AddNewItem.vue';
import UpdateItem from '../components/Menu/UpdateItem.vue';
import DeleteItem from '../components/Menu/DeleteItem.vue';
import DeleteAllItems from '../components/Menu/DeleteAllItems.vue';
import hello from '../components/Menu/hello.vue';

import ErrorPage from '../views/ErrorPage.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/sign-up',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login-in',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },

  {
    path: '/update-profile',
    name: 'UpdateProfile',
    component: UpdateProfile
  },
  {
    path: '/userLocations',
    name: 'UserLocations',
    component: UserLocations
  },
  {
    path: '/delete-all-locations',
    name: 'DeleteAllLocations',
    component: DeleteAllLocations
  },
  {
    path: '/up-date-location',
    name: 'UpdateLocation',
    component: UpdateLocation
  },
  {
    path: '/up-date-location/:locationId',
    name: 'UpdateLocation',
    component: UpdateLocation
  },
  {
    path: '/menu/location/:locationID',
    name: 'Menu',
    component: Mune,
  },
  {
    path: '/menu/categories/add/:locationID',
    name: 'AddNewCategory',
    component: AddNewCategory,
  },
  // {
  //   path: '/menu/categories/update/item/:itemId/loc/:locationID',
  //   name: 'UpdateItem',
  //   component: UpdateItem,
  // },
  {
    path: '/menu/item/update/item/:itemId/loc/:locationID',
    name: 'UpdateItem',
    component: UpdateItem,
  },
  {
    path: '/menu/item/update/item/:itemId/loc/:locationID',
    name: 'hello',
    component: hello,
  },
  {
    path: '/menu/categories/delete/:catId/:locationID',
    name: 'DeleteCategory',
    component: DeleteCategory,
  },
  {
    path: '/menu/categories/update/:catId/:locationID',
    name: 'UpdateCategory',
    component: UpdateCategory,
  },
  {
    path: '/menu/item/:itemId/delete/loc/:locationID',
    name: 'DeleteItem',
    component: DeleteItem,
  },
  {
    path: '/menu/items/delete-all/locationID',
    name: 'DeleteAllItems',
    component: DeleteAllItems,
  },
  {
    path: '/menu/categories/delete/all/:locationID',
    name: 'DeleteAllCategory',
    component: DeleteAllCategory,
  },
  {
    path: '/menu/categories/view/:locationID',
    name: 'ViewCategories',
    component: ViewCategories,
  },
  {
    path: '/menu/add/new/item/:locationID',
    name: 'AddNewItem',
    component: AddNewItem,
  },
  {
    path: '/add-new-location',
    name: 'AddNewLocation',
    component: AddNewLocation
  },
  {
    path: '/delete-location/:locationId',
    name: 'DeleteLocation',
    component: DeleteLocation
  },
  {
    path: '/:catchAll(.*)',
    name: 'ErrorPage',
    component: ErrorPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach( (to, from, next)=> { 
if(to.params.pageTitle !== undefined){
  document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`; 
}else{
  if(to.name == null){
    document.title = `UnKnow Page  | ${process.env.VUE_APP_TITLE}`;
  }else{
    document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`
  }
}
next();
});
export default router
