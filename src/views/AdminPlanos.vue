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

  <h2>{{ plano.nome }}</h2>

  <div class="plano-opcoes">

    <div v-if="plano.mensal" class="opcao">
      <h3>Mensal</h3>
      <p>R$ {{ plano.mensal.preco }}</p>
      <p>Status: 
        <span :class="plano.mensal.status ? 'ativo' : 'inativo'">
          {{ plano.mensal.status ? 'Ativo' : 'Inativo' }}
        </span>
      </p>

      <button @click="togglePlano(plano.mensal.id)">
        {{ plano.mensal.status ? 'Desativar' : 'Ativar' }}
      </button>
    </div>

    <div v-if="plano.anual" class="opcao destaque">
      <h3>Anual</h3>
      <p>R$ {{ plano.anual.preco }}</p>
      <p class="economia">Economize 20%</p>
      <p>Status: 
        <span :class="plano.anual.status ? 'ativo' : 'inativo'">
          {{ plano.anual.status ? 'Ativo' : 'Inativo' }}
        </span>
      </p>

      <button @click="togglePlano(plano.anual.id)">
        {{ plano.anual.status ? 'Desativar' : 'Ativar' }}
      </button>
    </div>

  </div>

</div>

      </div>
  
      <!-- MODAL -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Criar Novo Plano</h2>
  
          <input v-model="novoPlano.nome" placeholder="Nome do Plano" />
          <input v-model="novoPlano.preco" type="number" placeholder="Preço" />

  
          <input
            v-model="novoPlano.limite_aulas_dia"
            type="number"
            placeholder="Limite de aulas por dia"
          />
  
          <h3>Benefícios</h3>
  
          <div
            v-for="(beneficio, index) in novoPlano.beneficios"
            :key="index"
            class="beneficio-item"
          >
            <input v-model="beneficio.chave" placeholder="Chave (ex: pdf)" />
            <input v-model="beneficio.texto" placeholder="Texto do benefício" />
            <input
              v-model="beneficio.valor"
              type="number"
              placeholder="Valor"
            />
  
            <button
              class="btn-remove"
              @click="removerBeneficio(index)"
            >
              X
            </button>
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
import axios from "axios"

const planos = ref([])
const showModal = ref(false)
const token = localStorage.getItem("token")

const novoPlano = ref({
  nome: "",
  preco: "",
  duracao: "mensal",
  dias_validade: 30,
  limite_aulas_dia: 1,
  beneficios: [
    {
      chave: "",
      texto: "",
      valor: 1
    }
  ]
})

function resetForm() {
  novoPlano.value = {
    nome: "",
    preco: "",
    duracao: "mensal",
    dias_validade: 30,
    limite_aulas_dia: 1,
    beneficios: [
      {
        chave: "",
        texto: "",
        valor: 1
      }
    ]
  }
}

function adicionarBeneficio() {
  novoPlano.value.beneficios.push({
    chave: "",
    texto: "",
    valor: 1
  })
}

function removerBeneficio(index) {
  novoPlano.value.beneficios.splice(index, 1)
}

async function carregarPlanos() {
  const res = await axios.get(
    "http://localhost:8000/api/admin/planos",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  agruparPlanos(res.data)
}

function agruparPlanos(lista) {
  const agrupados = {}

  lista.forEach(plano => {
    const nomeBase = plano.nome
      .replace(" Mensal", "")
      .replace(" Anual", "")

    if (!agrupados[nomeBase]) {
      agrupados[nomeBase] = {
        nome: nomeBase,
        mensal: null,
        anual: null
      }
    }

    if (plano.duracao === "mensal") {
      agrupados[nomeBase].mensal = plano
    }

    if (plano.duracao === "anual") {
      agrupados[nomeBase].anual = plano
    }
  })

  planos.value = Object.values(agrupados)
}


async function criarPlano() {
  await axios.post(
    "http://localhost:8000/api/planos",
    novoPlano.value,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  showModal.value = false
  resetForm()
  carregarPlanos()
}

async function togglePlano(id) {
  await axios.patch(
    `http://localhost:8000/api/planos/${id}/toggle`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  carregarPlanos()
}

onMounted(() => {
  carregarPlanos()
})
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

.opcao {
  flex: 1;
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
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
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: #e5e7eb;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  margin-top: 10px;
}

.btn-toggle {
  margin-top: 10px;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #111827;
  color: white;
}

.btn-cancel {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
}

.ativo {
  color: green;
  font-weight: bold;
}

.inativo {
  color: red;
  font-weight: bold;
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

.modal input,
.modal select {
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
</style>
