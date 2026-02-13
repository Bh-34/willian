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

<style scoped>.dashboard {
  display: flex;
  min-width: 180vh;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* HEADER — MESMO PADRÃO DO LOGIN */
.header-section {
  background: var(--primary);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.header-content h1 {
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
}

.header-section .muted {
  color: rgba(255,255,255,0.85);
}

/* SECTION */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* PLANOS */
.plan-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.plan-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.plan-card.featured {
  border: 2px solid var(--primary);
}

.plan-badge {
  position: absolute;
  top: -10px;
  left: var(--spacing-lg);
  background: var(--primary);
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 600;
}

.price {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
}

.check {
  color: var(--primary);
  font-weight: 700;
}

/* SEARCH */
.search-input {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px 14px 45px;
  transition: var(--transition);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
  outline: none;
}

/* CURSOS */
.course-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: var(--transition);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.course-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.course-card h3 {
  font-weight: 800;
  color: var(--text-primary);
}

.lock-text {
  color: var(--text-tertiary);
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--neutral-50);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
}

</style>
