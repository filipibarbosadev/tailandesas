// Card de camisa usado na home e nas páginas de catálogo (Europeus, Seleções, Resto do Mundo).
// Os atributos data-* são lidos pelo carrinho (componentes/carrinho.js) ao clicar em "Comprar" ou na foto.

// Também usado pelo carrinho nos cards escritos direto no HTML das páginas dos clubes
const botaoComprarHtml = `<button class="botao-comprar" type="button" data-comprar><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.6-6.8H6.1"/></svg><span>Comprar</span></button>`;

// tipo: "adulto", "feminina" ou "infantil" (define a grade de tamanhos no carrinho)
const criarCardCamisa = ({ imagem, titulo, liga, descricao = "Camisa Tailandesa 1.1.", preco = "R$ 119,90", tipo = "adulto" }) => `
    <article class="catalog-card" data-titulo="${escaparHtml(titulo)}" data-liga="${escaparHtml(liga)}" data-preco="${escaparHtml(preco)}" data-imagem="${escaparHtml(imagem)}" data-tipo="${tipo}">
      <a class="catalog-card-media" href="${imagem}" target="_blank" rel="noopener noreferrer">
        <img src="${imagem}" alt="${escaparHtml(titulo)}" loading="lazy">
      </a>
      <div class="catalog-card-content">
        <span class="catalog-card-league">${escaparHtml(liga)}</span>
        <h2>${escaparHtml(titulo)}</h2>
        <p>${escaparHtml(descricao)}</p>
        <strong>${escaparHtml(preco)}</strong>
        ${botaoComprarHtml}
      </div>
    </article>
  `;
