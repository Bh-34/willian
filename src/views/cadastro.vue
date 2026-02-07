<template>
  <div class="register-page">
    <div class="card register-card">
      <h2>Crie sua conta</h2>
      <form @submit.prevent="submit">
        <label>
          Nome
          <input v-model="nome" type="text" placeholder="Seu nome" required />
        </label>

        <label>
          Email
          <input v-model="email" type="email" placeholder="seu@exemplo.com" required />
        </label>

          <label>
          cpf
          <input v-model="cpf" type="text" placeholder="Seu cpf" required />
        </label>

        <label>
          Telefone
          <input v-model="telefone" type="tel" placeholder="(XX) X XXXX-XXXX" />
        </label>

        <label>
          Senha
          <input v-model="senha" type="password" placeholder="Senha (mín. 6 caracteres)" minlength="6" required />
        </label>

        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>

        <div style="display:flex; gap:8px; margin-top:8px">
          <button class="btn primary" :disabled="loading">{{ loading ? 'Criando...' : 'Cadastrar' }}</button>
          <router-link to="/login" class="btn">Já tenho conta</router-link>
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
        await register({ nome: nome.value, email: email.value, cpf: cpf.value, senha: senha.value, telefone: telefone.value })
        success.value = 'Conta criada com sucesso! Você já está logado.'
        setTimeout(() => router.push('/'), 900)
      } catch (e: any) {
        error.value = e.message || 'Erro ao criar conta'
      } finally {
        loading.value = false
      }
    }

    return { nome, email, telefone, cpf,  senha, loading, error, success, submit }
  }
})
</script>

<style scoped>
.register-page{ display:flex; justify-content:center; padding:28px }
.register-card{ width:420px; display:flex; flex-direction:column; gap:12px; padding:20px }
form label{ display:flex; flex-direction:column; gap:6px; font-weight:600 }
input{ padding:8px; border-radius:8px; border:1px solid #e5e7eb }
.error{ color:#ef4444 }
.success{ color:#10b981 }
</style>