// Los subtítulos de la casa, dibujados encima de cada fotograma: pocas palabras cada vez, arriba; cada palabra
// aparece al decirse (con un desenfoque que se aclara), la que suena en blanco y negrita, las ya dichas en gris, y la
// palabra clave de cada frase dentro de su recuadro azul con dos tiradores, como una selección de texto.
// Las palabras no se mueven al pasar de negrita a gris: cada una tiene su sitio desde que aparece el bloque.
import { GlobalFonts } from "@napi-rs/canvas";
import { join } from "node:path";
import { RAIZ } from "./comun.mjs";

for (const p of ["Medium", "Bold", "ExtraBold"]) GlobalFonts.registerFromPath(join(RAIZ, "letra", `Figtree-${p}.ttf`), "Figtree");

export const ESTILO = {
  tam: 74, linea: 82, izq: 170, ancho: 740, arriba: 318, abajo: 1200, hueco: 19,
  tinta: "#ffffff", dicha: "#7b818a", marca: "#2f7cf6",
  anticipo: 0.08, // la palabra aparece un poco antes de oírse, para que se lea a tiempo
};
const E = ESTILO;

// Bloques de pocas palabras (6 o 30 letras como mucho), sin mezclar frases.
export function bloques(palabras, duracion) {
  const bs = [];
  for (const w of palabras) {
    const b = bs[bs.length - 1];
    const largo = b ? b.palabras.map((p) => p.texto).join(" ").length + w.texto.length + 1 : 0;
    if (!b || b.frase !== w.frase || b.palabras.length >= 6 || largo > 30) bs.push({ frase: w.frase, palabras: [w] });
    else b.palabras.push(w);
  }
  bs.forEach((b, i) => {
    b.inicio = Math.max(0, b.palabras[0].inicio - E.anticipo);
    const sig = bs[i + 1];
    b.fin = sig ? Math.min(sig.palabras[0].inicio - E.anticipo, b.palabras[b.palabras.length - 1].fin + 0.6) : duracion;
  });
  return bs;
}

const salir = (u) => 1 - Math.pow(1 - u, 2);                           // power2.out
const rebote = (u) => { const s = 2.5; u -= 1; return u * u * ((s + 1) * u + s) + 1; }; // back.out(2.5)
const tramo = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));

// Dónde va cada palabra de un bloque (se calcula una vez por bloque).
function colocar(g, b, modo) {
  if (b.sitio) return b.sitio;
  g.font = `700 ${E.tam}px Figtree`;
  const anchos = b.palabras.map((w) => g.measureText(w.texto).width);
  const lineas = [[]];
  let usado = 0;
  b.palabras.forEach((w, i) => {
    const extra = (lineas[lineas.length - 1].length ? E.hueco : 0) + anchos[i];
    if (usado + extra > E.ancho && lineas[lineas.length - 1].length) { lineas.push([]); usado = 0; }
    usado += (lineas[lineas.length - 1].length ? E.hueco : 0) + anchos[i];
    lineas[lineas.length - 1].push(i);
  });
  const arriba = modo === "abajo" ? E.abajo : E.arriba, sitio = [];
  lineas.forEach((l, j) => {
    const total = l.reduce((s, i, k) => s + anchos[i] + (k ? E.hueco : 0), 0);
    let x = E.izq + (E.ancho - total) / 2;
    for (const i of l) { sitio[i] = { x, w: anchos[i], y: arriba + j * E.linea }; x += anchos[i] + E.hueco; }
  });
  return (b.sitio = sitio);
}

function redondo(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y); g.closePath();
}

function caja(g, s, u) {
  const sx = 0.6 + 0.4 * rebote(u), al = Math.min(1, u * 1.6);
  const l = s.x - 0.14 * E.tam, r = s.x + s.w + 0.14 * E.tam, top = s.y + 0.02 * E.tam, bot = s.y + E.linea + 0.04 * E.tam;
  const cx = (l + r) / 2, w = (r - l) * sx, x0 = cx - w / 2;
  g.save();
  g.globalAlpha = al;
  redondo(g, x0, top, w, bot - top, 10);
  g.fillStyle = "rgba(47,124,246,0.22)"; g.fill();
  redondo(g, x0 + 2, top + 2, w - 4, bot - top - 4, 8);
  g.strokeStyle = E.marca; g.lineWidth = 4; g.stroke();
  for (const [hx, hy] of [[x0 + 2, top + 2], [x0 + w - 2, bot - 2]]) {
    g.beginPath(); g.arc(hx, hy, 9, 0, Math.PI * 2); g.fillStyle = "#ffffff"; g.fill();
    g.beginPath(); g.arc(hx, hy, 6, 0, Math.PI * 2); g.fillStyle = E.marca; g.fill();
  }
  g.restore();
}

export function dibujarSubtitulos(g, t, bs, modo = "arriba", donde = null) {
  if (modo === "no") return;
  if (modo === "dinamico") return dinamicos(g, t, bs, donde);
  const b = bs.find((x) => t >= x.inicio && t < x.fin);
  if (!b) return;
  const sitio = colocar(g, b, modo);
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "source-over";
  g.textBaseline = "middle";
  b.palabras.forEach((w, i) => {
    const sale = w.inicio - E.anticipo, u = tramo(t, sale, sale + 0.07);
    if (u <= 0) return;
    const s = sitio[i], sig = b.palabras[i + 1], dicha = !w.clave && sig && t >= sig.inicio - E.anticipo;
    if (w.clave) caja(g, s, tramo(t, sale + 0.07, sale + 0.19));
    g.font = `${dicha ? 500 : 700} ${E.tam}px Figtree`;
    const ancho = dicha ? g.measureText(w.texto).width : s.w;
    g.globalAlpha = salir(u);
    g.filter = u < 1 ? `blur(${(8 * (1 - salir(u))).toFixed(2)}px)` : "none";
    g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 14; g.shadowOffsetY = 2;
    g.fillStyle = dicha ? E.dicha : E.tinta;
    g.fillText(w.texto, s.x + (s.w - ancho) / 2, s.y + E.linea / 2);
  });
  g.restore();
}

// ---------------------------------------------------------------- subtítulos dinámicos
// Cambian de sitio y de tamaño con la escena: cada bloque pregunta dónde ir (donde(b) → { y, tam, giro, color }; si no
// hay respuesta, arriba) y entra con un pequeño salto; cada palabra salta al decirse, y la clave de la frase entra
// grande, de su color, con un golpe de escala y su recuadro.
const D = { tam: 84, ancho: 900, hueco: 0.26 };
function colocarDin(g, b, op) {
  const k = `${op.tam}|${op.y}`;
  if (b.sitioDin && b.sitioDin.k === k) return b.sitioDin;
  const tamDe = (w) => (w.clave ? op.tam * 1.32 : op.tam);
  const anchos = b.palabras.map((w) => { g.font = `800 ${tamDe(w)}px Figtree`; return g.measureText(w.texto).width; });
  const margen = b.palabras.map((w) => (w.clave ? tamDe(w) * 0.2 : 0)); // el recuadro de la clave necesita su sitio
  const hueco = op.tam * D.hueco, lineas = [[]];
  let usado = 0;
  b.palabras.forEach((w, i) => {
    const extra = (lineas[lineas.length - 1].length ? hueco : 0) + anchos[i] + 2 * margen[i];
    if (usado + extra > D.ancho && lineas[lineas.length - 1].length) { lineas.push([]); usado = 0; }
    usado += extra; lineas[lineas.length - 1].push(i);
  });
  const alto = (l) => Math.max(...l.map((i) => tamDe(b.palabras[i]))) * 1.12;
  const total = lineas.reduce((s, l) => s + alto(l), 0);
  let y = op.y - total / 2;
  const sitio = [];
  for (const l of lineas) {
    const w = l.reduce((s, i, k) => s + anchos[i] + 2 * margen[i] + (k ? hueco : 0), 0), h = alto(l);
    let x = 540 - w / 2;
    for (const i of l) { x += margen[i]; sitio[i] = { x, w: anchos[i], y: y + h / 2, tam: tamDe(b.palabras[i]) }; x += anchos[i] + margen[i] + hueco; }
    y += h;
  }
  return (b.sitioDin = { k, sitio, total });
}
function dinamicos(g, t, bs, donde) {
  const i = bs.findIndex((x) => t >= x.inicio && t < x.fin);
  if (i < 0) return;
  const b = bs[i];
  const op = { y: 380, tam: D.tam, giro: 0, color: "255,214,60", ...(donde ? donde(b) || {} : {}) };
  const { sitio } = colocarDin(g, b, op);
  const entra = tramo(t, b.inicio, b.inicio + 0.16);
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "source-over";
  g.textBaseline = "middle";
  // el bloque entra con un salto pequeño, un poco girado según donde(b)
  g.translate(540, op.y); g.rotate((op.giro || 0) * (1 - 0.3 * (1 - entra))); g.scale(0.85 + 0.15 * rebote(entra), 0.85 + 0.15 * rebote(entra)); g.translate(-540, -op.y);
  b.palabras.forEach((w, j) => {
    const sale = w.inicio - E.anticipo, u = tramo(t, sale, sale + 0.12);
    if (u <= 0) return;
    const s = sitio[j], sig = b.palabras[j + 1], dicha = !w.clave && sig && t >= sig.inicio - E.anticipo;
    const esc = w.clave ? 0.3 + 0.7 * rebote(tramo(t, sale, sale + 0.22)) + 0.12 * Math.exp(-Math.max(0, t - sale - 0.22) * 6) * (t > sale + 0.22 ? 1 : 0) : 0.55 + 0.45 * rebote(u);
    const cx = s.x + s.w / 2;
    g.save(); g.translate(cx, s.y); g.scale(esc, esc);
    g.font = `800 ${s.tam}px Figtree`;
    g.globalAlpha = salir(u);
    if (w.clave) {
      // su recuadro de color, como una selección, y un brillo detrás
      const pad = s.tam * 0.16, x0 = -s.w / 2 - pad, top = -s.tam * 0.62, h = s.tam * 1.2;
      g.save(); g.shadowColor = `rgba(${op.color},0.75)`; g.shadowBlur = 40;
      redondo(g, x0, top, s.w + pad * 2, h, 14); g.fillStyle = `rgba(${op.color},0.95)`; g.fill(); g.restore();
      g.fillStyle = "#14110c"; g.fillText(w.texto, -s.w / 2, 4);
    } else {
      g.lineJoin = "round"; g.lineWidth = s.tam * 0.16; g.strokeStyle = "rgba(0,0,0,0.72)"; g.strokeText(w.texto, -s.w / 2, 2);
      g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 18; g.shadowOffsetY = 3;
      g.fillStyle = dicha ? "#d9dde3" : E.tinta; g.fillText(w.texto, -s.w / 2, 2);
    }
    g.restore();
  });
  g.restore();
}
