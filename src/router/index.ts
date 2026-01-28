import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Produtos from '@/views/Produtos.vue'
import Login from '@/views/login.vue'
import Cadastro from '@/views/cadastro.vue'
import { isAuthenticated } from '@/services/authService'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/produtos', name: 'Produtos', component: Produtos, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if ((to.meta as any).requiresAuth && !isAuthenticated()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Cadastro') && isAuthenticated()) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
