const API_URL = 'http://localhost:5000/api';

/* === Protege o acesso ao dashboard.html === */
if (window.location.pathname.includes('dashboard.html')) {
  const token = sessionStorage.getItem('token');

  if (!token) {
    alert('Precisa estar autenticado para aceder ao dashboard.');
    window.location.href = 'index.html';
  } else {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      payload.role = decodeURIComponent(escape(payload.role)); // ✅ Corrige UTF-8
      const role = payload.role;

      console.log('🔎 Payload decodificado:', payload);
      sessionStorage.setItem('role', role);

      if (role.toLowerCase() !== 'técnico') {
        alert('Acesso restrito. Apenas Técnicos podem aceder ao dashboard.');
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      alert('Token inválido. Faça login novamente.');
      sessionStorage.clear();
      window.location.href = 'index.html';
    }
  }
}

/* === Alternar entre Login e Registo === */
function mostrarLogin() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm && registerForm) {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.getElementById('btnLogin')?.classList.add('active');
    document.getElementById('btnRegister')?.classList.remove('active');
  }
}

function mostrarRegisto() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm && registerForm) {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('btnLogin')?.classList.remove('active');
    document.getElementById('btnRegister')?.classList.add('active');
  }
}

/* === LOGIN === */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

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
      payload.role = decodeURIComponent(escape(payload.role)); // ✅ Corrige UTF-8
      console.log('🔎 Payload decodificado:', payload);
      sessionStorage.setItem('role', payload.role);

      alert('Login com sucesso!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Erro ao fazer login');
    }
  });
}

/* === REGISTO === */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const res = await fetch(`${API_URL}/utilizadores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password, role })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Utilizador criado com sucesso! Faça login.');
      mostrarLogin();
    } else {
      alert(data.message || 'Erro ao registar');
    }
  });
}

/* === DASHBOARD: PESQUISA === */
async function pesquisar() {
  const token = sessionStorage.getItem('token');
  const nome = document.getElementById('searchName')?.value;

  const res = await fetch(`${API_URL}/tecnico/utilizadores?nome=${nome}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
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

/* === DASHBOARD: UPLOAD === */
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
    const formData = new FormData();
    const file = document.getElementById('certificado').files[0];
    formData.append('certificado', file);

    const token = sessionStorage.getItem('token');

    const res = await fetch(`${API_URL}/tecnico/certificados/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    alert(data.message || 'Erro ao enviar certificado');
  });
}
