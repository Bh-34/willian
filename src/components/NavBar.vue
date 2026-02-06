<template>
  <nav class="navbar">
    <div class="logo">Tech Store</div>

    <div class="nav-right">
      <router-link to="/">Dashboard</router-link>
      <router-link to="/perfil">Perfil</router-link>

      <!-- NÃO LOGADO -->
      <router-link v-if="!logged" to="/cadastro">Cadastro</router-link>
      <router-link v-if="!logged" to="/login">Entrar</router-link>

      <!-- LOGADO -->
      <div v-else class="user-area">
        <span class="user-name">👋 {{ userName }}</span>
        <button class="btn-logout" @click="doLogout">Sair</button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUser, isAuthenticated, logout } from '@/services/authService'
import router from '@/router';

export default defineComponent({
  setup() {
    const router = useRouter()
    const user = useUser()

    const logged = computed(() => isAuthenticated())
    const userName = computed(() => {
      // Tentar obter do localStorage primeiro
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          return userData.nome || userData.name || userData.email || '';
        } catch {
          return '';
        }
      }
      // Fallback para o user do authService
      if (!user.value) return '';
      return user.value.nome || user.value.name || user.value.email || '';
    })

    function doLogout() {
      logout()
      router.push('/login')
    }

    return {
      logged,
      userName,
      doLogout
    }
  }
})
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: #111827;
  color: #fff;
}

.logo {
  font-weight: 700;
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.btn-logout {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: inherit;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.1);
}
</style>
