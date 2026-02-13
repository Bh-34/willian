<template>
  <div class="curso-container" v-if="curso">
    <!-- Header -->
    <div class="curso-header">
      <div class="header-content">
        <button @click="voltar" class="btn-back">← Voltar</button>
        <h1>{{ curso.titulo }}</h1>
        <p class="muted">{{ curso.descricao }}</p>
      </div>
    </div>

    <!-- Módulos -->
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
    const expandedModulos = ref<Record<string, boolean>>({})

    async function carregarCurso() {
      if (!user.value?.plano) {
        router.push('/')
        return
      }

      const response = await api.get(`/cursos/${route.params.id}`)
      curso.value = response.data
      
      // Expandir primeiro módulo por padrão
      if (curso.value?.modulos?.length > 0) {
        expandedModulos.value['0'] = true
      }
    }

    function toggleModulo(idx: string | number) {
      const key = String(idx)
      expandedModulos.value[key] = !expandedModulos.value[key]
    }

    function abrirAula(aula: any) {
      router.push({ name: 'aula', params: { id: aula.id } })
    }

    function voltar() {
      router.back()
    }

    onMounted(carregarCurso)

    return { curso, abrirAula, voltar, toggleModulo, expandedModulos }
  }
})
</script>

<style scoped>
.curso-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

.curso-header {
  background: linear-gradient(135deg, #5A4436 0%, #85685A 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 16px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  transition: var(--transition);
  font-size: 0.95rem;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
}

.modulo-card:hover {
  border-color: #85685A;
  box-shadow: var(--shadow-lg);
}

.modulo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: var(--transition);
  background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
}

.modulo-header:hover {
  background: linear-gradient(135deg, #F0F7FF 0%, #E0F2FE 100%);
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
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: var(--transition);
}

.aula-item:hover {
  border-color: #2E5C8A;
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
  background: #F0F7FF;
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
  background: linear-gradient(135deg, #2E5C8A, #4A90E2);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
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