<template>
  <div class="perfil-container">
    <div class="perfil-header">
      <h1>Meu Perfil</h1>
      <p class="subtitle">Gerencie suas informações pessoais</p>
    </div>

    <div class="perfil-content">
     
      <div class="card perfil-card">
        <div class="card-header">
          <h2>Informações Pessoais</h2>
          <button v-if="!editMode" @click="editMode = true" class="btn btn-secondary">
            ✏️ Editar
          </button>
        </div>

        <div v-if="!editMode" class="info-display">
          <div class="info-item">
            <label>Nome</label>
            <p>{{ user?.nome || 'Não informado' }}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>{{ user?.email || 'Não informado' }}</p>
          </div>
          <div class="info-item">
            <label>Telefone</label>
            <p>{{ user?.telefone || 'Não informado' }}</p>
          </div>
        </div>

        <div v-else class="info-edit">
          <div class="form-group">
            <label>Nome</label>
            <input v-model="editForm.nome" type="text" placeholder="Digite seu nome" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editForm.email" type="email" placeholder="Digite seu email" />
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input v-model="editForm.telefone" type="tel" placeholder="Digite seu telefone" />
          </div>
          <div class="edit-actions">
            <button @click="saveChanges" class="btn btn-primary">💾 Salvar</button>
            <button @click="cancelEdit" class="btn btn-secondary">❌ Cancelar</button>
          </div>
        </div>
      </div>

      
      <div class="card perfil-card">
        <div class="card-header">
          <h2>Segurança</h2>
        </div>
        <div class="security-options">
          <button class="btn btn-secondary" @click="showChangePassword = !showChangePassword">
            🔒 Alterar Senha
          </button>
          <button class="btn btn-danger" @click="doLogout">🚪 Fazer Logout</button>
        </div>
        <div v-if="showChangePassword" class="password-form">
          <div class="form-group">
            <label>Senha Atual</label>
            <input v-model="currentPassword" type="password" placeholder="Digite sua senha atual" />
          </div>
          <div class="form-group">
            <label>Nova Senha</label>
            <input v-model="newPassword" type="password" placeholder="Digite sua nova senha" />
            <small v-if="newPassword && newPassword.length < 8" style="color:#b91c1c">A senha precisa ter ao menos 8 caracteres.</small>
          </div>
          <div class="form-group">
            <label>Confirmar Nova Senha</label>
            <input v-model="confirmPassword" type="password" placeholder="Confirme sua nova senha" />
          </div>

          <p v-if="passwordError" style="color:#b91c1c">{{ passwordError }}</p>
          <p v-if="passwordSuccess" style="color:#059669">{{ passwordSuccess }}</p>

          <button class="btn btn-primary" :disabled="isUpdating || !canSubmit" @click="updatePassword">💾 Atualizar Senha</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { user as authUser, logout, changePassword } from '@/services/authService'

const editMode = ref(false)
const showChangePassword = ref(false)

const user = authUser

const editForm = reactive({
  nome: authUser.value?.nome || '',
  email: authUser.value?.email || '',
  telefone: authUser.value?.telefone || ''
})

// password form state
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isUpdating = ref(false)

const canSubmit = computed(() => {
  return newPassword.value.length >= 8 && newPassword.value === confirmPassword.value && currentPassword.value.length > 0
})

const router = useRouter()

function doLogout() {
  logout()
  router.push('/login')
}

function saveChanges() {
  if (authUser.value) {
    authUser.value.nome = editForm.nome
    authUser.value.email = editForm.email
    authUser.value.telefone = editForm.telefone
    localStorage.setItem('auth_user', JSON.stringify(authUser.value))
    editMode.value = false
  }
}

function cancelEdit() {
  editForm.nome = authUser.value?.nome || ''
  editForm.email = authUser.value?.email || ''
  editForm.telefone = authUser.value?.telefone || ''
  editMode.value = false
}

async function updatePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  if (newPassword.value.length < 8) {
    passwordError.value = 'A nova senha precisa ter pelo menos 8 caracteres.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'A confirmação da senha não confere.'
    return
  }

  isUpdating.value = true
  try {
    await changePassword(currentPassword.value, newPassword.value)
    passwordSuccess.value = 'Senha alterada com sucesso.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showChangePassword.value = false
  } catch (err: any) {
    passwordError.value = err?.message || 'Erro ao alterar senha.'
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.perfil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.perfil-header {
  margin-bottom: 32px;
}

.perfil-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111827;
}

.subtitle {
  color: var(--muted);
  font-size: 16px;
  margin: 0;
}

.perfil-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.perfil-card {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.info-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-weight: 600;
  color: var(--muted);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 16px;
  color: #111827;
  margin: 0;
}

.info-edit {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.edit-actions button {
  flex: 1;
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.security-options button {
  width: 100%;
  justify-content: center;
}

.password-form {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-form button {
  width: 100%;
}


.btn {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn.btn-primary {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
}

.btn.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn.btn-secondary:hover {
  background: #d1d5db;
}

.btn.btn-danger {
  background: #ef4444;
  color: white;
}

.btn.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .perfil-container {
    padding: 16px;
  }

  .perfil-header h1 {
    font-size: 24px;
  }

  .perfil-content {
    grid-template-columns: 1fr;
  }

  .edit-actions {
    flex-direction: column;
  }

  .edit-actions button {
    width: 100%;
  }
}
</style>