// Apertura B, el móvil: fotograma 0, la pantalla de un móvil llena la imagen con tu vídeo subiéndose («Subiendo…», la
// barra se llena); «subes»: la tarjeta sale disparada de la pantalla hacia la oscuridad y el móvil se queda atrás; la
// imagen ya es el estadio, con la cámara cayendo hacia la pista; «primero»: la primera fila se enciende. Desde ahí,
// igual que la apertura A.
import * as k from "#kit";
import { v } from "#voz";
import * as M from "../mundo.js";
import { T, cam as camA, mundo, luzGradas, TARJETA } from "../planos/01-estadio.js";

export const desde = 0;
export const entrada = "corte";
const { suave: su, tramo: tr, mez } = k;

const Tsale = T.subes + 0.05;        // la tarjeta sale del móvil
const Tmundo = T.subes + 0.55;       // el estadio ya está
// la cámara: igual que la A desde «primero»; antes, viene cayendo más cerca de la pista
const cam = k.ruta([
  [Tsale, { pos: [0, 30, 10], mira: [0, 0, -4] }],
  [T.primero - 0.1, { pos: [0.6, 3.0, 5.0], mira: [0, 1.4, -M.R0] }],
  [T.desc, { pos: [0, 1.9, -5.8], mira: [0, 1.45, -M.R0] }],
]);
const camBC = (t) => (t < T.desc ? cam(t) : camA(t));

// el móvil, en 2D, enorme
function movil(g, t, al) {
  if (al <= 0.003) return;
  const sube = su(tr(t, 0.05, T.subes - 0.1));          // la barra se llena
  const atras = k.sale(tr(t, Tsale, Tmundo));            // el móvil se va hacia atrás
  const esc = mez(1, 0.35, atras);
  g.save(); g.globalAlpha *= al; g.translate(540, 1000 + 500 * atras); g.scale(esc, esc);
  const w = 1000, h = 2000;
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60;
  k.redondo(g, -w / 2, -h / 2, w, h, 110); g.fillStyle = "#1a1d26"; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  k.redondo(g, -w / 2, -h / 2, w, h, 110); g.lineWidth = 6; g.strokeStyle = "rgba(255,255,255,0.22)"; g.stroke();
  k.redondo(g, -w / 2 + 22, -h / 2 + 22, w - 44, h - 44, 92); g.fillStyle = "#07070c"; g.fill();
  // la pantalla: tu vídeo, con el velo y la barra «Subiendo…»
  g.save(); k.redondo(g, -w / 2 + 22, -h / 2 + 22, w - 44, h - 44, 92); g.clip();
  const cardH = 1500, sale = k.entra(tr(t, Tsale - 0.05, Tsale + 0.35));
  M.tarjeta2D(g, 0, -40 - 1800 * sale, cardH * (1 + 0.6 * sale), { brillo: 0.3 + 0.5 * sale, borde: 0.9 });
  g.fillStyle = "rgba(0,0,0,0.45)"; g.fillRect(-w / 2, 640, w, 380);
  g.font = "700 54px Figtree"; g.fillStyle = "rgba(255,255,255,0.92)"; g.textAlign = "left"; g.fillText(sube < 0.999 ? "Subiendo tu vídeo…" : "Publicado", -w / 2 + 90, 760);
  k.redondo(g, -w / 2 + 90, 800, w - 180, 26, 13); g.fillStyle = "rgba(255,255,255,0.18)"; g.fill();
  k.redondo(g, -w / 2 + 90, 800, (w - 180) * sube, 26, 13); g.fillStyle = `rgb(${M.NARANJA})`; g.fill();
  g.restore();
  g.restore();
}

export function dibuja(g, t) {
  const cm = camBC(t);
  const enMundo = su(tr(t, Tsale + 0.1, Tmundo));
  if (enMundo > 0.003) mundo(g, t, cm, { sinTarjetaHasta: Tmundo + 0.1 });
  else { M.cielo(g); g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 1000, 2200, "255,120,40", 0.22 * (1 - enMundo)); k.brillo(g, 200, 300, 900, "120,60,200", 0.25 * (1 - enMundo)); g.restore(); }
  movil(g, t, 1 - enMundo);
  // la tarjeta que sale del móvil y cruza la pantalla hacia la pista (en 2D, por encima)
  const u = tr(t, Tsale, Tmundo + 0.15);
  if (u > 0 && u < 1) {
    const e = k.suave(u);
    M.tarjeta2D(g, mez(540, 540, e), mez(900, 1060, e), mez(1200, 120, e), { brillo: 0.6 * (1 - e), al: 1 - k.sale(tr(u, 0.75, 1)) });
  }
}
export const momentos = { barra: 0.05, sale: Tsale, llega: Tmundo };
