import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/auth/login.vue'
import Signup from '../components/auth/signup.vue'

const routes = [
  {
    path: '/',
    redirect: '/auth/signup'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/auth/signup',
    name: 'Signup',
    component: Signup
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router