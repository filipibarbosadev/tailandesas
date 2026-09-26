// Carrinho de compras: escolha de tamanho, carrinho lateral e finalização pelo WhatsApp.
// Funciona em todas as páginas; os itens ficam salvos no navegador do cliente (localStorage).
// Depende de util.js (escaparHtml) e componentes/card-camisa.js (botaoComprarHtml), carregados antes.
(() => {
  // ---------- Configuração da loja (edite aqui) ----------
  const CONFIG = {
    loja: "Mantos FC",
    whatsapp: "553899928529",
    tamanhos: {
      adulto: ["P", "M", "G", "GG", "2XL", "3XL", "4XL"],
      feminina: ["P", "M", "G", "GG"],
      infantil: ["2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos", "14 anos"]
    },
    // Personalização com nome e número: valor somado a cada camisa personalizada (em centavos)
    personalizacao: {
      preco: 3000,
      maxNome: 12,
      maxNumero: 2
    }
  };

  const CHAVE_STORAGE = "mantosfc-carrinho";

  const icones = {
    carrinho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.6-6.8H6.1"/></svg>',
    fechar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    lixeira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 12.5h9.4L17.5 7"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.29Z"/></svg>'
  };

  // ---------- Utilidades ----------
  const texto = (elemento) => (elemento ? elemento.textContent.replace(/\s+/g, " ").trim() : "");

  // "R$ 1.119,90" → 111990 (centavos, para somar sem erro de arredondamento)
  const paraCentavos = (preco) => {
    const m = String(preco).replace(/\s/g, "").match(/(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})/);
    return m ? Number(m[1].replace(/\./g, "")) * 100 + Number(m[2]) : 0;
  };

  const formatoReal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const emReais = (centavos) => formatoReal.format(centavos / 100);
  const plural = (n, singular, pluralTexto) => `${n} ${n === 1 ? singular : pluralTexto}`;

  // ---------- Estado (salvo no navegador) ----------
  const ler = () => {
    try {
      const itens = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || "[]");
      return Array.isArray(itens) ? itens : [];
    } catch {
      return [];
    }
  };

  let itens = ler();

  const salvar = () => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
    } catch {
      // navegação privada ou armazenamento bloqueado: o carrinho vale só enquanto a página estiver aberta
    }
  };

  // A mesma camisa com tamanho ou personalização diferente é outro item
  const chaveItem = (item) => {
    const personalizacao = item.personalizacao ? `${item.personalizacao.nome}#${item.personalizacao.numero}` : "";
    return `${item.id}|${item.tamanho}|${personalizacao}`;
  };

  // Valor de uma unidade já com a personalização ("extra" guarda o acréscimo cobrado ao adicionar)
  const precoUnitario = (item) => item.preco + (item.extra || 0);
  const quantidadeTotal = () => itens.reduce((soma, item) => soma + item.qtd, 0);
  const valorTotal = () => itens.reduce((soma, item) => soma + precoUnitario(item) * item.qtd, 0);

  // { nome: "SILVA", numero: "10" } → "SILVA · 10"
  const textoPersonalizacao = (personalizacao) => [personalizacao.nome, personalizacao.numero].filter(Boolean).join(" · ");

  const adicionar = (camisa, tamanho, qtd, personalizacao) => {
    const novo = { ...camisa, tamanho, qtd, personalizacao, extra: personalizacao ? CONFIG.personalizacao.preco : 0 };
    const existente = itens.find((item) => chaveItem(item) === chaveItem(novo));

    if (existente) {
      existente.qtd += qtd;
    } else {
      itens.push(novo);
    }

    salvar();
    atualizar();
  };

  const alterarQuantidade = (chave, diferenca) => {
    const item = itens.find((i) => chaveItem(i) === chave);

    if (!item) {
      return;
    }

    item.qtd += diferenca;
    itens = itens.filter((i) => i.qtd > 0);
    salvar();
    atualizar();
  };

  const remover = (chave) => {
    itens = itens.filter((i) => chaveItem(i) !== chave);
    salvar();
    atualizar();
  };

  // ---------- Mensagem do WhatsApp ----------
  const montarMensagem = () => {
    const linhas = itens.map((item, indice) => {
      const unitario = precoUnitario(item);
      const valor = item.qtd > 1
        ? `${item.qtd} x ${emReais(unitario)} = ${emReais(unitario * item.qtd)}`
        : emReais(unitario);
      const partes = [`*${indice + 1}. ${item.titulo}*`, `Tamanho: ${item.tamanho} | Qtd: ${item.qtd} | ${valor}`];

      if (item.personalizacao) {
        const { nome, numero } = item.personalizacao;
        const detalhes = [nome && `nome ${nome}`, numero && `número ${numero}`].filter(Boolean).join(", ");
        partes.push(`Personalização: ${detalhes} (+ ${emReais(item.extra)} por camisa)`);
      }

      // O link da foto ajuda a identificar modelos com o mesmo nome
      if (/^https?:/.test(item.imagem)) {
        partes.push(`Foto: ${item.imagem}`);
      }

      return partes.join("\n");
    });

    return [
      `Olá! Quero fazer este pedido pelo site da ${CONFIG.loja}:`,
      "",
      linhas.join("\n\n"),
      "",
      `*Total: ${emReais(valorTotal())}* (${plural(quantidadeTotal(), "camisa", "camisas")})`
    ].join("\n");
  };

  const linkWhatsApp = () => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(montarMensagem())}`;

  // ---------- Camisa a partir de um card ----------
  // Cards com data-titulo, data-liga, data-preco, data-imagem, data-tipo e (opcional) data-tamanhos="P,M,G"
  const lerCamisa = (card) => {
    const imagem = new URL(card.dataset.imagem, location.href).href;
    const tamanhos = card.dataset.tamanhos
      ? card.dataset.tamanhos.split(",").map((t) => t.trim()).filter(Boolean)
      : CONFIG.tamanhos[card.dataset.tipo] || CONFIG.tamanhos.adulto;

    return {
      id: imagem,
      titulo: card.dataset.titulo,
      liga: card.dataset.liga || "",
      preco: paraCentavos(card.dataset.preco),
      imagem,
      tipo: card.dataset.tipo || "adulto",
      tamanhos
    };
  };

  const tipoPorAba = (aba) => {
    if (aba === "feminina") {
      return "feminina";
    }

    return aba === "infantil" || aba === "kids" ? "infantil" : "adulto";
  };

  // As páginas dos clubes têm os cards escritos direto no HTML; aqui eles ganham os dados e o botão Comprar
  // (botaoComprarHtml vem de componentes/card-camisa.js)
  const prepararCardsDosClubes = () => {
    const clube = texto(document.querySelector("h1"));

    document.querySelectorAll(".produto-card").forEach((card) => {
      if (card.dataset.titulo) {
        return;
      }

      const aba = card.closest(".tab-content");
      const idAba = aba ? aba.id : "";
      const botaoAba = idAba ? document.querySelector(`.tab-btn[onclick*="'${idAba}'"]`) : null;
      const nomeAba = texto(botaoAba).replace(/^Versão\s+/i, "");
      const tamanhos = card.querySelector(".tamanhos");

      card.dataset.titulo = texto(card.querySelector("h4"));
      card.dataset.liga = [clube, nomeAba].filter(Boolean).join(" · ");
      card.dataset.preco = texto(card.querySelector(".preco"));
      card.dataset.imagem = card.querySelector("img").getAttribute("src");
      card.dataset.tipo = tipoPorAba(idAba);

      if (tamanhos) {
        card.dataset.tamanhos = texto(tamanhos).split("•").map((t) => t.trim()).join(",");
      }

      card.querySelector(".produto-info").insertAdjacentHTML("beforeend", botaoComprarHtml);
    });
  };

  // ---------- Janelas: foco, Esc e rolagem da página ----------
  let janelaAberta = null;
  let focoAnterior = null;

  const focaveis = (elemento) => [...elemento.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])")]
    .filter((e) => e.getClientRects().length > 0);

  const abrirJanela = (janela, focarEm) => {
    if (janelaAberta && janelaAberta !== janela) {
      fecharJanela(janelaAberta, false);
    }

    focoAnterior = focoAnterior || document.activeElement;
    janelaAberta = janela;
    janela.hidden = false;
    // espera um quadro para a animação de entrada funcionar
    requestAnimationFrame(() => janela.classList.add("aberto"));
    document.documentElement.classList.add("carrinho-travado");
    (focarEm || focaveis(janela)[0] || janela).focus();
  };

  const fecharJanela = (janela, devolverFoco = true) => {
    janela.classList.remove("aberto");
    janela.hidden = true;
    janelaAberta = null;
    document.documentElement.classList.remove("carrinho-travado");

    if (devolverFoco && focoAnterior && document.contains(focoAnterior)) {
      focoAnterior.focus();
    }

    focoAnterior = null;
  };

  document.addEventListener("keydown", (evento) => {
    if (!janelaAberta) {
      return;
    }

    if (evento.key === "Escape") {
      fecharJanela(janelaAberta);
      return;
    }

    // mantém o Tab dentro da janela aberta
    if (evento.key === "Tab") {
      const lista = focaveis(janelaAberta);
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  });

  // ---------- Montagem dos elementos ----------
  let escolha, painel, aviso, camisaEscolhida = null, timerAviso = null;

  const montarEscolha = () => {
    escolha = document.createElement("div");
    escolha.className = "carrinho-escolha";
    escolha.hidden = true;
    escolha.innerHTML = `
      <div class="carrinho-fundo" data-fechar></div>
      <div class="carrinho-escolha-caixa" role="dialog" aria-modal="true" aria-labelledby="carrinho-escolha-titulo">
        <button class="carrinho-fechar" type="button" aria-label="Fechar" data-fechar>${icones.fechar}</button>
        <div class="carrinho-escolha-foto"><img alt=""></div>
        <form class="carrinho-escolha-info" novalidate>
          <span class="carrinho-escolha-liga"></span>
          <h2 id="carrinho-escolha-titulo"></h2>
          <div class="carrinho-escolha-valor">
            <strong class="carrinho-escolha-preco"></strong>
            <span class="carrinho-escolha-extra" hidden></span>
          </div>

          <fieldset class="carrinho-tamanhos">
            <legend>Escolha o tamanho</legend>
            <div class="carrinho-tamanhos-opcoes"></div>
          </fieldset>
          <p class="carrinho-erro" data-erro="tamanho" role="alert" hidden>Escolha um tamanho para continuar.</p>

          <div class="carrinho-personalizar">
            <label class="carrinho-opcao">
              <input type="checkbox" name="personalizar">
              <span class="carrinho-opcao-caixa" aria-hidden="true"></span>
              <span class="carrinho-opcao-texto">
                <strong>Personalizar com nome e número</strong>
                <small>+ ${emReais(CONFIG.personalizacao.preco)} por camisa</small>
              </span>
            </label>
            <div class="carrinho-personalizar-campos" hidden>
              <label class="carrinho-campo">
                Nome
                <input type="text" name="personalizacao-nome" maxlength="${CONFIG.personalizacao.maxNome}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Ex.: SILVA">
              </label>
              <label class="carrinho-campo">
                Número
                <input type="text" name="personalizacao-numero" maxlength="${CONFIG.personalizacao.maxNumero}" inputmode="numeric" autocomplete="off" placeholder="10">
              </label>
            </div>
            <p class="carrinho-erro" data-erro="personalizacao" role="alert" hidden>Preencha o nome ou o número da personalização.</p>
          </div>

          <div class="carrinho-quantidade-linha">
            <span id="carrinho-qtd-rotulo">Quantidade</span>
            <div class="carrinho-qtd" role="group" aria-labelledby="carrinho-qtd-rotulo">
              <button type="button" data-qtd="-1" aria-label="Diminuir quantidade">−</button>
              <output aria-live="polite">1</output>
              <button type="button" data-qtd="1" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>

          <button class="carrinho-botao-principal" type="submit">${icones.carrinho}<span>Adicionar ao carrinho</span></button>
          <a class="carrinho-ver-foto" target="_blank" rel="noopener noreferrer">Ver foto ampliada</a>
        </form>
      </div>
    `;
    document.body.appendChild(escolha);

    const form = escolha.querySelector("form");
    const saida = escolha.querySelector("output");

    escolha.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-fechar]")) {
        fecharJanela(escolha);
      }

      const botaoQtd = evento.target.closest("[data-qtd]");

      if (botaoQtd) {
        saida.value = Math.min(20, Math.max(1, Number(saida.value) + Number(botaoQtd.dataset.qtd)));
      }
    });

    const personalizar = form.querySelector("input[name='personalizar']");
    const campos = form.querySelector(".carrinho-personalizar-campos");
    const nome = form.querySelector("input[name='personalizacao-nome']");
    const numero = form.querySelector("input[name='personalizacao-numero']");
    const erro = (tipo) => form.querySelector(`[data-erro='${tipo}']`);

    form.addEventListener("change", (evento) => {
      if (evento.target.name === "carrinho-tamanho") {
        erro("tamanho").hidden = true;
      }
    });

    personalizar.addEventListener("change", () => {
      campos.hidden = !personalizar.checked;
      erro("personalizacao").hidden = true;
      atualizarPrecoEscolha();

      if (personalizar.checked) {
        nome.focus();
      }
    });

    // Nome: só letras, espaços, ponto, hífen e apóstrofo; número: só dígitos
    nome.addEventListener("input", () => {
      nome.value = nome.value.replace(/[^\p{L} .'’-]/gu, "").slice(0, CONFIG.personalizacao.maxNome);
      erro("personalizacao").hidden = true;
    });

    numero.addEventListener("input", () => {
      numero.value = numero.value.replace(/\D/g, "").slice(0, CONFIG.personalizacao.maxNumero);
      erro("personalizacao").hidden = true;
    });

    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const marcado = form.querySelector("input[name='carrinho-tamanho']:checked");

      if (!marcado) {
        erro("tamanho").hidden = false;
        form.querySelector("input[name='carrinho-tamanho']").focus();
        return;
      }

      let personalizacao = null;

      if (personalizar.checked) {
        personalizacao = {
          nome: nome.value.replace(/\s+/g, " ").trim().toUpperCase(),
          numero: numero.value.trim()
        };

        if (!personalizacao.nome && !personalizacao.numero) {
          erro("personalizacao").hidden = false;
          nome.focus();
          return;
        }
      }

      const { tamanhos, ...camisa } = camisaEscolhida;
      adicionar(camisa, marcado.value, Number(saida.value), personalizacao);
      fecharJanela(escolha);
      mostrarAviso([camisa.titulo, `Tamanho ${marcado.value}`, personalizacao && textoPersonalizacao(personalizacao)].filter(Boolean).join(" · "));
    });
  };

  // Mostra o preço com o acréscimo quando a personalização está marcada
  const atualizarPrecoEscolha = () => {
    const personalizado = escolha.querySelector("input[name='personalizar']").checked;
    const extra = personalizado ? CONFIG.personalizacao.preco : 0;
    const detalhe = escolha.querySelector(".carrinho-escolha-extra");

    escolha.querySelector(".carrinho-escolha-preco").textContent = emReais(camisaEscolhida.preco + extra);
    detalhe.hidden = !personalizado;
    detalhe.textContent = `${emReais(camisaEscolhida.preco)} + ${emReais(extra)} de personalização`;
  };

  const abrirEscolha = (camisa) => {
    camisaEscolhida = camisa;
    const foto = escolha.querySelector(".carrinho-escolha-foto img");
    foto.src = camisa.imagem;
    foto.alt = camisa.titulo;
    escolha.querySelector(".carrinho-escolha-liga").textContent = camisa.liga;
    escolha.querySelector("h2").textContent = camisa.titulo;
    escolha.querySelector(".carrinho-ver-foto").href = camisa.imagem;
    escolha.querySelector("output").value = 1;
    escolha.querySelectorAll(".carrinho-erro").forEach((erro) => {
      erro.hidden = true;
    });
    escolha.querySelector("input[name='personalizar']").checked = false;
    escolha.querySelector(".carrinho-personalizar-campos").hidden = true;
    escolha.querySelector("input[name='personalizacao-nome']").value = "";
    escolha.querySelector("input[name='personalizacao-numero']").value = "";
    atualizarPrecoEscolha();
    escolha.querySelector(".carrinho-tamanhos legend").textContent = camisa.tipo === "infantil" ? "Escolha o tamanho (idade)" : "Escolha o tamanho";
    escolha.querySelector(".carrinho-tamanhos-opcoes").innerHTML = camisa.tamanhos.map((tamanho) => `
      <label class="carrinho-tamanho">
        <input type="radio" name="carrinho-tamanho" value="${escaparHtml(tamanho)}">
        <span>${escaparHtml(tamanho)}</span>
      </label>
    `).join("");
    abrirJanela(escolha, escolha.querySelector("input[name='carrinho-tamanho']"));
  };

  const montarPainel = () => {
    painel = document.createElement("div");
    painel.className = "carrinho-painel";
    painel.hidden = true;
    painel.innerHTML = `
      <div class="carrinho-fundo" data-fechar></div>
      <aside class="carrinho-lateral" role="dialog" aria-modal="true" aria-labelledby="carrinho-titulo">
        <header class="carrinho-topo">
          <div>
            <h2 id="carrinho-titulo">Seu carrinho</h2>
            <span class="carrinho-resumo"></span>
          </div>
          <button class="carrinho-fechar" type="button" aria-label="Fechar carrinho" data-fechar>${icones.fechar}</button>
        </header>

        <ul class="carrinho-itens"></ul>

        <div class="carrinho-vazio">
          ${icones.carrinho}
          <p>Seu carrinho está vazio.</p>
          <button class="carrinho-botao-secundario" type="button" data-fechar>Ver camisas</button>
        </div>

        <footer class="carrinho-rodape">
          <div class="carrinho-total">
            <span>Total</span>
            <strong></strong>
          </div>
          <a class="carrinho-botao-principal carrinho-finalizar" target="_blank" rel="noopener noreferrer">${icones.whatsapp}<span>Finalizar pelo WhatsApp</span></a>
          <p class="carrinho-nota">Você vai enviar o pedido pelo WhatsApp para confirmarmos tamanhos, entrega e pagamento.</p>
          <button class="carrinho-esvaziar" type="button">Esvaziar carrinho</button>
        </footer>
      </aside>
    `;
    document.body.appendChild(painel);

    painel.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-fechar]")) {
        fecharJanela(painel);
        return;
      }

      const acao = evento.target.closest("[data-acao]");

      if (acao) {
        const chave = acao.closest("[data-chave]").dataset.chave;

        if (acao.dataset.acao === "remover") {
          remover(chave);
        } else {
          alterarQuantidade(chave, acao.dataset.acao === "mais" ? 1 : -1);
        }

        // se o item sumiu, o foco vai para o topo do carrinho
        if (!document.contains(acao)) {
          painel.querySelector(".carrinho-fechar").focus();
        }
      }

      if (evento.target.closest(".carrinho-esvaziar") && window.confirm("Esvaziar o carrinho?")) {
        itens = [];
        salvar();
        atualizar();
        painel.querySelector(".carrinho-fechar").focus();
      }
    });
  };

  const renderizarPainel = () => {
    const lista = painel.querySelector(".carrinho-itens");
    const vazio = itens.length === 0;

    painel.querySelector(".carrinho-resumo").textContent = vazio ? "" : plural(quantidadeTotal(), "camisa", "camisas");
    painel.querySelector(".carrinho-vazio").hidden = !vazio;
    painel.querySelector(".carrinho-rodape").hidden = vazio;
    painel.querySelector(".carrinho-total strong").textContent = emReais(valorTotal());
    painel.querySelector(".carrinho-finalizar").href = vazio ? "#" : linkWhatsApp();

    // redesenha a lista preservando o botão que estava com foco
    const focado = document.activeElement && document.activeElement.closest("[data-chave]")
      ? [document.activeElement.closest("[data-chave]").dataset.chave, document.activeElement.dataset.acao]
      : null;

    lista.innerHTML = itens.map((item) => `
      <li class="carrinho-item" data-chave="${escaparHtml(chaveItem(item))}">
        <img src="${escaparHtml(item.imagem)}" alt="" loading="lazy">
        <div class="carrinho-item-info">
          <strong>${escaparHtml(item.titulo)}</strong>
          <span>Tamanho ${escaparHtml(item.tamanho)} · ${emReais(precoUnitario(item))}</span>
          ${item.personalizacao ? `<span class="carrinho-item-personalizacao">Personalizada: ${escaparHtml(textoPersonalizacao(item.personalizacao))} <span class="carrinho-sem-quebra">(+ ${emReais(item.extra)})</span></span>` : ""}
          <div class="carrinho-item-acoes">
            <div class="carrinho-qtd carrinho-qtd-pequena" role="group" aria-label="Quantidade de ${escaparHtml(item.titulo)}">
              <button type="button" data-acao="menos" aria-label="Diminuir">−</button>
              <output>${item.qtd}</output>
              <button type="button" data-acao="mais" aria-label="Aumentar">+</button>
            </div>
            <button class="carrinho-remover" type="button" data-acao="remover" aria-label="Remover ${escaparHtml(item.titulo)}">${icones.lixeira}</button>
          </div>
        </div>
        <strong class="carrinho-item-valor">${emReais(precoUnitario(item) * item.qtd)}</strong>
      </li>
    `).join("");

    if (focado) {
      const alvo = lista.querySelector(`[data-chave="${CSS.escape(focado[0])}"] [data-acao="${focado[1]}"]`);

      if (alvo) {
        alvo.focus();
      }
    }
  };

  const montarAviso = () => {
    aviso = document.createElement("div");
    aviso.className = "carrinho-aviso";
    aviso.setAttribute("role", "status");
    aviso.innerHTML = `
      <span class="carrinho-aviso-icone">${icones.carrinho}</span>
      <div><strong>Adicionado ao carrinho</strong><span class="carrinho-aviso-texto"></span></div>
      <button type="button" data-carrinho-abrir>Ver carrinho</button>
    `;
    document.body.appendChild(aviso);
  };

  const mostrarAviso = (mensagem) => {
    aviso.querySelector(".carrinho-aviso-texto").textContent = mensagem;
    aviso.classList.add("visivel");
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => aviso.classList.remove("visivel"), 4000);

    document.querySelectorAll("[data-carrinho-abrir]:not(.carrinho-aviso button)").forEach((botao) => {
      botao.classList.remove("pulsar");
      void botao.offsetWidth;
      botao.classList.add("pulsar");
    });
  };

  // Na home o botão do carrinho fica no cabeçalho; nas outras páginas aparece um botão flutuante
  const garantirBotaoCarrinho = () => {
    if (document.querySelector("[data-carrinho-abrir]:not(.carrinho-aviso button)")) {
      return;
    }

    document.body.insertAdjacentHTML("beforeend", `
      <button class="carrinho-flutuante" type="button" data-carrinho-abrir aria-label="Abrir carrinho">
        ${icones.carrinho}
        <span class="carrinho-contagem" data-carrinho-quantidade hidden>0</span>
      </button>
    `);
    document.body.classList.add("com-carrinho-flutuante");
  };

  const atualizar = () => {
    const qtd = quantidadeTotal();

    document.querySelectorAll("[data-carrinho-quantidade]").forEach((contagem) => {
      contagem.textContent = qtd > 99 ? "99+" : qtd;
      contagem.hidden = qtd === 0;
    });

    document.querySelectorAll("[data-carrinho-abrir]:not(.carrinho-aviso button)").forEach((botao) => {
      botao.setAttribute("aria-label", qtd ? `Abrir carrinho (${plural(qtd, "camisa", "camisas")})` : "Abrir carrinho");
    });

    renderizarPainel();
  };

  // ---------- Início ----------
  const iniciar = () => {
    garantirBotaoCarrinho();
    montarEscolha();
    montarPainel();
    montarAviso();
    prepararCardsDosClubes();
    atualizar();

    document.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-carrinho-abrir]")) {
        aviso.classList.remove("visivel");
        abrirJanela(painel, painel.querySelector(".carrinho-fechar"));
        return;
      }

      // "Comprar" ou clique na foto do card abre a escolha de tamanho
      const gatilho = evento.target.closest("[data-comprar], .catalog-card-media, .produto-card a");
      const card = gatilho && gatilho.closest("[data-titulo]");

      if (card) {
        evento.preventDefault();
        abrirEscolha(lerCamisa(card));
      }
    });

    // mantém o carrinho igual entre abas abertas do site
    window.addEventListener("storage", (evento) => {
      if (evento.key === CHAVE_STORAGE) {
        itens = ler();
        atualizar();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
