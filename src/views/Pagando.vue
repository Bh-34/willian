<template>
  <div class="pagando-container">
    <button class="btn voltar" @click="voltar">Voltar</button>
    <h1>Pagamento</h1>
    <div class="choose-method">
      <button :class="{ active: metodo === 'pix' }" @click="metodo = 'pix'">Pix</button>
      <button :class="{ active: metodo === 'cartao' }" @click="metodo = 'cartao'">Cartão</button>
    </div>
    <div v-if="metodo === 'pix'" class="pix-form">
      <h2>Pague com Pix</h2>
      <p>Escaneie o QR Code ou copie o código abaixo:</p>
      <div class="pix-code-box">
        <input type="text" :value="pixCode" readonly />
        <button @click="copiarPix">Copiar código</button>
      </div>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={{pixCode}}" alt="QR Code Pix" />
    </div>
    <div v-else-if="metodo === 'cartao'" class="cartao-form">
      <h2>Pague com Cartão</h2>
      <form @submit.prevent="comprarCartao">
        <div class="form-group">
          <label>Nome do Titular</label>
          <input type="text" v-model="cartao.nome" required />
        </div>
        <div class="form-group">
          <label>CPF do Titular</label>
          <input type="text" v-model="cartao.cpf" maxlength="14" required />
        </div>
        <div class="form-group">
          <label>Número do Cartão</label>
          <input type="text" v-model="cartao.numero" maxlength="16" required />
        </div>
        <div class="form-group">
          <label>Validade</label>
          <input type="text" v-model="cartao.validade" placeholder="MM/AA" required />
        </div>
        <div class="form-group">
          <label>CVV</label>
          <input type="text" v-model="cartao.cvv" maxlength="4" required />
        </div>
        <div class="form-group">
          <label>Parcelamento</label>
          <select v-model="cartao.parcelas">
            <option v-for="p in parcelasOpcoes" :key="p" :value="p">{{ p }}x de R$ {{ (valorBase / p).toFixed(2) }}</option>
          </select>
        </div>
        <div class="resumo-parcela">
          <strong>Total:</strong> R$ {{ valorBase.toFixed(2) }}<br>
          <span v-if="cartao.parcelas > 1">({{ cartao.parcelas }}x de R$ {{ valorParcela }})</span>
        </div>
        <button type="submit" class="btn primary">Finalizar Compra</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const metodo = ref('');
const pixCode = '00020126580014BR.GOV.BCB.PIX0136b1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9w52040000530398654041.005802BR5920NOME DO RECEBEDOR6009SAO PAULO62070503***6304ABCD';
function copiarPix() {
  navigator.clipboard.writeText(pixCode);
  alert('Código Pix copiado!');
}
const cartao = ref({
  numero: '',
  validade: '',
  cvv: '',
  nome: '',
  cpf: '',
  parcelas: 1
});
const parcelasOpcoes = [1, 2, 3, 6, 12];
const valorBase = computed(() => {
  // valor do plano selecionado
  const plano = route.query.plano === 'premium' ? 79.90 : 29.90;
  if (route.query.tipo === 'anual') {
    return plano * 12 * 0.9;
  }
  return plano;
});
const valorParcela = computed(() => {
  return (valorBase.value / cartao.value.parcelas).toFixed(2);
});
function comprarCartao() {
  alert('Compra realizada com cartão!');
  cartao.value = { numero: '', validade: '', cvv: '', nome: '', cpf: '', parcelas: 1 };
}
function voltar() {
  router.back();
}
</script>

<style scoped>
.pagando-container {
  max-width: 520px;
  margin: 48px auto;
  padding: 40px 32px 32px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  position: relative;
}
.btn.voltar {
  position: absolute;
  left: 32px;
  top: 24px;
  background: #e5e7eb;
  color: #111827;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
}
.btn.voltar:hover {
  background: #d1d5db;
}
.choose-method {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.choose-method button {
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background: #f9f9f9;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  font-size: 16px;
}
.choose-method button.active {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: #fff;
  border-color: #6b46c1;
}
.pix-form, .cartao-form {
  margin-top: 20px;
}
.pix-code-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.pix-code-box input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 15px;
}
.pix-code-box button {
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  background: #e5e7eb;
  font-weight: 600;
  cursor: pointer;
}
.cartao-form .form-group {
  margin-bottom: 18px;
}
.cartao-form label {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  display: block;
}
.cartao-form input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 15px;
}
.resumo-parcela {
  margin-bottom: 12px;
  font-size: 15px;
  color: #333;
}
.cartao-form select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 15px;
}
.btn.primary {
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  border: none;
  padding: 12px 0;
  border-radius: 8px;
  font-weight: 700;
  width: 100%;
  margin-top: 16px;
  font-size: 16px;
}
</style>