# Mantos FC — catálogo de camisas

Site estático (HTML, CSS e JavaScript puros, sem build). Os clientes escolhem camisas e tamanhos, montam o carrinho e finalizam o pedido pelo WhatsApp.

## Estrutura

```
index.html                  Página inicial: categorias, filtros, busca, ordenação e todas as camisas
europeus.html               Catálogo de clubes europeus (filtro por campeonato)
selecoes.html               Catálogo de seleções
resto-do-mundo.html         Catálogo de clubes fora da Europa
clubes/<clube>.html         Uma página por clube brasileiro, com as abas Torcedor/Retrô/Feminina/Infantil
404.html                    Página de erro; também redireciona os endereços antigos do site

assets/
  css/
    base.css                Regras comuns a todas as páginas
    catalogo.css            Páginas de catálogo e cards de camisa
    abas.css                Abas de modelo (clubes e home)
    clube.css               Páginas dos clubes
    home.css                Página inicial
    carrinho.css            Botão Comprar, escolha de tamanho, carrinho e aviso
  js/
    util.js                 Funções comuns (normalizar texto, escapar HTML)
    componentes/
      card-camisa.js        Card de camisa (home e catálogos)
      carrinho.js           Carrinho de compras e envio pelo WhatsApp
    dados/                  Listas de camisas de cada catálogo
      europeus.js  selecoes.js  resto-do-mundo.js  retro.js
    paginas/                Comportamento de cada página
      home.js  europeus.js  selecoes.js  resto-do-mundo.js  clube.js
  img/
    banners/                Banner da home (desktop e mobile) e banners de campanha
    categorias/             Ícones das 5 categorias da home
    escudos/                Escudos dos clubes brasileiros (originais/ tem as versões grandes)
    camisas/                Fotos das camisas
      brasileiros/  europeus/<liga>/  resto-do-mundo/  retro/<clube>/  selecoes/
```

## Tarefas comuns

**Camisa de clube brasileiro:** coloque a foto em `assets/img/camisas/brasileiros/` e copie um bloco `produto-card` dentro da aba certa em `clubes/<clube>.html`. A home e o carrinho leem essas páginas automaticamente.
Para uma grade de tamanhos diferente do padrão, acrescente no card algo como `<div class="tamanhos">P • M • G • GG</div>`.

**Clube brasileiro novo:** crie `clubes/<clube>.html` a partir de uma página existente, coloque o escudo em `assets/img/escudos/` e adicione o link no menu do `index.html` com `data-clube` e `data-escudo`.

**Camisa europeia, seleção, resto do mundo ou retrô internacional:** coloque a foto na pasta da categoria e acrescente o nome do arquivo na lista correspondente em `assets/js/dados/`. O nome exibido é montado a partir do nome do arquivo (ex.: `real madrid 26-27 home.jpg` → "Real Madrid 2026/27 Home").

**Tamanhos, personalização (valor e limite de letras/dígitos), número do WhatsApp e nome da loja:** no início de `assets/js/componentes/carrinho.js` (`CONFIG`). O valor da personalização fica em centavos (`3000` = R$ 30,00).

**Preço das retrô internacionais:** `retroPrice` em `assets/js/dados/retro.js`. Os demais preços estão em cada card (clubes) ou no padrão de `criarCardCamisa` (R$ 119,90).

**Ordem de "Mais vendidas":** lista `homeBestSellerTeams` em `assets/js/paginas/home.js`.

## Testar no computador

As camisas dos clubes brasileiros são lidas das páginas em `clubes/`, e o navegador só permite isso com o site servido por um servidor. Abrir o `index.html` com dois cliques não mostra essas camisas. Use a extensão Live Server do VS Code ou, na pasta do projeto:

```
python3 -m http.server 8000
```

e abra http://localhost:8000.
