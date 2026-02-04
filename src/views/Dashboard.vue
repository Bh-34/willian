<template>
  <div>
    <div class="card">
      <h1>Dashboard</h1>
      <p class="muted">Visão geral da loja — Escolha seu plano</p>
    </div>
    <section class="plans-grid" aria-label="Planos de cursos">
      <div class="plan basic card">
        <header>
          <h2>Plano Básico</h2>
        </header>
        <p class="price">{{ displayPrice.basic }}</p>
        <ul class="features">
          <li>3 aulas por dia</li>
          <li>5 cursos</li>
        </ul>
        <button class="btn primary" @click="toggleOptions('basic')">Escolher opção</button>
        <div v-if="showOptions.basic" style="margin-top:8px; display:flex; gap:8px;">
          <button class="btn" :class="{ active: selected.basic === 'mensal' }" @click="selectOption('basic', 'mensal')">Mensal</button>
          <button class="btn" :class="{ active: selected.basic === 'anual' }" @click="selectOption('basic', 'anual')">Anual</button>
        </div>
        <button v-if="selected.basic" class="btn primary" style="margin-top:8px;" @click="goToPagando('basic')">Assinar</button>
      </div>
      <div class="plan premium card">
        <header>
          <h2>Plano Premium</h2>
        </header>
        <p class="price">{{ displayPrice.premium }}</p>
        <ul class="features">
          <li>Aulas ilimitadas</li>
          <li>Cursos ilimitados</li>
          <li>Acesso a apostilas</li>
        </ul>
        <button class="btn primary" @click="toggleOptions('premium')">Escolher opção</button>
        <div v-if="showOptions.premium" style="margin-top:8px; display:flex; gap:8px;">
          <button class="btn" :class="{ active: selected.premium === 'mensal' }" @click="selectOption('premium', 'mensal')">Mensal</button>
          <button class="btn" :class="{ active: selected.premium === 'anual' }" @click="selectOption('premium', 'anual')">Anual</button>
        </div>
        <button v-if="selected.premium" class="btn primary" style="margin-top:8px;" @click="goToPagando('premium')">Assinar</button>
      </div>
    </section>
    <div class="search-bar">
      <input type="text" v-model="search" placeholder="Pesquise alguns cursos" @focus="searchFocused = true" @blur="searchFocused = false" />
      <button class="btn">🔍</button>
    </div>
    <div v-if="showCursos && (search || searchFocused)" class="cursos-lista-grid">
      <h2 style="margin-bottom: 12px;">Cursos Online</h2>
      <div v-if="filteredCursos.length === 0" class="no-results">Nenhum curso encontrado.</div>
      <div v-else class="cursos-grid">
        <div v-for="col in 5" :key="col" class="cursos-col">
          <ul>
            <li v-for="curso in cursosPorColuna(col - 1)" :key="curso.nome" class="curso-item">
              {{ curso.nome }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const cursos = [
  { nome: 'JavaScript para Iniciantes' },
  { nome: 'Python do Zero ao Avançado' },
  { nome: 'HTML e CSS Essencial' },
  { nome: 'Vue.js Completo' },
  { nome: 'React na Prática' },
  { nome: 'Node.js e Express' },
  { nome: 'Banco de Dados MySQL' },
  { nome: 'MongoDB para Desenvolvedores' },
  { nome: 'TypeScript Moderno' },
  { nome: 'Angular do Básico ao Pro' },
  { nome: 'Java para Web' },
  { nome: 'C# e .NET Core' },
  { nome: 'Flutter e Dart' },
  { nome: 'Desenvolvimento Android' },
  { nome: 'Swift para iOS' },
  { nome: 'PHP e Laravel' },
  { nome: 'Ruby on Rails' },
  { nome: 'Segurança da Informação' },
  { nome: 'DevOps e Docker' },
  { nome: 'AWS para Iniciantes' },
  { nome: 'Machine Learning com Python' },
  { nome: 'Data Science do Zero' },
  { nome: 'Power BI e Visualização de Dados' },
  { nome: 'Excel Avançado' },
  { nome: 'Lógica de Programação' },
  { nome: 'Design Gráfico com Photoshop' },
  { nome: 'UX/UI Design' },
  { nome: 'Marketing Digital' },
  { nome: 'Gestão de Projetos Ágeis' },
  { nome: 'Inglês para TI' }
];

export default defineComponent({
  setup() {
    const search = ref('');
    const searchFocused = ref(false);
    const filteredCursos = computed(() => {
      if (!search.value) return cursos;
      return cursos.filter(curso =>
        curso.nome.toLowerCase().includes(search.value.toLowerCase())
      );
    });
    const showCursos = computed(() => searchFocused.value || !!search.value);
    function cursosPorColuna(colIdx: number) {
      // Divide os cursos filtrados em 5 colunas de até 6 cursos
      const porColuna = 6;
      return filteredCursos.value.slice(colIdx * porColuna, (colIdx + 1) * porColuna);
    }
    const router = useRouter();
    const showOptions = ref({ basic: false, premium: false });
    const selected = ref({ basic: '', premium: '' });
    const prices = {
      basic: 29.90,
      premium: 79.90
    };
    function toggleOptions(plano: 'basic' | 'premium') {
      showOptions.value[plano] = !showOptions.value[plano];
    }
    function selectOption(plano: 'basic' | 'premium', tipo: string) {
      selected.value[plano] = tipo;
    }
    function goToPagando(plano: 'basic' | 'premium') {
      const tipo = selected.value[plano];
      if (tipo) {
        router.push({ name: 'Pagando', query: { tipo, plano } });
      }
    }
    const displayPrice = {
      basic: computed(() => {
        if (selected.value.basic === 'anual') {
          const anual = prices.basic * 12 * 0.9;
          return `R$ ${anual.toFixed(2)} (anual)`;
        }
        return `R$ ${prices.basic.toFixed(2)} (mensal)`;
      }),
      premium: computed(() => {
        if (selected.value.premium === 'anual') {
          const anual = prices.premium * 12 * 0.9;
          return `R$ ${anual.toFixed(2)} (anual)`;
        }
        return `R$ ${prices.premium.toFixed(2)} (mensal)`;
      })
    };
    return { search, searchFocused, filteredCursos, showCursos, cursosPorColuna, showOptions, selected, toggleOptions, selectOption, displayPrice, goToPagando };
  }
})
</script>

<style scoped>
.card {
  margin-bottom: 24px;
}
.plans-grid{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap:16px;
  margin-top:16px;
  margin-bottom: 32px;
}
.plan{
  padding:18px;
  border-radius:12px;
  display:flex;
  flex-direction:column;
  gap:12px;
  align-items:flex-start;
  transition:transform .18s ease, box-shadow .18s ease;
}
.plan:hover{ transform:translateY(-6px); box-shadow:0 10px 30px rgba(16,24,40,0.08) }
.plan header{ display:flex; align-items:center; gap:8px; width:100%; justify-content:space-between }
.plan h2{ margin:0; font-size:18px }
.tag{ background:rgba(0,0,0,0.06); padding:4px 8px; border-radius:999px; font-size:12px }
.price{ font-size:20px; font-weight:700; margin:0 }
.discount{ background:linear-gradient(90deg,#ff7a7a,#ff5a9e); color:white; padding:4px 8px; border-radius:6px; font-size:12px; margin-left:8px }
.per{ color:var(--muted); font-weight:500; margin-left:6px; font-size:14px }
.features{ list-style:none; padding:0; margin:6px 0 0 0; color:var(--muted) }
.features li{ margin:6px 0 }
.btn{ padding:10px 14px; border-radius:8px; border:none; cursor:pointer; background:transparent; font-weight:700 }
.btn.primary{ background:linear-gradient(90deg,var(--primary),#6b46c1); color:white }
.btn.active {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  border: 2px solid #6b46c1;
}

/* Diferenciação visual */
.basic{ border:1px solid rgba(30,136,229,0.08) }
.premium{ border:1px solid rgba(107,70,193,0.08); background:linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98)) }

/* Responsivo: em telas pequenas, uma coluna */
@media (max-width:700px){
  .plans-grid{ grid-template-columns: 1fr }
  .cursos-grid { grid-template-columns: 1fr !important; }
}

.muted{ color:var(--muted) }
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 24px auto;
  max-width: 400px;
  padding: 12px 0;
}
.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  font-size: 16px;
}
.search-bar .btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #e5e7eb;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
}
.search-bar .btn:hover {
  background: #d1d5db;
}
.cursos-lista-grid {
  max-width: 1200px;
  margin: 32px auto 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 24px 24px 12px 24px;
}
.cursos-lista-grid h2 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}
.cursos-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.cursos-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.curso-item {
  padding: 10px 0;
  border-bottom: 1px solid #ececec;
  font-size: 16px;
  color: #333;
}
.curso-item:last-child {
  border-bottom: none;
}
.no-results {
  color: #b91c1c;
  font-size: 16px;
  padding: 12px 0;
}
</style>
