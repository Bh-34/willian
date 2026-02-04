<template>
  <div class="container">
    <div v-if="plano" class="plano-detalhes">
      <div class="header">
        <router-link to="/" class="voltar"></router-link>
        <h1>{{ plano.nome }}</h1>
        <p v-if="plano.desconto" class="desconto-badge">{{ plano.desconto }}</p>
      </div>

      <div class="preco-section">
        <span class="preco">{{ plano.preco }}</span>
        <span class="periodicidade">{{ plano.periodicidade }}</span>
      </div>

      <div class="features-section">
        <h2>Características principais</h2>
        <ul class="features-list">
          <li v-for="(feature, index) in plano.features" :key="index" class="feature-item">
            ✓ {{ feature }}
          </li>
        </ul>
      </div>

      <div class="detalhes-section">
        <h2>O que está incluído</h2>
        <ul class="detalhes-list">
          <li v-for="(detalhe, index) in plano.detalhesAdicionais" :key="index" class="detalhe-item">
            ◆ {{ detalhe }}
          </li>
        </ul>
      </div>

      <button class="btn-assinar" @click="irParaPagamento">Prosseguir com o pagamento</button>
    </div>
    <div v-else class="sem-plano">
      <p>Nenhum plano selecionado</p>
      <router-link to="/" class="link-voltar">Voltar ao Dashboard</router-link>
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
  features: string[]
  desconto?: string
  detalhesAdicionais: string[]
}

export default defineComponent({
  setup() {
    const router = useRouter()

    const irParaPagamento = function(this: any) {
      if (this.plano) {
        localStorage.setItem('planoParaPagar', JSON.stringify(this.plano))
        router.push('/pagando')
      }
    }

    return {
      irParaPagamento
    }
  },
  data() {
    return {
      plano: null as Plano | null
    }
  },
  mounted() {
    const stored = sessionStorage.getItem('planoSelecionado')
    if (stored) {
      this.plano = JSON.parse(stored)
    }
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.plano-detalhes {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  position: relative;
  margin-bottom: 32px;
}

.voltar {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 16px;
  transition: transform 0.2s ease;
}

.voltar:hover {
  transform: translateX(-4px);
}

.header h1 {
  margin: 16px 0 8px 0;
  font-size: 32px;
  color: var(--text-primary);
}

.desconto-badge {
  display: inline-block;
  background: linear-gradient(90deg, #ff7a7a, #ff5a9e);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  margin-top: 8px;
}

.preco-section {
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.08), rgba(30, 136, 229, 0.08));
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  border-left: 4px solid var(--primary);
}

.preco {
  font-size: 42px;
  font-weight: 700;
  color: var(--primary);
  display: block;
  margin-bottom: 8px;
}

.periodicidade {
  font-size: 16px;
  color: var(--muted);
}

.features-section {
  margin-bottom: 32px;
}

.features-section h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.feature-item {
  background: rgba(107, 70, 193, 0.05);
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 500;
}

.feature-item::before {
  content: '';
}

.detalhes-section {
  margin-bottom: 32px;
}

.detalhes-section h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.detalhes-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detalhe-item {
  padding: 12px 16px;
  background: rgba(30, 136, 229, 0.05);
  border-radius: 8px;
  color: var(--text-primary);
  border-left: 3px solid var(--primary);
}

.detalhe-item::before {
  content: '';
}

.btn-assinar {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-assinar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
}

.btn-assinar:active {
  transform: translateY(0);
}

.sem-plano {
  text-align: center;
  padding: 48px 24px;
}

.sem-plano p {
  font-size: 18px;
  color: var(--muted);
  margin-bottom: 24px;
}

.link-voltar {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid var(--primary);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.link-voltar:hover {
  background: var(--primary);
  color: white;
}
</style>