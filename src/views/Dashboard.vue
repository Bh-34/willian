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
          <span class="tag"></span>
        </header>
        <p class="price">R$ 29,90 <span class="per"> </span></p>
        <ul class="features">
          <li>3 aulas por dia</li>
          <li>5 cursos</li>
        </ul>
        <button class="btn primary" @click="irParaVisualizacao('basicoMensal')">Assinar</button>
      </div>

      

     
      <div class="plan premium card">
        <header>
          <h2>Plano Premium</h2>
          <span class="tag"></span>
        </header>
        <p class="price">R$ 99,90 <span class="per"> </span></p>
        <ul class="features">
          <li>Aulas ilimitadas</li>
          <li>Cursos ilimitados</li>
          <li>Acesso a apostilas</li>
        </ul>
        <button class="btn primary" @click="irParaVisualizacao('premiumMensal')">Assinar</button>
      </div>

     
    </section>
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

    const planos: Record<string, Plano> = {
      basicoMensal: {
        nome: 'Plano Básico — Mensal',
        preco: 'R$ 29,90',
        periodicidade: 'por mês',
        features: ['3 aulas por dia', '5 cursos'],
        detalhesAdicionais: [
          'Acesso a 30 aulas por mês',
          'Certificado por curso completado',
          'Suporte por email',
          'Duração: 30 dias'
        ]
      },
      basicoAnual: {
        nome: 'Plano Básico — Anual',
        preco: 'R$ 299,00',
        periodicidade: 'por ano',
        features: ['6 aulas por dia', 'Acesso a 8 cursos'],
        desconto: '20% OFF',
        detalhesAdicionais: [
          'Acesso a 180 aulas por ano',
          'Certificado por curso completado',
          'Suporte por email e chat',
          'Duração: 365 dias',
          'Economia de R$ 74,80 comparado com plano mensal'
        ]
      },
      premiumMensal: {
        nome: 'Plano Premium — Mensal',
        preco: 'R$ 79,90',
        periodicidade: 'por mês',
        features: ['Aulas ilimitadas', 'Cursos ilimitados', 'Acesso a apostilas'],
        detalhesAdicionais: [
          'Aulas em tempo real com instrutores',
          'Acesso a apostilas em PDF',
          'Certificados de conclusão',
          'Suporte prioritário 24/7',
          'Fórum de discussão exclusivo',
          'Acesso a webinars semanais'
        ]
      },
      premiumAnual: {
        nome: 'Plano Premium — Anual',
        preco: 'R$ 599,00',
        periodicidade: 'por ano',
        features: ['Aulas ilimitadas', 'Cursos ilimitados', 'Acesso a apostilas'],
        desconto: '40% OFF',
        detalhesAdicionais: [
          'Aulas em tempo real com instrutores',
          'Acesso a apostilas em PDF',
          'Certificados de conclusão',
          'Suporte prioritário 24/7',
          'Fórum de discussão exclusivo',
          'Acesso a webinars semanais',
          'Duração: 365 dias',
          'Economia de R$ 360,80 comparado com plano mensal'
        ]
      }
    }

    const irParaVisualizacao = (chave: string) => {
      const plano = planos[chave]
      sessionStorage.setItem('planoSelecionado', JSON.stringify(plano))
      router.push('/visualizacao')
    }

    return {
      irParaVisualizacao
    }
  }
})
</script>

<style scoped>
.plans-grid{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap:16px;
  margin-top:16px;
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


.plan .btn { margin-top: auto }

.basic{ border:1px solid rgba(30,136,229,0.08) }
.premium{ border:1px solid rgba(107,70,193,0.08); background:linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98)) }


@media (max-width:700px){
  .plans-grid{ grid-template-columns: 1fr }
}

.muted{ color:var(--muted) }
</style>
