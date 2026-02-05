 <template>
  <div>
    <div class="card">
      <h1>Dashboard</h1>
      <p class="muted">Visão geral da loja — Escolha seu plano</p>
    </div>

    <section class="plans-grid" aria-label="Planos de cursos">
      <!-- Plano Básico -->
      <div class="plan basic card">
        <header>
          <h2>Plano Básico</h2>
          <span class="tag">Iniciante</span>
        </header>
        <p class="price">R$ 29,90 <span class="per">/ mês</span></p>
        <ul class="features">
          <li>✓ 3 aulas por dia</li>
          <li>✓ 5 cursos</li>
          <li>✓ Certificados</li>
          <li>✓ Suporte por email</li>
        </ul>
        <button class="btn primary" @click="selecionarPlano(planoBasico)">Assinar</button>
      </div>

      <!-- Plano Premium -->
      <div class="plan premium card">
        <header>
          <h2>Plano Premium</h2>
          <span class="tag premium-tag">Recomendado</span>
        </header>
        <p class="price">R$ 99,90 <span class="per">/ mês</span></p>
        <ul class="features">
          <li>✓ Aulas ilimitadas</li>
          <li>✓ Cursos ilimitados</li>
          <li>✓ Acesso a apostilas</li>
          <li>✓ Suporte 24/7</li>
        </ul>
        <button class="btn primary" @click="selecionarPlano(planoPremium)">Assinar</button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '@/services/authService'

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

    const selecionarPlano = (plano: Plano) => {
      // Verificar se está autenticado
      if (!isAuthenticated()) {
        router.push({ name: 'Login', query: { redirect: '/dashboard' } })
        return
      }

      // Salvar o plano selecionado para levar para a página de pagamento
      localStorage.setItem('planoParaPagar', JSON.stringify(plano))
      router.push('/pagando')
    }

    return {
      selecionarPlano,
      planoBasico: {
        nome: 'Plano Básico',
        preco: 'R$ 29,90',
        periodicidade: 'mês',
        features: ['3 aulas por dia', '5 cursos', 'Certificados', 'Suporte por email'],
        detalhesAdicionais: [
          'Acesso a 30 aulas por mês',
          'Certificado por curso completado',
          'Suporte por email',
          'Comunidade exclusiva'
        ]
      } as Plano,
      planoPremium: {
        nome: 'Plano Premium',
        preco: 'R$ 99,90',
        periodicidade: 'mês',
        features: ['Aulas ilimitadas', 'Cursos ilimitados', 'Acesso a apostilas', 'Suporte 24/7'],
        detalhesAdicionais: [
          'Aulas em tempo real com instrutores',
          'Acesso a apostilas em PDF',
          'Certificados de conclusão',
          'Suporte prioritário 24/7',
          'Fórum de discussão exclusivo',
          'Acesso a webinars semanais'
        ]
      } as Plano
    }
  }
})
</script>

<style scoped>
:root {
  --primary: #1e88e5;
  --muted: #6b7280;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #111827;
}

.muted {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.plan {
  padding: 18px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  background: white;
}

.plan:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
}

.plan header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
}

.plan h2 {
  margin: 0;
  font-size: 18px;
  color: #111827;
  font-weight: 600;
}

.tag {
  background: rgba(0, 0, 0, 0.06);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}

.tag.premium-tag {
  background: #e3f2fd;
  color: var(--primary);
}

.price {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.per {
  color: var(--muted);
  font-weight: 500;
  margin-left: 6px;
  font-size: 14px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 6px 0 0 0;
  color: var(--muted);
  font-size: 14px;
}

.features li {
  margin: 6px 0;
}

.btn {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: transparent;
  font-weight: 700;
  margin-top: auto;
  width: 100%;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
}

.basic {
  border: 1px solid rgba(30, 136, 229, 0.08);
}

.premium {
  border: 1px solid rgba(107, 70, 193, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.98));
}

@media (max-width: 700px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
