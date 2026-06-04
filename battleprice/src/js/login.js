// login.js — Intercepta o formulário e faz fetch no lugar

const API_BASE = "http://localhost:3000";

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // impede o browser de navegar pro backend

  const email = this.querySelector('input[name="email"]').value.trim();
  const senha = this.querySelector('input[name="senha"]').value;
  const btnEntrar = this.querySelector('button[type="submit"]');

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Email ou senha incorretos.");
      btnEntrar.disabled = false;
      btnEntrar.textContent = "Entrar";
      return;
    }

    // Salva o token e dados do usuário
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    // Redireciona pro jogo
    window.location.href = "/Views/jogo.html";
  } catch (err) {
    alert("Erro ao conectar com o servidor. Verifique se ele está rodando.");
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});
