// «¿Sabías que cada vídeo tuyo que la gente pasa de largo hace que le caigas un poco mejor?»
// El feed como un túnel: la cámara vuela a toda velocidad entre vídeos de colores que vienen hacia ella (el scroll).
// - Fotograma 0: ya en pleno vuelo, con vídeos pasando a los lados.
// - «tuyo»: tu vídeo, el de la tienda del toldo naranja, pasa rozando la cámara; «gente» y «largo»: vuelve a pasar.
// - «hace que le caigas»: el vuelo frena y tu vídeo se queda delante, grande; por abajo entra la silueta de quien
//   mira, de espaldas, y la luz naranja de tu vídeo le va iluminando; «mejor»: el naranja le llena.
// Se corta en «Lo» (el aula).
import * as k from "#kit";
import { v } from "#voz";
import { NARANJA, OTROS, espalda, tarjeta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar, F } = k;
const f1 = v.frase(1);
const Ttuyo = f1.t("tuyo"), Tgente = f1.t("gente"), Tlargo = f1.t("largo"), Thace = f1.t("hace"), Tcaig = f1.t("caigas"), Tmejor = f1.t("mejor");
const Tpara = Thace + 0.35;          // el vuelo se para aquí
const D = 70;                        // lo que avanza la cámara en total
const d = (t) => { const u = Math.min(1, Math.max(0, t / Tpara)); return D * (1 - Math.pow(1 - u, 2.4)) + 6; };
const H = 1.6;                       // alto de un vídeo en el mundo

// Los vídeos del túnel: en anillos alrededor del camino de la cámara.
const az = azar(4242);
const CARTAS = [];
for (let i = 0; i < 110; i++) {
  const z = 4 + i * 0.8 + az() * 0.5, a = az() * 6.2832, r = 2.3 + az() * 1.6;
  CARTAS.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 1.1, z, nombre: OTROS[Math.floor(az() * OTROS.length)] });
}
// Unos cuantos pasan muy cerca al principio: llenan la pantalla un instante al cruzarse.
for (let i = 0; i < 9; i++) { const a = 0.5 + i * 2.4, T = 0.12 + i * 0.13; CARTAS.push({ x: Math.cos(a) * 1.05, y: Math.sin(a) * 1.25, z: d(T) + 0.25, nombre: OTROS[i % OTROS.length] }); }
// Tu vídeo, en pantalla: llega desde el fondo, se queda grande un momento y sale disparado hacia arriba (el scroll).
// Dos veces («tuyo», «largo»); la tercera llega y se queda («hace que le caigas»).
const PASADAS = [
  { llega: Ttuyo - 0.2, quieto: Ttuyo + 0.08, va: Ttuyo + 0.42, sale: Ttuyo + 0.62, x: 600, ang: 0.05 },
  { llega: Tlargo - 0.42, quieto: Tlargo - 0.12, va: Tlargo + 0.2, sale: Tlargo + 0.4, x: 500, ang: -0.05 },
];
const Tfin0 = Thace - 0.05, Tfin1 = Tpara + 0.15;
function tuyo(g, t) {
  for (const p of PASADAS) {
    if (t < p.llega || t > p.sale + 0.05) continue;
    const u = k.entra(tr(t, p.llega, p.quieto)), w = k.sale(tr(t, p.va, p.sale));
    const h = mez(160, 900, u) * (1 + 0.04 * tr(t, p.quieto, p.va)), y = mez(1000, 1000, u) - 2600 * w;
    g.save(); g.translate(p.x, y); g.rotate(p.ang * (1 - u) + p.ang * 0.4);
    if (w > 0.02) { for (let i = 1; i <= 4; i++) tarjeta(g, "tuyo", 0, i * 120 * w, h, { al: 0.18 / i, borde: NARANJA }); }
    tarjeta(g, "tuyo", 0, 0, h, { al: Math.min(1, u * 3), borde: NARANJA, brillo: 0.6, color: NARANJA });
    g.restore();
  }
  if (t >= Tfin0) {
    const u = k.entra(tr(t, Tfin0, Tfin1));
    const h = mez(140, 920, u);
    tarjeta(g, "tuyo", 540, mez(980, 960, u), h, { al: Math.min(1, u * 3), borde: NARANJA, sombra: true, brillo: 0.35 + 0.65 * su(tr(t, Tcaig - 0.2, Tmejor + 0.2)), color: NARANJA });
  }
}

// las luces desenfocadas del fondo, dibujadas una vez
const BOKEH = k.lienzo(1080, 2200);
{ const c = BOKEH.getContext("2d"); c.fillStyle = "#07040f"; c.fillRect(0, 0, 1080, 2200); c.globalCompositeOperation = "lighter"; for (let i = 0; i < 24; i++) k.brillo(c, az() * 1080, az() * 2200, (60 + az() * 160) * 2, ["255,90,180", "90,180,255", "255,170,60", "150,100,255"][Math.floor(az() * 4)], 0.22); }

function pantalla(g, cz, t, gris) {
  // el fondo: oscuro, con luces desenfocadas que se mueven despacio
  const oy = -((cz * 30) % 2200); g.drawImage(BOKEH, 0, oy); if (oy + 2200 < 1920) g.drawImage(BOKEH, 0, oy + 2200);
  if (gris > 0) { g.fillStyle = `rgba(7,4,15,${0.5 * gris})`; g.fillRect(0, 0, 1080, 1920); }
  const cosas = [];
  for (const c of CARTAS) {
    if (c.fuera) continue;
    const z = c.z - cz;
    if (z < 0.3 || z > 34) continue;
    const x = 540 + (F * c.x) / z, y = 980 - (F * c.y) / z, h = (F * H) / z;
    if (x < -h || x > 1080 + h || y < -h || y > 1920 + h) continue;
    cosas.push({ z, dibuja() {
      const lejos = Math.min(1, (34 - z) / 10);           // aparecen de lejos sin saltar
      const cerca = Math.min(1, (z - 0.3) / 0.35);
      const al = lejos * cerca;
      tarjeta(g, c.nombre, x, y, h, { al: al * (1 - 0.65 * gris), gris: 0.5 * gris });
    } });
  }
  k.deLejosACerca(cosas);
}

let estela = null;
export function dibuja(g, t) {
  const gris = su(tr(t, Thace, Tcaig + 0.3));
  // estela de velocidad: los fotogramas de un instante antes, más tenues (solo mientras vuela deprisa)
  const vel = (d(t + 0.01) - d(t)) / 0.01;
  if (vel > 6) {
    // un solo fotograma de antes, a media resolución: basta para la estela y cuesta poco
    estela = estela || k.lienzo(540, 960);
    const c = estela.getContext("2d");
    c.setTransform(0.5, 0, 0, 0.5, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
    pantalla(c, d(t - 0.02), t, gris);
    pantalla(g, d(t), t, gris);
    g.globalAlpha = 0.3; g.drawImage(estela, 0, 0, 1080, 1920); g.globalAlpha = 1;
  } else pantalla(g, d(t), t, gris);
  tuyo(g, t);

  // quien mira, de espaldas: entra por abajo cuando frena el vuelo
  const sube = k.entra(tr(t, Thace - 0.1, Tcaig + 0.15));
  if (sube > 0) {
    const cuanto = 0.25 + 0.75 * su(tr(t, Tcaig - 0.1, Tmejor + 0.25));
    espalda(g, 560, mez(2350, 1530, sube), 360, NARANJA, cuanto);
  }
  // «mejor»: el calor naranja llena la imagen y se queda, suave
  const calor = su(tr(t, Tmejor - 0.15, Tmejor + 0.45));
  if (calor > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 1150, 1500, NARANJA, 0.35 * calor); g.restore(); }
  // el velo de arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 160, 0, 620); vg.addColorStop(0, "rgba(6,3,12,0.6)"); vg.addColorStop(1, "rgba(6,3,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

// Para el sonido: cuándo pasa rozando tu vídeo, cuándo frena y cuándo llega el calor
export const momentos = { llegadas: PASADAS.map((p) => p.llega), salidas: PASADAS.map((p) => p.va), final: Tfin0, para: Tpara, sube: Thace - 0.1, calor: Tmejor - 0.15 };
