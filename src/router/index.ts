import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import DashboardAssinado from '@/views/DashboardAssinado.vue'
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
  { path: '/perfil', name: 'perfil', component: Perfil, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'UserDashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/dashboard-assinado', name: 'DashboardAssinado', component: DashboardAssinado, meta: { requiresAuth: true } },
  { path: '/visualizacao', name: 'visualizacao', component: Visualizaçao, meta: { requiresAuth: true, redirect: true } },
  { path: '/pagando', name: 'pagando', component: Pagando, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Verificar autenticação
  if ((to.meta as any).requiresAuth && !isAuthenticated()) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Redirecionar login/cadastro se já autenticado
  else if ((to.name === 'login' || to.name === 'cadastro') && isAuthenticated()) {
    next({ name: 'Dashboard' })
  } 
  // Proteção específica: só permite dashboard assinada se houver pagamento
  else if (to.name === 'DashboardAssinado') {
    if (!localStorage.getItem('ultimoPagamento')) {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  } 
  else {
    next()
  }
})

export default router
