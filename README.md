# Tech Store Front

Projeto de exemplo em **Vue 3 + Vite + TypeScript** inspirado no layout mostrado.

## Como rodar 🛠️

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra http://localhost:5173 no navegador.

## Estrutura básica criada 🧭

- `src/components` - componente `NavBar.vue`
- `src/views` - `Dashboard.vue` e `Produtos.vue`
- `src/router` - rotas em `index.ts`
- `src/services/produtoService.ts` - serviço com dados fictícios
- `src/services/authService.ts` - serviço de autenticação (login/email+senha)
- `src/styles/global.css` - estilos globais

---

Test credentials for demo:

- Email: `user@example.com`
- Senha: `senha123`

You can also create a new account at `/cadastro` using the fields: **nome**, **email**, **senha**, and **telefone**. After registration the demo app will automatically log you in and redirect to the dashboard.

Se quiser que eu adicione recursos (carrinho, filtros, chamadas reais à API, testes unitários), diga o que você prefere que eu implemente em seguida.
