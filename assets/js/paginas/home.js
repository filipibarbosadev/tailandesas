// Página inicial: menu, filtros por categoria/clube/liga, busca, ordenação e lista paginada de todas as camisas
const homePageSize = 24;
let homePage = 1;
let homeCategory = "all";
let homeSubcategory = "all";
let homeTab = "all";
let homeSort = "vendidas";
let homeProducts = [];
let homeClubsNudged = false;
const homeClubNames = {};
const homeClubTabs = {};

const homeCategoryLabels = {
  brasileiros: "Times Brasileiros",
  europeus: "Europeus",
  selecoes: "Seleções",
  resto: "Resto do Mundo",
  retro: "Camisas Retrô"
};

// Ordem e nomes padrão das abas das páginas dos clubes brasileiros (Vasco usa "kids")
const brasileirosTabs = {
  torcedor: "Versão Torcedor",
  retro: "Retrô",
  feminina: "Feminina",
  infantil: "Infantil",
  kids: "Kids"
};

const cleanText = (element, fallback = "") => (element ? element.textContent.replace(/\s+/g, " ").trim() : fallback);

const clubKey = (link) => link.getAttribute("href").split("/").pop().replace(/\.html$/, "");

// "real madrid 26-27 home.jpg" → "real madrid"; "inter de milão third.png" → "inter de milão"
const teamFromFileName = (fileName) => fileName
  .replace(/\.[^/.]+$/, "")
  .split(/\s+(?=\d|(?:home|away|third|treino|goleiro|special|aniversary|aniversario|oktoberfest|pre jogo|pré jogo)\b)/i)[0];

const createHomeProduct = ({ category, subcategory = "", tab = "", retro = false, team, league, title, image, description = "Camisa Tailandesa 1.1.", price = "R$ 119,90" }) => {
  const normalizedTitle = normalizarTexto(title);
  // Modelos atuais: fora retrô, feminina e infantil
  const current = !retro && !["feminina", "infantil", "kids"].includes(tab);

  return {
    category,
    subcategory,
    tab,
    retro,
    team: normalizarTexto(team),
    current,
    home: current && /\bhome\b/.test(normalizedTitle) && !/goleiro/.test(normalizedTitle),
    // grade de tamanhos usada no carrinho
    tipo: tab === "feminina" ? "feminina" : ["infantil", "kids"].includes(tab) ? "infantil" : "adulto",
    league,
    title,
    image,
    description,
    price,
    searchable: normalizarTexto(`${title} ${league}`)
  };
};

// "Mais vendidas": o site não tem dados de venda, então a ordem segue esta lista de times (edite à vontade).
// Vêm primeiro as camisas home atuais desses times, na ordem da lista; depois os outros modelos atuais deles; depois o restante.
const homeBestSellerTeams = [
  "Atlético Mineiro", "Cruzeiro", "Flamengo", "Corinthians", "Palmeiras",
  "Real Madrid", "Barcelona", "Manchester City", "PSG", "Liverpool", "Chelsea", "Milan", "Inter de Milão", "Juventus",
  "São Paulo", "Vasco", "Manchester United", "Arsenal", "Bayern Munich",
  "Brasil", "Argentina", "Portugal",
  "Boca Jrs", "River Plate", "Inter Miami", "Al Nassr"
];

const sortByBestSellers = (products) => {
  const ranks = new Map(homeBestSellerTeams.map((team, index) => [normalizarTexto(team), index]));
  const score = (product) => {
    const rank = ranks.get(product.team);

    if (rank === undefined || !product.current) {
      return Number.MAX_SAFE_INTEGER;
    }

    return (product.home ? 0 : homeBestSellerTeams.length) + rank;
  };

  return products
    .map((product, index) => ({ product, index, score: score(product) }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ product }) => product);
};

const sortAlphabetically = (products) => [...products].sort((a, b) => a.team.localeCompare(b.team, "pt-BR")
  || a.title.localeCompare(b.title, "pt-BR", { numeric: true }));

// As camisas dos clubes brasileiros ficam no HTML de cada clube; lemos as páginas listadas no menu
const loadBrasileiros = async () => {
  const links = [...document.querySelectorAll("[data-clube]")];
  const tabOrder = Object.keys(brasileirosTabs);

  const results = await Promise.allSettled(links.map(async (link) => {
    const response = await fetch(link.href);

    if (!response.ok) {
      throw new Error(`${link.href}: ${response.status}`);
    }

    const page = new DOMParser().parseFromString(await response.text(), "text/html");
    const club = cleanText(link);
    const key = clubKey(link);

    // Os botões das abas chamam abrirTab('id', this); guardamos id e nome para repetir as abas na home
    homeClubTabs[key] = [...page.querySelectorAll(".tab-btn")]
      .map((button) => ({
        id: ((button.getAttribute("onclick") || "").match(/abrirTab\('([^']+)'/) || [])[1],
        label: cleanText(button)
      }))
      .filter((tab) => tab.id);

    const tabLabels = Object.fromEntries(homeClubTabs[key].map(({ id, label }) => [id, label]));

    return [...page.querySelectorAll(".tab-content .produto-card")].map((card) => {
      const tab = card.closest(".tab-content").id;
      const image = card.querySelector("img");
      const tabLabel = (tabLabels[tab] || brasileirosTabs[tab] || tab).replace(/^Versão\s+/i, "");

      return {
        order: tabOrder.indexOf(tab),
        product: createHomeProduct({
          category: "brasileiros",
          subcategory: key,
          tab,
          retro: tab === "retro",
          team: club,
          league: `${club} · ${tabLabel}`,
          title: cleanText(card.querySelector("h4"), club),
          image: new URL(image.getAttribute("src"), link.href).href,
          description: cleanText(card.querySelector(".descricao"), "Camisa Tailandesa 1.1."),
          price: cleanText(card.querySelector(".preco"), "R$ 119,90")
        })
      };
    });
  }));

  const failed = results.filter((result) => result.status === "rejected");
  failed.forEach((result) => console.warn("Não foi possível carregar o clube:", result.reason));
  document.getElementById("home-notice").hidden = failed.length === 0;

  // Primeiro a versão torcedor de todos os clubes, depois retrô, feminina e infantil
  return results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .sort((a, b) => a.order - b.order)
    .map(({ product }) => product);
};

const loadOtherCatalogs = () => [
  ...europeusCatalog.map(([filter, fileName]) => createHomeProduct({
    category: "europeus",
    subcategory: filter,
    team: teamFromFileName(fileName),
    league: europeusLabels[filter],
    title: displayEuropeuName(fileName),
    image: europeuImagem(filter, fileName)
  })),
  ...[...selecoes]
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((fileName) => createHomeProduct({
      category: "selecoes",
      team: getTeamName(fileName),
      league: "Seleção",
      title: formatName(fileName),
      image: selecaoImagem(fileName)
    })),
  ...restoCatalog.map((fileName) => createHomeProduct({
    category: "resto",
    team: teamFromFileName(fileName),
    league: "Clubes internacionais",
    title: formatRestoName(fileName),
    image: restoImagem(fileName)
  })),
  ...retroCatalog.map(([club, fileName]) => createHomeProduct({
    category: "retro",
    retro: true,
    team: retroClubs[club] || club,
    league: `${retroClubs[club] || club} · Retrô`,
    title: formatRetroName(club, fileName),
    image: retroImagem(club, fileName),
    price: retroPrice
  }))
];

const createHomeCard = (product) => criarCardCamisa({
  imagem: product.image,
  titulo: product.title,
  liga: product.league,
  descricao: product.description,
  preco: product.price,
  tipo: product.tipo
});

const renderHome = () => {
  const grid = document.getElementById("home-grid");
  const count = document.getElementById("home-count");
  const empty = document.getElementById("home-empty");
  const pagination = document.getElementById("home-pagination");
  const previous = document.getElementById("home-previous");
  const next = document.getElementById("home-next");
  const pageStatus = document.getElementById("home-page-status");
  const query = normalizarTexto(document.getElementById("home-search").value.trim());

  const results = homeProducts.filter((product) => {
    // Camisas Retrô junta as retrô internacionais com a aba Retrô dos times brasileiros
    const matchesCategory = homeCategory === "all"
      || product.category === homeCategory
      || (homeCategory === "retro" && product.retro);
    const matchesSubcategory = homeSubcategory === "all" || product.subcategory === homeSubcategory;
    const matchesTab = homeTab === "all" || product.tab === homeTab;
    return matchesCategory && matchesSubcategory && matchesTab && (!query || product.searchable.includes(query));
  });

  // homeProducts já está na ordem de "Mais vendidas"
  const ordered = homeSort === "alfabetica" ? sortAlphabetically(results) : results;
  const totalPages = Math.max(1, Math.ceil(ordered.length / homePageSize));
  homePage = Math.min(homePage, totalPages);
  const start = (homePage - 1) * homePageSize;
  const visibleResults = ordered.slice(start, start + homePageSize);

  grid.innerHTML = visibleResults.map(createHomeCard).join("");
  count.textContent = `${results.length} ${results.length === 1 ? "camisa" : "camisas"}`;
  empty.hidden = results.length > 0;
  pagination.hidden = results.length === 0;
  pageStatus.textContent = `Página ${homePage} de ${totalPages}`;
  previous.disabled = homePage === 1;
  next.disabled = homePage === totalPages;
};

const getHomeFilterLabel = () => {
  if (homeSubcategory === "all") {
    return homeCategoryLabels[homeCategory] || "Todas as camisas";
  }

  return homeCategory === "europeus" ? europeusLabels[homeSubcategory] : homeClubNames[homeSubcategory];
};

const getClubTabs = (club) => (homeClubTabs[club] && homeClubTabs[club].length
  ? homeClubTabs[club]
  : ["torcedor", "retro", "feminina", "infantil"].map((id) => ({ id, label: brasileirosTabs[id] })));

// Mesmas abas da página do clube: aparecem só com um clube brasileiro selecionado
const renderHomeModelTabs = () => {
  const container = document.getElementById("home-model-tabs");
  const showTabs = homeCategory === "brasileiros" && homeSubcategory !== "all";

  container.hidden = !showTabs;
  container.innerHTML = showTabs
    ? getClubTabs(homeSubcategory).map(({ id, label }) => `
      <button class="tab-btn${id === homeTab ? " active" : ""}" type="button" data-tab="${id}" aria-pressed="${id === homeTab}">${escaparHtml(label)}</button>
    `).join("")
    : "";
};

// Subcategoria: liga (Europeus) ou clube (Times Brasileiros); aba: modelo do clube
const setHomeFilter = (category, subcategory = "all", tab = "all") => {
  homeCategory = category;
  homeSubcategory = subcategory;
  homeTab = tab;
  homePage = 1;

  document.querySelectorAll(".home-category").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
  });

  document.querySelectorAll(".home-club").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.club === subcategory));
  });

  document.getElementById("home-league").value = category === "europeus" ? subcategory : "all";
  document.getElementById("home-league-wrap").hidden = category !== "europeus";
  document.getElementById("home-clubs-wrap").hidden = category !== "brasileiros";
  document.getElementById("home-filter").hidden = category === "all";
  document.getElementById("home-filter-label").textContent = getHomeFilterLabel();
  renderHomeModelTabs();
  renderHome();

  if (category === "brasileiros") {
    updateHomeClubsScroll();
    nudgeHomeClubs();
  }
};

// Mostra o aviso de deslizar e o esmaecido nas bordas só quando há clubes fora da tela
const updateHomeClubsScroll = () => {
  const clubs = document.getElementById("home-clubs");
  const scroller = document.getElementById("home-clubs-scroller");
  const maxScroll = clubs.scrollWidth - clubs.clientWidth;

  document.getElementById("home-clubs-hint").hidden = maxScroll <= 1;
  scroller.classList.toggle("can-scroll-left", clubs.scrollLeft > 1);
  scroller.classList.toggle("can-scroll-right", clubs.scrollLeft < maxScroll - 1);
};

// Na primeira vez que os escudos aparecem, desliza um pouco e volta para mostrar que a lista rola
const nudgeHomeClubs = () => {
  const clubs = document.getElementById("home-clubs");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (homeClubsNudged || reduceMotion || clubs.scrollWidth <= clubs.clientWidth) {
    return;
  }

  homeClubsNudged = true;
  setTimeout(() => {
    clubs.scrollTo({ left: 72, behavior: "smooth" });
    setTimeout(() => clubs.scrollTo({ left: 0, behavior: "smooth" }), 650);
  }, 500);
};

const setupHomeClubs = () => {
  const container = document.getElementById("home-clubs");

  container.innerHTML = [...document.querySelectorAll("[data-clube]")].map((link) => {
    const key = clubKey(link);
    const crest = link.dataset.escudo ? `<img src="${encodeURI(link.dataset.escudo)}" alt="" loading="lazy">` : "";
    homeClubNames[key] = cleanText(link);

    return `
      <button class="home-club" type="button" data-club="${key}" aria-pressed="false" title="${escaparHtml(homeClubNames[key])}">
        <span class="home-club-crest">${crest}</span>
        <span class="home-club-name">${escaparHtml(homeClubNames[key])}</span>
      </button>
    `;
  }).join("");

  container.querySelectorAll(".home-club").forEach((button) => {
    button.addEventListener("click", () => {
      const club = button.dataset.club;

      if (homeSubcategory === club) {
        setHomeFilter("brasileiros");
      } else {
        // Como na página do clube, abre na Versão Torcedor
        setHomeFilter("brasileiros", club, getClubTabs(club)[0].id);
      }
    });
  });

  document.getElementById("home-model-tabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");

    if (tab) {
      setHomeFilter("brasileiros", homeSubcategory, tab.dataset.tab);
      // As abas são redesenhadas; devolve o foco para quem navega pelo teclado
      document.querySelector(`#home-model-tabs [data-tab="${tab.dataset.tab}"]`).focus();
    }
  });

  container.addEventListener("scroll", updateHomeClubsScroll, { passive: true });
  window.addEventListener("resize", updateHomeClubsScroll);
};

const scrollToCatalog = () => {
  document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
};

const setupHomeMenu = () => {
  const menu = document.getElementById("home-menu");
  const openButton = document.getElementById("home-menu-open");
  const closeButton = menu.querySelector("button[data-menu-close]");

  const toggleMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    openButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("home-menu-open", open);
    (open ? closeButton : openButton).focus();
  };

  openButton.addEventListener("click", () => toggleMenu(true));
  menu.querySelectorAll("[data-menu-close]").forEach((element) => {
    element.addEventListener("click", () => toggleMenu(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      toggleMenu(false);
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const search = document.getElementById("home-search");
  const league = document.getElementById("home-league");
  const previous = document.getElementById("home-previous");
  const next = document.getElementById("home-next");

  setupHomeMenu();
  setupHomeClubs();

  document.querySelectorAll(".home-category").forEach((button) => {
    button.addEventListener("click", () => {
      setHomeFilter(homeCategory === button.dataset.category ? "all" : button.dataset.category);
      scrollToCatalog();
    });
  });

  document.getElementById("home-clear-filter").addEventListener("click", () => setHomeFilter("all"));

  document.getElementById("home-sort").addEventListener("change", (event) => {
    homeSort = event.target.value;
    homePage = 1;
    renderHome();
  });

  search.addEventListener("input", () => {
    homePage = 1;
    renderHome();
  });

  league.insertAdjacentHTML("beforeend", Object.entries(europeusLabels)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join(""));

  league.addEventListener("change", () => setHomeFilter("europeus", league.value));

  previous.addEventListener("click", () => {
    homePage -= 1;
    renderHome();
    scrollToCatalog();
  });

  next.addEventListener("click", () => {
    homePage += 1;
    renderHome();
    scrollToCatalog();
  });

  homeProducts = sortByBestSellers([...await loadBrasileiros(), ...loadOtherCatalogs()]);
  renderHomeModelTabs();
  renderHome();
});
