# 🎓 Tech Store - Design System Premium

## 📋 Visão Geral

O site foi completamente redesenhado com um **design system profissional e premium** seguindo as melhores práticas de UI/UX. A paleta de cores foi adaptada para um ambiente corporativo moderno e elegante.

---

## 🎨 Paleta de Cores - Design Premium

### Cores Primárias
- **Primary Dark**: `#1E3A52` - Azul escuro profissional
- **Primary**: `#2E5C8A` - Azul profissional (CTA, headers)
- **Primary Light**: `#4A90E2` - Azul claro (hover, accents)

### Neutros
- **Text Primary**: `#111827` - Quase preto (texto principal)
- **Text Secondary**: `#6B7280` - Cinza médio (texto secundário)
- **Text Tertiary**: `#9CA3AF` - Cinza claro (helper text)
- **Background**: `#F9FAFB` - Branco com tom cinzento
- **Card**: `#FFFFFF` - Branco puro
- **Border**: `#E5E7EB` - Cinza suave

### Status
- **Success**: `#10B981` - Verde (checkmarks, badges)
- **Warning**: `#F59E0B` - Laranja (avisos)
- **Error**: `#EF4444` - Vermelho (erros)

---

## 🏗️ Componentes Atualizados

### 1. **NavBar** ✅
- Gradiente azul profissional (`#1E3A52` → `#2E5C8A`)
- Logo em branco com hover em azul claro
- Links com efeitos hover sofisticados
- Border-bottom em `#4A90E2`
- Design responsivo mobile

### 2. **Dashboard** ✅
- Header com gradiente azul profissional
- Cartões de planos com efeito hover elevado
- Plano destaque com gradiente suave e sombra dupla
- Busca com styling profissional
- Grid responsivo de cursos
- Empty state estilizado

### 3. **Login** ✅
- Card centralizado com sombra premium
- Inputs com background neutro e border azul no focus
- Alertas de erro com design clean
- Botões com transições suaves
- Divider elegante

### 4. **Cadastro** ✅
- Form grid responsivo (2 colunas desktop, 1 mobile)
- Validação visual com feedback
- Alerts com animação slide-in
- Buttons com estados disabled

### 5. **Perfil** ✅
- Header com gradiente azul profissional
- Layout sidebar + main (responsivo)
- Cards com efeito hover com translate
- Status badge com animação pulse
- Seções organizadas com borders sutis

### 6. **Curso** ✅
- Header premium com back button estilizado
- Módulos com header gradient
- Aulas com ícone play e efeito hover
- Toggle icon com rotação suave
- Transições collapse/expand

### 7. **Footer** ✅ NOVO
- Background gradiente azul profissional
- Grid responsivo com 5 colunas
- Links sociais com hover effects
- Badges de segurança/certificação
- Copyright e divider elegante

---

## 📐 Sistema de Espaçamento

```
--spacing-xs:    4px   (gaps pequenos)
--spacing-sm:    8px   (gaps pequenos-médios)
--spacing-md:   12px   (gaps médios)
--spacing-lg:   16px   (gaps padrão)
--spacing-xl:   24px   (gaps grandes)
--spacing-2xl:  32px   (gaps muito grandes)
--spacing-3xl:  48px   (gaps premium/headers)
```

---

## 🎯 Sombras e Efeitos

```
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)      (sutil)
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.07)      (médio)
--shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1)     (grande)
--shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.1)     (premium)
```

### Border Radius
```
--radius-sm:   6px    (pequeno)
--radius-md:   8px    (médio)
--radius-lg:  12px    (grande)
--radius-xl:  16px    (premium)
```

### Transições
```
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
```

---

## ✨ Recursos Premium

### Efeitos Hover
- **Cards**: Elevação com translateY(-2px a -6px)
- **Links**: Cor muda para azul primary
- **Botões**: Sombra aumenta + transform translate

### Animações
- **Pulse**: Status badge com animação contínua
- **Slide-in**: Alerts aparecem com movimento
- **Collapse**: Módulos expandem/contraem suavemente
- **Rotate**: Toggle icons giram 180°

### Estados
- **Focus**: Border azul + box-shadow com transparência
- **Hover**: Cor muda + efeito elevation
- **Disabled**: Opacidade reduzida
- **Active**: Mais saturação/contraste

---

## 📱 Responsividade

Todos os componentes são **100% responsivos** com breakpoints em:
- `768px` (tablets)
- `600px` (smartphones)
- `480px` (pequenos smartphones)

---

## 🎯 Tipografia

```
h1: 2rem    - Headers principais
h2: 1.5rem  - Subtítulos
h3: 1.25rem - Seções
h4: 1rem    - Labels
p:  1rem    - Corpo de texto
```

Font Family: Sistema nativo (`-apple-system, BlinkMacSystemFont, 'Segoe UI'...`)

---

## 🔄 Variáveis CSS Globais

Todas as cores, espaçamentos, sombras e transições estão definidas como variáveis CSS globais no `global.css`, permitindo:
- ✅ Mudança de tema simples
- ✅ Consistência em todo o app
- ✅ Manutenção facilitada
- ✅ Performance otimizada

---

## 📝 Exemplo de Uso

```vue
<!-- Card com styling premium -->
<div class="card">
  <h3>Título</h3>
  <p class="muted">Descrição</p>
  <button class="btn primary">Ação</button>
</div>

<!-- Classes disponíveis -->
- .card          → Container com sombra
- .btn.primary   → Botão azul gradient
- .btn.secondary → Botão neutro
- .btn.danger    → Botão vermelho
- .muted         → Texto cinzento (secundário)
```

---

## ✅ Status do Projeto

- ✅ Design system completo
- ✅ Paleta de cores profissional
- ✅ Todos os componentes atualizados
- ✅ Responsividade garantida
- ✅ Zero erros de compilação
- ✅ Transições e animações suaves
- ✅ Footer premium implementado
- ✅ Acessibilidade básica

---

## 🚀 Próximos Passos (Opcionais)

- [ ] Dark mode support
- [ ] Mais animações micro-interactions
- [ ] Adaptive images
- [ ] PWA features
- [ ] SEO optimization

---

**Desenvolvido com ❤️ para um design premium moderno**
