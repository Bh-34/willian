<template>
  <div class="container" v-if="aula">
    <div class="header-aula">
      <button @click="$router.back()" class="voltar">
        ← Voltar para o curso
      </button>

      <button 
        @click="toggleConcluir" 
        :class="['btn-concluir', { 'is-concluido': concluida }]"
      >
        {{ concluida ? '✅ Aula Concluída' : 'Marcar como Concluída' }}
      </button>
    </div>

    <h1>{{ aula.titulo }}</h1>

    <div v-if="isYoutube" class="video-wrapper">
      <iframe
        :src="videoEmbedUrl"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <div v-else-if="aula.video_url" class="video-wrapper">
      <video controls :key="aula.video_url">
        <source :src="videoUrlCompleta" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    </div>

    <div class="footer-actions">
      <a
        v-if="aula.tem_pdf && aula.pdf_url"
        :href="pdfUrlCompleta"
        target="_blank"
        class="btn pdf"
      >
        📄 Baixar material em PDF
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import api from "@/services/api"

const route = useRoute()
const aula = ref<any>(null)
const concluida = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get(`/aulas/${route.params.id}`)
    aula.value = data
    concluida.value = data.foi_concluida // O Laravel deve enviar este campo
  } catch (error) {
    console.error("Erro ao carregar aula", error)
  }
})

const toggleConcluir = async () => {
  try {
    const { data } = await api.post(`/aulas/${aula.value.id}/concluir`);
    concluida.value = data.concluido;
  } catch (error) {
    console.error("Erro ao marcar conclusão", error);
  }
};

const isYoutube = computed(() => {
  if (!aula.value?.video_url) return false
  return (
    aula.value.video_url.includes("youtube.com") ||
    aula.value.video_url.includes("youtu.be")
  )
})

const videoUrlCompleta = computed(() => {
  if (!aula.value?.video_url) return ""
  return `http://localhost:8000/storage/${aula.value.video_url}`
})

const pdfUrlCompleta = computed(() => {
  if (!aula.value?.pdf_url) return ""
  return `http://localhost:8000/storage/${aula.value.pdf_url}`
})

const videoEmbedUrl = computed(() => {
  if (!aula.value?.video_url) return ""
  if (aula.value.video_url.includes("watch?v=")) {
    return aula.value.video_url.replace("watch?v=", "embed/")
  }
  if (aula.value.video_url.includes("youtu.be")) {
    const id = aula.value.video_url.split("/").pop()
    return `https://www.youtube.com/embed/${id}`
  }
  return aula.value.video_url
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.header-aula {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.voltar {
  font-weight: 600;
  color: #64748b;
  border: none;
  background: none;
  cursor: pointer;
  transition: 0.2s;
}

.voltar:hover { color: #3b82f6; }

.btn-concluir {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #3b82f6;
  background: transparent;
  color: #3b82f6;
}

.btn-concluir.is-concluido {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.video-wrapper {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: black;
  aspect-ratio: 16/9;
}

.video-wrapper iframe,
.video-wrapper video {
  width: 100%;
  height: 100%;
}

.btn.pdf {
  display: inline-block;
  padding: 12px 18px;
  background: #ef4444;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: 0.2s;
}

.btn.pdf:hover { background: #dc2626; }
</style>