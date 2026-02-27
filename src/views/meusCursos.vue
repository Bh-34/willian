<template>
  <div class="dashboard">
    <section class="header-section">
      <div class="header-content">
        <div>
          <h1>Meus Cursos</h1>
          <p class="muted">Acompanhe seu progresso e continue aprendendo</p>
        </div>
      </div>
    </section>

    <div class="branco">
      <section class="section search-section">
        <div class="search-container">
          <input
            v-model="search"
            type="text"
            placeholder="Buscar nos meus cursos..."
            class="search-input"
          />
        </div>
      </section>

      <section class="section">
        <div v-if="cursosFiltrados.length > 0" class="courses-grid">
          <div
            v-for="curso in cursosFiltrados"
            :key="curso.id"
            class="course-card"
          >
            <div @click="abrirCurso(curso)">
              <h3>{{ curso.titulo }}</h3>
              <p class="course-desc">{{ curso.descricao }}</p>

              <div class="progress-container">
                <div class="progress-info">
                  <span class="progress-label">Seu progresso</span>
                  <span class="progress-value"
                    >{{ curso.progresso || 0 }}%</span
                  >
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: (curso.progresso || 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <button class="remover-btn" @click="removerCurso(curso.id)">
              Remover dos favoritos
            </button>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Nenhum curso encontrado.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

export default defineComponent({
  setup() {
    const router = useRouter();
    const cursos = ref<any[]>([]);
    const search = ref("");

    const cursosFiltrados = computed(() =>
      cursos.value.filter((c) =>
        c.titulo.toLowerCase().includes(search.value.toLowerCase()),
      ),
    );

    async function carregarCursos() {
      try {
        const res = await api.get("/meus-cursos-salvos");
        cursos.value = res.data;
      } catch (e) {}
    }

    async function removerCurso(id: number) {
      if (confirm("Deseja remover este curso dos seus favoritos?")) {
        try {
          await api.post(`/cursos/${id}/salvar`);
          cursos.value = cursos.value.filter((c) => c.id !== id);
        } catch (e) {}
      }
    }

    const abrirCurso = (curso: any) => router.push(`/cursos/${curso.id}`);
    onMounted(carregarCursos);

    return { cursosFiltrados, search, abrirCurso, removerCurso };
  },
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 2rem auto;
  width: 100%;
}

.header-section {
  background: var(--primary);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-lg);
  padding-bottom: 4rem;
}

.header-content h1 {
  color: white;
  font-size: 2rem;
  font-weight: 800;
}

.header-section .muted {
  color: rgba(255,255,255,0.85);
}

.remover-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 10px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.remover-btn:hover {
  background: #dc2626;
}

.branco {
  background: #f8fafc;
  padding: 3rem 2rem;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-top: -20px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.course-card {
  background: white;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  border-bottom: 2px solid #0F172A;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.course-card h3 {
  font-weight: 800;
  color: var(--text-primary);
}

.progress-container {
  margin-top: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin-top: 6px;
  display: inline-block;
}

.search-container {
  margin-top: 2rem;
  position: relative;
  max-width: 500px;
}

.search-section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.search-input {
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 14px 20px 14px 48px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
  outline: none;
}
.search-icon
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--neutral-50);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
}

</style>
