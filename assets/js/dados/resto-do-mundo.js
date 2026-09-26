// Camisas de clubes fora da Europa: arquivos em assets/img/camisas/resto-do-mundo/
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
