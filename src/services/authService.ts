import { ref } from 'vue'
import api from './api'

// Conta de teste padrão
const contaTeste = {
  nome: 'Visitante Teste',
  email: 'teste@techstore.com',
  cpf: '000.000.000-00',
  telefone: '(11) 99999-9999'
}

const user = ref<any>(null)

const storedUser = localStorage.getItem('user')

try {
  user.value = storedUser ? JSON.parse(storedUser) : contaTeste
} catch {
  localStorage.removeItem('user')
  user.value = contaTeste
}

// Se não houver usuário, usar conta de teste
if (!user.value) {
  user.value = contaTeste
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
  // Voltar para conta de teste
  user.value = contaTeste
}

export function isAuthenticated() {
  // Sempre considerado autenticado (com conta de teste ou real)
  return true
}

export function useUser() {
  return user
}
