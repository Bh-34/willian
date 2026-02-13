<template>
  <div class="container" v-if="aula">
    <router-link
      :to="`/cursos`"
      class="voltar"
    >
      ← Voltar para o curso
    </router-link>

    <!-- VIDEO -->
   <div class="video-wrapper" v-if="aula.video_url">
  <iframe
    :src="videoEmbedUrl"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

    <!-- PDF -->
    <a
      v-if="aula.tem_pdf && aula.pdf_url"
      :href="aula.pdf_url"
      target="_blank"
      class="btn pdf"
    >
      Baixar material em PDF
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'



export default defineComponent({
  setup() {
       const router = useRouter()
    const route = useRoute()
    const aula = ref<any>(null)

    onMounted(async () => {
      const id = route.params.id
      const response = await api.get(`/aulas/${id}`)
      aula.value = response.data
    })

const videoEmbedUrl = computed(() => {
  if (!aula.value?.video_url) return ''

  // youtube padrão
  if (aula.value.video_url.includes('watch?v=')) {
    return aula.value.video_url.replace('watch?v=', 'embed/')
  }

  // youtu.be
  if (aula.value.video_url.includes('youtu.be')) {
    const id = aula.value.video_url.split('/').pop()
    return `https://www.youtube.com/embed/${id}`
  }

  return aula.value.video_url
})
    

    return { aula, videoEmbedUrl  }
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
  position: relative;
  padding-top: 56.25%; /* 16:9 */
  border-radius: 12px;
  overflow: hidden;
  background: black;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
