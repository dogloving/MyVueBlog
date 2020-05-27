import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from "views/Login"
import AddNewArticle from "views/admin/AddNewArticle"
import Home from "views/Home.vue"
import EditArticle from "views/admin/EditArticle"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/editarticle/:aid',
    component: EditArticle,
    props: true
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/addnewarticle',
    component: AddNewArticle
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
