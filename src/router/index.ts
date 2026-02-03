import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/login.vue'
import Cadastro from '@/views/cadastro.vue'
import Perfil from '@/views/Perfil.vue'
import { useUser } from '@/services/authService'

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
  const user = useUser()

  // rota protegida e NÃO logado
  if ((to.meta as any).requiresAuth && !user.value) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // já logado tentando acessar login ou cadastro
  if ((to.name === 'login' || to.name === 'cadastro') && user.value) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
