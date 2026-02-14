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

    <div class="branco">

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
    
  
    
    <!-- CURSOS -->
    <section class="section">
      
      <section class="section search-section">
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
          <div class="section-header">
      <p class="muted">{{ cursosFiltrados.length }} curso{{ cursosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ cursosFiltrados.length !== 1 ? 's' : '' }}</p>
      </div>
      </section>
      <div v-if="cursosFiltrados.length > 0" class="courses-grid">
        <div
        v-for="curso in cursosFiltrados"
        :key="curso.id"
        class="course-card"
        @click="abrirCurso(curso)"
        >
        <div class="course-header">
            <span class="course-icon"></span>
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
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  margin: 2rem auto;
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

}

.header-section .muted {
  color: rgba(255,255,255,0.85);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}


.branco h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.search-container {
  margin-top: 2rem;
    position: relative;
  max-width: 500px;
}
.search-section {
  display: flex;
  justify-content: center;
}

.section search-section {
  display: flex;
  flex-direction: row;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #94a3b8;
}

.search-clear {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 0.8rem;
  color: #94a3b8;
}


.branco p {
  color: #64748b;
  margin-bottom: 2rem;
}

.branco {
  background: #f8fafc; 
  padding: 3rem 2rem;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-top: -20px; 
}

.header-section {
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding-bottom: 4rem;
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
    max-width: 380px;
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

/* CURSOS */
.course-card {
  background: white;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  border-bottom: 2px solid  #0F172A;
}

.course-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
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
