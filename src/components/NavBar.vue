<template>
  <nav class="navbar">
    <div style="font-weight:700">Tech Store</div>
    <router-link to="/perfil" class="btn-perfil">👤 Perfil</router-link>
    <div style="margin-left:auto; display:flex; gap:12px; align-items:center">
      <router-link to="/">Dashboard</router-link>
      <router-link v-if="!logged" to="/cadastro">Cadastro</router-link>

        <div v-if="logged" class="user-area">
          <span class="user-email">{{ userEmail }}</span>
        </div>

      <!-- mostra apenas quando deslogado; usa rota nomeada para consistência -->
      <router-link v-else :to="{ name: 'Login' }">Entrar</router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { user } from '@/services/authService'

export default defineComponent({
  setup() {
    const logged = computed(() => !!user.value)
    const userEmail = computed(() => user.value?.email || '')

    return { logged, userEmail }
  }
})
</script>

<style scoped>
.navbar{ align-items:center }
.btn-perfil{ color:inherit; text-decoration:none; font-weight:600; font-size:14px; margin-left:16px; padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:6px; transition:all 0.2s; display:flex; align-items:center; gap:6px }
.btn-perfil:hover{ background:rgba(255,255,255,0.2) }
.user-email{ margin-right:8px; font-weight:600; font-size:14px }
.btn-logout{ background:transparent; border:1px solid rgba(255,255,255,0.14); color:inherit; padding:6px 8px; border-radius:6px; cursor:pointer }
</style>
