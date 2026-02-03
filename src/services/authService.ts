import { ref, computed } from 'vue'
import api from './api'

const user = ref<any>(null)

/**
 * 🔒 Carregamento seguro do usuário do localStorage
 * Evita JSON.parse("undefined")
 */
const storedUser = localStorage.getItem('user')

if (storedUser && storedUser !== 'undefined') {
  try {
    user.value = JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('user')
    user.value = null
  }
} else {
  user.value = null
}
export async function login(email: string, senha: string) {
  const response = await api.post('/login', { email, senha })

  console.log('LOGIN RESPONSE:', response.data)

  const { token, usuario: userData } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(userData))

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`

  user.value = userData
  return userData
}

export async function register(data: {
  nome: string
  email: string
  senha: string
  telefone?: string
  cpf: string
}) {
  try {
    const response = await api.post('/cadastro', {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      telefone: data.telefone,
      cpf: data.cpf
    })

    const { token, user: userData } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    user.value = userData
    return userData
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar conta')
  }
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete api.defaults.headers.common['Authorization']
  user.value = null
}

/**
 * ⚠️ computed NÃO é função
 * usar: isAuthenticated.value
 */
export const isAuthenticated = computed(() => {
  return !!user.value
})

export function useUser() {
  return user
}
