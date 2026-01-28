<template>
  <div class="login-page">
    <div class="card login-card">
      <h2>Entrar</h2>
      <form @submit.prevent="submit">
        <label>
          Email
          <input v-model="email" type="email" placeholder="seu@exemplo.com" required />
        </label>

        <label>
          Senha
          <input v-model="senha" type="password" placeholder="Senha" required minlength="6" />
        </label>

        <div v-if="error" class="error">{{ error }}</div>

        <div style="display:flex; gap:8px; margin-top:8px">
          <button class="btn primary" :disabled="loading">{{ loading ? 'Carregando...' : 'Entrar' }}</button>
          <button type="button" class="btn" @click="fillTest">Usar conta de teste</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { login } from '@/services/authService'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const email = ref('')
    const senha = ref('')
    const loading = ref(false)
    const error = ref('')
    const router = useRouter()
    const route = useRoute()

    async function submit() {
      error.value = ''
      loading.value = true
      try {
        await login(email.value, senha.value)
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      } catch (e: any) {
        error.value = e.message || 'Erro ao autenticar'
      } finally {
        loading.value = false
      }
    }

    function fillTest() {
      email.value = 'user@example.com'
      senha.value = 'senha123'
    }

    return { email, senha, loading, error, submit, fillTest }
  }
})
</script>

<style scoped>
.login-page{ display:flex; justify-content:center; padding:28px }
.login-card{ width:360px; display:flex; flex-direction:column; gap:12px; padding:20px }
form label{ display:flex; flex-direction:column; gap:6px; font-weight:600 }
input{ padding:8px; border-radius:8px; border:1px solid #e5e7eb }
.error{ color:#ef4444 }
</style>
