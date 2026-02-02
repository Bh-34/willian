import { ref } from 'vue'

export type User = { nome?: string; email: string; token: string; telefone?: string }

const STORAGE_TOKEN_KEY = 'auth_token'
const STORAGE_USER_KEY = 'auth_user'
const STORAGE_USERS_KEY = 'auth_users'

// Estado reativo para que componentes possam reagir a mudanças
const user = ref<User | null>(JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null'))

// Lista de usuários mock persistida no localStorage
const initialUsers = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || 'null') || [
  { nome: 'Usuário de Teste', email: 'user@example.com', password: 'senha123', telefone: '', token: 'fake-jwt-token' }
]

function saveUsers(list: any[]) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(list))
}

export async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found: any = initialUsers.find((u: any) => u.email === email && u.password === password)
      if (found) {
        const u = { email: found.email, token: found.token || 'token-' + Date.now(), nome: found.nome, telefone: found.telefone }
        localStorage.setItem(STORAGE_TOKEN_KEY, u.token)
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u))
        user.value = u
        resolve(u)
      } else {
        reject(new Error('Email ou senha inválidos'))
      }
    }, 600)
  })
}

export async function register(payload: { nome: string; email: string; senha: string; telefone?: string }) {
  return new Promise<User>((resolve, reject) => {
    setTimeout(() => {
      const exists = initialUsers.find((u: any) => u.email === payload.email)
      if (exists) return reject(new Error('Email já cadastrado'))

      const token = 'token-' + Date.now()
      const novo: any = { nome: payload.nome, email: payload.email, password: payload.senha, telefone: payload.telefone || '', token }
      initialUsers.push(novo)
      saveUsers(initialUsers)

      const u: User = { nome: novo.nome, email: novo.email, token, telefone: novo.telefone }
      localStorage.setItem(STORAGE_TOKEN_KEY, token)
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u))
      user.value = u
      resolve(u)
    }, 700)
  })
}

export function logout() {
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_USER_KEY)
  user.value = null
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(STORAGE_TOKEN_KEY)
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!user.value) return reject(new Error('Usuário não autenticado'))
      const found: any = initialUsers.find((u: any) => u.email === user.value!.email)
      if (!found) return reject(new Error('Usuário não encontrado'))
      if (found.password !== currentPassword) return reject(new Error('Senha atual incorreta'))
      found.password = newPassword
      saveUsers(initialUsers)
      resolve()
    }, 400)
  })
}

export { user }
