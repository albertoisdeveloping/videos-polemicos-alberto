// «Pero si pasa de largo, ahí se queda tu vídeo en trescientas visitas, y tus seguidores ni se enteran.»
// De vuelta en la fila, encendida: «pasa de largo»: los seis pasan con el pulgar (un destello que sube) y se apagan
// uno a uno. «ahí se queda tu vídeo»: la cámara gira a la pista: tu tarjeta sola, apagándose, con el 300 clavado.
// «tus seguidores ni se enteran»: sigue hasta el banco naranja, a oscuras, aplaudiendo sin mirar. Se corta en «Y».
import * as k from "#kit";
import { v } from "#voz";
import * as M from "../mundo.js";
import { TARJETA } from "./01-estadio.js";

const f6 = v.frase(6);
export const desde = () => f6.inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez } = k;
export const T = { pero: f6.inicio, pasa: f6.t("pasa"), largo: f6.t("largo"), ahi: f6.t("ahí"), queda: f6.t("queda"), video: f6.t("vídeo"), tresc: f6.t("trescientas"), visitas: f6.t("visitas"), y: f6.t("y"), seg: f6.t("seguidores"), enteran: f6.t("enteran"), fin: f6.fin };

export const cam = k.ruta([
  [T.pero - 0.3, { pos: [0, 2.3, -4.2], mira: [0, 1.45, -M.R0] }],
  [T.ahi - 0.2, { pos: [0, 2.3, -4.2], mira: [0, 1.45, -M.R0] }],
  [T.video + 0.3, { pos: [2.4, 1.8, 6.0], mira: [TARJETA[0], 1.2, TARJETA[2]] }],
  [T.y - 0.1, { pos: [2.4, 1.8, 6.0], mira: [TARJETA[0], 1.2, TARJETA[2]] }],
  [T.seg + 0.4, { pos: [4.8, 2.2, 8.5], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.fin + 0.3, { pos: [4.8, 2.2, 8.5], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
]);

// cada uno de los seis pasa de largo en su momento
const PASAN = [0, 0.12, 0.2, 0.31, 0.4, 0.52].map((d, i) => ({ i, t: f6.t("pasa") + 0.05 + d * 1.6 }));

export function dibuja(g, t) {
  const cm = cam(t);
  M.cielo(g);
  M.estadio(g, cm, M.nada, { sinFila: true });
  const luces = PASAN.map((p) => 1 - su(tr(t, p.t, p.t + 0.22)));
  const fila = M.filaPorPersona(g, cm, luces);
  // el destello del pulgar que sube, en cada uno
  if (fila && !fila.fuera) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (const p of PASAN) {
      const u = tr(t, p.t - 0.05, p.t + 0.3); if (u <= 0 || u >= 1) continue;
      const s = M.SEIS[p.i], x = fila.x - fila.w / 2 + s.u * fila.w, y0 = fila.y - fila.h * 0.22;
      const e = k.sale(u); k.brillo(g, x, y0 - fila.h * 0.9 * e, fila.w * 0.16 * (1 - u), M.CIAN, 0.9 * (1 - u));
      g.strokeStyle = `rgba(${M.CIAN},${0.8 * (1 - u)})`; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y0 - fila.h * 0.9 * e); g.lineTo(x, y0 - fila.h * 0.9 * Math.max(0, e - 0.25)); g.stroke();
    }
    g.restore();
  }
  // tu tarjeta, sola y apagándose
  const apaga = su(tr(t, T.ahi, T.tresc));
  M.tarjeta(g, cm, TARJETA, 2.6, { brillo: 0.4 * (1 - apaga) + 0.08, borde: 0.9 - 0.5 * apaga, apagada: 0.6 * apaga });
  // el banco: a oscuras, pero se les ve (aplauden sin mirar)
  M.banco(g, cm, M.BANCO, 0.24 + 0.05 * Math.sin(t * 5) * (1 - su(tr(t, T.fin - 0.45, T.fin - 0.15))));
  if (t < T.ahi + 0.3) { const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(5,6,15,0.5)"); vg.addColorStop(1, "rgba(5,6,15,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 600); }
}

export const momentos = { pasan: PASAN.map((p) => p.t), gira: T.ahi + 0.1, apaga: T.tresc, banco: T.seg - 0.1 };
