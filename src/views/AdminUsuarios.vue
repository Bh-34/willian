 <template>
  <div class="dashboard">
    
    <section class="header-section">
      <div class="header-content">
        <div>
          <h1>Gerenciar Usuários</h1>
          <p class="muted">Controle de permissões da plataforma</p>
        </div>
      </div>
    </section>

    <div class="branco">

      <section class="section">
        
        <div class="table-card">
          <table class="user-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="u in usuarios" :key="u.id">
                <td>{{ u.name }}</td>
                <td>{{ u.email }}</td>

                <td>
                  <span class="role-badge" :class="u.role">
                    {{ u.role }}
                  </span>
                </td>

                <td>
                  <button
                    v-if="u.role !== 'admin'"
                    class="btn-action"
                    @click="toggleProfessor(u.id)"
                  >
                    {{ u.role === 'professor'
                      ? 'Remover Professor'
                      : 'Tornar Professor' }}
                  </button>

                  <span v-else class="admin-label">
                    Administrador
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const usuarios = ref([])
const token = localStorage.getItem("token")

async function carregarUsuarios() {
  const res = await axios.get(
    "http://localhost:8000/api/admin/users",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  usuarios.value = res.data
}

async function toggleProfessor(id) {
  await axios.patch(
    `http://localhost:8000/api/admin/users/${id}/toggle-professor`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  carregarUsuarios()
}

onMounted(() => {
  carregarUsuarios()
})
</script>


<style scoped>

.dashboard {
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 2rem auto;
}

.header-section {
  background: var(--primary);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-xl);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-lg);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 800;
  color: white;
}

.header-section .muted {
  color: rgba(255,255,255,0.85);
}

.branco {
  background: #f8fafc;
  padding: 3rem 2rem;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-top: -20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.table-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  overflow: hidden;
}

/* Tabela */
.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  text-align: left;
  padding: 16px;
  font-size: 0.9rem;
  color: #64748b;
  background: #f1f5f9;
}

.user-table td {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.95rem;
}

.user-table tr:hover {
  background: #f8fafc;
}

/* Badges de cargo */
.role-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

/* Cores seguindo sua paleta */
.professor {
  background: rgba(22,163,74,0.1);
  color: #16a34a;
}

.admin {
  background: rgba(220,38,38,0.1);
  color: #dc2626;
}

.user {
  background: rgba(100,116,139,0.1);
  color: #64748b;
}

/* Botão ação */
.btn-action {
  background: var(--primary);
  color: white;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-action:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.admin-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}


</style>