# 🎨 Paleta de Cores - Referência Visual

## CORES PRIMÁRIAS (Azul Profissional)

### 1. Azul Navy Dark
```
Código: #1E3A52
RGB: 30, 58, 82
Uso: Headers, backgrounds escuros, footers
Exemplo: NavBar background, Curso header
```

### 2. Azul Profissional
```
Código: #2E5C8A
RGB: 46, 92, 138
Uso: Primary color, CTAs, borders
Exemplo: Botões principais, course card borders
```

### 3. Azul Claro
```
Código: #4A90E2
RGB: 74, 144, 226
Uso: Accents, hover states, secondary
Exemplo: Links, hover effects, badges
```

---

## CORES NEUTRAS (Profissionais)

### Texto
```
Primário:   #111827 - Textos principais (quase preto)
Secundário: #6B7280 - Subtítulos, descrições
Terciário:  #9CA3AF - Helper text, hints, muted
```

### Fundos
```
Page Background: #F9FAFB - Fundo geral (branco com tom)
Card Background: #FFFFFF - Cards puros
Border:          #E5E7EB - Linhas, separadores
```

### Neutros Adicionais
```
Neutral 50:   #F9FAFB (muito claro)
Neutral 100:  #F3F4F6 (claro)
Neutral 200:  #E5E7EB (médio-claro)
Neutral 300:  #D1D5DB (médio)
Neutral 400:  #9CA3AF (médio-escuro)
Neutral 500:  #6B7280 (escuro)
```

---

## CORES FUNCIONAIS

### Sucesso
```
Código: #10B981
RGB: 16, 185, 129
Uso: Checkmarks, badges de sucesso, status ativo
Exemplo: Status pulse badge no perfil
```

### Aviso
```
Código: #F59E0B
RGB: 245, 158, 11
Uso: Avisos, alertas importantes
```

### Erro
```
Código: #EF4444
RGB: 239, 68, 68
Uso: Erros, alertas críticos, botões danger
Exemplo: Logout button styling
```

---

## GRADIENTES UTILIZADOS

### Gradient 1: Profissional Premium (NavBar, Headers)
```
Direction: 135deg (canto superior esquerdo para inferior direito)
Color 1: #1E3A52 (azul navy - 0%)
Color 2: #2E5C8A (azul profissional - 100%)
Uso: NavBar, Dashboard header, Curso header
```

### Gradient 2: Azul Claro (Plano destaque, Cards)
```
Direction: 135deg
Color 1: #1E3A52 (0%)
Color 2: #4A90E2 (100%)
Uso: Plano destaque, seções premium
```

### Gradient 3: Suave (Backgrounds hover)
```
Color 1: #F0F7FF (azul bem claro)
Color 2: #E0F2FE (azul muito claro)
Uso: Card hover backgrounds
```

### Gradient 4: Neutro (Form backgrounds)
```
Direction: 135deg
Color 1: #F9FAFB
Color 2: #F3F4F6
Uso: Form backgrounds, seções alternadas
```

---

## COMBINAÇÕES DE CORES

### Primary Action
```
Background: linear-gradient(135deg, #2E5C8A 0%, #4A90E2 100%)
Color: #FFFFFF
Border: transparent
Hover: Gradient mais escuro + elevation
```

### Secondary Action
```
Background: #F3F4F6
Color: #2E5C8A
Border: 2px solid #E5E7EB
Hover: Background #E5E7EB
```

### Danger Action
```
Background: #EF4444
Color: #FFFFFF
Border: transparent
Hover: #DC2626
```

### Card Hover
```
Border-color: #2E5C8A
Background: linear-gradient(135deg, #F0F7FF 0%, #E0F2FE 100%)
Box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1)
Transform: translateY(-6px)
```

---

## VARIÁVEIS CSS NO PROJETO

```css
/* Primárias */
--primary: #2E5C8A;
--primary-light: #4A90E2;
--primary-dark: #1E3A52;

/* Neutros */
--neutral-50: #F9FAFB;
--neutral-100: #F3F4F6;
--neutral-200: #E5E7EB;
--neutral-900: #111827;

/* Textos */
--text-primary: #111827;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;

/* Fundos */
--bg: #F9FAFB;
--bg-light: #ffffff;
--card: #ffffff;

/* Borders */
--border: #E5E7EB;

/* Status */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

---

## 🎯 GUIA RÁPIDO DE USO

### Texto Principal
```css
color: #111827; /* --text-primary */
```

### Texto Secundário (Muted)
```css
color: #6B7280; /* --text-secondary */
```

### Links e CTAs
```css
color: #4A90E2; /* --primary-light */
```

### Cards
```css
background: #FFFFFF;
border: 2px solid #E5E7EB;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
```

### Buttons Primary
```css
background: linear-gradient(135deg, #2E5C8A 0%, #4A90E2 100%);
color: #FFFFFF;
```

### Inputs Focus
```css
border-color: #2E5C8A;
box-shadow: 0 0 0 3px rgba(46, 92, 138, 0.1);
```

---

## ✨ EFEITOS COM COR

### Transição Suave
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Sombra Premium
```css
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
```

### Focus State
```css
outline: none;
border-color: #2E5C8A;
box-shadow: 0 0 0 3px rgba(46, 92, 138, 0.1);
```

---

## 🎨 AMOSTRA VISUAL (Texto)

Aqui como as cores aparecem em diferentes contextos:

### Header (Gradiente Azul Profissional)
```
Fundo: #1E3A52 → #2E5C8A
Texto: #FFFFFF
Cor Border: #4A90E2
```

### Card Padrão
```
Fundo: #FFFFFF
Texto: #111827
Border: #E5E7EB (1-2px)
Sombra: suave
```

### Card Hover
```
Fundo: #F0F7FF → #E0F2FE
Texto: #111827
Border: #2E5C8A
Sombra: grande
```

### Status Ativo
```
Dot: #10B981 (com pulse animation)
Texto: #111827
```

### Alert Erro
```
Fundo: #FEE2E2
Texto: #991B1B
Border: #FECACA
Ícone: ⚠️
```

---

## 🔄 COMPATIBILIDADE

Esta paleta é compatível com:
- ✅ WCAG AA (Contrast ratios adequados)
- ✅ Daltonismo (cores diferenciáveis)
- ✅ Impressão (cores claras e escuras definidas)
- ✅ Variações de tela (tons neutros)

---

**Paleta profissional e moderna para interface premium** 🎉
