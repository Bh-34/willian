import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/login.vue'
import Cadastro from '@/views/cadastro.vue'
import Perfil from '@/views/Perfil.vue'
import { isAuthenticated } from '@/services/authService'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  {path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if ((to.meta as any).requiresAuth && !isAuthenticated()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'cadastro') && isAuthenticated()) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
