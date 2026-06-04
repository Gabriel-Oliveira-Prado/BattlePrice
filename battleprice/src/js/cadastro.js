const API_BASE = "http://localhost:3000";

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#233B63',
  color: '#F2F5F5',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = this.querySelector('input[name="nome"]').value.trim();
  const email = this.querySelector('input[name="email"]').value.trim();
  const senha = this.querySelector('input[name="senha"]').value;
  const btnCadastrar = this.querySelector('button[type="submit"]');

  btnCadastrar.disabled = true;
  btnCadastrar.textContent = "Cadastrando...";

  try {
    const res = await fetch(`${API_BASE}/api/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      Toast.fire({ icon: 'error', title: data.erro || "Erro ao realizar cadastro." });
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = "Cadastrar";
      return;
    }

    // Cadastro com sucesso
    Swal.fire({
      icon: 'success',
      title: data.mensagem || "Usuário cadastrado com sucesso!",
      text: "Faça login para continuar.",
      background: '#233B63',
      color: '#F2F5F5',
      confirmButtonColor: '#4A77B5'
    }).then(() => {
      window.location.href = "/Views/login.html";
    });

  } catch (err) {
    Toast.fire({ icon: 'error', title: "Erro ao conectar com o servidor. Verifique se ele está rodando." });
    btnCadastrar.disabled = false;
    btnCadastrar.textContent = "Cadastrar";
  }
});
