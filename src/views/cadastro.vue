<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <h1>Crie sua conta</h1>
        <p class="muted">Comece sua jornada de aprendizado</p>
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="nome">Nome Completo</label>
          <input v-model="nome" id="nome" type="text" placeholder="Seu nome completo" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" id="email" type="email" placeholder="seu@exemplo.com" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="cpf">CPF</label>
            <input v-model="cpf" id="cpf" type="text" placeholder="000.000.000-00" required />
          </div>

          <div class="form-group">
            <label for="phone">Telefone</label>
            <input v-model="telefone" id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            v-model="senha" 
            id="password"
            type="password" 
            placeholder="Mín. 6 caracteres" 
            minlength="6" 
            required 
          />
          <small class="hint">Use pelo menos 6 caracteres</small>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <div class="form-actions">
          <button class="btn primary btn-lg" :disabled="loading">
            {{ loading ? 'Criando conta...' : 'Cadastrar' }}
          </button>
        </div>

        <div class="login-link">
          <p class="muted">Já tem uma conta? 
            <router-link to="/login">Faça login</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { register } from '@/services/authService'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const nome = ref('')
    const email = ref('')
    const cpf = ref('')
    const telefone = ref('')
    const senha = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const router = useRouter()

    function validarTelefone(t: string) {
      if (!t) return true
      return /^[-+() 0-9]+$/.test(t)
    }

    async function submit() {
      error.value = ''
      success.value = ''
      
      if (senha.value.length < 6) {
        error.value = 'Senha deve ter ao menos 6 caracteres'
        return
      }
      
      if (!validarTelefone(telefone.value)) {
        error.value = 'Telefone inválido'
        return
      }

      loading.value = true
      try {
        await register({ 
          nome: nome.value, 
          email: email.value, 
          cpf: cpf.value, 
          senha: senha.value, 
          telefone: telefone.value 
        })
        success.value = 'Conta criada com sucesso! Redirecionando...'
        setTimeout(() => router.push('/login'), 1500)
      } catch (e: any) {
        error.value = e.message || 'Erro ao criar conta'
      } finally {
        loading.value = false
      }
    }

    return { nome, email, telefone, cpf, senha, loading, error, success, submit }
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #ECF8D4 0%, #F5F1EB 100%);
}

.register-card {
  width: 100%;
  max-width: 500px;
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

.hint {
  font-size: 0.85rem;
  color: #6B6B6B;
  margin-top: 4px;
  font-weight: 500;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
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
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-error {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FECACA;
}

.alert-success {
  background: #DCFCE7;
  color: #166534;
  border: 1px solid #BBF7D0;
}

.form-actions {
  margin-bottom: var(--spacing-lg);
}

.btn-lg {
  width: 100%;
  padding: 14px 24px;
  font-size: 1rem;
}

.login-link {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border);
}

.login-link p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.login-link a {
  color: #2E5C8A;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

.login-link a:hover {
  color: #4A90E2;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .register-card {
    padding: var(--spacing-xl);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-actions {
  margin-bottom: var(--spacing-lg);
}

.btn-lg {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
}

.login-link {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border);
}

.login-link a {
  font-weight: 600;
  color: var(--primary);
}

@media (max-width: 480px) {
  .register-card {
    padding: var(--spacing-lg);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>