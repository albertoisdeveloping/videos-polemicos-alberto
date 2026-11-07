// «¿Sabías que cada vídeo que subes lo ven primero un puñado de desconocidos, y son ellos los que deciden si lo ve
// alguien más?» + «Tú crees que tienes trescientas visitas por tener pocos seguidores, pero ellos casi no pintan nada.»
// Apertura A, el estadio: la cámara cae en picado desde el cielo sobre el estadio a oscuras; «subes»: tu tarjeta sube
// de la pista; «primero»: chasquido y solo se enciende la primera fila, seis caras con su móvil; «desconocidos»: la
// cámara frena delante de ellos; «alguien más»: se eleva y se intuye todo lo que espera a oscuras. Frase 2, sin corte:
// baja a la pista, tú con el móvil; «seguidores»: gira al banco naranja de tus cuatro amigos; «nada»: se aleja y el
// banco se queda diminuto y se apaga. Se corta en «Lo» (el cielo).
import * as k from "#kit";
import { v } from "#voz";
import * as M from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2);
export const T = {
  subes: f1.t("subes"), primero: f1.t("primero"), desc: f1.t("desconocidos"), deciden: f1.t("deciden"), alguien: f1.t("alguien"), fin1: f1.fin,
  tu: f2.t("tu"), tresc: f2.t("trescientas"), pocos: f2.t("pocos"), seg: f2.t("seguidores"), pero: f2.t("pero"), nada: f2.t("nada"), fin2: f2.fin,
};
export const DUENO = [1.0, 0, 0.6], TARJETA = [-1.0, 0, 0.6];

// la cámara: cae del cielo, frena en la fila, se eleva, baja a ti, gira al banco y se aleja
export const cam = k.ruta([
  [0, { pos: [0, 110, 30], mira: [0, 0, -2] }],
  [T.subes, { pos: [0, 34, 12], mira: [-1.2, 1.5, -1] }],
  [T.primero - 0.1, { pos: [0.6, 3.0, 5.0], mira: [0, 1.4, -M.R0] }],
  [T.desc, { pos: [0, 1.9, -5.8], mira: [0, 1.45, -M.R0] }],
  [T.deciden + 0.3, { pos: [0, 1.9, -5.8], mira: [0, 1.45, -M.R0] }],
  [T.fin1 - 0.1, { pos: [0, 7, 3], mira: [0, 5, -M.R0 - 6] }],
  [T.tu + 0.7, { pos: [2.6, 1.6, 6.2], mira: [0.3, 0.95, 0] }],
  [T.pocos - 0.15, { pos: [2.6, 1.6, 6.2], mira: [0.3, 0.95, 0] }],
  [T.seg + 0.2, { pos: [4.6, 2.0, 8.2], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.pero + 0.3, { pos: [4.6, 2.0, 8.2], mira: [M.BANCO[0], 1.0, M.BANCO[2]] }],
  [T.nada + 0.2, { pos: [5, 26, 34], mira: [2, 3, -8] }],
  [T.fin2 + 0.4, { pos: [5, 26, 34], mira: [2, 3, -8] }],
]);

// luz de las gradas: nada hasta «primero»; en «alguien más» un asomo en las filas de detrás
export function luzGradas(t) {
  const asomo = 0.1 * su(tr(t, T.alguien - 0.1, T.alguien + 0.5)) * (1 - su(tr(t, T.tu + 0.4, T.tu + 1.2)));
  return (r, a, s) => (r > 0 && r < 6 && Math.abs(a) < 0.9 ? asomo * (0.5 + 0.5 * Math.sin(s * 40 + t * 3)) : 0);
}

// lo que pasa en el mundo después del primer segundo y medio (lo comparten las dos aperturas)
export function mundo(g, t, cm, op = {}) {
  M.cielo(g);
  const encFila = su(tr(t, T.primero - 0.04, T.primero + 0.12));
  const fila = M.estadio(g, cm, luzGradas(t), { fila: encFila, detalle: t > T.primero - 0.3 ? 1 : 0.5 });
  // tu tarjeta: sube de la pista en «subes» y se queda en el centro
  const sube = k.entra(tr(t, T.subes - 0.12, T.subes + 0.5));
  const alto = mez(0, 2.6, sube) * (1 + 0.7 * su(tr(t, T.subes - 0.1, T.subes + 0.3)) * (1 - su(tr(t, T.subes + 0.4, T.primero - 0.05))));
  if (alto > 0.02 && !(op.sinTarjetaHasta && t < op.sinTarjetaHasta)) {
    const late = 1 + 0.03 * Math.sin(t * 9);
    M.tarjeta(g, cm, [TARJETA[0], 0, TARJETA[2]], alto * late, { brillo: 0.35 + 0.35 * sube, borde: 0.95, apagada: 0 });
  }
  if (fila && !fila.fuera) k.fogonazo(g, fila.x, fila.y - fila.h * 0.5, t - (T.primero - 0.02), 1400, "170,220,255");
  // «deciden»: los móviles de los seis laten un poco; sus pulgares (un punto de luz que sube)
  if (fila && !fila.fuera && t > T.deciden - 0.1 && t < T.fin1 + 0.2) {
    const u = su(tr(t, T.deciden - 0.1, T.deciden + 0.3));
    g.save(); g.globalCompositeOperation = "lighter";
    for (const s of M.SEIS) { const x = fila.x - fila.w / 2 + s.u * fila.w, y = fila.y - fila.h * 0.22; k.brillo(g, x, y, fila.w * 0.09 * (1 + 0.25 * Math.sin(t * 8 + s.u * 9)), M.CIAN, 0.5 * u); }
    g.restore();
  }
  // frase 2: tú, con el móvil, al lado de tu tarjeta; el banco de tus seguidores
  if (t > T.fin1 - 0.6) {
    const luzBanco = su(tr(t, T.pocos - 0.1, T.seg + 0.1)) * (1 - su(tr(t, T.nada - 0.05, T.nada + 0.35)));
    M.banco(g, cm, M.BANCO, 0.15 + 0.85 * luzBanco);
    const d = M.dueno(g, cm, DUENO, 1.85, { luz: 1 });
    // la luz de la tarjeta sobre ti
    if (d && !d.fuera) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, d.x - d.w * 0.3, d.y - d.h * 0.5, d.h * 0.9, M.NARANJA, 0.18); g.restore(); }
  }
  // el velo de arriba para el subtítulo cuando la fila llena la pantalla
  if (t > T.primero && t < T.fin1) { const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(5,6,15,0.55)"); vg.addColorStop(1, "rgba(5,6,15,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 600); }
}

export function dibuja(g, t) { mundo(g, t, cam(t)); }

// para el sonido y los efectos
export const momentos = { cae: 0, subes: T.subes - 0.12, enciende: T.primero - 0.04, frena: T.desc, eleva: T.fin1 - 0.3, baja: T.tu + 0.1, gira: T.seg - 0.1, aleja: T.nada - 0.1, apaga: T.nada + 0.1 };
