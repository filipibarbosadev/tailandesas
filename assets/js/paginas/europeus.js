// Página Clubes Europeus: busca, filtro por campeonato e paginação
const europeusPageSize = 24;
let europeusPage = 1;

const renderEuropeus = () => {
  const search = document.querySelector("#catalog-search");
  const filter = document.querySelector("#championship-filter");
  const grid = document.querySelector("#catalog-grid");
  const count = document.querySelector("#catalog-count");
  const empty = document.querySelector("#catalog-empty");
  const pagination = document.querySelector("#catalog-pagination");
  const previous = document.querySelector("#catalog-previous");
  const next = document.querySelector("#catalog-next");
  const pageStatus = document.querySelector("#catalog-page-status");
  const query = normalizarTexto(search.value.trim());

  const results = europeusCatalog.filter(([liga, arquivo]) => {
    const matchesFilter = filter.value === "all" || filter.value === liga;
    const searchable = normalizarTexto(`${arquivo} ${europeusLabels[liga]}`);
    return matchesFilter && (!query || searchable.includes(query));
  });

  const totalPages = Math.max(1, Math.ceil(results.length / europeusPageSize));
  europeusPage = Math.min(europeusPage, totalPages);
  const start = (europeusPage - 1) * europeusPageSize;
  const visibleResults = results.slice(start, start + europeusPageSize);

  grid.innerHTML = visibleResults.map(([liga, arquivo]) => criarCardCamisa({
    imagem: europeuImagem(liga, arquivo),
    titulo: displayEuropeuName(arquivo),
    liga: europeusLabels[liga]
  })).join("");
  count.textContent = `${results.length} ${results.length === 1 ? "camisa encontrada" : "camisas encontradas"}`;
  empty.hidden = results.length > 0;
  pagination.hidden = results.length === 0;
  pageStatus.textContent = `Página ${europeusPage} de ${totalPages}`;
  previous.disabled = europeusPage === 1;
  next.disabled = europeusPage === totalPages;
};

document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector("#catalog-search");
  const filter = document.querySelector("#championship-filter");
  const previous = document.querySelector("#catalog-previous");
  const next = document.querySelector("#catalog-next");
  const filterOptions = Object.entries(europeusLabels)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");

  filter.insertAdjacentHTML("beforeend", filterOptions);
  search.addEventListener("input", () => {
    europeusPage = 1;
    renderEuropeus();
  });
  filter.addEventListener("change", () => {
    europeusPage = 1;
    renderEuropeus();
  });
  previous.addEventListener("click", () => {
    europeusPage -= 1;
    renderEuropeus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    europeusPage += 1;
    renderEuropeus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  renderEuropeus();
});
