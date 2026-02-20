<template>
  <div class="auth-container">
    <div class="auth-left">
      <div class="brand">
        <h1>Plataforma de Cursos</h1>
        <p>
          Acesse conteúdos profissionais desenvolvidos para acelerar sua evolução.
          Aprenda no seu ritmo, com qualidade e estrutura organizada.
        </p>

        <ul>
          <li>Cursos atualizados</li>
          <li>Acesso imediato após assinatura</li>
          <li>Material complementar disponível</li>
        </ul>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <h2>Acessar conta</h2>
        <p class="muted">
          Entre para continuar seu aprendizado.
        </p>

        <form @submit.prevent="submit">
          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" required />
          </div>

          <div class="form-group">
            <label>Senha</label>
            <input v-model="senha" type="password" required minlength="6" />
          </div>

          <div v-if="error" class="alert-error">
            {{ error }}
          </div>

          <button class="btn-primary" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="auth-footer">
          <router-link to="/cadastro">
            Criar nova conta
          </router-link>
        </div>
      </div>
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
.auth-container {
  display: flex;
.auth-container {
  min-height: calc(100vh - 70px); 
  width: 100%;
}

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