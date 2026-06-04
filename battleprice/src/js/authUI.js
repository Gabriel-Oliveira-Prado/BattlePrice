import { abrirRanking } from "./ranking.js";

export function setupAuthUI() {
  const userStr = localStorage.getItem("usuario");
  // Find the nav container in the header
  const nav = document.querySelector("header .nav");
  if (!nav) return;

  const btnEntrar = nav.querySelector(".btn-action");

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const nomeFull = user.nome || "Jogador";
      const inicial = nomeFull.charAt(0).toUpperCase();

      // Create User Profile Component
      const userDropdown = document.createElement("div");
      userDropdown.className = "user-profile-dropdown position-relative d-flex align-items-center";
      
      userDropdown.innerHTML = `
        <div class="user-avatar-circle" title="${nomeFull}">
           ${inicial}
        </div>
        <span class="user-name-hidden">${nomeFull}</span>
        <div class="user-dropdown-menu shadow">
          <button id="btn-logout" class="btn btn-sm w-100 text-start fw-bold d-flex align-items-center gap-2">
            <i class="bi bi-box-arrow-right"></i> Sair da conta
          </button>
        </div>
      `;

      if (btnEntrar) {
         nav.replaceChild(userDropdown, btnEntrar);
      } else {
         nav.appendChild(userDropdown);
      }

      // Interaction Logic
      let isClickedOpen = false;

      userDropdown.addEventListener("mouseenter", () => {
         userDropdown.classList.add("show-dropdown");
      });
      userDropdown.addEventListener("mouseleave", () => {
         if (!isClickedOpen) {
            userDropdown.classList.remove("show-dropdown");
         }
      });
      userDropdown.addEventListener("click", (e) => {
         if (e.target.closest('#btn-logout')) return;
         isClickedOpen = !isClickedOpen;
         if (isClickedOpen) {
            userDropdown.classList.add("show-dropdown");
         } else {
            userDropdown.classList.remove("show-dropdown");
         }
      });

      document.getElementById('btn-logout').addEventListener("click", () => {
         localStorage.removeItem("usuario");
         localStorage.removeItem("token");
         window.location.href = "/index.html";
      });

    } catch (e) {
      console.error("Error setting up auth UI:", e);
    }
  }

  // Set up ranking button globally
  const placarBtn = document.getElementById("placar-btn");
  if (placarBtn) {
    placarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      abrirRanking();
    });
  }
}

document.addEventListener("DOMContentLoaded", setupAuthUI);
