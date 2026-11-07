// «Pues eso hacen tus vídeos cuando alguien los pasa de largo, que le vas sonando sin que se dé cuenta.»
// Otro sitio: por encima del hombro de quien mira el móvil (la misma silueta del principio). Se entra en «Pues».
// - «tus vídeos»: en su móvil, el feed; el pulgar sube vídeo tras vídeo y entre ellos sale el tuyo (la tienda).
// - «los pasa de largo»: tu vídeo se va hacia arriba como los demás, sin pararse.
// - «le vas sonando»: cada vez que pasa el tuyo, dentro de su cabeza se enciende un poco más la luz naranja.
// - «sin que se dé cuenta»: la cabeza ni se mueve; la luz se queda.
// Se corta en «Y» (la calle).
import * as k from "#kit";
import { v } from "#voz";
import { NARANJA, OTROS, espalda, tarjeta } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tvid = f8.t("videos"), Tlargo = f8.t("largo"), Tson = f8.t("sonando"), Tcuenta = f8.t("cuenta"), Fin = f8.fin;

// el feed del móvil: la lista de vídeos y cuándo sube cada uno (un scroll)
const LISTA = ["playa", "tuyo", "plato", "concierto", "tuyo", "gimnasio", "ciudad", "tuyo", "montana"];
const N = LISTA.length - 1;
export const scrolls = Array.from({ length: N }, (_, i) => mez(T0 + 0.35, Tcuenta - 0.35, i / (N - 1)));
const pos = (t) => scrolls.reduce((a, s) => a + k.claves([[s, 0], [s + 0.22, 1]])(t), 0);
// cuándo se va cada vez tu vídeo (cuando sube el siguiente a él)
export const pasaTuyo = LISTA.map((n, i) => (n === "tuyo" ? scrolls[i] : null)).filter((x) => x != null);

export function dibuja(g, t) {
  // fondo: una habitación de noche, con la luz del móvil
  g.fillStyle = "#0a0810"; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 640, 860, 1400, "120,140,220", 0.35); g.restore();
  // el móvil, en su mano, por delante (un poco girado)
  const PX = 650, PY = 990, PW = 520, PH = 1060;
  g.save(); g.translate(PX, PY); g.rotate(0.06);
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 60; g.shadowOffsetY = 30; redondo(g, -PW / 2, -PH / 2, PW, PH, 70); g.fillStyle = "#111"; g.fill(); g.restore();
  redondo(g, -PW / 2, -PH / 2, PW, PH, 70); k.metal(g, -PW / 2, PW / 2, ["#2c2e34", "#9ea3ac", "#4a4d55", "#c7cbd2", "#26282d"]);
  const SW = PW - 30, SH = PH - 30;
  g.save(); redondo(g, -SW / 2, -SH / 2, SW, SH, 56); g.clip();
  g.fillStyle = "#000"; g.fillRect(-SW / 2, -SH / 2, SW, SH);
  const p = pos(t);
  for (let i = 0; i < LISTA.length; i++) {
    const y = (i - p) * SH;
    if (y < -SH * 1.2 || y > SH * 1.2) continue;
    const tuyo = LISTA[i] === "tuyo";
    tarjeta(g, LISTA[i], 0, y, SH / 0.995 * 1.0, { borde: tuyo ? NARANJA : null });
  }
  g.restore();
  g.restore();
  // el pulgar, que sube en cada scroll
  const subeP = scrolls.reduce((a, s) => a + k.pulso(t, s + 0.1, 0.12), 0);
  g.save(); g.translate(PX + 140, PY + 420 - 160 * subeP);
  g.fillStyle = "#c98f70"; g.beginPath(); g.ellipse(0, 0, 58, 110, -0.35, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,230,210,0.5)"; g.beginPath(); g.ellipse(-12, -50, 30, 36, -0.35, 0, 6.2832); g.fill();
  g.restore();
  // quien mira, de espaldas: la luz naranja de dentro sube un escalón cada vez que pasa tu vídeo
  const dentro = pasaTuyo.reduce((a, s) => a + su(tr(t, s, s + 0.4)) / pasaTuyo.length, 0);
  espalda(g, 330, 1500, 330, "140,160,230", 0.55, dentro);
  if (dentro > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 330, 1420, 700, NARANJA, 0.25 * dentro); g.restore(); }
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(8,6,12,0.55)"); vg.addColorStop(1, "rgba(8,6,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { scrolls, pasaTuyo };
