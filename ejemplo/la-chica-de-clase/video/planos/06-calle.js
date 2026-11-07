// «Y el día que necesite lo que vendes, va a tirar del que ya le suena.»
// Otro sitio: una calle de noche con una fila de tiendas a oscuras. Se entra con un corte en «Y».
// - «el día que necesite lo que vendes»: la cámara viaja por la calle, tienda tras tienda, todas iguales y apagadas;
//   quien mira (la misma silueta, con la luz naranja dentro) camina por la acera.
// - «va a tirar del que»: la cámara frena delante de la del toldo naranja, la de tu vídeo.
// - «suena»: se enciende, con su luz cálida en la calle, y la luz de su cabeza se enciende con ella.
// Se corta en «Así» (el aula).
import * as k from "#kit";
import { v } from "#voz";
import { NARANJA, espalda, tienda } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f9 = v.frase(9);
const T0 = f9.inicio, Tvend = f9.t("vendes"), Ttirar = f9.t("tirar"), Tsuena = f9.t("suena"), Fin = f9.fin;

const ANCHO = 800, N = 6, TUYA = 4;               // tiendas de 620 de ancho; la tuya es la quinta
const TOLDOS = ["70,110,170", "60,140,100", "150,60,70", "110,90,160", NARANJA, "60,130,140"];
const cx = k.claves([[T0, 0], [Ttirar + 0.1, TUYA * ANCHO]]);
export const enciende = Tsuena - 0.12;

const CIELO = (() => { const cv = k.lienzo(1080, 1920), g = cv.getContext("2d"); const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#0b1030"); bg.addColorStop(1, "#2a1a3a"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920); const az = azar(2); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + az() * 0.6})`; g.fillRect(az() * 1080, az() * 700, 2, 2); } return cv; })();

export function dibuja(g, t) {
  g.drawImage(CIELO, 0, 0);
  const x0 = cx(t), luz = su(tr(t, enciende, enciende + 0.35));
  // las tiendas, una al lado de otra (la base en y 1350)
  for (let i = 0; i < N; i++) {
    const x = 540 + i * ANCHO - x0;
    if (x < -ANCHO || x > 1080 + ANCHO) continue;
    tienda(g, x, 1350, ANCHO - 40, i === TUYA ? mez(0.22, 1, luz) : 0.22, t, TOLDOS[i]);
  }
  // la acera y la calzada, con el reflejo de la luz de tu tienda
  const ag = g.createLinearGradient(0, 1350, 0, 1920); ag.addColorStop(0, "#3a3438"); ag.addColorStop(0.2, "#262226"); ag.addColorStop(1, "#141216"); g.fillStyle = ag; g.fillRect(0, 1350, 1080, 570);
  g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(0, 1350, 1080, 6);
  if (luz > 0) { g.save(); g.globalCompositeOperation = "lighter"; const tx = 540 + TUYA * ANCHO - x0; k.brillo(g, tx, 1400, 1300, "255,170,80", 0.45 * luz); g.restore(); }
  // las farolas, entre tienda y tienda
  for (let i = 0; i <= N; i++) { const x = 540 + (i - 0.5) * ANCHO - x0; if (x < -100 || x > 1180) continue; g.fillStyle = "#18161c"; g.fillRect(x - 8, 520, 16, 840); g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, 520, 420, "190,200,255", 0.4); g.restore(); }
  // quien mira, de espaldas, en la acera: camina y, en «suena», se le enciende la luz de dentro
  const anda = 1 - su(tr(t, Ttirar - 0.1, Ttirar + 0.3)), bob = Math.abs(Math.sin(t * 7)) * 10 * anda;
  espalda(g, 250, 1640 - bob, 220, luz > 0 ? NARANJA : "150,160,210", 0.3 + 0.6 * luz, 0.55 + 0.45 * luz);
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(8,6,20,0.5)"); vg.addColorStop(1, "rgba(8,6,20,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { viaje: T0, frena: Ttirar + 0.1, enciende };
