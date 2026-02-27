<template>
  <div class="curso-container" v-if="curso">
    <div class="curso-header">
      <div class="header-content">
        <button @click="voltar" class="btn-back">← Voltar</button>
        <h1>{{ curso.titulo }}</h1>
        <p class="muted">{{ curso.descricao }}</p>
        <button @click="salvarCurso" class="btn-salvar">
          {{ salvo ? "★ Salvo nos favoritos" : "☆ Salvar curso" }}
        </button>
      </div>

      <div class="rating-wrapper">
        <div class="stars-interactive">
          <span
            v-for="i in 5"
            :key="i"
            class="star-btn"
            :class="{
              filled: i <= (hoverRating || curso.media_notas),
              hovering: i <= hoverRating,
            }"
            @mouseover="hoverRating = i"
            @mouseleave="hoverRating = 0"
            @click="votar(i)"
          >
            ★
          </span>
        </div>
        <span class="rating-info">
          <strong>{{ curso.media_notas }}</strong>
          <span class="muted">({{ curso.total_avaliacoes }} avaliações)</span>
        </span>
      </div>
    </div>

    <div v-if="erroPlano" class="erro-plano">
      <p>⚠️ {{ erroPlano }}</p>
      <button @click="abrirModalPlanos" class="btn primary">
        Escolher um Plano
      </button>
    </div>

    <section class="modulos-section">
      <div class="section-intro">
        <h2>Conteúdo do Curso</h2>
        <p class="muted">{{ curso.modulos?.length || 0 }} módulos no total</p>
      </div>

      <div
        v-for="(modulo, index) in curso.modulos"
        :key="modulo.id"
        class="modulo-card"
      >
        <div class="modulo-header" @click="toggleModulo(index)">
          <div class="modulo-info">
            <span class="modulo-icon">📚</span>
            <div>
              <h3>{{ modulo.titulo }}</h3>
              <span class="aula-count"
                >{{ modulo.aulas?.length || 0 }} aulas</span
              >
            </div>
          </div>
          <span class="toggle-icon" :class="{ open: expandedModulos[index] }"
            >▼</span
          >
        </div>

        <transition name="collapse">
          <div v-if="expandedModulos[index]" class="modulo-content">
           <div v-for="aula in modulo.aulas" :key="aula.id" class="aula-item" @click.stop.prevent="abrirAula(aula)">
              <div class="aula-icon">
                <span v-if="aula.foi_concluida">✅</span>
                <span v-else>▶</span>
              </div>
              <div class="aula-info">
                <p class="aula-title">{{ aula.titulo }}</p>
              </div>
              <div class="aula-stats">
                <span class="views-count"> 👁️ {{ aula.views || 0 }} </span>
                <div class="aula-badge" v-if="aula.tem_pdf">PDF</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>
   
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import { useUser } from "@/services/authService";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const user = useUser();
    const curso = ref<any>(null);
    const salvo = ref(false);
    const erroPlano = ref<string | null>(null);
    const expandedModulos = ref<Record<string, boolean>>({});
    const hoverRating = ref(0);
    const showPlanModal = ref(false);
    const planos = ref<any[]>([]);
onMounted(() => {
  console.log("DADOS DO USUÁRIO LOGADO:", user.value);
  carregarCurso();
});
async function carregarCurso() {
  erroPlano.value = null;

  try {
    const response = await api.get(`/cursos/${route.params.id}`);
    curso.value = response.data;
    if (curso.value?.modulos?.length > 0) expandedModulos.value["0"] = true;
    verificarSeEstaSalvo();
  } catch (e: any) {
    if (e.response?.status === 403) {
      erroPlano.value = e.response.data.message || "Seu plano não dá acesso a este curso.";
    } else {
      console.error("Erro ao carregar curso:", e);
    }
  }
}

    async function verificarSeEstaSalvo() {
      try {
        const res = await api.get(`/cursos/${curso.value.id}/salvo`);
        salvo.value = res.data.salvo;
      } catch (e) {}
    }

    async function votar(nota: number) {
      try {
        const response = await api.post(`/cursos/${curso.value.id}/avaliar`, {
          nota,
        });

        curso.value.media_notas = response.data.data.nova_media;
        curso.value.total_avaliacoes = response.data.data.total_votos;

        alert("Obrigado por avaliar!");
      } catch (e: any) {
        alert(e.response?.data?.message || "Erro ao avaliar curso");
      }
    }

    const planosDisponiveis = computed(() => {
      if (!user.value?.plano_id) return planos.value;
      return planos.value.filter((grupo) => {
        return (
          grupo.mensal?.id !== user.value.plano_id &&
          grupo.anual?.id !== user.value.plano_id
        );
      });
    });
    async function salvarCurso() {
      try {
        const response = await api.post(`/cursos/${curso.value.id}/salvar`);
        salvo.value = response.data.salvo;
      } catch (e) {}
    }

    const alternar = (p: any) => (p.mostrarAnual = !p.mostrarAnual);
    const planoAtual = (p: any) => (p.mostrarAnual ? p.anual : p.mensal);

    function selecionarPlano(plano: any) {
      sessionStorage.setItem("planoSelecionado", JSON.stringify(plano));
      router.push("/visualizacao");
    }
    function agruparPlanos(lista: any[]) {
      const agrupados: any = {};
      lista.forEach((plano) => {
        const nomeBase = plano.nome
          .replace(" Mensal", "")
          .replace(" Anual", "");
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
  async function abrirModalPlanos() {
  showPlanModal.value = true; 
  
  if (planos.value.length === 0) {
    try {
      const res = await api.get("/planos");
      agruparPlanos(res.data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      alert("Não foi possível carregar os planos agora.");
    }
  }
}
async function abrirAula(aula: any) {
  try {
    await api.get(`/aulas/${aula.id}`);
    router.push({ name: "aula", params: { id: aula.id } });
  } catch (e: any) {
    if (e.response?.status === 403) {
      erroPlano.value = e.response.data.message;
    }
  }
}

    const toggleModulo = (idx: any) =>
      (expandedModulos.value[idx] = !expandedModulos.value[idx]);
    const voltar = () => router.back();

    onMounted(carregarCurso);

   return {
  curso,
  salvo,
  erroPlano,
  salvarCurso,
  abrirAula,
  voltar,
  toggleModulo,
  expandedModulos,
  hoverRating,
  votar,
  showPlanModal,
  planos, 
  abrirModalPlanos,
  alternar,
  planoAtual,
  selecionarPlano,
  user
};
  },
});
</script>

<style scoped>
.curso-container {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 3rem;
}
.curso-header {
  background: var(--primary);
  color: white;
  padding: 3rem 1rem;
  border-radius: 8px 8px 0 0;
}
.header-content {
  max-width: 1100px;
  margin: 0 auto;
}

.rating-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 12px;
  width: fit-content;
}

.stars-interactive {
  display: flex;
  gap: 4px;
}

.star-btn {
  font-size: 1.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.3);
  transition:
    transform 0.2s,
    color 0.2s;
}
/* ESTILOS DO MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 900px;

  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.modal-header h2 {
  margin: 0;
  color: #333;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.plan-modal-card {
  border: 1px solid #eee;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: 0.3s;
}
.plan-modal-card:hover {
  border-color: var(--primary);
}
.price {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 1rem 0;
  color: var(--primary);
}

.btn-toggle-period {
  background: #f1f5f9;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.star-btn.filled {
  color: #fbbf24;
}

.star-btn:hover {
  transform: scale(1.2);
}

.rating-info {
  color: white;
  font-size: 0.9rem;
}

.rating-info strong {
  font-size: 1.1rem;
}

.header-content .muted {
  color: rgba(255, 255, 255, 0.7);
}
.btn-back {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.aula-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.views-count {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.aula-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-salvar {
  background: white;
  color: #3b82f6;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}
.modulos-section {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.modulo-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  overflow: hidden;
}
.modulo-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
h1 {
  color: white;
}
.aula-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: 0.2s;
}
.aula-item:hover {
  background: #f8fbff;
  transform: translateX(5px);
}
.aula-concluida {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.aula-title {
  font-weight: 600;
  font-size: 0.95rem;
}
.aula-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
}
.toggle-icon.open {
  transform: rotate(180deg);
}
.erro-plano {
  background: #fff5f5; /* Vermelho bem claro */
  border: 1px dashed #feb2b2;
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin: 1rem 0;
}

.erro-plano p {
  color: #c53030;
  font-weight: 600;
  margin: 0;
}

.btn-upgrade {
  animation: pulse-button 2s infinite;
}

@keyframes pulse-button {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
