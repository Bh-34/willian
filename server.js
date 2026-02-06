const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Diretório dos arquivos txt
const infoDir = path.join(__dirname, 'src/info');

// Rota para registrar compra completa em compras.txt
app.post('/api/compras', (req, res) => {
  try {
    const { usuario, email, cpf, plano, tipo, valor, data } = req.body;
    const compraInfo = `- Usuário: ${usuario} | Email: ${email} | CPF: ${cpf} | Plano: ${plano} | Tipo: ${tipo} | Valor: ${valor} | Data: ${data}\n`;
    
    const comprasPath = path.join(infoDir, 'compras.txt');
    fs.appendFileSync(comprasPath, compraInfo, 'utf-8');
    
    res.json({ success: true, message: 'Compra registrada com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar compra:', error);
    res.status(500).json({ error: 'Erro ao registrar compra' });
  }
});

// Rota para adicionar usuário
app.post('/api/usuario', (req, res) => {
  try {
    const { nome, email, cpf, telefone } = req.body;
    const usuarioInfo = `- Nome: ${nome} | Email: ${email} | CPF: ${cpf} | Telefone: ${telefone || 'N/A'}\n`;
    
    const usuariosPath = path.join(infoDir, 'usuarios.txt');
    if (!fs.existsSync(usuariosPath)) {
      fs.writeFileSync(usuariosPath, 'Usuários cadastrados:\n\n', 'utf-8');
    }
    fs.appendFileSync(usuariosPath, usuarioInfo, 'utf-8');
    
    res.json({ success: true, message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Rota para registrar login
app.post('/api/login', (req, res) => {
  try {
    const { email, data } = req.body;
    const loginInfo = `- Email: ${email} | Data: ${data}\n`;
    
    const loginsPath = path.join(infoDir, 'logins.txt');
    if (!fs.existsSync(loginsPath)) {
      fs.writeFileSync(loginsPath, 'Logins realizados:\n\n', 'utf-8');
    }
    fs.appendFileSync(loginsPath, loginInfo, 'utf-8');
    
    res.json({ success: true, message: 'Login registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar login:', error);
    res.status(500).json({ error: 'Erro ao registrar login' });
  }
});

// Rota para adicionar curso em pagina1.txt
app.post('/api/pagina1', (req, res) => {
  try {
    const { curso } = req.body;
    const cursoInfo = `- ${curso}\n`;
    
    const pagina1Path = path.join(infoDir, 'pagina1.txt');
    fs.appendFileSync(pagina1Path, cursoInfo, 'utf-8');
    
    res.json({ success: true, message: 'Curso adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar curso:', error);
    res.status(500).json({ error: 'Erro ao adicionar curso' });
  }
});

// Rota para adicionar plano em pagina2.txt
app.post('/api/pagina2', (req, res) => {
  try {
    const { nome, detalhes, preco } = req.body;
    const planoInfo = `- Nome: ${nome} | Detalhes: ${detalhes} | Preço: ${preco}\n`;
    
    const pagina2Path = path.join(infoDir, 'pagina2.txt');
    fs.appendFileSync(pagina2Path, planoInfo, 'utf-8');
    
    res.json({ success: true, message: 'Plano adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar plano:', error);
    res.status(500).json({ error: 'Erro ao adicionar plano' });
  }
});

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ message: 'Servidor rodando com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
