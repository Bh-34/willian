<template>
  <div class="perfil-container">
    <!-- Header Premium -->
    <div class="perfil-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="header-title">
          <h1>Meu Perfil</h1>
          <p class="subtitle">Gerencie sua conta e preferências</p>
        </div>
      </div>
    </div>

    <div class="branco">

    <div class="perfil-content">
      <!-- Seção Esquerda: Informações -->
      <aside class="perfil-sidebar">
        <!-- Card de Informações Pessoais -->
        <section class="perfil-section">
          <div class="section-header">
            <h2>Informações Pessoais</h2>
            <button 
              v-if="!editMode" 
              @click="editMode = true" 
              class="btn-icon"
              title="Editar informações"
            >
              ✏️
            </button>
          </div>

          <div v-if="!editMode" class="info-display">
            <div class="info-item">
              <span class="info-label">Nome</span>
              <span class="info-value">{{ user?.nome || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value info-email">{{ user?.email || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPF</span>
              <span class="info-value">{{ user?.cpf || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Telefone</span>
              <span class="info-value">{{ user?.telefone || '—' }}</span>
            </div>
          </div>

          <div v-else class="info-edit">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input v-model="editForm.nome" id="nome" type="text" placeholder="Seu nome" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="editForm.email" id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div class="form-group">
              <label for="phone">Telefone</label>
              <input v-model="editForm.telefone" id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" />
            </div>
            <div class="edit-actions">
              <button @click="saveChanges" class="btn primary">💾 Salvar</button>
              <button @click="cancelEdit" class="btn secondary">Cancelar</button>
            </div>
          </div>
        </section>

        <!-- Status Badge -->
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>Conta ativa</span>
        </div>
      </aside>

      <!-- Seção Direita: Segurança e Planos -->
      <main class="perfil-main">
        <!-- Card Segurança -->
        <section class="perfil-section">
          <div class="section-header">
            <h2>Segurança</h2>
          </div>

          <div class="security-grid">
            <button 
              class="security-btn"
              @click="showChangePassword = !showChangePassword"
            >
              <div class="btn-content">
                <span class="btn-title">Alterar Senha</span>
                <span class="btn-desc">Atualize sua senha</span>
              </div>
            </button>
          </div>

          <transition name="expand">
            <div v-if="showChangePassword" class="password-form">
              <div class="form-group">
                <label for="newpass">Nova Senha</label>
                <input
                  id="newpass"
                  v-model="newPassword"
                  type="password"
                  placeholder="Mín. 6 caracteres"
                  minlength="6"
                />
              </div>
              <div class="form-actions">
                <button class="btn primary" @click="changePassword">Atualizar Senha</button>
                <button type="button" class="btn secondary" @click="showChangePassword = false">Cancelar</button>
              </div>
            </div>
          </transition>
        </section>

        <!-- Card Planos -->
        <section v-if="historicoPlanos.length > 0" class="perfil-section planos-section">
          <div class="section-header">
            <h2>💎 Histórico de Planos</h2>
            <button 
              class="btn-expand"
              @click="mostrarHistoricoPlanos = !mostrarHistoricoPlanos"
            >
              {{ mostrarHistoricoPlanos ? '▲' : '▼' }}
            </button>
          </div>

          <transition name="expand">
            <div v-if="mostrarHistoricoPlanos" class="planos-list">
              <div
                v-for="h in historicoPlanos"
                :key="h.id"
                class="plano-card"
              >
                <div class="plano-header">
                  <div class="plano-info">
                    <span class="plano-badge">{{ h.plano.nome }}</span>
                    <span class="plano-date">{{ formatDate(h.created_at) }}</span>
                  </div>
                  <span class="plano-price">R$ {{ formatPrice(h.plano.preco) }}</span>
                </div>
              </div>
            </div>
          </transition>
        </section>

        <!-- Card Sair -->
        <section class="perfil-section logout-section">
          <button class="btn danger btn-full" @click="doLogout">
            Sair da Conta
          </button>
        </section>
      </main>
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatPrice(price: number) {
  return price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function changePassword() {
  if (!newPassword.value) {
    alert('Digite a nova senha')
    return
  }

  try {
    await updateUser({
      senha: newPassword.value
    })

    alert('Senha atualizada com sucesso')
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  min-height: calc(100vh - 60px);
   background: #eef2f7;
     padding-bottom: 3rem;
}

/* Header */
.perfil-header {
  position: relative;
  overflow: hidden;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: var(--shadow-lg);
   border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
 background: var(--primary);
  z-index: 0;
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  width: 100%;
}

.branco {
  background: #f8fafc; 
  padding: 3rem 2rem;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-top: -20px; 
}

.header-title h1 {
  color: white;
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.header-title .subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1.05rem;
}

/* Layout Principal */
.perfil-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  width: 100%;
  display: grid;
 grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: var(--spacing-2xl);
}

.perfil-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  
}

.perfil-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.perfil-section {
  background: white;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.perfil-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  border-color: var(--primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border);
}

.section-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #3D3D3D;
  font-weight: 800;
}

.btn-icon {
  background: #F5F1EB;
  border: 2px solid var(--border);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition);
}

.btn-icon:hover {
  background: #85685A;
  border-color: #85685A;
  transform: scale(1.1);
}

.btn-expand {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: #bcbcbc;
  transition: var(--transition);
  padding: 0;
}

.btn-expand:hover {
  transform: scale(1.2);
}

/* Informações */
.info-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: #f8fafc;
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary);
}

.info-label {
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #0F172A;
}

.info-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: #828282;
}

.info-email {
  word-break: break-all;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: linear-gradient(135deg, #E0DEAB 0%, #ECF8D4 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  font-weight: 600;
  color: var(--accent);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6B9E7F;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Formulários */
.info-edit {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  font-weight: 600;
  color: #0F172A;
  font-size: 0.95rem;
}

.form-group input {
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.3s ease;
}


.form-group input:focus {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
}

.edit-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.edit-actions .btn {
  flex: 1;
}

/* Segurança */
.security-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.security-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.security-btn:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}
.security-btn .icon {
  font-size: 1.6rem;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.btn-title {
  font-weight: 700;
  color: #0F172A;
}

.btn-desc {
  font-size: 0.85rem;
  color: #6B6B6B;
}

.password-form {
  border-top: 2px solid var(--border);
  padding-top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
}

.form-actions .btn {
  flex: 1;
}

.logout-section {
  grid-column: 1 / -1;
}

.planos-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.plano-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.plano-card:hover {
  transform: translateX(4px);
  border-color: var(--primary);
}


.plano-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.plano-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.plano-badge {
  background: linear-gradient(135deg, #2E5C8A, #1E3A52);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
  width: fit-content;
}

.plano-date {
  font-size: 0.85rem;
  color: #6B7280;
}

.plano-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2E5C8A;
}

/* Logout */
.logout-section {
  grid-column: 1 / -1;
  text-align: center;
  border: 2px solid #FEE2E2;
  background: #FEF2F2;
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.perfil-sidebar,
.perfil-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}


.btn-full {
  width: 100%;
  justify-content: center;
}

/* Status Badge */
.status-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #F0F7FF 0%, #E0F2FE 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.status-dot {
  width: 12px;
  height: 12px;
  background: #10B981;
  border-radius: 50%;
  display: block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Transições */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsivo */
@media (max-width: 1024px) {
  .perfil-content {
    grid-template-columns: 1fr;
  }

  .perfil-sidebar {
    order: 2;
  }

  .perfil-main {
    order: 1;
  }
}

@media (max-width: 768px) {
  .header-title h1 {
    font-size: 1.75rem;
  }

  .perfil-section {
    padding: var(--spacing-lg);
  }

  .info-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .edit-actions,
  .form-actions {
    flex-direction: column;
  }

  .edit-actions .btn,
  .form-actions .btn {
    width: 100%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>