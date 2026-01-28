<template>
  <nav class="navbar">
    <div style="font-weight:700">Tech Store</div>
    <div style="margin-left:auto; display:flex; gap:12px; align-items:center">
      <router-link to="/">Dashboard</router-link>
      <router-link to="/produtos">Produtos</router-link>
      <router-link v-if="!logged" to="/cadastro">Cadastro</router-link>

      <div v-if="logged" class="user-area">
        <span class="user-email">{{ userEmail }}</span>
        <button class="btn-logout" @click="doLogout">Sair</button>
      </div>

      <!-- mostra apenas quando deslogado; usa rota nomeada para consistência -->
      <router-link v-else :to="{ name: 'Login' }">Entrar</router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { user, logout, isAuthenticated } from '@/services/authService'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const logged = computed(() => isAuthenticated())
    const userEmail = computed(() => user.value?.email || '')

    function doLogout() {
      logout()
      router.push('/login')
    }

    return { logged, userEmail, doLogout }
  }
})
</script>

<style scoped>
.navbar{ align-items:center }
.user-email{ margin-right:8px; font-weight:600; font-size:14px }
.btn-logout{ background:transparent; border:1px solid rgba(255,255,255,0.14); color:inherit; padding:6px 8px; border-radius:6px; cursor:pointer }
</style>
