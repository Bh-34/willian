<template>
  <div class="auth-container">
    <div class="auth-left">
      <div class="brand">
        <h1>Comece agora</h1>
        <p>
          Crie sua conta para acessar os melhores cursos e evoluir com conteúdo estruturado e profissional.
        </p>

        <ul>
          <li>Aprendizado contínuo</li>
          <li>Conteúdo atualizado</li>
          <li>Acesso imediato após assinatura</li>
        </ul>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <h2>Criar conta</h2>
        <p class="muted">
          Preencha seus dados para começar.
        </p>

        <form @submit.prevent="submit">
          <div class="form-group">
            <label>Nome completo</label>
            <input v-model="nome" type="text" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>

          <div class="form-group">
            <label>CPF</label>
            <input v-model="cpf" type="text" required />
          </div>

          <div class="form-group">
            <label>Telefone</label>
            <input v-model="telefone" type="tel" />
          </div>

          <div class="form-group">
            <label>Senha</label>
            <input v-model="senha" type="password" minlength="6" required />
          </div>

          <div v-if="error" class="alert-error">
            {{ error }}
          </div>

          <button class="btn-primary" :disabled="loading">
            {{ loading ? 'Criando conta...' : 'Cadastrar' }}
          </button>
        </form>

        <div class="auth-footer">
          <router-link to="/login">
            Já possui conta? Acessar
          </router-link>
        </div>
      </div>
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
.auth-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}


.auth-left {
  flex: 1;
  background: #0F172A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.brand {
  max-width: 420px;
}

.brand h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.brand p {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #CBD5E1;
}

.brand ul {
  list-style: none;
  padding: 0;
}

.brand li {
  margin-bottom: 10px;
  color: #E2E8F0;
}

.auth-left {
  flex: 1;
}

.auth-right {
  flex: 1.4;
}

.auth-right {
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.auth-card {
  width: 100%;
  max-height: 100%;
  max-width: 380px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
}

.auth-card h2 {
  margin-bottom: 6px;
  font-size: 1.4rem;
  color: #0F172A;
}

.muted {
  color: #64748B;
  font-size: 0.9rem;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

input {
  padding: 6px;
  border: 1px solid #CBD5E1;
  border-radius: 6px;
  font-size: 0.95rem;
}

input:focus {
  border-color: #0F172A;
  outline: none;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #0F172A;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1E293B;
}

.alert-error {
  background: #FEE2E2;
  color: #991B1B;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #0F172A;
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-left {
    display: none;
  }
}

</style>