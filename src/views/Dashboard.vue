<template>
  <div class="dashboard">
    <!-- HEADER -->
    <section class="header-section">
      <div class="header-content">
        <div>
          <h1>Bem-vindo ao Dashboard!</h1>
          <p class="muted">{{ hasPlano ? 'Seus cursos disponíveis' : 'Escolha um plano para acessar os cursos' }}</p>
        </div>
      </div>
    </section>

    <!-- PLANOS -->
    <section v-if="!hasPlano" class="section">
      <div class="section-header">
        <h2>Nossos Planos</h2>
        <p class="muted">Escolha o melhor para você</p>
      </div>
      <div class="plans-grid">
        <div
          v-for="plano in planos"
          :key="plano.id"
          class="plan-card"
          :class="{ featured: plano.id === 2 }"
        >
          <div class="plan-badge" v-if="plano.id === 2">Mais Popular</div>
          <h3>{{ plano.nome }}</h3>
          <div class="price">R$ {{ plano.preco?.toLocaleString('pt-BR') }}</div>

          <ul class="benefits">
            <li v-for="b in plano.beneficios" :key="b.chave" class="benefit-item">
              <span class="check">✓</span>
              {{ b.texto }}
            </li>
          </ul>

          <button class="btn primary btn-full" @click="selecionarPlano(plano)">
            Assinar Plano
          </button>
        </div>
      </div>
    </section>

    <!-- BUSCA -->
    <section class="section">
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar cursos..."
          class="search-input"
        />
        <span v-if="search" class="search-clear" @click="search = ''">✕</span>
      </div>
    </section>

    <!-- CURSOS -->
    <section class="section">
      <div class="section-header">
        <h2>Cursos Disponíveis</h2>
        <p class="muted">{{ cursosFiltrados.length }} curso{{ cursosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ cursosFiltrados.length !== 1 ? 's' : '' }}</p>
      </div>

      <div v-if="cursosFiltrados.length > 0" class="courses-grid">
        <div
          v-for="curso in cursosFiltrados"
          :key="curso.id"
          class="course-card"
          @click="abrirCurso(curso)"
        >
          <div class="course-header">
            <span class="course-icon">📖</span>
            <span v-if="!hasPlano" class="lock-badge">🔒</span>
          </div>
          <h3>{{ curso.titulo }}</h3>
          <p class="course-desc">{{ curso.descricao }}</p>
          <div v-if="!hasPlano" class="course-footer">
            <span class="lock-text">Assine para acessar</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Nenhum curso encontrado com "<strong>{{ search }}</strong>"</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useUser } from '@/services/authService'

export default defineComponent({
  setup() {
    const router = useRouter()
    const user = useUser()

    const planos = ref<any[]>([])
    const cursos = ref<any[]>([])
    const search = ref('')

    const hasPlano = computed(() => !!user.value?.plano_id)

    const cursosFiltrados = computed(() =>
      cursos.value.filter(c =>
        c.titulo.toLowerCase().includes(search.value.toLowerCase())
      )
    )

    async function carregarDados() {
      try {
        const [planosRes, cursosRes] = await Promise.all([
          api.get('/planos'),
          api.get('/cursos')
        ])

        planos.value = planosRes.data
        cursos.value = cursosRes.data
      } catch (e) {
        console.warn('Erro ao carregar dados', e)
      }
    }

    function selecionarPlano(plano: any) {
      sessionStorage.setItem('planoSelecionado', JSON.stringify(plano))
      router.push('/visualizacao')
    }

    function abrirCurso(curso: any) {
      if (!hasPlano.value) return
      router.push(`/cursos/${curso.id}`)
    }

    onMounted(carregarDados)

    return {
      planos,
      cursosFiltrados,
      selecionarPlano,
      abrirCurso,
      search,
      hasPlano
    }
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #5A4436 0%, #85685A 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border-left: none;
}

.header-content h1 {
  color: white;
  margin-bottom: var(--spacing-sm);
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.header-section .muted {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
}

/* Section */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.section-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.plan-card {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: var(--transition);
  position: relative;
  box-shadow: var(--shadow-md);
}

.plan-card:hover {
  border-color: #85685A;
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  background: #F5F1EB;
}

.plan-card.featured {
  border: 2px solid #85685A;
  box-shadow: 0 0 0 1px #CB8E5F, var(--shadow-xl);
  transform: scale(1.03);
  background: linear-gradient(135deg, #FBF8F0 0%, #FFFFFF 100%);
}

.plan-card.featured:hover {
  transform: scale(1.03) translateY(-6px);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: var(--spacing-lg);
  background: linear-gradient(135deg, #85685A, #CB8E5F);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
}

.plan-card h3 {
  font-size: 1.4rem;
  margin: 0;
  color: #3D3D3D;
  font-weight: 800;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #85685A;
  margin: var(--spacing-md) 0 0 0;
  letter-spacing: -1px;
}

.benefits {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.check {
  color: #85685A;
  font-weight: 800;
  min-width: 20px;
}

.btn-full {
  width: 100%;
  margin-top: var(--spacing-lg);
  padding: 14px 24px;
  font-weight: 600;
  font-size: 1rem;
}

/* Search */
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-lg);
  font-size: 1.3rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px calc(var(--spacing-lg) + 32px);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: var(--transition);
  background: white;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  border-color: #2E5C8A;
  box-shadow: 0 0 0 3px rgba(46, 92, 138, 0.1);
  outline: none;
}

.search-clear {
  position: absolute;
  right: var(--spacing-lg);
  cursor: pointer;
  color: #9CA3AF;
  font-weight: 700;
  transition: var(--transition);
  font-size: 1.1rem;
}

.search-clear:hover {
  color: #2E5C8A;
}

/* Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.course-card {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  box-shadow: var(--shadow-md);
}

.course-card:hover {
  border-color: #85685A;
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  background: #F5F1EB;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.course-icon {
  font-size: 2.2rem;
}

.lock-badge {
  font-size: 1.3rem;
}

.course-card h3 {
  font-size: 1.25rem;
  margin: 0;
  color: #3D3D3D;
  font-weight: 800;
}

.course-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
  flex: 1;
  line-height: 1.5;
}

.course-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border);
}

.lock-text {
  font-size: 0.85rem;
  color: #9CA3AF;
  display: inline-block;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--neutral-50);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border);
}

.empty-state p {
  margin: 0;
  font-size: 1.05rem;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    gap: var(--spacing-xl);
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }

  .plan-card.featured {
    transform: scale(1);
  }

  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
