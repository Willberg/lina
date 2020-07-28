import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import TodoList from '@/views/todo/TodoList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/user/Register.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/todoList',
    name: 'TodoList',
    component: TodoList
  }
]

const router = new VueRouter({
  routes
})

export default router
