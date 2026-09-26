// Página Resto do Mundo: busca e paginação
const restoPageSize = 12;
let restoPage = 1;

const renderResto = () => {
  const search = document.querySelector("#resto-search");
  const grid = document.querySelector("#resto-grid");
  const count = document.querySelector("#resto-count");
  const empty = document.querySelector("#resto-empty");
  const pagination = document.querySelector("#resto-pagination");
  const previous = document.querySelector("#resto-previous");
  const next = document.querySelector("#resto-next");
  const pageStatus = document.querySelector("#resto-page-status");
  const query = normalizarTexto(search.value.trim());
  const results = restoCatalog.filter((fileName) => {
    const searchable = normalizarTexto(`${fileName} ${formatRestoName(fileName)}`);
    return !query || searchable.includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(results.length / restoPageSize));

  restoPage = Math.min(restoPage, totalPages);
  const start = (restoPage - 1) * restoPageSize;
  const visibleResults = results.slice(start, start + restoPageSize);

  grid.innerHTML = visibleResults.map((fileName) => criarCardCamisa({
    imagem: restoImagem(fileName),
    titulo: formatRestoName(fileName),
    liga: "Clubes internacionais"
  })).join("");
  count.textContent = `${results.length} ${results.length === 1 ? "camisa encontrada" : "camisas encontradas"}`;
  empty.hidden = results.length > 0;
  pagination.hidden = results.length === 0;
  pageStatus.textContent = `Página ${restoPage} de ${totalPages}`;
  previous.disabled = restoPage === 1;
  next.disabled = restoPage === totalPages;
};

document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector("#resto-search");
  const previous = document.querySelector("#resto-previous");
  const next = document.querySelector("#resto-next");

  search.addEventListener("input", () => {
    restoPage = 1;
    renderResto();
  });

  previous.addEventListener("click", () => {
    restoPage -= 1;
    renderResto();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    restoPage += 1;
    renderResto();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  renderResto();
});
