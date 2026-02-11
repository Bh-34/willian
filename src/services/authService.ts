import { ref, computed } from 'vue'
import api from './api'

const user = ref<any>(null)

const storedUser = localStorage.getItem('user')
const token = localStorage.getItem('token')

if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

try {
  if (storedUser && storedUser !== 'undefined') {
    user.value = JSON.parse(storedUser)
  } else {
    user.value = null
  }
} catch {
  localStorage.removeItem('user')
  user.value = null
}

try {
  if (storedUser && storedUser !== 'undefined') {
    user.value = JSON.parse(storedUser)
  } else {
    user.value = null
  }
} catch (e) {
  console.warn('Erro ao carregar usuário do localStorage:', e)
  localStorage.removeItem('user')
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
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar conta')
  }
}

export async function fetchPerfil() {
  const response = await api.get('/perfil')
  user.value = response.data.usuario
  localStorage.setItem('user', JSON.stringify(response.data.usuario))
  return response.data.usuario
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete api.defaults.headers.common['Authorization']
  user.value = null
}

export const isAuthenticated = computed(() => {
  return !!user.value
})

export function useUser() {
  return user
}


export async function updateUser(data: {
  nome?: string
  email?: string
  telefone?: string
  senha?: string
}) {
  if (!user.value?.id) {
    throw new Error('Usuário não autenticado')
  }

  const response = await api.put(`/usuarios/${user.value.id}`, data)

  const updatedUser = response.data.usuario || response.data

  user.value = updatedUser
  localStorage.setItem('user', JSON.stringify(updatedUser))

  return updatedUser
}




