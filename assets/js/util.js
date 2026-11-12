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

// "R$ 1.119,90" → 111990 (centavos, para somar sem erro de arredondamento)
const paraCentavos = (preco) => {
  const m = String(preco).replace(/\s/g, "").match(/(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})/);
  return m ? Number(m[1].replace(/\./g, "")) * 100 + Number(m[2]) : 0;
};

const formatoReal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const emReais = (centavos) => formatoReal.format(centavos / 100);

// Sem os centavos quando são zero, para selos curtos: 20000 → "R$ 200"
const emReaisCurto = (centavos) => (centavos % 100 ? emReais(centavos) : emReais(centavos).replace(/,00$/, ""));
