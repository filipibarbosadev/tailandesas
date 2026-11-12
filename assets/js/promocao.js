// Promoção em vigor: preços promocionais nos cards e combo no carrinho.
// Os preços normais continuam nas páginas dos clubes e nos dados; aqui ficam só as regras da campanha.
// Para encerrar antes ou prorrogar, mude "fim". Valores em centavos.
const promocao = {
  nome: "Black November",
  fim: "2026-12-01T00:00:00-03:00",
  // Modelo torcedor, masculinas e femininas: 1 por R$ 110,00 ou 2 por R$ 200,00 (o combo é aplicado no carrinho)
  torcedor: { preco: 11000, combo: { quantidade: 2, preco: 20000 } },
  // Retrô: R$ 10,00 de desconto (não entra no combo)
  retro: { desconto: 1000 },
  // Conjunto kids: de R$ 139,90 por R$ 119,90
  infantil: { preco: 11990 },
  // Personalização com nome e número, por camisa
  personalizacao: 2000
};

const promocaoAtiva = () => Date.now() < Date.parse(promocao.fim);

// "torcedor" (inclui as femininas), "retro" ou "infantil"; tipo é a grade de tamanhos (adulto, feminina, infantil)
const modeloCamisa = ({ tipo, retro }) => (retro ? "retro" : tipo === "infantil" ? "infantil" : "torcedor");

// Preço de uma camisa com a promoção; fora dela, ou se a regra não baratear, fica o preço normal
const precoPromocional = (modelo, centavos) => {
  const regra = promocao[modelo];

  if (!promocaoAtiva() || !regra) {
    return centavos;
  }

  return Math.min(centavos, regra.preco ?? centavos - (regra.desconto || 0));
};

const precoPersonalizacao = (normal) => (promocaoAtiva() ? Math.min(normal, promocao.personalizacao) : normal);

// Desconto do combo: as camisas torcedor são agrupadas (as mais caras primeiro) e cada grupo completo sai pelo preço do combo
const descontoCombo = (precosTorcedor) => {
  if (!promocaoAtiva()) {
    return 0;
  }

  const { quantidade, preco } = promocao.torcedor.combo;
  const ordenados = [...precosTorcedor].sort((a, b) => b - a);
  let desconto = 0;

  for (let i = 0; i + quantidade <= ordenados.length; i += quantidade) {
    const soma = ordenados.slice(i, i + quantidade).reduce((total, valor) => total + valor, 0);
    desconto += Math.max(0, soma - preco);
  }

  return desconto;
};

// Texto curto da oferta, para o selo sobre a foto: "2 por R$ 200", "R$ 10 OFF"
const seloOferta = (modelo, normal) => {
  if (!promocaoAtiva()) {
    return "";
  }

  if (modelo === "torcedor") {
    const { quantidade, preco } = promocao.torcedor.combo;
    return `${quantidade} por ${emReaisCurto(preco)}`;
  }

  const desconto = normal - precoPromocional(modelo, normal);
  return desconto > 0 ? `${emReaisCurto(desconto)} OFF` : "";
};
