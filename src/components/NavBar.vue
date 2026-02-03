<template>
  <nav class="navbar">
    <div class="logo">Tech Store</div>
          <router-link to="/perfil">Perfil</router-link>
    <div class="nav-right">
      <router-link to="/">Dashboard</router-link>
      <template v-if="!isLogged">
        <router-link to="/cadastro">Cadastro</router-link>
        <router-link to="/login">Entrar</router-link>
      </template>

      <!-- LOGADO -->
      <template v-else>

        <div class="user-area">
          <span class="user-name">👋 {{ userName }}</span>
          <button class="btn-logout" @click="doLogout">Sair</button>
        </div>
      </template>
    </div>
  </nav>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUser, logout } from '@/services/authService'

export default defineComponent({
  setup() {
    const router = useRouter()
    const user = useUser() // ref

    const isLogged = computed(() => !!user.value)

    const userName = computed(() => {
      return user.value?.nome || user.value?.email || ''
    })

    function doLogout() {
      logout()
      router.push('/login')
    }

    return {
      isLogged,
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
