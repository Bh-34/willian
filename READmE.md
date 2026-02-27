# 🎓 Tech Store - Plataforma Premium de Educação Online

Uma aplicação web moderna e responsiva para gestão de cursos, aulas e planos de aprendizado. Desenvolvida com **Vue 3**, **Vite** e um design system profissional premium.

---

## 📋 Visão Geral

O **Tech Store** é uma plataforma educacional completa que permite aos usuários:
- 📚 Navegar e se inscrever em cursos
- 🎥 Assistir aulas e conteúdos educacionais
- 💳 Gerenciar planos e assinaturas
- 👤 Gerenciar perfil e dados pessoais
- 🔐 Sistema seguro de autenticação
- 📊 Dashboard com visão geral de progresso

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|----------|
| **Vue.js** | 3.5.27 | Framework frontend |
| **Vue Router** | 4.2.0 | Roteamento e navegação |
| **Vite** | 5.0.0 | Build tool e dev server |
| **TypeScript** | 5.2.2 | Type safety |
| **Axios** | 1.5.0 | Cliente HTTP/API |

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── NavBar.vue      # Barra de navegação principal
├── views/              # Páginas da aplicação
│   ├── login.vue       # Página de login
│   ├── cadastro.vue    # Pagina de cadastro
│   ├── Dashboard.vue   # Dashboard com visão geral
│   ├── Curso.vue       # Detalhes do curso
│   ├── Aula.vue        # Reprodutor de aula
│   ├── meusCursos.vue  # Cursos do usuário
│   ├── Perfil.vue      # Perfil do usuário
│   ├── AdminPlanos.vue # Gerenciamento de planos
│   ├── Pagando.vue     # Página de pagamento
│   └── visualizacao.vue # Visualização de conteúdo
├── router/
│   └── index.ts        # Configuração de rotas
├── services/
│   ├── api.ts          # Cliente API HTTP
│   └── authService.ts  # Serviço de autenticação
├── styles/
│   └── global.css      # Estilos globais
├── assets/             # Recursos estáticos
├── App.vue            # Componente raiz
├── main.ts            # Ponto de entrada
└── env.d.ts           # Tipos TypeScript
```

---

## 🎨 Design System Premium

A aplicação segue um **design system profissional e moderno** com:

### Paleta de Cores
- **Primária Escura**: `#1E3A52` - Azul navy profissional (headers, backgrounds)
- **Primária**: `#2E5C8A` - Azul corporativo (CTAs, botões)
- **Primária Clara**: `#4A90E2` - Azul acento (hover, links, badges)
- **Sucesso**: `#10B981` - Verde
- **Aviso**: `#F59E0B` - Laranja
- **Erro**: `#EF4444` - Vermelho
- **Neutros**: Escalas cinzentas profissionais

### Componentes Estilizados
- ✅ NavBar com gradiente profissional
- ✅ Dashboard com cartões e grid responsivo
- ✅ Formulários modernos (login, cadastro)
- ✅ Cards com efeitos hover elevados
- ✅ Tipografia hierárquica
- ✅ Design responsivo mobile-first

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd willian
```

2. **Instale as dependências**
```bash
npm install
```

### Executar em Desenvolvimento

```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

---

## 📖 Funcionalidades Principais

### 🔐 Autenticação
- Login seguro com validação
- Cadastro de novos usuários
- Gerenciamento de sessão com JWT (via authService)

### 📚 Cursos
- Listagem de cursos disponíveis
- Detalhes completos do curso
- Visualização de aulas
- Reprodutor de vídeo integrado

### 💳 Planos e Pagamentos
- Visualização de planos disponíveis
- Gerenciamento de assinaturas
- Página de pagamento integrada

### 👤 Perfil do Usuário
- Edição de informações pessoais
- Visualização de cursos em progresso
- Histórico de aprendizado

### 🎯 Dashboard
- Visão geral de cursos
- Estatísticas de progresso
- Acesso rápido aos cursos em progresso

---

## 🔌 API Integration

A aplicação se conecta com uma API backend através do serviço `api.ts`:

```typescript
// Exemplo de uso
import { api } from '@/services/api'

// Requisições GET, POST, PUT, DELETE
await api.get('/cursos')
await api.post('/auth/login', credenciais)
```

---

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Breakpoints para tablet e desktop
- ✅ Layout fluido e adaptativo
- ✅ Navegação responsiva

---

## 📝 Documentação Adicional

- [Design System](./DESIGN_SYSTEM.md) - Especificações detalhadas do design
- [Paleta de Cores](./PALETA_CORES.md) - Referência visual de cores
- [Guia de Páginas](./GUIA_PAGINAS.md) - Documentação de estrutura das páginas
- [Resumo de Transformação](./RESUMO_TRANSFORMACAO.txt) - Mudanças realizadas

---

## 👨‍💻 Desenvolvimento

### Arquitetura
- **Vite** para build rápido
- **Vue 3 Composition API** (opcional)
- **Vue Router** para navegação SPA
- **TypeScript** para type-safety

### Configuração TypeScript
Ver `tsconfig.json` para configuração de tipos

### Variáveis de Ambiente
Configurar no arquivo `.env` (não incluído no repositório)

---

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run preview  # Visualiza a build de produção
```

---

## 🎯 Próximos Passos / Roadmap

- [ ] Adicionar testes unitários
- [ ] Integração com mais features de colaboração
- [ ] Sistema de notificações em tempo real
- [ ] Chat com suporte
- [ ] Certificados de conclusão
- [ ] Gamificação (pontos e badges)

---

## 📄 Licença

Projeto privado - Todos os direitos reservados

---

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ usando Vue.js e Vite**



