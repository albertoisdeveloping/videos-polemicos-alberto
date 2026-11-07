// «Y esa prueba la puedes hacer tú con los trial reels, que enseñan tu vídeo solo a quien no te sigue.»
// «Subes el mismo vídeo con tres principios distintos, y al día siguiente publicas el que más gente aguantó.»
// «Así que tu alcance no lo deciden tus seguidores, lo decide esa primera fila, y tú eliges con qué vídeo sales.»
// En la pista, sin cortes:
// - «prueba»: a tu tarjeta le sale la etiqueta «Prueba»; «trial reels»: un interruptor que se enciende.
// - «solo a quien no te sigue»: se enciende un corro en las gradas y sobre el banco de los seguidores baja una cortina.
// - «tres principios»: suben tres tarjetas, cada una con otro primer fotograma; «al día siguiente»: el cielo amanece y
//   vuelve la noche; cada tarjeta enciende sus filas (una, cinco, ninguna); «aguantó»: la del medio crece y las otras
//   bajan a la pista.
// - «no lo deciden tus seguidores»: el banco se apaga; «esa primera fila»: la fila se enciende y te mira;
//   «eliges»: levantas la tarjeta ganadora y el estadio entero se enciende detrás. Sigue (el cielo).
import * as k from "#kit";
import { v } from "#voz";
import * as M from "../mundo.js";
import { TARJETA } from "./01-estadio.js";

const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
export const desde = () => f7.inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez } = k;
export const T = {
  y: f7.inicio, prueba: f7.t("prueba"), tu: f7.t("tu"), trial: f7.t("trial"), reels: f7.t("reels"), ensenan: f7.t("enseñan"), solo: f7.t("solo"), no: f7.t("no"), sigue: f7.t("sigue"), fin7: f7.fin,
  subes: f8.inicio, mismo: f8.t("mismo"), tres: f8.t("tres"), principios: f8.t("principios"), distintos: f8.t("distintos"), dia: f8.t("día"), siguiente: f8.t("siguiente"), publicas: f8.t("publicas"), mas: f8.t("más"), aguanto: f8.t("aguantó"), fin8: f8.fin,
  asi: f9.inicio, alcance: f9.t("alcance"), deciden: f9.t("deciden"), seg: f9.t("seguidores"), decide: f9.t("decide"), fila: f9.t("fila"), tu9: f9.t("tu", 2), eliges: f9.t("eliges"), sales: f9.t("sales"), fin9: f9.fin,
};
export const DUENO7 = [1.1, 0, 0.9];
const CARTAS = [[-3.2, 0, -1.0], [0, 0, -1.4], [3.2, 0, -1.0]];

export const cam = k.ruta([
  [T.y - 0.3, { pos: [1.6, 2.0, 6.8], mira: [-0.3, 1.2, -0.5] }],
  [T.ensenan, { pos: [1.6, 2.0, 6.8], mira: [-0.3, 1.2, -0.5] }],
  [T.no + 0.25, { pos: [4.6, 2.0, 8.2], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.subes + 0.2, { pos: [4.6, 2.0, 8.2], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.tres, { pos: [0, 3.6, 10.5], mira: [0, 2.2, -6] }],
  [T.publicas, { pos: [0, 3.6, 10.5], mira: [0, 2.2, -6] }],
  [T.aguanto + 0.3, { pos: [0, 2.6, 6.5], mira: [0, 1.8, -3] }],
  [T.alcance, { pos: [0, 2.6, 6.5], mira: [0, 1.8, -3] }],
  [T.seg + 0.1, { pos: [3.6, 2.2, 8.6], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.decide + 0.1, { pos: [3.6, 2.2, 8.6], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.fila + 0.2, { pos: [0, 2.3, -3.5], mira: [0, 1.45, -M.R0] }],
  [T.tu9 - 0.1, { pos: [0, 2.3, -3.5], mira: [0, 1.45, -M.R0] }],
  [T.eliges + 0.05, { pos: [5.2, 2.8, 3.2], mira: [0.6, 1.6, -0.5] }],
  [T.eliges + 0.5, { pos: [0.8, 2.2, 7.4], mira: [0.4, 1.6, -4] }],
  [T.sales + 0.55, { pos: [0, 7, 15], mira: [0, 4.5, -8] }],
  [T.fin9 + 0.3, { pos: [0, 7, 15], mira: [0, 4.5, -8] }],
]);

// la luz de las gradas en cada momento
function luzGradas(t) {
  const corro = su(tr(t, T.solo - 0.05, T.solo + 0.3)) * (1 - su(tr(t, T.subes, T.subes + 0.4)));
  const res = su(tr(t, T.siguiente + 0.1, T.publicas));                 // los resultados de las tres
  const quita = su(tr(t, T.aguanto + 0.2, T.aguanto + 0.7));            // se van los de las perdedoras
  const fila9 = su(tr(t, T.fila - 0.05, T.fila + 0.15));
  const todo = k.claves([[T.eliges, 0], [T.sales + 0.3, M.FILAS + 3]])(t);
  return (r, a, s) => {
    let l = 0;
    if (corro > 0.003 && r <= 3 && Math.abs(a) < 0.3 + 0.03 * s) l = corro * (0.8 + 0.2 * Math.sin(s * 50 + t * 4));
    if (res > 0.003) {
      // izquierda (a ≈ +0.75): una fila; medio (a ≈ 0): cinco; derecha (a ≈ -0.75): ninguna
      const sect = (c, w) => Math.abs(a - c) < w;
      if (sect(0.78, 0.22) && r < 1 * res + 0.5) l = Math.max(l, res * (1 - quita));
      if (sect(0, 0.3) && r < 5 * res + 0.5) l = Math.max(l, res);
    }
    if (fila9 > 0.003 && r === 0) l = Math.max(l, fila9);
    if (t > T.eliges) { const d = todo - r; if (d > 0) l = Math.max(l, Math.min(1, d / 1.2) * (0.9 + 0.1 * Math.sin(s * 40 + t * 6))); }
    return l;
  };
}

// el interruptor «Prueba» sobre la tarjeta (en pantalla, pegado a su esquina)
function interruptor(g, r, t) {
  if (!r) return;
  const sale = k.entra(tr(t, T.prueba - 0.05, T.prueba + 0.3)), on = su(tr(t, T.trial, T.reels + 0.1));
  if (sale <= 0.01) return;
  const x = r.x + r.w * 0.52, y = r.y - r.h * 0.42, w = r.h * 0.19 * sale, h = w * 0.5;
  g.save();
  // la etiqueta
  g.globalAlpha = sale; k.etiqueta(g, x - w * 0.1, y - h * 1.9, "Prueba", M.CIAN, 1, Math.max(28, h * 0.55));
  // el interruptor
  k.redondo(g, x, y, w, h, h / 2); g.fillStyle = `rgb(${k.mezRgb("60,66,90", M.CIAN, on)})`; g.fill();
  g.beginPath(); g.arc(x + h / 2 + (w - h) * on, y + h / 2, h * 0.4, 0, 6.2832); g.fillStyle = "#fff"; g.fill();
  if (on > 0.5) { g.globalCompositeOperation = "lighter"; k.brillo(g, x + w / 2, y + h / 2, w * 2.2, M.CIAN, 0.35 * on); }
  g.restore();
}


export function dibuja(g, t) { M.cielo(g); escena(g, cam(t), t); }

// toda la escena de la pista (el plano 10 la sigue dibujando con su propia cámara). op.glow: cuánto resplandor final.
export function escena(g, cm, t, op = {}) {
  // en «al día siguiente» amanece y vuelve la noche
  const dia = k.pulso(t, T.siguiente + 0.1, 0.42);
  if (dia > 0.01) { g.save(); const gr = g.createLinearGradient(0, 0, 0, 1100); gr.addColorStop(0, `rgba(255,170,90,${0.75 * dia})`); gr.addColorStop(1, `rgba(255,120,60,0)`); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1100); g.restore(); }
  const fila = M.estadio(g, cm, luzGradas(t), { fila: t > T.fila - 0.05 ? su(tr(t, T.fila - 0.05, T.fila + 0.15)) : 0 });
  // la cortina sobre el banco en «no te sigue», y el banco que se apaga del todo en «no lo deciden tus seguidores»
  const cortina = su(tr(t, T.no - 0.1, T.sigue + 0.2));
  const banco = M.banco(g, cm, M.BANCO, (0.8 - 0.45 * cortina) * (1 - 0.45 * su(tr(t, T.deciden, T.seg + 0.3))));
  if (banco && !banco.fuera && cortina > 0.01) { g.save(); g.fillStyle = `rgba(10,8,26,${0.7 * cortina})`; const h = banco.h * 1.25 * cortina; k.redondo(g, banco.x - banco.w * 0.62, banco.y - banco.h * 1.25, banco.w * 1.24, h, 14); g.fill(); g.restore(); }
  // tú: en «eliges» levantas el móvil
  M.dueno(g, cm, DUENO7, 1.85, { mezcla: { pose: "trofeo", u: su(tr(t, T.eliges - 0.1, T.eliges + 0.2)) } });
  // tu tarjeta con la etiqueta y el interruptor (hasta que suben las tres)
  const tres = su(tr(t, T.tres - 0.1, T.principios + 0.3));
  if (tres < 0.999) {
    const r = M.tarjeta(g, cm, TARJETA, 2.6 * (1 - tres), { brillo: 0.4, borde: 0.95, al: 1 - tres });
    if (t < T.tres) interruptor(g, r, t);
  }
  // las tres tarjetas: suben, cada una con su principio; la del medio gana
  if (tres > 0.001) {
    const gana = su(tr(t, T.mas - 0.1, T.aguanto + 0.4)), alza = su(tr(t, T.eliges - 0.05, T.eliges + 0.45));
    const minis = [M.MINIS.a, M.MINIS.b, M.MINIS.c], letras = ["A", "B", "C"];
    CARTAS.forEach((c, i) => {
      const sube = k.entra(tr(t, T.tres - 0.1 + i * 0.12, T.principios + 0.2 + i * 0.12));
      const pierde = i === 1 ? 0 : gana;
      if (pierde > 0.985) return;
      let h = 2.6 * sube * (1 - 0.9 * pierde) * (i === 1 ? 1 + 0.15 * gana : 1);
      let P = [c[0], c[1] - 0.1 * pierde, mez(c[2], 0.6, i === 1 ? gana : 0)];
      if (i === 1 && alza > 0) { const A = [DUENO7[0] + 0.02, 2.05 + 0.35 * alza + 0.04 * Math.sin(t * 5), DUENO7[2] - 0.3]; P = k.mezV(P, A, alza); h = mez(h, 2.2, alza); }
      const r = M.tarjeta(g, cm, P, h, { mini: minis[i], brillo: i === 1 ? 0.4 + 0.3 * gana : 0.35 * (1 - pierde), borde: 0.9, apagada: pierde * 0.6, al: 1 - 0.9 * pierde });
      if (r && sube > 0.9 && pierde < 0.5 && alza < 0.5) k.etiqueta(g, r.x - r.w * 0.45, r.y - r.h * 0.5 - 70, letras[i], i === 1 ? M.NARANJA : "220,225,240", (1 - pierde) * (1 - 2 * alza), 40);
    });
  }
  // «eliges»: el estadio se enciende detrás
  const lleno = su(tr(t, T.sales - 0.1, T.sales + 0.5));
  if (lleno > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 820, 2400, M.AZUL, 0.2 * lleno * (op.glow ?? 1)); g.restore(); }
  if (fila && !fila.fuera) k.fogonazo(g, fila.x, fila.y - fila.h * 0.5, t - (T.fila - 0.05), 1200, "170,220,255");
}

export const momentos = { etiqueta: T.prueba - 0.05, interruptor: T.trial, corro: T.solo - 0.05, cortina: T.no - 0.1, suben: [0, 1, 2].map((i) => T.tres - 0.1 + i * 0.12), dia: T.siguiente - 0.2, resultados: T.siguiente + 0.1, gana: T.mas - 0.1, apagaBanco: T.deciden, fila: T.fila - 0.05, alza: T.eliges - 0.05, lleno: T.sales - 0.1 };
