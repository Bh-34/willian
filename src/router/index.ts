import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/login.vue'
import Cadastro from '@/views/cadastro.vue'
import Perfil from '@/views/Perfil.vue'
import { useUser } from '@/services/authService'
import Visualizaçao from '@/views/visualizacao.vue' 
import Pagando from '@/views/Pagando.vue'
import Curso from '@/views/Curso.vue'
import AulaView from '@/views/Aula.vue'


const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  {path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
  {path: '/visualizacao', name: 'visualizacao', component: Visualizaçao, meta: { requiresAuth: true } },
   {path: '/pagando', name: 'pagando', component: Pagando, meta: { requiresAuth: true } },
   {path: '/cursos/:id',name: 'curso',component: Curso,meta: { requiresAuth: true }},
   {path: '/aulas/:id',name: 'aula',component: AulaView,meta: { requiresAuth: true, requiresPlano: true }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const user = useUser()

  if ((to.meta as any).requiresAuth && !user.value) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if ((to.name === 'login' || to.name === 'cadastro') && user.value) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.meta.requiresPlano && !user?.plano_id) {
    next('/')
  } else {
    next()
  }
})



export default router
