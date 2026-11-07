// Dibuja el fotograma del segundo t: el plano que toca y, encima, los subtítulos.
import { createCanvas } from "@napi-rs/canvas";
import { ALTO, ANCHO } from "./comun.mjs";
import { bloques, dibujarSubtitulos } from "./subtitulos.mjs";

export const FUNDIDO = 0.3;

export function preparar(proy) {
  const lienzo = createCanvas(ANCHO, ALTO), g = lienzo.getContext("2d");
  const aparte = createCanvas(ANCHO, ALTO);
  const subs = bloques(proy.v.palabras, proy.duracion);
  const modo = proy.guion.subtitulos || "arriba";
  const salida = createCanvas(ANCHO, ALTO);
  return { lienzo, g, aparte, subs, modo, salida, gs: salida.getContext("2d") };
}

export function planoEn(proy, t) {
  const ps = proy.planos;
  let i = 0;
  while (i + 1 < ps.length && t >= ps[i + 1].desde) i++;
  return i;
}

function limpiar(g) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; g.filter = "none";
  g.shadowBlur = 0; g.shadowColor = "rgba(0,0,0,0)"; g.shadowOffsetX = 0; g.shadowOffsetY = 0;
  g.setLineDash([]); g.lineCap = "butt"; g.lineJoin = "miter";
  g.fillStyle = "#000000"; g.fillRect(0, 0, ANCHO, ALTO);
}

function plano(p, g, t) {
  limpiar(g);
  g.save();
  try { p.dibuja(g, t); }
  catch (e) { e.message = `plano ${p.id}, segundo ${t.toFixed(3)}: ${e.message}`; throw e; }
  g.restore();
}

// opciones: { subtitulos: false } para verlo sin ellos.
export function dibujar(proy, est, t, opciones = {}) {
  const i = planoEn(proy, t), p = proy.planos[i];
  plano(p, est.g, t);
  if (p.entrada === "fundido" && i > 0 && t < p.desde + FUNDIDO) {
    const ga = est.aparte.getContext("2d");
    plano(proy.planos[i - 1], ga, t);
    const u = (t - p.desde) / FUNDIDO, k = u * u * (3 - 2 * u);
    // lo de antes encima, apagándose
    est.g.globalAlpha = 1 - k; est.g.drawImage(est.aparte, 0, 0); est.g.globalAlpha = 1;
  }
  // los efectos del proyecto: la cámara por encima de todo (golpes de zoom, temblor, transiciones) y lo que va encima
  let g = est.g, lienzo = est.lienzo;
  const ef = proy.efectos;
  if (ef && (ef.camara || ef.encima)) {
    const c = ef.camara ? ef.camara(t) || {} : {}, gs = est.gs;
    limpiar(gs);
    gs.save();
    if (c.desenfoque > 0.05) gs.filter = `blur(${c.desenfoque.toFixed(2)}px)`;
    gs.translate(ANCHO / 2 + (c.x || 0), ALTO / 2 + (c.y || 0)); gs.rotate(c.giro || 0); gs.scale(c.zoom || 1, c.zoom || 1);
    gs.drawImage(est.lienzo, -ANCHO / 2, -ALTO / 2);
    gs.restore();
    if (ef.encima) { gs.save(); ef.encima(gs, t, p.id); gs.restore(); }
    g = gs; lienzo = est.salida;
  }
  if (opciones.subtitulos !== false) dibujarSubtitulos(g, t, est.subs, est.modo, ef && ef.subtitulo ? (b) => ef.subtitulo(t, b, p.id) : null);
  return lienzo;
}
