import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/login.vue'
import Cadastro from '@/views/cadastro.vue'
import Perfil from '@/views/Perfil.vue'
import Visualizaçao from '@/views/Visualizaçao.vue' 
import Pagando from '@/views/Pagando.vue'
import { isAuthenticated } from '@/services/authService'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cadastro', name: 'cadastro', component: Cadastro },
  {path: '/perfil', name: 'perfil', component: Perfil, meta: { requiresAuth: true } },
  {path: '/visualizacao', name: 'visualizacao', component: Visualizaçao, meta: { requiresAuth: true } },
  {path: '/pagando', name: 'pagando', component: Pagando, meta: { requiresAuth: true } }
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
