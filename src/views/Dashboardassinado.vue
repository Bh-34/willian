<template>
  <div class="dashboard-assinado">
    <div class="header-assinado">
      <div class="header-content">
        <h1>Bem-vindo ao seu Curso!</h1>
        <p>Aproveite ao máximo seu aprendizado</p>
      </div>
      <div class="user-info">
        <router-link to="/perfil" class="perfil-link">Meu Perfil</router-link>
        <button @click="logout" class="logout-btn">Sair</button>
      </div>
    </div>

    <div class="container-assinado">
      <!-- Resumo da Assinatura -->
      <div class="resumo-assinatura" v-if="assinatura">
        <h2>Sua Assinatura</h2>
        <div class="info-assinatura">
          <div class="info-item">
            <span class="label">Curso:</span>
            <span class="valor">{{ assinatura.plano.nome }}</span>
          </div>
          <div class="info-item">
            <span class="label">Plano:</span>
            <span class="valor">{{ assinatura.plano.periodicidade }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="valor status-ativo">Ativo</span>
          </div>
          <div class="info-item">
            <span class="label">Data de Assinatura:</span>
            <span class="valor">{{ assinatura.dataAssinatura }}</span>
          </div>
        </div>
      </div>

      <!-- Conteúdo do Curso -->
      <div class="conteudo-curso">
        <h2>Conteúdo do Curso</h2>

        <div class="modulos">
          <!-- Módulo 1: Conceitos Básicos -->
          <div class="modulo">
            <div class="modulo-header" @click="toggleModulo(0)">
              <h3>{{ modulos[0].titulo }}</h3>
              <span class="toggle-icon">{{ modulosAbertos[0] ? '▼' : '▶' }}</span>
            </div>
            <div class="modulo-conteudo" v-if="modulosAbertos[0]">
              <div
                v-for="aula in modulos[0].aulas"
                :key="aula.id"
                class="aula"
                @click="selecionarAula(aula)"
              >
                <span class="aula-icone">🎥</span>
                <div class="aula-info">
                  <h4>{{ aula.titulo }}</h4>
                  <p class="duracao">{{ aula.duracao }}</p>
                </div>
                <span v-if="aula.concluida" class="concluida">✓</span>
              </div>
            </div>
          </div>

          <!-- Módulo 2: Técnicas Avançadas -->
          <div class="modulo">
            <div class="modulo-header" @click="toggleModulo(1)">
              <h3>{{ modulos[1].titulo }}</h3>
              <span class="toggle-icon">{{ modulosAbertos[1] ? '▼' : '▶' }}</span>
            </div>
            <div class="modulo-conteudo" v-if="modulosAbertos[1]">
              <div
                v-for="aula in modulos[1].aulas"
                :key="aula.id"
                class="aula"
                @click="selecionarAula(aula)"
              >
                <span class="aula-icone">🎥</span>
                <div class="aula-info">
                  <h4>{{ aula.titulo }}</h4>
                  <p class="duracao">{{ aula.duracao }}</p>
                </div>
                <span v-if="aula.concluida" class="concluida">✓</span>
              </div>
            </div>
          </div>

          <!-- Módulo 3: Projetos Práticos -->
          <div class="modulo">
            <div class="modulo-header" @click="toggleModulo(2)">
              <h3>{{ modulos[2].titulo }}</h3>
              <span class="toggle-icon">{{ modulosAbertos[2] ? '▼' : '▶' }}</span>
            </div>
            <div class="modulo-conteudo" v-if="modulosAbertos[2]">
              <div
                v-for="aula in modulos[2].aulas"
                :key="aula.id"
                class="aula"
                @click="selecionarAula(aula)"
              >
                <span class="aula-icone">🎥</span>
                <div class="aula-info">
                  <h4>{{ aula.titulo }}</h4>
                  <p class="duracao">{{ aula.duracao }}</p>
                </div>
                <span v-if="aula.concluida" class="concluida">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reprodutor de Vídeo -->
      <div class="player-container" v-if="aulaAtual">
        <div class="video-player">
          <div class="video-placeholder">
            <span class="play-icon">▶</span>
            <p>{{ aulaAtual.titulo }}</p>
            <small>{{ aulaAtual.duracao }}</small>
          </div>
        </div>
        <div class="aula-detalhes">
          <h3>{{ aulaAtual.titulo }}</h3>
          <p class="descricao">{{ aulaAtual.descricao }}</p>

          <div class="materiais">
            <h4>Materiais Complementares</h4>
            <ul>
              <li v-for="material in aulaAtual.materiais" :key="material">
                📄 {{ material }}
              </li>
            </ul>
          </div>

          <button @click="marcarComoConcluida" class="btn-concluir">
            {{ aulaAtual.concluida ? '✓ Concluída' : 'Marcar como Concluída' }}
          </button>
        </div>
      </div>

      <!-- Progresso Geral -->
      <div class="progresso-geral">
        <h2>Seu Progresso</h2>
        <div class="progress-stats">
          <div class="stat">
            <span class="numero">{{ aulasCompletas }}</span>
            <span class="label">Aulas Completas</span>
          </div>
          <div class="stat">
            <span class="numero">{{ totalAulas }}</span>
            <span class="label">Total de Aulas</span>
          </div>
          <div class="stat">
            <span class="numero">{{ percentualProgresso }}%</span>
            <span class="label">Progresso</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: percentualProgresso + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

interface Plano {
  nome: string
  preco: string
  periodicidade: string
}

interface Assinatura {
  plano: Plano
  dataAssinatura: string
}

interface Aula {
  id: string
  titulo: string
  duracao: string
  descricao: string
  concluida: boolean
  materiais: string[]
}

interface Modulo {
  id: number
  titulo: string
  aulas: Aula[]
}

export default defineComponent({
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      assinatura: null as Assinatura | null,
      modulosAbertos: [true, false, false] as boolean[],
      aulaAtual: null as Aula | null,
      intervaloVerificacao: null as any,
      modulos: [
        {
          id: 0,
          titulo: 'Módulo 1: Conceitos Básicos',
          aulas: [
            {
              id: 'aula-1-1',
              titulo: 'Introdução ao Curso',
              duracao: '15 min',
              descricao: 'Bem-vindo! Nesta aula apresentamos os conceitos fundamentais que você precisará dominar.',
              concluida: true,
              materiais: ['Slides da Introdução', 'Glossário de Termos']
            },
            {
              id: 'aula-1-2',
              titulo: 'Fundamentos Essenciais',
              duracao: '28 min',
              descricao: 'Mergulhe nos fundamentos essenciais do curso. Abordaremos os pilares principais e conceitos-chave.',
              concluida: true,
              materiais: ['PDF com Resumo', 'Exercícios Práticos', 'Referências']
            },
            {
              id: 'aula-1-3',
              titulo: 'Ferramentas e Recursos',
              duracao: '22 min',
              descricao: 'Conheça as principais ferramentas e recursos que você utilizará ao longo do curso.',
              concluida: false,
              materiais: ['Download das Ferramentas', 'Guia de Instalação']
            }
          ]
        },
        {
          id: 1,
          titulo: 'Módulo 2: Técnicas Avançadas',
          aulas: [
            {
              id: 'aula-2-1',
              titulo: 'Técnicas Avançadas - Parte 1',
              duracao: '35 min',
              descricao: 'Aprenda técnicas avançadas que levarão suas habilidades ao próximo nível.',
              concluida: false,
              materiais: ['Vídeo Complementar', 'Casos de Uso', 'Código Exemplo']
            },
            {
              id: 'aula-2-2',
              titulo: 'Otimização de Performance',
              duracao: '32 min',
              descricao: 'Descubra como otimizar o desempenho e criar soluções mais eficientes.',
              concluida: false,
              materiais: ['Benchmark de Performance', 'Dicas de Otimização']
            }
          ]
        },
        {
          id: 2,
          titulo: 'Módulo 3: Projetos Práticos',
          aulas: [
            {
              id: 'aula-3-1',
              titulo: 'Projeto Prático 1',
              duracao: '45 min',
              descricao: 'Desenvolva um projeto completo do zero, aplicando todos os conhecimentos adquiridos.',
              concluida: false,
              materiais: ['Briefing do Projeto', 'Arquivos de Inicialização', 'Solução Comentada']
            },
            {
              id: 'aula-3-2',
              titulo: 'Projeto Prático 2',
              duracao: '50 min',
              descricao: 'Um desafio mais complexo onde você terá a oportunidade de inovar e criar sua própria solução.',
              concluida: false,
              materiais: ['Desafio Proposto', 'Recursos Adicionais']
            }
          ]
        }
      ] as Modulo[]
    }
  },
  computed: {
    totalAulas(): number {
      return this.modulos.reduce((total, modulo) => total + modulo.aulas.length, 0)
    },
    aulasCompletas(): number {
      return this.modulos.reduce(
        (total, modulo) => total + modulo.aulas.filter((aula) => aula.concluida).length,
        0
      )
    },
    percentualProgresso(): number {
      return this.totalAulas > 0 ? Math.round((this.aulasCompletas / this.totalAulas) * 100) : 0
    }
  },
  mounted() {
    const assinatura = localStorage.getItem('ultimoPagamento')
    if (!assinatura) {
      this.router.push('/')
      return
    }

    const dadosPagamento = JSON.parse(assinatura)
    this.assinatura = {
      plano: dadosPagamento.plano,
      dataAssinatura: dadosPagamento.dataPagamento
    }

    const progresso = localStorage.getItem('progressoCurso')
    if (progresso) {
      const dados = JSON.parse(progresso)
      this.modulos.forEach((modulo) => {
        modulo.aulas.forEach((aula) => {
          const aulaSalva = dados[aula.id]
          if (aulaSalva) {
            aula.concluida = aulaSalva.concluida
          }
        })
      })
    }

    const primeiraNaoConcluida = this.modulos
      .flatMap((m) => m.aulas)
      .find((a) => !a.concluida)
    this.aulaAtual = primeiraNaoConcluida || this.modulos[0].aulas[0]

    // Monitorar mudanças no localStorage para detectar logout
    this.verificarAssinatura()
    this.intervaloVerificacao = setInterval(() => {
      this.verificarAssinatura()
    }, 1000)
  },
  beforeUnmount() {
    if (this.intervaloVerificacao) {
      clearInterval(this.intervaloVerificacao)
      this.intervaloVerificacao = null
    }
  },
  methods: {
    verificarAssinatura() {
      if (!localStorage.getItem('ultimoPagamento')) {
        this.router.push('/login')
      }
    },
    toggleModulo(index: number) {
      this.modulosAbertos[index] = !this.modulosAbertos[index]
      this.$forceUpdate()
    },
    selecionarAula(aula: Aula) {
      this.aulaAtual = aula
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    marcarComoConcluida() {
      if (this.aulaAtual) {
        this.aulaAtual.concluida = true

        const progresso: Record<string, { concluida: boolean }> = {}
        this.modulos.forEach((modulo) => {
          modulo.aulas.forEach((aula) => {
            progresso[aula.id] = { concluida: aula.concluida }
          })
        })
        localStorage.setItem('progressoCurso', JSON.stringify(progresso))

        const todasAulas = this.modulos.flatMap((m) => m.aulas)
        const indexAtual = todasAulas.findIndex((a) => a.id === this.aulaAtual!.id)
        if (indexAtual < todasAulas.length - 1) {
          this.aulaAtual = todasAulas[indexAtual + 1]
        }
      }
    },
    logout() {
      if (this.intervaloVerificacao) {
        clearInterval(this.intervaloVerificacao)
        this.intervaloVerificacao = null
      }

      localStorage.removeItem('token')
      localStorage.removeItem('ultimoPagamento')
      localStorage.removeItem('progressoCurso')
      localStorage.removeItem('planoParaPagar')
      this.router.push('/login')
    }
  }
})
</script>

<style scoped>
.dashboard-assinado {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.header-assinado {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0;
  color: #667eea;
  font-size: 2rem;
}

.header-content p {
  margin: 0.5rem 0 0 0;
  color: #666;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.perfil-link,
.logout-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.perfil-link {
  background: #667eea;
  color: white;
  text-decoration: none;
}

.perfil-link:hover {
  background: #5568d3;
}

.logout-btn {
  background: #f44336;
  color: white;
}

.logout-btn:hover {
  background: #da190b;
}

.container-assinado {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.resumo-assinatura {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resumo-assinatura h2 {
  color: #667eea;
  margin-top: 0;
  margin-bottom: 1rem;
}

.info-assinatura {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.info-item .label {
  font-weight: bold;
  color: #666;
}

.info-item .valor {
  color: #667eea;
  font-weight: 600;
}

.status-ativo {
  color: #4caf50;
}

.conteudo-curso {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.conteudo-curso h2 {
  color: #667eea;
  margin-top: 0;
}

.modulos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modulo {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.modulo-header {
  background: #f9f9f9;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
  user-select: none;
}

.modulo-header:hover {
  background: #f0f0f0;
}

.modulo-header h3 {
  margin: 0;
  color: #333;
  flex: 1;
}

.toggle-icon {
  color: #667eea;
  font-weight: bold;
}

.modulo-conteudo {
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow-y: auto;
}

.aula {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.aula:hover {
  background: #f5f5f5;
}

.aula-icone {
  font-size: 1.5rem;
}

.aula-info {
  flex: 1;
  min-width: 0;
}

.aula-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.duracao {
  margin: 0;
  color: #999;
  font-size: 0.9rem;
}

.concluida {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.2rem;
}

.player-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.video-player {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.video-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  aspect-ratio: 16 / 9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
}

.play-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.video-placeholder p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.video-placeholder small {
  margin-top: 0.5rem;
  opacity: 0.8;
}

.aula-detalhes {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.aula-detalhes h3 {
  color: #667eea;
  margin-top: 0;
}

.descricao {
  color: #666;
  line-height: 1.6;
}

.materiais h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.materiais ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.materiais li {
  padding: 0.5rem 0;
  color: #667eea;
  cursor: pointer;
}

.materiais li:hover {
  text-decoration: underline;
}

.btn-concluir {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-top: auto;
  transition: background 0.3s ease;
}

.btn-concluir:hover {
  background: #45a049;
}

.progresso-geral {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progresso-geral h2 {
  color: #667eea;
  margin-top: 0;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat .numero {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat .label {
  color: #666;
  font-size: 0.95rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .header-assinado {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .player-container {
    grid-template-columns: 1fr;
  }

  .container-assinado {
    padding: 1rem;
  }
}
</style>