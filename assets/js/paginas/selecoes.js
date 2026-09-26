// Página Seleções: busca e paginação
const selecoesPageSize = 24;
let selecoesPage = 1;

const renderSelecoes = (term = "") => {
  const container = document.getElementById("selecoes-container");
  const count = document.getElementById("selecoes-count");
  const empty = document.getElementById("selecoes-empty");
  const pagination = document.getElementById("selecoes-pagination");
  const previous = document.getElementById("selecoes-previous");
  const next = document.getElementById("selecoes-next");
  const pageStatus = document.getElementById("selecoes-page-status");
  const sorted = [...selecoes].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const filtro = term.trim().toLowerCase();
  const resultados = sorted.filter((fileName) => {
    const nome = formatName(fileName).toLowerCase();
    return !filtro || nome.includes(filtro) || fileName.toLowerCase().includes(filtro);
  });

  const totalPages = Math.max(1, Math.ceil(resultados.length / selecoesPageSize));
  selecoesPage = Math.min(selecoesPage, totalPages);
  const start = (selecoesPage - 1) * selecoesPageSize;
  const visibleResults = resultados.slice(start, start + selecoesPageSize);

  container.innerHTML = visibleResults.map((fileName) => criarCardCamisa({
    imagem: selecaoImagem(fileName),
    titulo: formatName(fileName),
    liga: "Seleção"
  })).join("");
  count.textContent = `${resultados.length} ${resultados.length === 1 ? "camisa encontrada" : "camisas encontradas"}`;
  empty.hidden = resultados.length > 0;
  pagination.hidden = resultados.length === 0;
  pageStatus.textContent = `Página ${selecoesPage} de ${totalPages}`;
  previous.disabled = selecoesPage === 1;
  next.disabled = selecoesPage === totalPages;
};

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("filtro-selecoes");
  const previous = document.getElementById("selecoes-previous");
  const next = document.getElementById("selecoes-next");

  renderSelecoes();

  input.addEventListener("input", (event) => {
    selecoesPage = 1;
    renderSelecoes(event.target.value);
  });

  previous.addEventListener("click", () => {
    selecoesPage -= 1;
    renderSelecoes(input.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    selecoesPage += 1;
    renderSelecoes(input.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
