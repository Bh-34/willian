<template>
  <div class="curso-container" v-if="curso">
    <!-- Header -->
    <div class="curso-header">
      <div class="header-content">
        <button @click="voltar" class="btn-back">← Voltar</button>
        <h1>{{ curso.titulo }}</h1>
        <p class="muted">{{ curso.descricao }}</p>
        <button @click="salvarCurso" class="btn salvar">
  {{ salvo ? '★ Salvo' : '☆ Salvar curso' }}
</button>
      </div>
    </div>

<div
  v-if="erroPlano"
  class="erro-plano"
>
  <p>{{ erroPlano }}</p>
  <button @click="$router.push('/planos')" class="btn-upgrade">
    Ver planos
  </button>
</div>

    <section class="modulos-section">
      <div class="section-intro">
        <h2>Conteúdo do Curso</h2>
        <p class="muted">{{ curso.modulos?.length || 0 }} módulo{{ curso.modulos?.length !== 1 ? 's' : '' }}</p>
      </div>

      <div
        v-for="(modulo, index) in curso.modulos"
        :key="modulo.id"
        class="modulo-card"
      >
        <div class="modulo-header" @click="toggleModulo(index)">
          <div class="modulo-info">
            <span class="modulo-icon">+</span>
            <div>
              <h3>{{ modulo.titulo }}</h3>
              <span class="aula-count">{{ modulo.aulas?.length || 0 }} aula{{ modulo.aulas?.length !== 1 ? 's' : '' }}</span>
            </div>
          </div>
          <span class="toggle-icon" :class="{ open: expandedModulos[index] }">▼</span>
        </div>

        <transition name="collapse">
          <div v-if="expandedModulos[index]" class="modulo-content">
            <div
              v-for="aula in modulo.aulas"
              :key="aula.id"
              class="aula-item"
              @click="abrirAula(aula)"
            >
              <div class="aula-icon">▶</div>
              <div class="aula-info">
                <p class="aula-title">{{ aula.titulo }}</p>
              </div>
              <div class="aula-badge" v-if="aula.tem_pdf">
                PDF
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useUser } from '@/services/authService'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const user = useUser()

    const curso = ref<any>(null)
    const salvo = ref(false)
    const erroPlano = ref<string | null>(null)
    const expandedModulos = ref<Record<string, boolean>>({})

    async function carregarCurso() {
      if (!user.value?.plano) {
        router.push('/')
        return
      }

      try {
        const response = await api.get(`/cursos/${route.params.id}`)
        curso.value = response.data

        if (curso.value?.modulos?.length > 0) {
          expandedModulos.value['0'] = true
        }

        await verificarSeEstaSalvo()

      } catch (e) {
        console.warn('Erro ao carregar curso', e)
      }
    }

    async function verificarSeEstaSalvo() {
      if (!curso.value) return

      try {
        const res = await api.get(`/cursos/${curso.value.id}/salvo`)
        salvo.value = res.data.salvo
      } catch (e) {
        console.warn('Erro ao verificar se está salvo', e)
      }
    }

    async function salvarCurso() {
      if (!curso.value) return

      try {
        const response = await api.post(`/cursos/${curso.value.id}/salvar`)
        salvo.value = response.data.salvo
      } catch (e) {
        console.warn('Erro ao salvar curso', e)
      }
    }

    async function abrirAula(aula: any) {
  erroPlano.value = null;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      erroPlano.value = 'Usuário não autenticado';
      return;
    }

    // Requisição com token explícito
    await api.get(`/aulas/${aula.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    router.push({ name: 'aula', params: { id: aula.id } });

  } catch (error: any) {
    if (error.response?.status === 403) {
      erroPlano.value = error.response.data.message;
    } else {
      erroPlano.value = 'Erro ao carregar aula';
    }
  }
}

    function toggleModulo(idx: string | number) {
      const key = String(idx)
      expandedModulos.value[key] = !expandedModulos.value[key]
    }

    function voltar() {
      router.back()
    }

    onMounted(carregarCurso)

    return {
      curso,
      salvo,
      erroPlano,
      salvarCurso,
      abrirAula,
      voltar,
      toggleModulo,
      expandedModulos
    }
  }
})
</script>



<style scoped>
.curso-container {
  background: #eef2f7;
  min-height: 100vh;
  padding: 0 2rem 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.curso-header {
  background: var(--primary);
  color: white;
  padding: 4rem 0;
  border-radius: 6px;
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

.btn-back {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}
.erro-plano {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  margin: 0 auto;
  max-width: 1100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.btn-upgrade {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn-upgrade:hover {
  background: #1d4ed8;
}

.btn-back:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-2px);
}

.curso-header h1 {
  color: white;
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.curso-header .muted {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
}

.curso-header .muted {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
}

.modulos-section {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-intro {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.section-intro h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #111827;
  font-weight: 800;
}

.section-intro .muted {
  font-size: 1rem;
  color: #6B7280;
}

.modulo-card {
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

.modulo-card:hover {
  border-color: var(--primary);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.modulo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 2rem;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.modulo-header:hover {
  background: #eef2ff;
}

.modulo-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.modulo-icon {
  font-size: 1.6rem;
}

.modulo-header h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1.2rem;
  color: #111827;
  font-weight: 800;
}

.aula-count {
  font-size: 0.9rem;
  color: #6B7280;
  font-weight: 500;
}

.toggle-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
  color: #85685A;
  font-weight: 700;
}

.toggle-icon.open {
  transform: rotate(180deg);
}

.modulo-content {
  border-top: 1px solid var(--border);
  background: var(--neutral-50);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.aula-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.aula-item:hover {
  border-color: var(--primary);
  background: #f8fbff;
  transform: translateX(6px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

.aula-icon {
  font-size: 1.3rem;
  color: #4A90E2;
  flex-shrink: 0;
  font-weight: 700;
}

.aula-info {
  flex: 1;
}

.aula-title {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.aula-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Transições */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .curso-header h1 {
    font-size: 1.5rem;
  }

  .aula-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>