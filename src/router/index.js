import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("views/admin/Login")
const AddNewArticle = () => import("views/admin/AddNewArticle")
const Home = () => import("views/common/Home")
const EditArticle = () => import("views/admin/EditArticle")
const EditProject = () => import("views/admin/EditProject")
const Projects = () => import("views/common/Projects")

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
    path: '/editproject/:pid?',
    component: EditProject,
    props: true
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/addnewarticle',
    component: AddNewArticle
  },
  {
    path: '/project',
    component: Projects
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
