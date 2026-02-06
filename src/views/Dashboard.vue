<template>
  <div>
    <section class="hero-banner">
      <div class="hero-content">
        <div class="hero-badge">🚀 Bem-vindo à sua jornada de aprendizado</div>
        <h1 class="hero-title">Aprenda, <span>cresça</span> e domine novas habilidades com especialistas</h1>
        <p class="hero-subtitle">Acesso ilimitado a cursos premium, aulas ao vivo, certificados e uma comunidade de milhares de aprendizes. Comece sua transformação agora e alcance seus objetivos profissionais.</p>
        
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">Cursos disponíveis</div>
          </div>
          <div class="stat">
            <div class="stat-number">50k+</div>
            <div class="stat-label">Alunos satisfeitos</div>
          </div>
          <div class="stat">
            <div class="stat-number">4.9★</div>
            <div class="stat-label">Avaliação média</div>
          </div>
        </div>

        <div class="hero-benefits">
          <div class="benefit">
            <span class="checkmark">✓</span>
            <span>Aulas ao vivo, gravadas e sob demanda</span>
          </div>
          <div class="benefit">
            <span class="checkmark">✓</span>
            <span>Certificados reconhecidos no mercado</span>
          </div>
          <div class="benefit">
            <span class="checkmark">✓</span>
            <span>Mentores experientes com suporte direto</span>
          </div>
          <div class="benefit">
            <span class="checkmark">✓</span>
            <span>Comunidade exclusiva de networking</span>
          </div>
          <div class="benefit">
            <span class="checkmark">✓</span>
            <span>Acesso vitalício ao conteúdo</span>
          </div>
          <div class="benefit">
            <span class="checkmark">✓</span>
            <span>Projetos práticos com casos reais</span>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn btn-hero btn-primary">Começar gratuitamente</button>
          <button class="btn btn-hero btn-secondary">Ver todos os cursos</button>
        </div>

        <p class="hero-cta">✨ Acesso gratuito aos 5 primeiros dias. Sem cartão de crédito necessário.</p>
      </div>

      <div class="hero-illustration">
        <div class="illustration-box">
          <div class="illustration-icon">👨‍💻</div>
          <div class="illustration-icon secondary">📚</div>
          <div class="illustration-icon tertiary">🎓</div>
          <div class="floating-card">
            <div class="card-icon">⭐</div>
            <div class="card-text">
              <p class="card-title">Destaque</p>
              <p class="card-desc">Curso mais procurado</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="plans-section">
      <div class="section-header">
        <h2 class="section-title">Escolha seu plano perfeito</h2>
        <p class="section-subtitle">Encontre o plano ideal para suas necessidades de aprendizado</p>
      </div>

      <div class="plans-grid">
        <div class="plan basic">
          <div class="plan-header">
            <h3>Plano Básico</h3>
            <span class="plan-badge">Ideal para iniciantes</span>
          </div>
          <p class="price">{{ displayPrice.basic }}</p>
          <ul class="features">
            <li>✓ 3 aulas por dia</li>
            <li>✓ 5 cursos</li>
          </ul>
          <div class="plan-actions">
            <button class="btn btn-option" :class="{ active: selected.basic === 'mensal' }" @click="selectOption('basic', 'mensal')">Mensal</button>
            <button class="btn btn-option" :class="{ active: selected.basic === 'anual' }" @click="selectOption('basic', 'anual')">Anual</button>
          </div>
          <button v-if="selected.basic" class="btn btn-assinar" @click="goToPagando('basic')">Assinar agora</button>
          <button v-else class="btn btn-assinar disabled">Selecione uma opção</button>
          <button class="btn btn-benefit" @click="goToVisualizacao('basic')">Ver benefícios →</button>
        </div>

        <div class="plan premium featured">
          <div class="featured-badge">⭐ Mais Popular</div>
          <div class="plan-header">
            <h3>Plano Premium</h3>
            <span class="plan-badge premium-badge">Para profissionais</span>
          </div>
          <p class="price">{{ displayPrice.premium }}</p>
          <ul class="features">
            <li>✓ Aulas ilimitadas</li>
            <li>✓ Cursos ilimitados</li>
            <li>✓ Acesso a apostilas</li>
          </ul>
          <div class="plan-actions">
            <button class="btn btn-option" :class="{ active: selected.premium === 'mensal' }" @click="selectOption('premium', 'mensal')">Mensal</button>
            <button class="btn btn-option" :class="{ active: selected.premium === 'anual' }" @click="selectOption('premium', 'anual')">Anual</button>
          </div>
          <button v-if="selected.premium" class="btn btn-assinar primary" @click="goToPagando('premium')">Assinar agora</button>
          <button v-else class="btn btn-assinar disabled">Selecione uma opção</button>
          <button class="btn btn-benefit" @click="goToVisualizacao('premium')">Ver benefícios →</button>
        </div>
      </div>
    </section>

    <section class="cursos-section">
      <div class="search-container">
        <div class="search-header">
          <h2>Explore nossos cursos</h2>
          <p>Pesquise entre centenas de cursos disponíveis</p>
        </div>
        <div class="search-bar">
          <input type="text" v-model="search" placeholder="Pesquise alguns cursos" @focus="searchFocused = true" @blur="searchFocused = false" />
          <button class="btn">🔍</button>
        </div>
      </div>

      <div v-if="showCursos && (search || searchFocused)" class="cursos-lista-grid">
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
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Array com 7 cursos
const cursos = ref<any[]>([
  { nome: 'JavaScript para Iniciantes' },
  { nome: 'Python do Zero ao Avançado' },
  { nome: 'Vue.js Completo' },
  { nome: 'React na Prática' },
  { nome: 'Node.js e Express' },
  { nome: 'TypeScript Moderno' },
  { nome: 'Angular do Básico ao Pro' }
]);

export default defineComponent({
  setup() {
    const search = ref('');
    const searchFocused = ref(false);
    const filteredCursos = computed(() => {
      if (!search.value) return cursos.value;
      return cursos.value.filter(curso =>
        curso.nome.toLowerCase().includes(search.value.toLowerCase())
      );
    });
    const showCursos = computed(() => searchFocused.value || !!search.value);
    function goToVisualizacao(plano: 'basic' | 'premium') {
      // Salvar plano selecionado no localStorage
      localStorage.setItem('planoSelecionado', plano);
      router.push({ name: 'Visualizaçao' });
    }
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
        onMounted(async () => {
          // Exemplo de busca dos cursos via infoService
          // Aqui você pode implementar a leitura dos cursos de pagina1.txt via API/backend
          // cursos.value = await buscarCursos();
        });
    function toggleOptions(plano: 'basic' | 'premium') {
      showOptions.value[plano] = !showOptions.value[plano];
    }
    function selectOption(plano: 'basic' | 'premium', tipo: string) {
      selected.value[plano] = tipo;
      // Salvar seleção no localStorage
      localStorage.setItem(`plano_${plano}_selecionado`, tipo);
    }
    function goToPagando(plano: 'basic' | 'premium') {
      const tipo = selected.value[plano];
      if (tipo) {
        // Salvar informações do plano no localStorage
        localStorage.setItem('planoSelecionado', plano);
        localStorage.setItem('tipoPlanoSelecionado', tipo);
        router.push({ name: 'Pagando' });
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
      return { search, searchFocused, filteredCursos, showCursos, cursosPorColuna, showOptions, selected, toggleOptions, selectOption, displayPrice, goToPagando, goToVisualizacao };
  }
})
</script>

<style scoped>
/* Hero Banner */
.hero-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 100px 80px;
  margin-bottom: 80px;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  max-width: 100%;
}

@media (max-width: 1440px) {
  .hero-banner {
    padding: 90px 60px;
    gap: 70px;
  }
}

@media (max-width: 1200px) {
  .hero-banner {
    padding: 80px 40px;
    gap: 60px;
  }
}

@media (max-width: 1024px) {
  .hero-banner {
    grid-template-columns: 1fr;
    padding: 70px 36px;
    gap: 50px;
    margin-bottom: 60px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  .hero-illustration {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 60px 28px;
    gap: 40px;
    margin-bottom: 50px;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-stats {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .hero-benefits {
    grid-template-columns: 1fr;
  }

  .hero-illustration {
    height: 280px;
  }
}

@media (max-width: 640px) {
  .hero-banner {
    padding: 50px 20px;
    gap: 30px;
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .hero-illustration {
    display: none;
  }
}

.hero-badge {
  display: inline-block;
  background: rgba(107, 70, 193, 0.08);
  border: 1px solid rgba(107, 70, 193, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #6b46c1;
  width: fit-content;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  z-index: 10;
}

.hero-title {
  font-size: 62px;
  font-weight: 900;
  line-height: 1.1;
  color: #111827;
  margin: 0;
}

.hero-title span {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: #555;
  line-height: 1.8;
  margin: 0;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin: 20px 0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #999;
  font-weight: 600;
}

.hero-benefits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin: 28px 0;
  flex-wrap: wrap;
}

.btn-hero {
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(107, 70, 193, 0.3);
}

.btn-secondary {
  background: white;
  color: #6b46c1;
  border: 2px solid #6b46c1;
}

.btn-secondary:hover {
  background: #f8f6ff;
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(107, 70, 193, 0.1);
}

.hero-cta {
  font-size: 14px;
  color: #999;
  margin: 0;
  font-weight: 500;
}

.hero-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 480px;
}

.illustration-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-icon {
  font-size: 140px;
  position: absolute;
  animation: float-slow 4s ease-in-out infinite;
  opacity: 0.85;
}

.illustration-icon.secondary {
  font-size: 110px;
  top: 10px;
  right: 20px;
  animation: float-slow 5s ease-in-out infinite 0.5s;
  opacity: 0.65;
}

.illustration-icon.tertiary {
  font-size: 100px;
  bottom: 20px;
  left: 10px;
  animation: float-slow 6s ease-in-out infinite 1s;
  opacity: 0.55;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(5deg); }
}

.floating-card {
  position: absolute;
  bottom: 40px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: float-card 3s ease-in-out infinite;
}

@keyframes float-card {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.card-icon {
  font-size: 32px;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.card-desc {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* Plans Section */
.plans-section {
  padding: 80px 80px;
  margin-bottom: 80px;
  background: linear-gradient(180deg, rgba(107, 70, 193, 0.03), transparent);
}

@media (max-width: 1440px) {
  .plans-section {
    padding: 80px 60px;
  }
}

@media (max-width: 1200px) {
  .plans-section {
    padding: 70px 40px;
    margin-bottom: 70px;
  }

  .section-title {
    font-size: 40px;
  }
}

@media (max-width: 1024px) {
  .plans-section {
    padding: 60px 36px;
  }

  .section-title {
    font-size: 36px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .plans-grid {
    max-width: 100%;
    gap: 24px;
  }

  .plan {
    padding: 40px;
  }
}

@media (max-width: 768px) {
  .plans-section {
    padding: 50px 28px;
    margin-bottom: 50px;
  }

  .section-title {
    font-size: 32px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .plan {
    padding: 32px;
  }

  .plan.featured {
    transform: scale(1);
  }
}

@media (max-width: 640px) {
  .plans-section {
    padding: 40px 20px;
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 28px;
  }

  .plan {
    padding: 24px;
    gap: 20px;
  }

  .plan-header {
    flex-direction: column;
  }

  .plan-badge {
    width: 100%;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: 44px;
  font-weight: 900;
  color: #111827;
  margin: 0 0 12px 0;
}

.section-subtitle {
  font-size: 18px;
  color: #999;
  margin: 0;
}

.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.plan {
  padding: 48px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.plan:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border-color: rgba(107, 70, 193, 0.1);
}

.plan.featured {
  border-color: rgba(107, 70, 193, 0.3);
  box-shadow: 0 20px 60px rgba(107, 70, 193, 0.08);
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.02), rgba(99, 102, 241, 0.02));
  position: relative;
  transform: scale(1.02);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 24px;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.plan-header h3 {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.plan-badge {
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  font-weight: 600;
  white-space: nowrap;
}

.plan-badge.premium-badge {
  background: rgba(107, 70, 193, 0.1);
  color: #6b46c1;
}

.price {
  font-size: 32px;
  font-weight: 900;
  color: #111827;
  margin: 0;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.features li {
  font-size: 15px;
  color: #555;
  font-weight: 500;
}

.plan-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.btn-option {
  flex: 1;
  padding: 12px 16px;
  background: #f5f5f5;
  color: #666;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-option:hover {
  background: #efefef;
}

.btn-option.active {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  border-color: rgba(107, 70, 193, 0.5);
}

.btn-assinar {
  padding: 14px 24px;
  background: #f5f5f5;
  color: #666;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-assinar.primary {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
}

.btn-assinar.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(107, 70, 193, 0.3);
}

.btn-assinar.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-benefit {
  padding: 12px 24px;
  background: transparent;
  color: #6b46c1;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.btn-benefit:hover {
  background: rgba(107, 70, 193, 0.05);
}

/* Cursos Section */
.cursos-section {
  padding: 80px 80px;
}

@media (max-width: 1440px) {
  .cursos-section {
    padding: 80px 50px;
  }
}

@media (max-width: 1200px) {
  .cursos-section {
    padding: 70px 40px;
  }

  .search-header h2 {
    font-size: 40px;
  }
}

@media (max-width: 1024px) {
  .cursos-section {
    padding: 60px 36px;
  }

  .search-header h2 {
    font-size: 36px;
  }

  .cursos-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .cursos-section {
    padding: 50px 28px;
  }

  .search-header h2 {
    font-size: 32px;
  }

  .search-header p {
    font-size: 16px;
  }

  .cursos-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .curso-item {
    font-size: 14px;
    padding: 10px 0;
  }
}

@media (max-width: 640px) {
  .cursos-section {
    padding: 40px 20px;
  }

  .search-header h2 {
    font-size: 28px;
  }

  .search-header p {
    font-size: 14px;
  }

  .search-bar {
    max-width: 100%;
    margin: 24px 0;
  }

  .cursos-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .curso-item {
    font-size: 13px;
    padding: 8px 0;
  }
}

.search-container {
  text-align: center;
  margin-bottom: 48px;
}

.search-header h2 {
  font-size: 44px;
  font-weight: 900;
  color: #111827;
  margin: 0 0 12px 0;
}

.search-header p {
  font-size: 18px;
  color: #999;
  margin: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 32px auto;
}

.search-bar input {
  flex: 1;
  padding: 14px 20px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 16px;
  transition: all 0.2s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: rgba(107, 70, 193, 0.4);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.05);
}

.search-bar .btn {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  background: #f5f5f5;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
}

.search-bar .btn:hover {
  background: #efefef;
}

.cursos-lista-grid {
  max-width: 100%;
  margin: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}

.cursos-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.cursos-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.curso-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
}

.curso-item:last-child {
  border-bottom: none;
}

.curso-item:hover {
  color: #6b46c1;
  padding-left: 8px;
}

.no-results {
  color: #999;
  font-size: 16px;
  padding: 40px 0;
  text-align: center;
}

/* Mobile Responsive */
@media (max-width: 900px) {
  .hero-banner {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 40px;
    margin-bottom: 60px;
  }

  .hero-title {
    font-size: 44px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .hero-illustration {
    height: 300px;
  }

  .plans-section {
    padding: 60px 40px;
    margin-bottom: 60px;
  }

  .section-title {
    font-size: 36px;
  }

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .plan.featured {
    transform: scale(1);
  }

  .cursos-section {
    padding: 60px 40px;
  }

  .search-header h2 {
    font-size: 36px;
  }

  .cursos-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .hero-banner {
    padding: 40px 20px;
    gap: 30px;
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .hero-benefits {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-hero {
    width: 100%;
    padding: 14px 20px;
  }

  .hero-illustration {
    display: none;
  }

  .plans-section {
    padding: 40px 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .plan {
    padding: 32px 20px;
  }

  .plan-header {
    flex-direction: column;
  }

  .plan-badge {
    width: 100%;
    text-align: center;
  }

  .cursos-section {
    padding: 40px 20px;
  }

  .search-header h2 {
    font-size: 28px;
  }

  .cursos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
