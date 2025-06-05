const API_URL = 'http://localhost:5000/api';

// Proteção de acesso a páginas
const pathname = window.location.pathname;

if (pathname.includes('dashboard.html') || pathname.includes('gestor.html')) {
  const token = sessionStorage.getItem('token');
  if (!token) {
    alert('Precisa estar autenticado.');
    window.location.href = 'index.html';
  } else {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = decodeURIComponent(escape(payload.role)).toLowerCase();

      if (pathname.includes('dashboard.html') && role !== 'técnico') {
        alert('Acesso restrito a Técnicos.');
        window.location.href = 'index.html';
      }

      if (pathname.includes('gestor.html') && role !== 'gestor operações') {
        alert('Acesso restrito a Gestores de Operações.');
        window.location.href = 'index.html';
      }

      sessionStorage.setItem('role', role);
    } catch (err) {
      console.error('Token inválido:', err);
      alert('Token inválido. Faça login novamente.');
      sessionStorage.clear();
      window.location.href = 'index.html';
    }
  }
}

// Notificação
function mostrarAlerta(msg, tipo = 'info') {
  alert(`${tipo.toUpperCase()}: ${msg}`);
}

// Alternar entre login/registo
function mostrarLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('btnLogin')?.classList.add('active');
  document.getElementById('btnRegister')?.classList.remove('active');
}

function mostrarRegisto() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('btnLogin')?.classList.remove('active');
  document.getElementById('btnRegister')?.classList.add('active');
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      const token = data.token;
      sessionStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = decodeURIComponent(escape(payload.role));
      sessionStorage.setItem('role', role);

      mostrarAlerta('Login com sucesso!', 'sucesso');

      if (role.toLowerCase() === 'técnico') {
        window.location.href = 'dashboard.html';
      } else if (role.toLowerCase() === 'gestor operações') {
        window.location.href = 'gestor.html';
      } else {
        mostrarAlerta('Role não autorizado.', 'erro');
        sessionStorage.clear();
        window.location.href = 'index.html';
      }
    } else {
      mostrarAlerta(data.message || 'Erro ao fazer login', 'erro');
    }
  });
}

// Registo
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = registerForm.nome.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const role = registerForm.role.value;

    const res = await fetch(`${API_URL}/utilizadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password, role })
    });

    const data = await res.json();
    if (res.ok) {
      mostrarAlerta('Utilizador criado com sucesso! Faça login.', 'sucesso');
      mostrarLogin();
    } else {
      mostrarAlerta(data.message || 'Erro ao registar', 'erro');
    }
  });
}

// DASHBOARD: Pesquisa de utilizadores
async function pesquisar() {
  const token = sessionStorage.getItem('token');
  const nome = document.getElementById('searchName')?.value;
  const res = await fetch(`${API_URL}/tecnico/utilizadores?nome=${nome}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const lista = document.getElementById('listaUtilizadores');
  const uploadArea = document.getElementById('uploadArea');
  if (!lista || !uploadArea) return;

  lista.innerHTML = '';
  uploadArea.innerHTML = '';

  data.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.nome} (${user.email})`;
    const botao = document.createElement('button');
    botao.textContent = 'Enviar certificado';
    botao.onclick = () => mostrarUpload(user._id, user.nome);
    li.appendChild(botao);
    lista.appendChild(li);
  });
}

// DASHBOARD: Upload de certificado
function mostrarUpload(userId, nome) {
  const uploadArea = document.getElementById('uploadArea');
  if (!uploadArea) return;

  uploadArea.innerHTML = `
    <h3>Enviar certificado para ${nome}</h3>
    <form id="uploadForm">
      <input type="file" id="certificado" accept="application/pdf" required><br>
      <button type="submit">Enviar</button>
    </form>
  `;

  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('certificado').files[0];
    const formData = new FormData();
    formData.append('certificado', file);

    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_URL}/tecnico/certificados/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    mostrarAlerta(data.message || 'Erro ao enviar certificado');
  });
}

// GESTOR: Pesquisa de clientes
async function pesquisarClientes() {
  const nome = document.getElementById('searchCliente')?.value;
  const select = document.getElementById('clienteSelect');
  if (!select) return;

  select.innerHTML = '<option value="">A procurar...</option>';
  const res = await fetch(`${API_URL}/utilizadores/pesquisar?nome=${encodeURIComponent(nome)}`);
  const data = await res.json();

  select.innerHTML = '<option value="">Selecione um cliente</option>';
  data.forEach(cliente => {
    const opt = document.createElement('option');
    opt.value = cliente._id;
    opt.textContent = `${cliente.nome} (${cliente.email})`;
    select.appendChild(opt);
  });
}

function clienteSelecionado() {
  const id = document.getElementById('clienteSelect').value;
  console.log(' Cliente selecionado:', id);
}

// GESTOR: Obter produção
async function obterProducao() {
  const idCliente = document.getElementById('clienteSelect').value;
  if (!idCliente) return alert('Selecione um cliente primeiro');

  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_URL}/production/${idCliente}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const resultado = document.getElementById('producaoResultado');

  if (res.ok) {
    const historico = data.historico || [];
    resultado.innerHTML = `
 Cliente: ${data.cliente.nome} (${data.cliente.email})
 Produção Atual: ${data.producao_kwh} kWh
 Crédito Estimado: ${data.credito_energia}

 Leituras Recentes:
${historico.length > 0 ? historico.map(l => `• ${l.data}: ${l.kwh} kWh`).join('\n') : 'Sem leituras anteriores.'}
    `;
  } else {
    resultado.textContent = 'Erro: ' + (data.message || 'Falha ao obter dados');
  }
}
