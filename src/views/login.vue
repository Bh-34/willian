<template>
  <div class="login-page">
    <div class="card login-card">
      <h2>Entrar</h2>

      <form @submit.prevent="submit">
        <label>
          Email
          <input
            v-model="email"
            type="email"
            placeholder="seu@exemplo.com"
            required
          />
        </label>

        <label>
          Senha
          <input
            v-model="senha"
            type="password"
            placeholder="Senha"
            required
            minlength="6"
          />
        </label>

        <div v-if="error" class="error">{{ error }}</div>

        <div style="display:flex; gap:8px; margin-top:8px">
          <button class="btn primary" :disabled="loading">
            {{ loading ? 'Carregando...' : 'Entrar' }}
          </button>
        </div>

        <button type="button" class="btn secondary" @click="loginDireto" style="width: 100%">
          Entrar com Conta Teste
        </button>
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
        error.value = e.message
      } finally {
        loading.value = false
      }
    }

    function fillTest() {
      email.value = 'user@example.com'
      senha.value = 'senha123'
    }

    function loginDireto() {
      const contaTeste = {
        nome: 'Visitante Teste',
        email: 'teste@techstore.com',
        cpf: '000.000.000-00',
        telefone: '(11) 99999-9999'
      }
      localStorage.setItem('user', JSON.stringify(contaTeste))
      router.push('/')
    }

    return {
      email,
      senha,
      loading,
      error,
      submit,
      fillTest,
      loginDireto
    }
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  padding: 28px;
}
.login-card {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}
form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}
input {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.error {
  color: #ef4444;
}
.btn.secondary {
  background-color: #6b7280;
  color: white;
}
.btn.secondary:hover {
  background-color: #4b5563;
}
</style>
