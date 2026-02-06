<template>
  <div class="container" v-if="curso">
    <h1>{{ curso.titulo }}</h1>
    <p class="muted">{{ curso.descricao }}</p>

    <div
      v-for="modulo in curso.modulos"
      :key="modulo.id"
      class="modulo"
    >
      <h2>{{ modulo.titulo }}</h2>

      <ul>
        <li
          v-for="aula in modulo.aulas"
          :key="aula.id"
          @click="abrirAula(aula)"
        >
          ▶ {{ aula.titulo }}
          <span v-if="aula.tem_pdf">📄</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useUser } from '@/services/authService'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const user = useUser()

    const curso = ref<any>(null)

    async function carregarCurso() {
      if (!user.value?.plano) {
        router.push('/')
        return
      }

      const response = await api.get(`/cursos/${route.params.id}`)
      curso.value = response.data
    }

    function abrirAula(aula: any) {
  router.push({ name: 'aula', params: { id: aula.id } })
}

    onMounted(carregarCurso)

    return { curso, abrirAula }
  }
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 6px;
}

.muted {
  color: var(--muted);
  margin-bottom: 24px;
}

/* ===== MÓDULO ===== */
.modulo {
  background: white;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
  border: 1px solid rgba(0,0,0,0.06);
}

.modulo h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

/* ===== AULAS ===== */
.modulo ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modulo li {
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background .2s ease, transform .15s ease;
}

.modulo li:not(:last-child) {
  margin-bottom: 6px;
}

.modulo li:hover {
  background: rgba(30,136,229,0.08);
  transform: translateX(4px);
}

.modulo li span {
  font-size: 16px;
}

</style>