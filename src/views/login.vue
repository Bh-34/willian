<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h1>Bem-vindo!</h1>
        <p class="muted">Acesse sua conta para continuar</p>
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@exemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="senha"
            type="password"
            placeholder="Sua senha"
            required
            minlength="6"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div class="form-actions">
          <button class="btn primary" :disabled="loading">
            {{ loading ? 'Carregando...' : 'Entrar' }}
          </button>
          <button type="button" class="btn secondary" @click="fillTest">
            Conta de teste
          </button>
        </div>
      </form>

      <div class="divider">OU</div>

      <router-link to="/cadastro" class="btn btn-block">
        Criar nova conta
      </router-link>
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

    return {
      email,
      senha,
      loading,
      error,
      submit,
      fillTest
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #ECF8D4 0%, #F5F1EB 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-3xl);
  border: 1px solid var(--border);
}

.card-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.card-header h1 {
  font-size: 1.85rem;
  margin-bottom: var(--spacing-sm);
  color: #3D3D3D;
  font-weight: 800;
}

.card-header .muted {
  font-size: 1rem;
  color: #6B6B6B;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

input {
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-family: inherit;
  transition: var(--transition);
  background: #F5F1EB;
  color: var(--text-primary);
}

input::placeholder {
  color: #8B8B8B;
}

input:focus {
  border-color: #85685A;
  background: white;
  box-shadow: 0 0 0 3px rgba(133, 104, 90, 0.1);
  outline: none;
}

.alert {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-error {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FECACA;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-actions .btn {
  flex: 1;
}

.divider {
  text-align: center;
  color: #8B8B8B;
  margin: var(--spacing-xl) 0;
  position: relative;
  font-weight: 600;
  font-size: 0.9rem;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: var(--border);
  z-index: 0;
}

.divider {
  background: var(--card);
  position: relative;
  z-index: 1;
  padding: 0 var(--spacing-md);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.btn-block {
  width: 100%;
  justify-content: center;
  background: white;
  color: #85685A;
  border: 2px solid var(--border);
  font-weight: 600;
  transition: var(--transition);
}

.btn-block:hover {
  background: #F5F1EB;
  border-color: #85685A;
  color: #5A4436;
}

@media (max-width: 480px) {
  .login-card {
    padding: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
