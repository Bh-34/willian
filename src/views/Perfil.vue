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
          <button class="btn btn-danger">🚪 Fazer Logout</button>
        </div>
        <div v-if="showChangePassword" class="password-form">
          <div class="form-group">
            <label>Senha Atual</label>
            <input type="password" placeholder="Digite sua senha atual" />
          </div>
          <div class="form-group">
            <label>Nova Senha</label>
            <input type="password" placeholder="Digite sua nova senha" />
          </div>
          <div class="form-group">
            <label>Confirmar Nova Senha</label>
            <input type="password" placeholder="Confirme sua nova senha" />
          </div>
          <button class="btn btn-primary">💾 Atualizar Senha</button>
        </div>
      </div>

      <!-- Card de Planos Comprados no Final -->
      <div class="card planos-comprados-card planos-card-expanded">
        <div class="card-header">
          <h2>Meus Planos 🎯</h2>
          <span class="planos-total">{{ planosMaisRecentes.length }} plano(s)</span>
        </div>
        <div v-if="planosMaisRecentes.length > 0" class="planos-resumo-expanded">
          <div v-for="(plano, idx) in planosMaisRecentes" :key="idx" class="plano-card-item">
            <div class="plano-header-expanded">
              <div class="plano-info">
                <span class="plano-tipo">{{ plano.plano }}</span>
                <span class="plano-duracao">{{ plano.tipo }}</span>
              </div>
              <div class="plano-valor-grande">{{ plano.valor }}</div>
            </div>
            <div class="plano-details">
              <div class="detail-row">
                <span class="detail-label">📅 Data de Compra</span>
                <span class="detail-value">{{ formatData(plano.data) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">⏰ Hora</span>
                <span class="detail-value">{{ formatHora(plano.data) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">✅ Status</span>
                <span class="detail-value status-ativo">Ativo</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="planos-vazio">
          <p>Nenhum plano assinado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface User {
  nome: string;
  email: string;
  telefone: string;
}

const user = ref<User | null>(null);
const editMode = ref(false);
const showChangePassword = ref(false);
const minhasCompras = ref<any[]>([]);
const editForm = ref<Partial<User>>({
  nome: '',
  email: '',
  telefone: ''
});

const planosMaisRecentes = computed(() => {
  return minhasCompras.value.slice(0, 3);
});

onMounted(() => {
  // Carregar dados do usuário da API ou localStorage
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
    editForm.value = { ...user.value };
  }

  // Carregar histórico de compras
  const compras = localStorage.getItem('minhasCompras');
  if (compras) {
    minhasCompras.value = JSON.parse(compras);
  }
});

const saveChanges = async () => {
  if (user.value && editForm.value.nome && editForm.value.email && editForm.value.telefone) {
    user.value = editForm.value as User;
    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify(user.value));
    editMode.value = false;
  }
};

const cancelEdit = () => {
  if (user.value) {
    editForm.value = { ...user.value };
  }
  editMode.value = false;
};

const formatData = (data: any) => {
  if (!data) return 'Não informada';
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const formatHora = (data: any) => {
  if (!data) return 'Não informada';
  const date = new Date(data);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
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

/* Card de Planos Comprados */
.planos-comprados-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%);
  border: 2px solid #10b981;
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

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-value {
  color: #111827;
  font-weight: 500;
  font-size: 0.95rem;
}

.status-ativo {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white !important;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
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