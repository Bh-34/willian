export type Produto = {
  id: number
  nome: string
  preco: number
  imagem?: string
}

const mock: Produto[] = [
  { id: 1, nome: 'Camiseta Tech', preco: 49.9, imagem: '/src/assets/capa-estudo-azul.svg' },
  { id: 2, nome: 'Caneca Dev', preco: 29.9, imagem: '/src/assets/capa-estudo-azul.svg' },
  { id: 3, nome: 'Mochila', preco: 129.9, imagem: '/src/assets/capa-estudo-azul.svg' }
]

export async function listarProdutos(): Promise<Produto[]> {
  // Simula uma chamada assíncrona
  return new Promise((resolve) => setTimeout(() => resolve(mock), 300))
}
