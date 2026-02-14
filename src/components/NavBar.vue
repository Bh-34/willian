<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo">
        <span class="logo-icon">TS</span>
        <span>Tech Store</span>
      </div>

      <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-right" :class="{ open: mobileMenuOpen }">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/perfil" class="nav-link">Perfil</router-link>

        <template v-if="!isLogged">
          <router-link to="/cadastro" class="nav-link">Cadastro</router-link>
          <router-link to="/login" class="nav-link btn-login">Entrar</router-link>
        </template>

        <template v-else>
          <div class="user-area">
            <span class="user-name">{{ userName }}</span>
            <button class="btn-logout" @click="doLogout">Sair</button>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser, logout } from '@/services/authService'

export default defineComponent({
  setup() {
    const router = useRouter()
    const user = useUser()
    const mobileMenuOpen = ref(false)

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
      doLogout,
      mobileMenuOpen
    }
  }
})
</script>

<style scoped>
.navbar {
  background: #0F172A;
  color: white;
  padding: var(--spacing-md) 0;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid #ffffff;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 180vh; 
}

.logo {
  font-weight: 800;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
  color: #E0DEAB;
  letter-spacing: -0.5px;
}

.logo:hover {
  color: #CB8E5F;
  transform: scale(1.02);
}

.logo-icon {
  font-size: 1.6rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  color: #E0DEAB;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  background: rgba(203, 142, 95, 0.1);
  color: #CB8E5F;
  border-bottom-color: #CB8E5F;
}

.btn-login {
  background: #CB8E5F;
  border: 2px solid #CB8E5F;
  color: white;
  padding: 8px 16px;
}

.btn-login:hover {
  background: #B07A4F;
  border-color: #E0DEAB;
  box-shadow: var(--shadow-md);
}

.user-area {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  color: #E0DEAB;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition);
}

.btn-logout:hover {
  background: #4A90E2;
  border-color: #4A90E2;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  gap: 5px;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: var(--transition);
}

/* Responsivo */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .nav-right {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #606060 0%, #808080 100%);
    flex-direction: column;
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .nav-right.open {
    max-height: 400px;
  }

  .nav-link {
    width: 100%;
    text-align: left;
  }
}
</style>
