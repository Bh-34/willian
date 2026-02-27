<template>
  <div class="dashboard">
    <section class="header-section">
      <div class="header-content">
        <div>
          <h1>🎓 Painel do Professor</h1>
          <p class="muted">
            Gerencie seus cursos de forma organizada e profissional.
          </p>
        </div>
        <button class="btn white-btn" @click="abrirModalCurso()">
          + Criar Novo Curso
        </button>
      </div>
    </section>

    <div class="branco">
      <section class="section">
        <div class="section-header">
          <h2>Seus Cursos</h2>
          <p class="muted">
            Acompanhe o conteúdo e as aulas de cada curso criado.
          </p>
        </div>

        <div v-if="cursos.length > 0" class="courses-grid">
          <div v-for="curso in cursos" :key="curso.id" class="course-card-new">
            <div class="course-info">
              <div class="course-title-area">
                <h3>{{ curso.titulo }}</h3>
                <span class="badge"
                  >{{ curso.modulos?.length || 0 }} Módulos</span
                >
              </div>
              <p class="course-desc">{{ curso.descricao }}</p>
            </div>

            <div class="course-actions">
              <button
                class="btn secondary small-btn"
                @click="abrirModalModulo(curso)"
              >
                📦 Módulos
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Você ainda não criou nenhum curso.</p>
          <button class="btn primary mt-2" @click="abrirModalCurso()">
            Criar meu primeiro curso
          </button>
        </div>
      </section>
    </div>

    <div v-if="modalCurso" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Novo Curso</h3>
      <button @click="modalCurso = false" class="close-btn">&times;</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Título do Curso</label>
        <input class="custom-input" v-model="novoCurso.titulo" placeholder="Ex: Masterclass de Vue 3" />
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea class="custom-input textarea" v-model="novoCurso.descricao" placeholder="O que os alunos vão aprender?"></textarea>
      </div>

      <div class="form-group">
        <label>Capa do Curso</label>
        <input type="file" @change="handleCapaUpload" class="custom-input" accept="image/*" />
        
        <div v-if="capaPreview" class="preview-container">
          <img :src="capaPreview" class="capa-preview-img" />
          <p class="small-text muted">Esta será a imagem do card</p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn outline" @click="modalCurso = false">Cancelar</button>
      <button class="btn primary" @click="criarCurso">Salvar Curso</button>
    </div>
  </div>
</div>

    <div v-if="modalModulo" class="modal-overlay">
      <div class="modal-content large">
        <div class="modal-header">
          <h3>Módulos de: {{ cursoSelecionado.titulo }}</h3>
          <button @click="modalModulo = false" class="close-btn">
            &times;
          </button>
        </div>
        <div class="modal-body scrollable">
          <div class="add-module-box">
            <input
              class="custom-input"
              v-model="nomeNovoModulo"
              placeholder="Nome do novo módulo"
            />
            <button class="btn secondary" @click="criarModulo">
              Adicionar Módulo
            </button>
          </div>

          <div
            v-for="modulo in cursoSelecionado.modulos"
            :key="modulo.id"
            class="modulo-item-list"
          >
            <div class="modulo-item-header">
              <h4>📚 {{ modulo.titulo }}</h4>
              <button
                class="btn primary small-btn"
                @click="prepararNovaAula(modulo)"
              >
                + Aula
              </button>
            </div>

            <div v-if="moduloIdParaAula === modulo.id" class="form-nova-aula">
              <div class="inline-inputs">
                <input
                  class="custom-input"
                  v-model="novaAula.titulo"
                  placeholder="Título da aula"
                />
                <input
                  class="custom-input small-input"
                  v-model="novaAula.duracao"
                  type="number"
                  placeholder="Min"
                />
              </div>
              <div class="file-row">
                <label
                  >Vídeo:
                  <input
                    type="file"
                    @change="(e) => (novaAula.video = e.target.files[0])"
                /></label>
                <label>
                  <input type="checkbox" v-model="novaAula.tem_pdf" /> Tem PDF?
                </label>
              </div>
              <input
                v-if="novaAula.tem_pdf"
                type="file"
                @change="(e) => (novaAula.pdf = e.target.files[0])"
                class="mt-1"
              />

              <div class="form-actions mt-1">
                <button
                  class="btn primary small-btn"
                  @click="criarAula(modulo)"
                >
                  Salvar Aula
                </button>
                <button
                  class="btn outline small-btn"
                  @click="moduloIdParaAula = null"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <ul class="aulas-mini-list">
              <li v-for="aula in modulo.aulas" :key="aula.id">
                <span>▶ {{ aula.titulo }}</span>
                <span class="muted small-text"
                  >{{ aula.duracao }}min | 👁️ {{ aula.views || 0 }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";

const cursos = ref([]);
const modalCurso = ref(false);
const modalModulo = ref(false);

const cursoSelecionado = ref(null);
const nomeNovoModulo = ref("");
const moduloIdParaAula = ref(null);

const capaPreview = ref(null); 
const novoCurso = ref({ titulo: "", descricao: "", capa: null });
const novaAula = ref({
  titulo: "",
  duracao: "",
  video: null,
  pdf: null,
  tem_pdf: false,
});

const carregarCursos = async () => {
  const { data } = await api.get("/meus-cursos");
  cursos.value = data;
};

const abrirModalCurso = () => {
  novoCurso.value = { titulo: "", descricao: "", capa: null };
  modalCurso.value = true;
};



const abrirModalModulo = (curso) => {
  cursoSelecionado.value = curso;
  modalModulo.value = true;
};

const prepararNovaAula = (modulo) => {
  moduloIdParaAula.value = modulo.id;
  novaAula.value = {
    titulo: "",
    duracao: "",
    video: null,
    pdf: null,
    tem_pdf: false,
  };
};

const handleCapaUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    novoCurso.value.capa = file;
    capaPreview.value = URL.createObjectURL(file);
  }
};

const criarCurso = async () => {
  const formData = new FormData();
  formData.append("titulo", novoCurso.value.titulo);
  formData.append("descricao", novoCurso.value.descricao);

  if (novoCurso.value.capa) {
    formData.append("capa", novoCurso.value.capa);
  }

  try {
    const { data } = await api.post("/cursos", formData);

    cursos.value.push({
      ...data,
      modulos: [],
    });

    novoCurso.value = { titulo: "", descricao: "", capa: null };
    capaPreview.value = null; 
    modalCurso.value = false;

    alert("Curso criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    alert("Erro ao criar curso. Verifique os dados.");
  }
};

const criarModulo = async () => {
  const { data } = await api.post("/modulos", {
    curso_id: cursoSelecionado.value.id,
    titulo: nomeNovoModulo.value,
  });
  cursoSelecionado.value.modulos.push({ ...data, aulas: [] });
  nomeNovoModulo.value = "";
};

const criarAula = async (modulo) => {
  const formData = new FormData();
  formData.append("modulo_id", modulo.id);
  formData.append("titulo", novaAula.value.titulo);
  formData.append("duracao", novaAula.value.duracao || 0);
  formData.append("tem_pdf", novaAula.value.tem_pdf ? 1 : 0);
  if (novaAula.value.video) formData.append("video_url", novaAula.value.video);
  if (novaAula.value.pdf) formData.append("pdf_url", novaAula.value.pdf);

  const { data } = await api.post("/aulas", formData);
  modulo.aulas.push(data);
  moduloIdParaAula.value = null;
};

onMounted(carregarCursos);
</script>

<style scoped>
:root {
  --primary: #3b82f6;
  --secondary: #0f172a;
  --bg: #f8fafc;
  --border: #e2e8f0;
}

.dashboard {
  max-width: 1400px;
  margin: 2rem auto;
}

.header-section {
  background:var(--primary);
  color: white;
  padding: 3rem 2rem;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
}
.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-container {
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  padding: 5px;
  border-radius: 8px;
  background: #f8fafc;
  text-align: center;
}

.capa-preview-img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 6px;
}
.header-content h1 {
  color: white;
  margin: 0;
}
.white-btn {
  background: white;
  color: #3b82f6;
  font-weight: bold;
}

/* CORPO */
.branco {
  background: #f8fafc;
  padding: 3rem 2rem;
  border-radius: 0 0 20px 20px;
  margin-top: -20px;
}

/* GRID DE CURSOS */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}
.course-card-new {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
}

/* MODAIS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.modal-content.large {
  max-width: 800px;
  max-height: 90vh;
}
.scrollable {
  overflow-y: auto;
  max-height: 60vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* MÓDULOS DENTRO DO MODAL */
.modulo-item-list {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}
.modulo-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.add-module-box {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
}

/* LISTA DE AULAS MINI */
.aulas-mini-list {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
}
.aulas-mini-list li {
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

/* FORM NOVA AULA */
.form-nova-aula {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #3b82f6;
}

/* AUXILIARES */
.custom-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 10px;
}
.btn {
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}
.btn.primary {
  background: #3b82f6;
  color: white;
}
.btn.secondary {
  background: #0f172a;
  color: white;
}
.btn.outline {
  background: none;
  border: 1px solid #e2e8f0;
}
.mt-1 {
  margin-top: 0.5rem;
}
.mt-2 {
  margin-top: 1rem;
}
.inline-inputs {
  display: flex;
  gap: 10px;
}
.small-input {
  width: 80px;
}
</style>
