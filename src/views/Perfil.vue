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
            <input type="password" placeholder="Digite sua senha atual" />
          </div>
           <div class="form-group">
              <input
  type="password"
  placeholder="Digite sua nova senha"
  v-model="newPassword"
/>
           </div>
              <button class="btn btn-primary" @click="changePassword">
                      💾 Atualizar Senha
              </button>
        </div>
        <div class="card planos-comprados-card planos-card-expanded">
<div class="card-header">
  <h2>Meus Planos 🎯</h2>

  <button
    class="btn btn-secondary"
    @click="mostrarHistoricoPlanos = !mostrarHistoricoPlanos"
  >
    {{ mostrarHistoricoPlanos ? '▲ Ocultar' : '▼ Ver histórico' }}
  </button>
</div>

<transition name="expand">
  <div
    v-if="mostrarHistoricoPlanos"
    class="planos-resumo-expanded"
  >
    <div
      v-for="h in historicoPlanos"
      :key="h.id"
      class="plano-card-item"
    >
      <div class="plano-header-expanded">
        <div class="plano-info">
          <span class="plano-tipo">{{ h.plano.nome }}</span>
        </div>
        <div class="plano-valor-grande">
          R$ {{ h.plano.preco }}
        </div>
      </div>

      <div class="plano-details">
        <div class="detail-row">
          <span class="detail-label">📅 Data</span>
          <span class="detail-value">
            {{ new Date(h.created_at).toLocaleDateString('pt-BR') }}
          </span>
        </div>

        <div class="detail-row">
          <span class="detail-label">⏰ Hora</span>
          <span class="detail-value">
            {{ new Date(h.created_at).toLocaleTimeString('pt-BR') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</transition>
</div>
</div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPerfil, updateUser, useUser, logout } from '@/services/authService'
import { onMounted, computed } from 'vue'

const mostrarHistoricoPlanos = ref(false)


const newPassword = ref('')
const router = useRouter()

const user = useUser()

const editMode = ref(false)
const showChangePassword = ref(false)

const editForm = ref({
  nome: '',
  email: '',
  telefone: ''
})

watch(
  user,
  (newUser) => {
    if (newUser) {
      editForm.value.nome = newUser.nome || ''
      editForm.value.email = newUser.email || ''
      editForm.value.telefone = newUser.telefone || ''
    }
  },
  { immediate: true }
)
async function changePassword() {
  if (!newPassword.value) {
    alert('Digite a nova senha')
    return
  }

  try {
    await updateUser({
      senha: newPassword.value
    })

    alert('Senha atualizada com sucesso 🔒')
    newPassword.value = ''
    showChangePassword.value = false
  } catch {
    alert('Erro ao atualizar senha')
  }
}

onMounted(async () => {
  try {
    await fetchPerfil()
  } catch (e) {
    console.error('Erro ao carregar perfil', e)
  }
})

const historicoPlanos = computed(() => {
  return user.value?.historico_planos || []
})


async function saveChanges() {
  try {
    await updateUser({
      nome: editForm.value.nome,
      email: editForm.value.email,
      telefone: editForm.value.telefone
    })

    editMode.value = false
  } catch {
    alert('Erro ao atualizar perfil')
  }
}
  
function cancelEdit() {
  if (!user.value) return

  editForm.value.nome = user.value.nome || ''
  editForm.value.email = user.value.email || ''
  editForm.value.telefone = user.value.telefone || ''

  editMode.value = false
}

function doLogout() {
  logout()
  router.push('/login')
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

/* Card de Planos Comprados */
.planos-comprados-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%);
  border: 2px solid #10b981;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.planos-comprados-card .card-header {
  border-bottom-color: #10b981;
}

.planos-resumo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plano-badge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 4px solid #0078d7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.plano-badge-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 120, 215, 0.1);
}

.plano-badge-content {
  display: flex;
  gap: 8px;
}

.plano-tipo {
  background: linear-gradient(135deg, #0078d7 0%, #005fa3 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.plano-duracao {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.plano-valor {
  font-weight: 700;
  color: #0078d7;
  font-size: 0.95rem;
}

.planos-vazio {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Card de Planos Expandido */
.planos-card-expanded {
  grid-column: 1 / -1;
}

.planos-card-expanded .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
}

.planos-total {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.planos-resumo-expanded {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plano-card-item {
  background: white;
  border-left: 6px solid #0078d7;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.plano-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 120, 215, 0.15);
}

.plano-header-expanded {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.plano-info {
  display: flex;
  gap: 8px;
}

.plano-valor-grande {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0078d7 0%, #005fa3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.plano-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

/* Estilos dos botões */
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