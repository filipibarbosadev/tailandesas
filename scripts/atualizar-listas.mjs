// Atualiza as listas de camisas dos catálogos a partir das pastas de imagens.
// Uso, na pasta do projeto:  node scripts/atualizar-listas.mjs
//
// Reescreve o trecho entre "INÍCIO DA LISTA" e "FIM DA LISTA" de cada arquivo em assets/js/dados/.
// As camisas dos clubes brasileiros continuam sendo cadastradas nas páginas clubes/*.html;
// o script só avisa quando existe foto em assets/img/camisas/brasileiros/ que nenhuma página usa.
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const camisas = join(raiz, "assets/img/camisas");
const ehImagem = (nome) => /\.(jpe?g|png|webp|avif|gif)$/i.test(nome);
const ordenar = (a, b) => a.localeCompare(b, "pt-BR", { numeric: true, sensitivity: "base" });
const avisos = [];

const pastas = (dir) => readdirSync(dir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort(ordenar);

const arquivos = (dir) => {
  const itens = readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile() && !e.name.startsWith("."));
  itens.filter((e) => !ehImagem(e.name)).forEach((e) => avisos.push(`ignorado (não é imagem): ${join(dir, e.name).slice(raiz.length + 1)}`));
  return itens.filter((e) => ehImagem(e.name)).map((e) => e.name).sort(ordenar);
};

const europeus = join(camisas, "europeus");
const retro = join(camisas, "retro");

const listas = [
  ["assets/js/dados/europeus.js", "europeusCatalog",
    pastas(europeus).flatMap((liga) => arquivos(join(europeus, liga)).map((arquivo) => [liga, arquivo]))],
  ["assets/js/dados/selecoes.js", "selecoes", arquivos(join(camisas, "selecoes"))],
  ["assets/js/dados/resto-do-mundo.js", "restoCatalog", arquivos(join(camisas, "resto-do-mundo"))],
  ["assets/js/dados/retro.js", "retroCatalog",
    pastas(retro).flatMap((grupo) => [
      // fotos soltas na pasta do grupo: o time sai do nome do arquivo
      ...arquivos(join(retro, grupo)).map((arquivo) => [grupo, "", arquivo]),
      ...pastas(join(retro, grupo)).flatMap((clube) => arquivos(join(retro, grupo, clube)).map((arquivo) => [grupo, clube, arquivo]))
    ])]
];

const formatar = (item) => (Array.isArray(item) ? `[${item.map((v) => JSON.stringify(v)).join(", ")}]` : JSON.stringify(item));
const INICIO = /^\/\/ INÍCIO DA LISTA.*\n/m;
const FIM = /^\/\/ FIM DA LISTA\n/m;

for (const [arquivo, nome, itens] of listas) {
  const caminho = join(raiz, arquivo);
  const texto = readFileSync(caminho, "utf8");
  const inicio = texto.match(INICIO);
  const fim = texto.match(FIM);

  if (!inicio || !fim) {
    throw new Error(`Marcadores "INÍCIO DA LISTA"/"FIM DA LISTA" não encontrados em ${arquivo}`);
  }

  const antes = texto.slice(0, inicio.index + inicio[0].length);
  const anterior = texto.slice(antes.length, fim.index);
  const depois = texto.slice(fim.index);
  const lista = itens.length
    ? `const ${nome} = [\n${itens.map((item) => `  ${formatar(item)}`).join(",\n")}\n];\n`
    : `const ${nome} = [];\n`;

  // compara com a lista anterior para mostrar o que entrou e o que saiu
  const chaves = (bloco) => new Set([...bloco.matchAll(/^\s*(\[.*\]|".*"),?$/gm)].map((m) => m[1]));
  const velhas = chaves(anterior);
  const novas = chaves(lista);
  const entraram = [...novas].filter((c) => !velhas.has(c)).length;
  const sairam = [...velhas].filter((c) => !novas.has(c)).length;

  writeFileSync(caminho, antes + lista + depois);
  console.log(`${arquivo}: ${itens.length} camisas (+${entraram} / -${sairam})`);
}

// Fotos de clubes brasileiros que nenhuma página em clubes/ usa
const usadas = new Set();
for (const pagina of readdirSync(join(raiz, "clubes")).filter((f) => f.endsWith(".html"))) {
  for (const m of readFileSync(join(raiz, "clubes", pagina), "utf8").matchAll(/camisas\/brasileiros\/([^"']+)["']/g)) {
    usadas.add(decodeURI(m[1]));
  }
}

const brasileiros = join(camisas, "brasileiros");
const semPagina = existsSync(brasileiros) ? arquivos(brasileiros).filter((f) => !usadas.has(f)) : [];

if (semPagina.length) {
  console.log(`\nFotos em assets/img/camisas/brasileiros/ que ainda não estão em nenhuma página de clube (${semPagina.length}):`);
  semPagina.forEach((f) => console.log(`  - ${f}`));
}

avisos.forEach((a) => console.log(`Aviso: ${a}`));
