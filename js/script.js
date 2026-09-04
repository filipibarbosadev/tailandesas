const selecoes = [
  'africa2026away.jpg',
  'africa2026home.jpg',
  'alemanhaaway.jpg',
  'alemanhahome2026.jpg',
  'arabiasauditaaway2026.jpg',
  'arabiasauditahome2026.jpg',
  'argeliaaway2026.jpg',
  'argeliahome2026.jpg',
  'argeliatreino2026.jpg',
  'argentinaaway2026.jpg',
  'argentinagoleiro2026.jpg',
  'argentinahome.png',
  'argentinahome2026.jpg',
  'argentinaprejogo.png',
  'australiaaway2026.jpg',
  'australiahome2026.jpg',
  'austriaaway2026.jpg',
  'austriahome2026.jpg',
  'belgica2026away.jpg',
  'belgica2026home.jpg',
  'bosniaaway2026.jpg',
  'bosniahome2026.jpg',
  'brasil.png',
  'brasilaway.png',
  'BRASILGOLEIRO2026.jpg',
  'CABOVERDE GOLEIROAMARELO 2026.png',
  'CABOVERDEAWAY2026.jpg',
  'CABOVERDEGOLEIROLARANJA2026.png',
  'CABOVERDEGOLEIROROSA2026.png',
  'CABOVERDEHOME2026.jpg',
  'camisa portugal rosa 2026.jpg',
  'canadaaway2026.jpg',
  'canadahome2026.png',
  'cataraway2026.jpg',
  'CATARHOME2026.jpg',
  'colombiaaway2026.jpg',
  'colombiahome2026.jpg',
  'colombiatreinobranca2026.jpg',
  'congoaway2026.jpg',
  'congohome2026.jpg',
  'COREIADOSULAWAY2026.jpg',
  'COREIADOSULHOME2026.png',
  'COSTADOMARFIMAWAY2026.png',
  'COSTADOMARFIMHOME2026.jpg',
  'costaricaaway2026.jpg',
  'costaricahome2026.jpg',
  'croaciaaway2026.png',
  'croaciahome2026.jpg',
  'curacaoaway2026.jpg',
  'egitoaway2026.jpg',
  'egitohome2026.png',
  'equadoraway2026.jpg',
  'EQUADORHOME2026.jpg',
  'escociaaway2026.jpg',
  'escociahome2026.jpg',
  'espanhaaway.png',
  'espanhagoleiro2026.jpg',
  'espanhagoleirored2026.jpg',
  'espanhahome.jpg',
  'espanhatreino2026.jpg',
  'estadosunidosaway2026.jpg',
  'estadosunidosgoleiro2026.jpg',
  'estadosunidoshome2026.jpg',
  'francaaway2026.jpg',
  'francagoleiro2026.jpg',
  'francahome2026.jpg',
  'ganaaway2026.png',
  'ganahome2026.png',
  'haitiaway2026.jpg',
  'haitihome2026.jpg',
  'holanda2026home.jpg',
  'holandaaway2026.png',
  'INGLATERRAAWAY2026.jpg',
  'inglaterragoleiroazul2026.jpg',
  'INGLATERRAHOME2026.jpg',
  'INGLATERRATREINO2026.jpg',
  'IRAAWAY2026.jpg',
  'IRAHOME2026.jpg',
  'IRAQUEAWAY2026.jpg',
  'IRAQUEHOME2026.jpg',
  'italiahome.jpg',
  'japao home.jpg',
  'JAPAOHOME2026.jpg',
  'JAPÃOAWAY2026.jpg',
  'JORDANIAAWAY2026.jpg',
  'JORDANIAHOME2026.jpg',
  'MARROCOSAWAY2026.jpg',
  'MARROCOSHOME2026.jpg',
  'MEXICOAWAY2026.jpg',
  'MEXICOGOLEIRO2026.jpg',
  'MEXICOHOME2026.jpg',
  'MEXICOTHIRD2026.jpg',
  'noruega2026away.jpg',
  'noruega2026home.jpg',
  'novazelandiaaway2026.jpg',
  'novazelandiahome2026.jpg',
  'panamaaway2026.jpg',
  'panamahome2026.jpg',
  'panamathird2026.jpg',
  'paraguaiaway2026.jpg',
  'paraguaihome2026.jpg',
  'portugalaquecimento vermelha2026.jpg',
  'portugalaquecimento2026.jpg',
  'portugalaway2026.jpg',
  'portugalgoleirocinza2026.jpg',
  'portugalhome2026.jpg',
  'republicachecaaway.jpg',
  'republicachecahome.jpg',
  'SENEGALAWAY2026.jpg',
  'SENEGALHOME2026.jpg',
  'sueciaaway2026.jpg',
  'sueciahome2026.jpg',
  'SUICAAWAY2026.jpg',
  'SUICAHOME2026.jpg',
  'tunisiaaway2026.jpg',
  'tunisiahome2026.jpg',
  'tunisiathird2026.jpg',
  'turquiaaway2026.jpg',
  'turquiahome2026.jpg',
  'uruguayaway2026.jpg',
  'uruguayhome2026.jpg'
];

const teamAliases = {
  'africa': 'África',
  'alemanha': 'Alemanha',
  'arabiasaudita': 'Arábia Saudita',
  'argelia': 'Argélia',
  'argentina': 'Argentina',
  'australia': 'Austrália',
  'austria': 'Áustria',
  'belgica': 'Bélgica',
  'bosnia': 'Bósnia',
  'brasil': 'Brasil',
  'caboverde': 'Cabo Verde',
  'canada': 'Canadá',
  'catar': 'Catar',
  'colombia': 'Colômbia',
  'congo': 'Congo',
  'coreiadosul': 'Coreia do Sul',
  'costadomarfim': 'Costa do Marfim',
  'costarica': 'Costa Rica',
  'croacia': 'Croácia',
  'curacao': 'Curaçao',
  'egito': 'Egito',
  'equador': 'Equador',
  'escocia': 'Escócia',
  'espanha': 'Espanha',
  'estadosunidos': 'Estados Unidos',
  'franca': 'França',
  'gana': 'Gana',
  'haiti': 'Haiti',
  'holanda': 'Holanda',
  'inglaterra': 'Inglaterra',
  'ira': 'Irã',
  'iraque': 'Iraque',
  'italia': 'Itália',
  'japao': 'Japão',
  'jordania': 'Jordânia',
  'marrocos': 'Marrocos',
  'mexico': 'México',
  'noruega': 'Noruega',
  'novazelandia': 'Nova Zelândia',
  'panama': 'Panamá',
  'paraguai': 'Paraguai',
  'portugal': 'Portugal',
  'republicacheca': 'República Tcheca',
  'senegal': 'Senegal',
  'suecia': 'Suécia',
  'suica': 'Suíça',
  'tunisia': 'Tunísia',
  'turquia': 'Turquia',
  'uruguay': 'Uruguai'
};

const normalizeText = (text) => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const getTeamName = (fileName) => {
  const cleaned = fileName.replace(/\.[^/.]+$/, '').replace(/\s+/g, '');
  const normalized = normalizeText(cleaned);

  const foundTeam = Object.keys(teamAliases).find((team) => normalized.includes(team));

  if (foundTeam) {
    return teamAliases[foundTeam];
  }

  const fallback = cleaned
    .replace(/(home|away|goleiro|third|treino|prejogo|aquecimento|amarelo|laranja|rosa|cinza|red|branca|verde|azul|vermelha|2026|2027)/gi, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  return fallback ? fallback.replace(/\b\w/g, (char) => char.toUpperCase()) : 'Seleção';
};

const getVariantName = (fileName) => {
  const normalized = normalizeText(fileName);

  const partList = [
    ['goleiroamarelo', 'Goleiro Amarelo'],
    ['goleirolaranja', 'Goleiro Laranja'],
    ['goleirorosa', 'Goleiro Rosa'],
    ['goleiroazul', 'Goleiro Azul'],
    ['goleirocinza', 'Goleiro Cinza'],
    ['goleirored', 'Goleiro Red'],
    ['goleiro', 'Goleiro'],
    ['third', 'Third'],
    ['treino', 'Treino'],
    ['prejogo', 'Pre Jogo'],
    ['aquecimento', 'Aquecimento'],
    ['vermelha', 'Vermelha'],
    ['away', 'Away'],
    ['home', 'Home'],
    ['amarelo', 'Amarelo'],
    ['laranja', 'Laranja'],
    ['rosa', 'Rosa'],
    ['cinza', 'Cinza'],
    ['red', 'Red'],
    ['branca', 'Branca'],
    ['azul', 'Azul']
  ];

  const variant = partList.find(([token]) => normalized.includes(token));
  return variant ? variant[1] : 'Home';
};

const getYear = (fileName) => {
  const match = fileName.match(/20\d{2}/);
  return match ? match[0] : '2026';
};

const formatName = (fileName) => {
  const team = getTeamName(fileName);
  const variant = getVariantName(fileName);
  const year = getYear(fileName);

  return `Camisa ${team} ${variant} ${year}`;
};

const createCard = (fileName) => {
  const imagePath = `assets/camisas/selecoes/${fileName}`;
  const title = formatName(fileName);
  const encodedPath = encodeURI(imagePath);

  return `
    <article class="catalog-card">
      <a class="catalog-card-media" href="${encodedPath}" target="_blank" rel="noopener noreferrer">
        <img src="${encodedPath}" alt="${title}" loading="lazy">
      </a>
      <div class="catalog-card-content">
        <span class="catalog-card-league">Seleção</span>
        <h2>${title}</h2>
        <p>Camisa Tailandesa 1.1.</p>
        <strong>R$ 119,90</strong>
      </div>
    </article>
  `;
};

const selecoesPageSize = 24;
let selecoesPage = 1;

const renderSelecoes = (term = '') => {
  const container = document.getElementById('selecoes-container');

  if (!container) {
    return;
  }

  const count = document.getElementById('selecoes-count');
  const empty = document.getElementById('selecoes-empty');
  const pagination = document.getElementById('selecoes-pagination');
  const previous = document.getElementById('selecoes-previous');
  const next = document.getElementById('selecoes-next');
  const pageStatus = document.getElementById('selecoes-page-status');
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

  container.innerHTML = visibleResults.map(createCard).join('');
  count.textContent = `${resultados.length} ${resultados.length === 1 ? 'camisa encontrada' : 'camisas encontradas'}`;
  empty.hidden = resultados.length > 0;
  pagination.hidden = resultados.length === 0;
  pageStatus.textContent = `Página ${selecoesPage} de ${totalPages}`;
  previous.disabled = selecoesPage === 1;
  next.disabled = selecoesPage === totalPages;
};

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('filtro-selecoes');
  const previous = document.getElementById('selecoes-previous');
  const next = document.getElementById('selecoes-next');

  renderSelecoes();

  if (input) {
    input.addEventListener('input', (event) => {
      selecoesPage = 1;
      renderSelecoes(event.target.value);
    });
  }

  if (previous && next) {
    previous.addEventListener('click', () => {
      selecoesPage -= 1;
      renderSelecoes(input.value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      selecoesPage += 1;
      renderSelecoes(input.value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});