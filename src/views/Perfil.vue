<template>
  <div class="perfil-container">
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
        <aside class="perfil-sidebar">
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
                <span class="info-value">{{ user?.nome || "—" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value info-email">{{
                  user?.email || "—"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">CPF</span>
                <span class="info-value">{{ user?.cpf || "—" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Telefone</span>
                <span class="info-value">{{ user?.telefone || "—" }}</span>
              </div>
            </div>

            <div v-else class="info-edit">
              <div class="form-group">
                <label for="nome">Nome Completo</label>
                <input
                  v-model="editForm.nome"
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  v-model="editForm.email"
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                />
              </div>
              <div class="form-group">
                <label for="phone">Telefone</label>
                <input
                  v-model="editForm.telefone"
                  id="phone"
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
              <div class="edit-actions">
                <button @click="saveChanges" class="btn primary">
                  💾 Salvar
                </button>
                <button @click="cancelEdit" class="btn secondary">
                  Cancelar
                </button>
              </div>
            </div>
          </section>

          <div class="status-badge">
            <span class="status-dot"></span>
            <span>Conta ativa</span>
          </div>
        </aside>

        <main class="perfil-main">
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
                  <button class="btn primary" @click="changePassword">
                    Atualizar Senha
                  </button>
                  <button
                    type="button"
                    class="btn secondary"
                    @click="showChangePassword = false"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </transition>
          </section>

          <section class="perfil-section planos-section">
            <div class="section-header">
              <h2>💎 Seus Planos</h2>
              <div class="plan-actions">
                <button class="btn primary btn-sm" @click="abrirModalPlanos">
                  Trocar Plano
                </button>
                <button
                  v-if="historicoPlanos.length > 0"
                  class="btn-expand"
                  @click="mostrarHistoricoPlanos = !mostrarHistoricoPlanos"
                  title="Ver histórico"
                >
                  {{ mostrarHistoricoPlanos ? "▲" : "▼" }}
                </button>
              </div>
            </div>

            <transition name="expand">
              <div
                v-if="mostrarHistoricoPlanos && historicoPlanos.length > 0"
                class="planos-list"
              >
                <div
  v-for="h in historicoPlanos"
  :key="h.id"
  class="plano-card"
  :class="{ 'plano-ativo-card': h.plano_id === user?.plano_id }"
>
  <div class="plano-header">
    <div class="plano-info">
      <div class="plano-badge-wrapper">
        <span class="plano-badge">{{ h.plano.nome }}</span>
        <span v-if="h.plano_id === user?.plano_id" class="badge-active-status">Ativo</span>
      </div>
      <span class="plano-date">{{ formatDate(h.created_at) }}</span>
    </div>
    <span class="plano-price">R$ {{ formatPrice(h.plano.preco) }}</span>
  </div>
</div>
              </div>
              <div v-else-if="mostrarHistoricoPlanos">
                <p class="muted-text">Nenhum histórico encontrado.</p>
              </div>
            </transition>
          </section>

          <section class="perfil-section logout-section">
            <button class="btn danger btn-full" @click="doLogout">
              Sair da Conta
            </button>
          </section>
        </main>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showPlanModal"
        class="modal-overlay"
        @click.self="showPlanModal = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2>Nossos Planos</h2>
            <button class="modal-close" @click="showPlanModal = false">
              ✕
            </button>
          </div>
          <p class="muted-text">Escolha o melhor para você</p>

          <div class="plans-grid">
            <div
              v-for="plano in planos"
              :key="plano.nome"
              class="plan-modal-card"
            >
              <h3>{{ plano.nome }}</h3>

              <div class="price">
                R$
                {{
                  planoAtual(plano)?.preco?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })
                }}
              </div>

              <p class="period">
                {{
                  plano.mostrarAnual
                    ? "Plano Anual (365 dias)"
                    : "Plano Mensal (30 dias)"
                }}
              </p>

              <ul class="benefits">
                <li
                  v-for="b in planoAtual(plano)?.beneficios"
                  :key="b.chave"
                  class="benefit-item"
                >
                  <span class="check">✓</span>
                  {{ b.texto }}
                </li>
              </ul>

              <button class="btn-toggle-period" @click="alternar(plano)">
                {{ plano.mostrarAnual ? "Ver Mensal" : "Ver Anual (20% OFF)" }}
              </button>

             <button 
  class="btn btn-full"
  :class="planoAtual(plano)?.id === user?.plano_id ? 'secondary' : 'primary'"
  :disabled="planoAtual(plano)?.id === user?.plano_id"
  @click="selecionarPlano(planoAtual(plano))"
>
  {{ planoAtual(plano)?.id === user?.plano_id ? 'Seu Plano Atual' : 'Assinar Plano' }}
</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  fetchPerfil,
  updateUser,
  useUser,
  logout,
} from "@/services/authService";
import api from "@/services/api";

const router = useRouter();
const user = useUser();

const mostrarHistoricoPlanos = ref(false);
const newPassword = ref("");
const editMode = ref(false);
const showChangePassword = ref(false);
const editForm = ref({
  nome: "",
  email: "",
  telefone: "",
});

const showPlanModal = ref(false);
const planos = ref<any[]>([]);

const planosDisponiveis = computed(() => {

  if (!user.value?.plano_id) return planos.value;

  return planos.value.filter(grupo => {
    const idMensal = grupo.mensal?.id;
    const idAnual = grupo.anual?.id;
    
    return idMensal !== user.value.plano_id && idAnual !== user.value.plano_id;
  });
});

watch(
  user,
  (newUser) => {
    if (newUser) {
      editForm.value.nome = newUser.nome || "";
      editForm.value.email = newUser.email || "";
      editForm.value.telefone = newUser.telefone || "";
    }
  },
  { immediate: true },
);

const historicoPlanos = computed(() => {
  return user.value?.historico_planos || [];
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return price?.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function changePassword() {
  if (!newPassword.value) {
    alert("Digite a nova senha");
    return;
  }
  try {
    await updateUser({ senha: newPassword.value });
    alert("Senha atualizada com sucesso");
    newPassword.value = "";
    showChangePassword.value = false;
  } catch {
    alert("Erro ao atualizar senha");
  }
}

async function saveChanges() {
  try {
    await updateUser({
      nome: editForm.value.nome,
      email: editForm.value.email,
      telefone: editForm.value.telefone,
    });
    editMode.value = false;
  } catch {
    alert("Erro ao atualizar perfil");
  }
}

function cancelEdit() {
  if (!user.value) return;
  editForm.value.nome = user.value.nome || "";
  editForm.value.email = user.value.email || "";
  editForm.value.telefone = user.value.telefone || "";
  editMode.value = false;
}

function doLogout() {
  logout();
  router.push("/login");
}

async function abrirModalPlanos() {
  showPlanModal.value = true;

  if (planos.value.length === 0) {
    await carregarPlanos();
  }
}

async function carregarPlanos() {
  try {
    const res = await api.get("/planos");
    agruparPlanos(res.data);
  } catch (e) {
    console.warn("Erro ao carregar planos", e);
  }
}

function agruparPlanos(lista: any[]) {
  const agrupados: any = {};
  lista.forEach((plano) => {
    const nomeBase = plano.nome.replace(" Mensal", "").replace(" Anual", "");
    if (!agrupados[nomeBase]) {
      agrupados[nomeBase] = {
        nome: nomeBase,
        mensal: null,
        anual: null,
        mostrarAnual: false,
      };
    }
    if (plano.duracao === "mensal") agrupados[nomeBase].mensal = plano;
    if (plano.duracao === "anual") agrupados[nomeBase].anual = plano;
  });
  planos.value = Object.values(agrupados);
}

function alternar(plano: any) {
  plano.mostrarAnual = !plano.mostrarAnual;
}

function planoAtual(plano: any) {
  return plano.mostrarAnual ? plano.anual : plano.mensal;
}

function selecionarPlano(plano: any) {
  showPlanModal.value = false;
  sessionStorage.setItem("planoSelecionado", JSON.stringify(plano));
  router.push("/visualizacao"); 
}

onMounted(async () => {
  try {
    await fetchPerfil();
  } catch (e) {
    console.error("Erro ao carregar perfil", e);
  }
});
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

.perfil-header {
  position: relative;
  overflow: hidden;
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

.plano-badge-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plano-ativo-card {
  border: 2px solid #10B981 !important;
  background: #F0FDF4 !important; 
  transform: scale(1.02); 
}

.badge-active-status {
  background: #10B981;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
}

.plano-card {
  transition: all 0.3s ease;
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

.branco {
  background: #f8fafc;
  padding: 3rem 2rem;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-top: -20px;
}

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

.perfil-sidebar,
.perfil-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.perfil-section {
  background: white;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.perfil-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
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
  color: #3d3d3d;
  font-weight: 800;
}

.btn-icon {
  background: #f5f1eb;
  border: 2px solid var(--border);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition);
}

.btn-icon:hover {
  background: #85685a;
  border-color: #85685a;
  transform: scale(1.1);
}

.plan-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
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
  color: #0f172a;
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
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}
.status-dot {
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  display: block;
  animation: pulse 2s infinite;
}

/* Formulários e Inputs */
.info-edit,
.password-form {
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
  color: #0f172a;
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
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
.edit-actions,
.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}
.edit-actions .btn,
.form-actions .btn {
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
  cursor: pointer;
  text-align: left;
}
.security-btn:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}
.btn-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.btn-title {
  font-weight: 700;
  color: #0f172a;
}
.btn-desc {
  font-size: 0.85rem;
  color: #6b6b6b;
}

/* Historico de Planos */
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
  background: linear-gradient(135deg, #2e5c8a, #1e3a52);
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
  color: #6b7280;
}
.plano-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2e5c8a;
}

.logout-section {
  text-align: center;
  border: 2px solid #fee2e2;
  background: #fef2f2;
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}
.btn-full {
  width: 100%;
  justify-content: center;
}
.muted-text {
  color: #6b7280;
  font-size: 0.95rem;
}

/* --- NOVOS ESTILOS MODAL E PLANOS --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}
.modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: 0.3s;
}
.modal-close:hover {
  color: #e11d48;
  transform: scale(1.1);
}

/* Baseado no Dashboard */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.plan-modal-card {
  background: var(--card, white);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: var(--transition, all 0.3s ease);
  box-shadow: var(--shadow-sm, 0 4px 6px rgba(0, 0, 0, 0.05));
}

.plan-modal-card:hover {
  border-color: var(--primary);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.plan-modal-card h3 {
  margin: 0;
  font-size: 1.3rem;
}
.price {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
}
.period {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}
.benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  flex-grow: 1;
}
.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  margin-bottom: 8px;
  color: #334155;
}
.check {
  color: var(--primary);
  font-weight: 700;
}

.btn-toggle-period {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 8px;
  border-radius: var(--radius-md);
  width: 100%;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-toggle-period:hover {
  background: var(--primary);
  color: white;
}

/* Animações */
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  .modal-content {
    padding: 1.5rem;
  }
}
</style>
