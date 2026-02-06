<template>
  <div class="container">
    <div v-if="plano" class="plano-detalhes">
      <div class="header">
        <router-link to="/" class="voltar">← Voltar</router-link>
        <h1>{{ plano.nome }}</h1>
      </div>

      <div class="preco-section">
        <span class="preco">
          R$ {{ Number(plano.preco).toFixed(2).replace('.', ',') }}
        </span>
      </div>

      <div class="features-section">
        <h2>Características principais</h2>
        <ul class="features-list">
          <li
            v-for="beneficio in plano.beneficios"
            :key="beneficio.chave"
            class="feature-item"
          >
            ✓ {{ beneficio.texto }}
          </li>

          <li v-if="plano.pdf" class="feature-item">
            ✓ Acesso a apostilas em PDF
          </li>
        </ul>
      </div>

      <button class="btn-assinar" @click="irParaPagamento">
        Prosseguir com o pagamento
      </button>
    </div>

    <div v-else class="sem-plano">
      <p>Nenhum plano selecionado</p>
      <router-link to="/" class="link-voltar">
        Voltar ao Dashboard
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const plano = ref<any>(null)

    function irParaPagamento() {
      if (!plano.value) return
      localStorage.setItem('planoParaPagar', JSON.stringify(plano.value))
      router.push('/pagando')
    }

    onMounted(() => {
      const stored = sessionStorage.getItem('planoSelecionado')
      if (stored) {
        plano.value = JSON.parse(stored)
      }
    })

    return {
      plano,
      irParaPagamento
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
  margin-bottom: 32px;
}

.voltar {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 16px;
}

.header h1 {
  margin: 16px 0 8px 0;
  font-size: 32px;
}

.preco-section {
  background: linear-gradient(
    135deg,
    rgba(107, 70, 193, 0.08),
    rgba(30, 136, 229, 0.08)
  );
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
  border-left: 4px solid var(--primary);
}

.preco {
  font-size: 42px;
  font-weight: 700;
  color: var(--primary);
}

.features-section {
  margin-bottom: 32px;
}

.features-section h2 {
  font-size: 20px;
  margin-bottom: 16px;
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
  font-weight: 500;
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
}

.sem-plano {
  text-align: center;
  padding: 48px 24px;
}

.link-voltar {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
</style>
