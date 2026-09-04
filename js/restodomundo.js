const restoCatalog = [
  "chivas guadalajara 26-27 home.jpg",
  "inter miami 26-27 home.png",
  "inter miami 26-27 away.jpg",
  "boca jrs 26-27 away.jpg",
  "al nassr 26-27 away.jpg",
  "al nassr 26-27 home.png",
  "monterrey 26-27 home.jpg",
  "america mexico 26-27 home.jpg",
  "new york red bulls 26-27 home.jpg",
  "inter miami 26-27 third.png",
  "river plate 26-27 home.png",
  "boca jrs 26-27 home.jpg"
];

const restoPageSize = 12;
let restoPage = 1;

const normalizeResto = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

const formatRestoName = (fileName) => fileName
  .replace(/\.[^/.]+$/, "")
  .replace(/\b26-27\b/g, "2026/27")
  .replace(/\b(home|away|third)\b/gi, (variant) => ({
    home: "Home",
    away: "Away",
    third: "Third"
  }[variant.toLowerCase()]))
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const createRestoCard = (fileName) => {
  const imagePath = `assets/camisas/outros clubes/${fileName}`;
  const encodedPath = encodeURI(imagePath);
  const title = formatRestoName(fileName);

  return `
    <article class="catalog-card">
      <a class="catalog-card-media" href="${encodedPath}" target="_blank" rel="noopener noreferrer">
        <img src="${encodedPath}" alt="${title}" loading="lazy">
      </a>
      <div class="catalog-card-content">
        <span class="catalog-card-league">Clubes internacionais</span>
        <h2>${title}</h2>
        <p>Camisa Tailandesa 1.1.</p>
        <strong>R$ 119,90</strong>
      </div>
    </article>
  `;
};

const renderResto = () => {
  const search = document.querySelector("#resto-search");
  const grid = document.querySelector("#resto-grid");
  const count = document.querySelector("#resto-count");
  const empty = document.querySelector("#resto-empty");
  const pagination = document.querySelector("#resto-pagination");
  const previous = document.querySelector("#resto-previous");
  const next = document.querySelector("#resto-next");
  const pageStatus = document.querySelector("#resto-page-status");
  const query = normalizeResto(search.value.trim());
  const results = restoCatalog.filter((fileName) => {
    const searchable = normalizeResto(`${fileName} ${formatRestoName(fileName)}`);
    return !query || searchable.includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(results.length / restoPageSize));

  restoPage = Math.min(restoPage, totalPages);
  const start = (restoPage - 1) * restoPageSize;
  const visibleResults = results.slice(start, start + restoPageSize);

  grid.innerHTML = visibleResults.map(createRestoCard).join("");
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
