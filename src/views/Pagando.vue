<template>
  <div class="container">
    <div class="payment-wrapper">
      <div v-if="!pagamentoRealizado" class="payment-form">
        <div class="header">
          <router-link to="/visualizacao" class="voltar">← Voltar</router-link>
          <h1>Finalizar Pagamento</h1>
        </div>

        <div class="plano-resumo" v-if="plano">
          <h2>Resumo do Pedido</h2>
          <div class="resumo-item">
            <span class="label">Plano:</span>
            <span class="valor">{{ plano.nome }}</span>
          </div>
          <div class="resumo-item">
            <span class="label">Valor:</span>
            <span class="valor preco">{{ plano.preco }}</span>
          </div>
          <div class="resumo-item" v-if="plano.desconto">
            <span class="label">Desconto:</span>
            <span class="valor desconto">{{ plano.desconto }}</span>
          </div>
        </div>

        <form @submit.prevent="processarPagamento" class="form-pagamento">
          <div class="form-group">
            <label for="nome">Nome do Titular do Cartão</label>
            <input
              id="nome"
              v-model="formaPagamento.nome"
              type="text"
              placeholder="João Silva"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formaPagamento.email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="cartao">Número do Cartão</label>
            <input
              id="cartao"
              v-model="formaPagamento.cartao"
              type="text"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input="formatarCartao"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="validade">Data de Validade</label>
              <input
                id="validade"
                v-model="formaPagamento.validade"
                type="text"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatarValidade"
                required
              />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input
                id="cvv"
                v-model="formaPagamento.cvv"
                type="text"
                placeholder="123"
                maxlength="4"
                @input="apenasNumeros"
                required
              />
            </div>
          </div>

          <div v-if="erro" class="erro-message">
            {{ erro }}
          </div>

          <button type="submit" class="btn-pagar" :disabled="processando">
            <span v-if="!processando">Confirmar Pagamento</span>
            <span v-else>Processando...</span>
          </button>
        </form>
      </div>

      <div v-else class="sucesso-pagamento">
        <div class="checkmark">✓</div>
        <h1>Pagamento Realizado com Sucesso!</h1>
        <p>Obrigado por sua compra.</p>

        <div class="dados-confirmacao">
          <h2>Detalhes da Transação</h2>
          <div class="item">
            <span class="label">ID da Transação:</span>
            <span class="valor">{{ numeroTransacao }}</span>
          </div>
          <div class="item">
            <span class="label">Plano:</span>
            <span class="valor">{{ plano?.nome }}</span>
          </div>
          <div class="item">
            <span class="label">Valor Pago:</span>
            <span class="valor preco">{{ plano?.preco }}</span>
          </div>
          <div class="item">
            <span class="label">Data:</span>
            <span class="valor">{{ dataPagamento }}</span>
          </div>
          <div class="item">
            <span class="label">Cartão:</span>
            <span class="valor">{{ cartaoMascarado }}</span>
          </div>
        </div>

        <router-link to="/" class="btn-voltar">Voltar ao Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Plano {
  nome: string
  preco: string
  periodicidade: string
  features: string[]
  desconto?: string
  detalhesAdicionais: string[]
}

interface FormaPagamento {
  nome: string
  email: string
  cartao: string
  validade: string
  cvv: string
}

export default defineComponent({
  data() {
    return {
      plano: null as Plano | null,
      formaPagamento: {
        nome: '',
        email: '',
        cartao: '',
        validade: '',
        cvv: ''
      } as FormaPagamento,
      pagamentoRealizado: false,
      processando: false,
      erro: '',
      numeroTransacao: '',
      dataPagamento: '',
      cartaoMascarado: ''
    }
  },
  mounted() {
    const stored = localStorage.getItem('planoParaPagar')
    if (stored) {
      this.plano = JSON.parse(stored)
    }
  },
  methods: {
    formatarCartao(event: Event) {
      const input = event.target as HTMLInputElement
      let valor = input.value.replace(/\s/g, '')
      let formatado = ''
      for (let i = 0; i < valor.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatado += ' '
        }
        formatado += valor[i]
      }
      this.formaPagamento.cartao = formatado
    },
    formatarValidade(event: Event) {
      const input = event.target as HTMLInputElement
      let valor = input.value.replace(/\D/g, '')
      if (valor.length >= 2) {
        valor = valor.slice(0, 2) + '/' + valor.slice(2, 4)
      }
      this.formaPagamento.validade = valor
    },
    apenasNumeros(event: Event) {
      const input = event.target as HTMLInputElement
      input.value = input.value.replace(/\D/g, '')
    },
    validarFormulario(): boolean {
      this.erro = ''

      if (!this.formaPagamento.nome.trim()) {
        this.erro = 'Nome do titular é obrigatório'
        return false
      }

      if (!this.formaPagamento.email.includes('@')) {
        this.erro = 'Email inválido'
        return false
      }

      const cartaoNumeros = this.formaPagamento.cartao.replace(/\s/g, '')
      if (cartaoNumeros.length !== 16) {
        this.erro = 'Número do cartão deve ter 16 dígitos'
        return false
      }

      if (!this.formaPagamento.validade.match(/^\d{2}\/\d{2}$/)) {
        this.erro = 'Data de validade inválida (MM/YY)'
        return false
      }

      if (this.formaPagamento.cvv.length !== 3 && this.formaPagamento.cvv.length !== 4) {
        this.erro = 'CVV deve ter 3 ou 4 dígitos'
        return false
      }

      return true
    },
    processarPagamento() {
      if (!this.validarFormulario()) {
        return
      }

      this.processando = true

      // Simular processamento de pagamento (2 segundos)
      setTimeout(() => {
        // Gerar ID de transação
        this.numeroTransacao = 'TRX' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()

        // Formatar data
        const data = new Date()
        this.dataPagamento = data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR')

        // Mascarar cartão (mostrar apenas últimos 4 dígitos)
        const cartaoNumeros = this.formaPagamento.cartao.replace(/\s/g, '')
        this.cartaoMascarado = '**** **** **** ' + cartaoNumeros.slice(-4)

        // Salvar dados de pagamento no localStorage
        const dadosPagamento = {
          numeroTransacao: this.numeroTransacao,
          plano: this.plano,
          formaPagamento: {
            nome: this.formaPagamento.nome,
            email: this.formaPagamento.email,
            cartao: this.cartaoMascarado
          },
          dataPagamento: this.dataPagamento,
          valor: this.plano?.preco,
          status: 'concluído'
        }

        localStorage.setItem('ultimoPagamento', JSON.stringify(dadosPagamento))

        // Adicionar à histórico de pagamentos
        const historico = JSON.parse(localStorage.getItem('historicoPagamentos') || '[]')
        historico.push(dadosPagamento)
        localStorage.setItem('historicoPagamentos', JSON.stringify(historico))

        this.pagamentoRealizado = true
        this.processando = false
      }, 2000)
    }
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(30, 136, 229, 0.05));
  padding: 24px;
}

.payment-wrapper {
  max-width: 600px;
  margin: 0 auto;
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
  transition: transform 0.2s ease;
}

.voltar:hover {
  transform: translateX(-4px);
}

.header h1 {
  margin: 16px 0 0 0;
  font-size: 28px;
  color: var(--text-primary);
}

.plano-resumo {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(30, 136, 229, 0.1);
}

.plano-resumo h2 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.resumo-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--muted);
  font-weight: 500;
}

.valor {
  color: var(--text-primary);
  font-weight: 600;
}

.valor.preco {
  color: var(--primary);
  font-size: 18px;
}

.valor.desconto {
  color: #ff5a9e;
}

.form-pagamento {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(30, 136, 229, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
}

.form-group input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.erro-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  border-left: 4px solid #c33;
}

.btn-pagar {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pagar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
}

.btn-pagar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sucesso-pagamento {
  text-align: center;
  background: white;
  padding: 48px 24px;
  border-radius: 12px;
  border: 1px solid rgba(30, 136, 229, 0.1);
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.checkmark {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 48px;
  color: white;
  animation: popIn 0.5s ease;
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.sucesso-pagamento h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: var(--text-primary);
}

.sucesso-pagamento > p {
  color: var(--muted);
  margin-bottom: 32px;
}

.dados-confirmacao {
  background: rgba(30, 136, 229, 0.05);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: left;
}

.dados-confirmacao h2 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.dados-confirmacao .item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dados-confirmacao .item:last-child {
  border-bottom: none;
}

.btn-voltar {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.btn-voltar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
}
</style>