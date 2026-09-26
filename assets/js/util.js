// Funções usadas por todas as páginas

// Remove acentos e deixa em minúsculas, para buscas e comparações ("São Paulo" → "sao paulo")
const normalizarTexto = (valor) => String(valor)
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase();

// Evita que textos das camisas quebrem o HTML montado nos cards
const escaparHtml = (valor) => String(valor)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
