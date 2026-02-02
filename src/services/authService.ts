import { ref } from 'vue'
import api from './api'


const user = ref<any>(null)

const storedUser = localStorage.getItem('user')

try {
  user.value = storedUser ? JSON.parse(storedUser) : null
} catch {
  localStorage.removeItem('user')
  user.value = null
}


export async function login(email: string, senha: string) {
  try {
    const response = await api.post('/login', { email, senha })

    const { token, user: userData } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    user.value = userData
    return userData
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao autenticar')
  }
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

export function isAuthenticated() {
  return !!user.value
}

export function useUser() {
  return user
}
