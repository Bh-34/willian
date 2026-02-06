<template>
  <div class="container" v-if="aula">
    <router-link
      :to="`/cursos`"
      class="voltar"
    >
      ← Voltar para o curso
    </router-link>

    <h1>{{ aula.titulo }}</h1>
    <p class="muted">{{ aula.descricao }}</p>

    <!-- VIDEO -->
    <div class="video-wrapper">
      <video
        v-if="aula.video_url"
        controls
        controlsList="nodownload"
      >
        <source :src="aula.video_url" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    </div>

    <!-- PDF -->
    <a
      v-if="aula.tem_pdf && aula.pdf_url"
      :href="aula.pdf_url"
      target="_blank"
      class="btn pdf"
    >
      📄 Baixar material em PDF
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

export default defineComponent({
  setup() {
    const route = useRoute()
    const aula = ref<any>(null)

    onMounted(async () => {
      const id = route.params.id
      const response = await api.get(`/aulas/${id}`)
      aula.value = response.data
    })

    return { aula }
  }
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.voltar {
  display: inline-block;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}

h1 {
  margin-bottom: 8px;
}

.video-wrapper {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: black;
}

video {
  width: 100%;
  max-height: 520px;
}

.btn.pdf {
  display: inline-block;
  padding: 12px 18px;
  background: linear-gradient(90deg, var(--primary), #6b46c1);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
}

.muted {
  color: var(--muted);
}
</style>
