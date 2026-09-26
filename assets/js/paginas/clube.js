// Páginas dos clubes brasileiros: troca a aba visível (Versão Torcedor, Retrô, Feminina, Infantil)
// Os botões chamam abrirTab('id-da-aba', this) direto no HTML
function abrirTab(id, botao) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  botao.classList.add("active");
}
