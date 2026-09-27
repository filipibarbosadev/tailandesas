// Camisas de clubes fora da Europa: arquivos em assets/img/camisas/resto-do-mundo/
// INÍCIO DA LISTA — gerada por scripts/atualizar-listas.mjs a partir das pastas de imagens; não edite à mão
const restoCatalog = [
  "al nassr 26-27 away.jpg",
  "al nassr 26-27 home.png",
  "america mexico 26-27 home.jpg",
  "boca jrs 26-27 away.jpg",
  "boca jrs 26-27 home.jpg",
  "chivas guadalajara 26-27 home.jpg",
  "inter miami 26-27 away.jpg",
  "inter miami 26-27 home.png",
  "inter miami 26-27 third.png",
  "monterrey 26-27 home.jpg",
  "new york red bulls 26-27 home.jpg",
  "river plate 26-27 home.png"
];
// FIM DA LISTA

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

const restoImagem = (arquivo) => encodeURI(`assets/img/camisas/resto-do-mundo/${arquivo}`);
