<template>
  <div>
    <h1>Produtos</h1>
    <div class="products">
      <div class="product card" v-for="p in produtos" :key="p.id">
        <img :src="p.imagem" :alt="p.nome" />
        <div style="font-weight:700">{{ p.nome }}</div>
        <div class="muted">R$ {{ p.preco.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { listarProdutos, Produto } from '@/services/produtoService'

export default defineComponent({
  setup() {
    const produtos = ref<Produto[]>([])

    onMounted(async () => {
      produtos.value = await listarProdutos()
    })

    return { produtos }
  }
})
</script>

<style scoped>
.muted{ color:var(--muted) }
</style>