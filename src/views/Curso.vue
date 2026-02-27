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
        'filled': i <= (hoverRating || curso.media_notas),
        'hovering': i <= hoverRating 
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
      <p>{{ erroPlano }}</p>
      <button @click="$router.push('/planos')" class="btn-upgrade">
        Ver planos
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
            <div
              v-for="aula in modulo.aulas"
              :key="aula.id"
              class="aula-item"
              :class="{ 'aula-concluida': aula.foi_concluida }"
              @click="abrirAula(aula)"
            >
              <div class="aula-icon">
                <span v-if="aula.foi_concluida">✅</span>
                <span v-else>▶</span>
              </div>
              <div class="aula-info">
                <p class="aula-title">{{ aula.titulo }}</p>
              </div>
              <div class="aula-stats">
    <span class="views-count">
      👁️ {{ aula.views || 0 }}
    </span>
    <div class="aula-badge" v-if="aula.tem_pdf">PDF</div>
  </div>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
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

    async function carregarCurso() {
      if (!user.value?.plano) {
        router.push("/");
        return;
      }
      try {
        const response = await api.get(`/cursos/${route.params.id}`);
        curso.value = response.data;
        if (curso.value?.modulos?.length > 0) expandedModulos.value["0"] = true;
        verificarSeEstaSalvo();
      } catch (e) {
        console.warn(e);
        console.error("ERRO DETALHADO DO BACKEND:", (e as any)?.response?.data);
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
      const response = await api.post(`/cursos/${curso.value.id}/avaliar`, { nota });
      
      curso.value.media_notas = response.data.data.nova_media;
      curso.value.total_avaliacoes = response.data.data.total_votos;
      
      alert("Obrigado por avaliar!");
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro ao avaliar curso");
    }
  }

    async function salvarCurso() {
      try {
        const response = await api.post(`/cursos/${curso.value.id}/salvar`);
        salvo.value = response.data.salvo;
      } catch (e) {}
    }

    async function abrirAula(aula: any) {
      router.push({ name: "aula", params: { id: aula.id } });
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
    votar
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
  color: rgba(255, 255, 255, 0.3); /* Estrela vazia */
  transition: transform 0.2s, color 0.2s;
}

.star-btn.filled {
  color: #fbbf24; /* Amarelo ouro */
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
h1{
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
</style>
