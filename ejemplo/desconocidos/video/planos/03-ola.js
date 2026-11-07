// «Lo dice Instagram: cada reel que subes se lo enseña primero a un grupo pequeño que no te sigue.» (desde el cielo)
// «Es como salir a un estadio a oscuras donde solo se enciende la primera fila.» (la cámara baja a la pista, sin corte)
// «Si esa fila lo ve entero y lo envía, se enciende la siguiente, y la siguiente, hasta llenar el estadio.» (la ola)
// - «Instagram»: el borde del estadio da un latido de luz. «reel que subes»: tu tarjeta sube del centro.
// - «grupo pequeño»: en medio de miles de puntos apagados se enciende un corro pequeño de luces azules.
// - «no te sigue»: lejos, el banco naranja de los seguidores parpadea, apagado.
// - «salir»: la cámara cae en picado a la pista y tú sales al centro; «a oscuras»: todo negro alrededor.
// - «primera fila»: chasquido y la fila de los seis se enciende delante de ti.
// - «entero»: sobre cada móvil una barrita que se llena; «envía»: avioncitos de luz hacia las gradas;
//   «siguiente» ×2: se enciende una fila más cada vez; «llenar»: la ola sube por todo el estadio y la cámara se aleja.
// Se corta en «Pero» (la fila, otra vez).
import * as k from "#kit";
import { v } from "#voz";
import * as M from "../mundo.js";
import { DUENO, TARJETA } from "./01-estadio.js";

const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
export const desde = () => f3.inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez } = k;
export const T = {
  insta: f3.t("instagram"), reel: f3.t("reel"), subes3: f3.t("subes"), primero: f3.t("primero"), grupo: f3.t("grupo"), peq: f3.t("pequeño"), no: f3.t("no"), sigue: f3.t("sigue"), fin3: f3.fin,
  es: f4.inicio, salir: f4.t("salir"), estadio: f4.t("estadio"), oscuras: f4.t("oscuras"), solo: f4.t("solo"), enciende: f4.t("enciende"), fila: f4.t("fila"), fin4: f4.fin,
  si: f5.inicio, entero: f5.t("entero"), envia: f5.t("envía"), sig1: f5.t("siguiente"), sig2: f5.t("siguiente", 2), hasta: f5.t("hasta"), llenar: f5.t("llenar"), estadio5: f5.t("estadio"), fin5: f5.fin,
};

export const DUENO3 = [1.7, 0, 1.9], TARJETA3 = [-1.2, 0, 0.0];   // a tu lado al bajar; se apaga antes de que la cámara avance a la fila
export const cam = k.ruta([
  [T.insta - 0.4, { pos: [0, 125, 26], mira: [0, 0, -3] }],
  [T.grupo, { pos: [0, 95, 20], mira: [0, 2, -8] }],
  [T.sigue + 0.3, { pos: [0, 80, 16], mira: [0, 2, -10] }],
  [T.estadio + 0.2, { pos: [0.4, 2.6, 6.5], mira: [0.2, 1.3, -M.R0] }],
  [T.solo, { pos: [0.4, 2.6, 6.5], mira: [0.2, 1.3, -M.R0] }],
  [T.fila + 0.3, { pos: [0, 2.4, -3.2], mira: [0, 1.45, -M.R0] }],
  [T.sig1 - 0.2, { pos: [0, 2.4, -3.2], mira: [0, 1.45, -M.R0] }],
  [T.sig2, { pos: [0, 4.5, 0], mira: [0, 3.5, -M.R0] }],
  [T.hasta, { pos: [0, 9, 6], mira: [0, 8, -M.R0 - 4] }],
  [T.estadio5 + 0.25, { pos: [0, 52, 40], mira: [0, 10, -8] }],
  [T.fin5 + 0.3, { pos: [0, 52, 40], mira: [0, 10, -8] }],
]);

// cuánto está encendido cada asiento
function luzGradas(t) {
  // el corro pequeño de la frase 3, que se apaga al bajar a la pista
  const corro = su(tr(t, T.grupo - 0.1, T.peq + 0.15)) * (1 - su(tr(t, T.salir, T.estadio)));
  // la ola de la frase 5: una fila, otra, y el estadio entero
  const frente = k.claves([[T.sig1 - 0.25, 0], [T.sig1 + 0.1, 1.9], [T.sig2 - 0.25, 1.9], [T.sig2 + 0.1, 3.9], [T.hasta + 0.1, 4.2], [T.estadio5 + 0.2, M.FILAS + 3]])(t);
  const ancho = k.claves([[T.sig1 - 0.25, 0.42], [T.sig2 + 0.1, 0.75], [T.hasta + 0.1, 0.9], [T.estadio5 + 0.2, 3.3]])(t);
  const calma = 1 - su(tr(t, T.fin5 - 0.45, T.fin5 - 0.15));   // antes del corte, las luces se quedan quietas
  const parpadeo = 1;
  return (r, a, s) => {
    let l = 0;
    if (corro > 0.003 && r <= 3 && Math.abs(a) < 0.3 + 0.03 * s) l = corro * (0.75 + 0.25 * Math.sin(s * 50 + t * 4));
    if (t > T.sig1 - 0.3 && r >= 1) {
      const d = frente - r;
      const dentro = Math.abs(a) < ancho * (0.9 + 0.2 * s);
      if (dentro && d > 0) l = Math.max(l, Math.min(1, d / 0.9) * parpadeo * (0.9 + 0.1 * calma * Math.sin(s * 40 + t * 6)));
    }
    return l;
  };
}

// las barritas de «entero» y los avioncitos de «envía», en pantalla sobre la fila
function sobreLaFila(g, t, fila) {
  if (!fila || fila.fuera) return;
  const barra = su(tr(t, T.entero - 0.45, T.entero + 0.25)), ve = tr(t, T.si + 0.05, T.envia + 0.5);
  if (ve > 0 && ve < 1) {
    g.save();
    for (const s of M.SEIS) {
      const x = fila.x - fila.w / 2 + s.u * fila.w, y = fila.y - fila.h * 1.08, w = fila.w * 0.11, h = Math.max(8, fila.h * 0.03);
      k.redondo(g, x - w / 2, y, w, h, h / 2); g.fillStyle = "rgba(255,255,255,0.25)"; g.fill();
      k.redondo(g, x - w / 2, y, w * Math.max(0.02, barra), h, h / 2); g.fillStyle = `rgb(${M.CIAN})`; g.fill();
      if (barra > 0.98) k.brillo(g, x - w / 2 + w, y + h / 2, h * 6, M.CIAN, 0.8 * (1 - tr(t, T.entero + 0.3, T.entero + 0.8)));
    }
    g.restore();
  }
  // los avioncitos: de cada móvil sale una chispa que vuela hacia arriba y atrás (hacia las filas de detrás)
  const u = tr(t, T.envia - 0.05, T.envia + 0.7);
  if (u > 0 && u < 1) {
    g.save(); g.globalCompositeOperation = "lighter";
    M.SEIS.forEach((s, i) => {
      const x0 = fila.x - fila.w / 2 + s.u * fila.w, y0 = fila.y - fila.h * 0.3;
      const e = k.entra(u), x = x0 + (s.u - 0.5) * fila.w * 0.5 * e, y = y0 - fila.h * (0.9 + 0.2 * (i % 3)) * e + 60 * e * e;
      const al = 1 - u * u;
      for (let j = 0; j < 7; j++) { const b = Math.max(0, u - j * 0.035), eb = k.entra(b); const xx = x0 + (s.u - 0.5) * fila.w * 0.5 * eb, yy = y0 - fila.h * (0.9 + 0.2 * (i % 3)) * eb + 60 * eb * eb; k.brillo(g, xx, yy, 90 * (1 - j / 8), M.CIAN, 0.7 * al * (1 - j / 8)); }
      g.fillStyle = `rgba(255,255,255,${0.95 * al})`; g.beginPath(); g.moveTo(x, y - 24); g.lineTo(x + 26, y + 12); g.lineTo(x, y + 3); g.lineTo(x - 26, y + 12); g.closePath(); g.fill();
    });
    g.restore();
  }
}

export function dibuja(g, t) {
  const cm = cam(t);
  M.cielo(g);
  const encFila = su(tr(t, T.enciende - 0.02, T.enciende + 0.14));
  const lejos = t < T.salir;
  const fila = M.estadio(g, cm, luzGradas(t), { fila: encFila, detalle: lejos ? 0.5 : 1 });
  // el borde del estadio late en «Instagram»
  const lat = k.pulso(t, T.insta + 0.1, 0.22);
  if (lat > 0.02) { const c = k.proyecta(cm, [0, M.ALTO_GRADA, 0]); if (c) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, c.x, c.y, k.tamano(M.RADIO * 2.3, c.z), "150,180,255", 0.35 * lat); g.restore(); } }
  { const corro = su(tr(t, T.grupo - 0.1, T.peq + 0.15)) * (1 - su(tr(t, T.salir, T.estadio))); const c = k.proyecta(cm, [0, 2, -M.R0 - 2]); if (corro > 0.01 && c) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, c.x, c.y, k.tamano(14, c.z), M.AZUL, 0.55 * corro); g.restore(); } }
  // tu tarjeta: sube en «reel que subes» (y ya está en la pista desde entonces)
  const sube = k.entra(tr(t, T.reel - 0.05, T.subes3 + 0.3));
  const golpe = su(tr(t, T.reel, T.subes3 + 0.1)) * (1 - su(tr(t, T.subes3 + 0.2, T.primero)));
  const seVa = su(tr(t, T.solo - 0.2, T.solo + 0.25));
  if (sube > 0.01 && seVa < 0.999) M.tarjeta(g, cm, lejos ? [0, 0, 0] : TARJETA3, 2.6 * sube * (1 + 2.2 * golpe), { brillo: (0.4 + 0.3 * golpe) * (1 - seVa), borde: 0.95, al: 1 - seVa });
  // el banco de los seguidores: parpadea apagado en «no te sigue»
  const parp = t > T.no - 0.1 && t < T.sigue + 0.6 ? 0.2 + 0.5 * k.pulso(t, T.no + 0.15, 0.12) + 0.5 * k.pulso(t, T.sigue, 0.12) : 0.12;
  M.banco(g, cm, M.BANCO, Math.min(1, parp));
  // tú: sales al centro en «salir» (de la derecha, con un paso)
  if (t > T.salir - 0.2) {
    const u = su(tr(t, T.salir - 0.1, T.estadio + 0.1));
    const x = mez(DUENO3[0] + 4.2, DUENO3[0], u), bob = Math.abs(Math.sin(u * 14)) * 0.05 * (1 - u);
    M.dueno(g, cm, [x, bob, DUENO3[2]], 1.85, { pose: "camina", mezcla: { pose: "dueno", u: su(tr(t, T.estadio + 0.05, T.estadio + 0.35)) } });
  }
  if (fila && !fila.fuera) k.fogonazo(g, fila.x, fila.y - fila.h * 0.5, t - (T.enciende - 0.02), 1400, "170,220,255");
  sobreLaFila(g, t, fila);
  // «llenar»: el resplandor de todo el estadio encendido
  const lleno = su(tr(t, T.llenar - 0.1, T.estadio5 + 0.2));
  if (lleno > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 820, 2400, M.AZUL, 0.22 * lleno); g.restore(); }
  if (!lejos && t < T.sig2) { const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(5,6,15,0.5)"); vg.addColorStop(1, "rgba(5,6,15,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 600); }
}

export const momentos = { late: T.insta + 0.1, sube: T.reel - 0.05, corro: T.grupo - 0.1, parpadea: [T.no + 0.15, T.sigue], cae: T.salir, pasos: T.salir, enciende: T.enciende - 0.02, barras: T.entero - 0.45, envia: T.envia - 0.05, filas: [T.sig1 - 0.25, T.sig2 - 0.25], ola: T.hasta + 0.1, lleno: T.llenar };
