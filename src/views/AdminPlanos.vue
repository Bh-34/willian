<template>
  <div class="admin-container">
    <div class="header">
      <h1>Painel Administrativo</h1>
      <button class="btn-primary" @click="showModal = true">
        + Criar Plano
      </button>
    </div>

    <div class="planos-grid">
    <div v-for="plano in planos" :key="plano.nome" class="plano-card">

  <h2 class="plano-titulo">{{ plano.nome }}</h2>

  <div class="plano-opcoes">

    <div v-if="plano.mensal" class="opcao">
      <h3>Mensal</h3>

      <div class="preco">
        R$ {{ plano.mensal.preco }}
      </div>

      <p>Status: 
        <span :class="plano.mensal.status ? 'ativo' : 'inativo'">
          {{ plano.mensal.status ? 'Ativo' : 'Inativo' }}
        </span>
      </p>

      <ul class="beneficios-lista" v-if="plano.mensal.beneficios">
        <li v-for="b in plano.mensal.beneficios" :key="b.chave">
          <span class="check">✓</span> {{ b.texto }}
        </li>
      </ul>
    </div>

    <div v-if="plano.anual" class="opcao destaque">
      <h3>Anual</h3>

      <div class="preco">
        R$ {{ plano.anual.preco }}
      </div>

      <p class="economia">Economize 20%</p>

      <p>Status: 
        <span :class="plano.anual.status ? 'ativo' : 'inativo'">
          {{ plano.anual.status ? 'Ativo' : 'Inativo' }}
        </span>
      </p>

      <ul class="beneficios-lista" v-if="plano.anual.beneficios">
        <li v-for="b in plano.anual.beneficios" :key="b.chave">
          <span class="check">✓</span> {{ b.texto }}
        </li>
      </ul>
    </div>

  </div>

  <button class="btn-toggle" @click="togglePlanoGrupo(plano)">
    {{ planoAtivo(plano) ? 'Desativar Plano' : 'Ativar Plano' }}
  </button>

</div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Criar Novo Plano</h2>

        <input v-model="novoPlano.nome" placeholder="Nome do Plano" />
        <input v-model.number="novoPlano.preco" type="number" placeholder="Preço" />
        <input v-model.number="novoPlano.limite_aulas_dia" type="number" placeholder="Limite de aulas por dia" />

        <label class="checkbox-pdf">
          <input type="checkbox" v-model="novoPlano.tem_pdf" />
          Permite baixar PDFs
        </label>

        <label class="checkbox-professor">
          <input type="checkbox" v-model="permiteProfessor" />
          Permite se tornar Professor
        </label>

        <h3>Benefícios</h3>
        <div
          v-for="(beneficio, index) in novoPlano.beneficios"
          :key="index"
          class="beneficio-item"
        >
          <input v-model="beneficio.chave" placeholder="Chave (ex: pdf)" />
          <input v-model="beneficio.texto" placeholder="Texto do benefício" />
          <input v-model.number="beneficio.valor" type="number" placeholder="Valor" />
          <button class="btn-remove" @click="removerBeneficio(index)">X</button>
        </div>

        <button class="btn-secondary" @click="adicionarBeneficio">
          + Adicionar Benefício
        </button>

        <div class="modal-actions">
          <button class="btn-primary" @click="criarPlano">
            Salvar
          </button>
          <button class="btn-cancel" @click="showModal = false">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from '@/services/api'

const planos = ref([])
const showModal = ref(false)
const permiteProfessor = ref(false)

const novoPlano = ref({
  nome: "",
  preco: 0,
  duracao: "mensal",
  dias_validade: 30,
  limite_aulas_dia: 1,
  tem_pdf: false, 
  beneficios: [
    { chave: "", texto: "", valor: 1 }
  ]
})
function planoAtivo(plano) {
  return (
    (plano.mensal && plano.mensal.status) ||
    (plano.anual && plano.anual.status)
  )
}

async function togglePlanoGrupo(plano) {

  const ids = []

  if (plano.mensal) ids.push(plano.mensal.id)
  if (plano.anual) ids.push(plano.anual.id)

  await api.patch('/admin/planos/toggle-grupo', {
    ids
  })

  carregarPlanos()
}
function resetForm() {
  novoPlano.value = {
    nome: "",
    preco: 0,
    duracao: "mensal",
    dias_validade: 30,
    limite_aulas_dia: 1,
    tem_pdf: false,
    beneficios: [{ chave: "", texto: "", valor: 1 }]
  }
  permiteProfessor.value = false
}

function adicionarBeneficio() {
  novoPlano.value.beneficios.push({ chave: "", texto: "", valor: 1 })
}

function removerBeneficio(index) {
  novoPlano.value.beneficios.splice(index, 1)
}

async function carregarPlanos() {
  const res = await api.get('/admin/planos')
  agruparPlanos(res.data)
}

function agruparPlanos(lista) {
  const agrupados = {}
  lista.forEach(plano => {
    const nomeBase = plano.nome.replace(" Mensal", "").replace(" Anual", "")
    if (!agrupados[nomeBase]) agrupados[nomeBase] = { nome: nomeBase, mensal: null, anual: null }
    if (plano.duracao === "mensal") agrupados[nomeBase].mensal = plano
    if (plano.duracao === "anual") agrupados[nomeBase].anual = plano
  })
  planos.value = Object.values(agrupados)
}

async function criarPlano() {
  if (permiteProfessor.value) {
    novoPlano.value.beneficios.push({
      chave: "professor",
      texto: "Pode se tornar professor",
      valor: 1
    })
  }

  await api.post('/planos', novoPlano.value)
  showModal.value = false
  resetForm()
  carregarPlanos()
}

async function togglePlano(id) {
  await api.patch(`/planos/${id}/toggle`, {})
  carregarPlanos()
}

onMounted(() => carregarPlanos())
</script>

<style scoped>
.admin-container {
  padding: 40px;
  background: #f5f7fa;
  min-height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
.planos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.plano-opcoes {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}
.inativo {
  color: #ef4444;
  font-weight: bold;
}
.opcao {
  flex: 1;
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
}
.plano-titulo {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
}
.preco {
  font-size: 1.6rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 10px;
}
.beneficios-lista li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: #374151;
}

.beneficios-lista {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.destaque {
  border: 2px solid #2563eb;
}
.economia {
  color: #16a34a;
  font-weight: bold;
}
.plano-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}
.plano-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}
.ativo {
  color: #16a34a;
  font-weight: bold;
}
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.btn-toggle:hover {
  background: #1d4ed8;
}
.btn-toggle {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}
.btn-secondary {
  background: #e5e7eb;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  margin-top: 10px;
}
.btn-cancel {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}
.opcao {
  flex: 1;
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  transition: 0.3s ease;
}
.opcao:hover {
  background: #f3f4f6;
}

.modal input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.beneficio-item {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}
.btn-remove {
  background: red;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.checkbox-pdf, .checkbox-professor {
  display: block;
  margin: 8px 0;
}
.check {
  color: #16a34a;
  font-weight: bold;
}
</style>