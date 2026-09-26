// Camisas retrô internacionais: [pasta do clube, arquivo] dentro de assets/img/camisas/retro/
// As retrô dos times brasileiros vêm da aba "Retrô" de cada página de clube
const retroCatalog = [
  ["barcelona", "barcelona 80-81 home.jpg"],
  ["barcelona", "barcelona 92-95 home.jpg"],
  ["barcelona", "barcelona 96 home.jpg"],
  ["barcelona", "barcelona 98 home.jpg"],
  ["barcelona", "barcelona 99 centenario.jpg"],
  ["barcelona", "barcelona 2000 away.jpg"],
  ["barcelona", "barcelona 03-04 home.jpg"],
  ["barcelona", "barcelona 03-04 away.jpg"],
  ["barcelona", "barcelon 05-06 away.jpg"],
  ["barcelona", "barcelona 05-06 away ronaldinho.png"],
  ["barcelona", "barcelona 06-07 home.jpg"],
  ["barcelona", "barcelona 07-08 home.jpg"],
  ["barcelona", "barcelona 08-09 home.jpg"],
  ["barcelona", "barcelona 08-09 away.jpg"],
  ["barcelona", "barcelona 09-10 home.jpg"],
  ["barcelona", "barcelona 10-11 away.jpg"],
  ["barcelona", "barcelona 13-14 third.jpg"],
  ["barcelona", "barcelona 14-15 home.jpg"],
  ["barcelona", "barcelona 15-16 home.jpg"],
  ["barcelona", "barcelona 16-17 home.jpg"],
  ["barcelona", "barcelona 16-17 away.jpeg"]
];

// Mesmo preço das retrô nas páginas dos clubes brasileiros
const retroPrice = "R$ 149,90";

// Nome exibido de cada pasta de clube
const retroClubs = {
  barcelona: "Barcelona"
};

const capitalizeRetro = (value) => value.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

// "05-06" → "2005/06", "80-81" → "1980/81", "96" → "1996", "2000" → "2000"
const formatRetroSeason = (season) => {
  const fullYear = (year) => (year.length === 4 ? year : `${Number(year) > 30 ? "19" : "20"}${year}`);
  const [start, end] = season.split("-");
  return end ? `${fullYear(start)}/${end}` : fullYear(start);
};

const formatRetroName = (club, fileName) => {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const match = baseName.match(/\b(\d{4}|\d{2}(?:-\d{2})?)\b\s*(.*)$/);
  const season = match ? formatRetroSeason(match[1]) : "";
  const details = (match ? match[2] : "")
    .replace(/\bcentenario\b/gi, "Centenário");

  return `${retroClubs[club] || capitalizeRetro(club)} Retrô ${season} ${capitalizeRetro(details)}`
    .replace(/\s+/g, " ")
    .trim();
};

const retroImagem = (clube, arquivo) => encodeURI(`assets/img/camisas/retro/${clube}/${arquivo}`);
