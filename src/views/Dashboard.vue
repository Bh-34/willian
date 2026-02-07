<template>
  <div>
    <div class="card">
      <h1>Dashboard</h1>
      <p class="muted">
        {{ hasPlano ? 'Seus cursos disponíveis' : 'Escolha um plano para acessar os cursos' }}
      </p>
    </div>

    <!-- PLANOS (SÓ SE NÃO TIVER PLANO) -->
    <section v-if="!hasPlano" class="plans-grid">
      <div
        v-for="plano in planos"
        :key="plano.id"
        class="plan card"
      >
        <h2>{{ plano.nome }}</h2>
        <p class="price">R$ {{ plano.preco }}</p>

        <ul>
          <li v-for="b in plano.beneficios" :key="b.chave">
            {{ b.texto }}
          </li>
        </ul>

        <button class="btn primary" @click="selecionarPlano(plano)">
          Assinar
        </button>
      </div>
    </section>

    <!-- PESQUISA -->
    <div class="search-box">
      <input
        v-model="search"
        placeholder="Pesquisar cursos..."
      />
    </div>

    <!-- CURSOS -->
    <section class="courses-grid">
      <div
        v-for="curso in cursosFiltrados"
        :key="curso.id"
        class="course card"
        @click="abrirCurso(curso)"
      >
        <h3>{{ curso.titulo }}</h3>
        <p class="muted">{{ curso.descricao }}</p>

        <span v-if="!hasPlano" class="lock">
          🔒 Assine para acessar
        </span>
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

    const hasPlano = computed(() => !!user.value?.plano)

    async function carregarDados() {
  const [resPlanos, resCursos] = await Promise.all([
    api.get('/planos'),
    api.get('/cursos')
  ])

  planos.value = resPlanos.data
  cursos.value = resCursos.data
}

    function selecionarPlano(plano: any) {
      sessionStorage.setItem('planoSelecionado', JSON.stringify(plano))
      router.push('/visualizacao')
    }

    function abrirCurso(curso: any) {
      if (!hasPlano.value) return
      router.push(`/cursos/${curso.id}`)
    }

    const cursosFiltrados = computed(() =>
      cursos.value.filter(c =>
        c.titulo.toLowerCase().includes(search.value.toLowerCase())
      )
    )

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


<style scoped>/* ===== LAYOUT GERAL ===== */
.card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.06);
  margin-bottom: 20px;
}

h1 {
  margin: 0 0 6px 0;
}

.muted {
  color: var(--muted);
  font-size: 14px;
}

/* ===== PLANOS ===== */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.plan {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform .2s ease, box-shadow .2s ease;
}

.plan:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.plan h2 {
  margin: 0;
  font-size: 18px;
}

.plan .price {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
}

.plan ul {
  padding-left: 18px;
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

/* ===== BOTÃO ===== */
.btn {
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn.primary {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
}

.plan .btn {
  margin-top: auto;
}

/* ===== PESQUISA ===== */
.search-box {
  margin: 20px 0;
}

.search-box input {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.1);
  font-size: 15px;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30,136,229,0.15);
}

/* ===== CURSOS ===== */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.course {
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
  position: relative;
}

.course:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.course h3 {
  margin: 0 0 6px 0;
  font-size: 17px;
}

.course .lock {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.75);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
}

</style>
