// «Así que el que no publica es la chica que nunca fue a clase.»
// «Envíaselo a ese amigo que tiene un negocio y no publica nada.»
// El aula otra vez (se entra con un corte en «Así»): la primera fila de cerca, con las tres chicas sentadas, cada una
// con su luz, y entre ellas un sitio vacío.
// - «el que no publica»: un foco cae sobre el sitio vacío.
// - «la chica que nunca fue»: en el pupitre vacío se posa la foto de la coral, gris.
// - «Envíaselo a ese amigo»: la cámara se aleja hasta ver el aula entera, llena, con el hueco iluminado en primera fila;
//   «nada»: el resto del aula se oscurece un poco y solo queda el hueco.
import * as k from "#kit";
import { v } from "#voz";
import { CHICAS, aula, camino2D, polaroid, rayitas, sentada, sinVista, sitio, vista } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez } = k;
const f10 = v.frase(10), f11 = v.frase(11);
const T0 = f10.inicio, Tpub = f10.t("publica"), Tchica = f10.t("chica"), Tnunca = f10.t("nunca");
const Tnada = f11.t("nada"), Fin = v.duracion;

// cuatro sitios seguidos en el centro de la primera fila: amarilla, (vacío), turquesa, violeta
let m = 0, d = 1e9; for (let j = 0; j < 30; j++) { let p; try { p = sitio(0, j); } catch { break; } if (!p) break; if (Math.abs(p.x + 60) < d) { d = Math.abs(p.x + 60); m = j; } }
const SITIOS = [m - 1, m, m + 1, m + 2], QUIEN = [1, 0, 2, 3];
const vacio = sitio(0, m);

const cam = camino2D([
  [T0, [2.2, vacio.x + 50, -500]],
  [Tnunca + 0.3, [2.4, vacio.x + 30, -500]],
  [f11.inicio + 0.1, [2.4, vacio.x + 30, -500]],
  [Tnada - 0.2, [0.55, 0, -40]],
  [Fin, [0.53, 0, -30]],
]);
export const foco = Tpub - 0.15, posaFoto = Tchica - 0.2;

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  sinVista(g); g.fillStyle = "#1c1412"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  const f = su(tr(t, foco, foco + 0.4)), osc = su(tr(t, Tnada - 0.3, Tnada + 0.4));
  aula(g, t, { luzDia: 0.6, libres: SITIOS, enSitio: (gg, j) => {
    const q = QUIEN[SITIOS.indexOf(j)], p = sitio(0, j);
    if (q === 0) return;
    sentada(gg, p.x, p.y, p.e, CHICAS[q].c, CHICAS[q].pelo, { halo: 0.5 });
  } });
  // las rayitas que quedaron en la pizarra
  for (const [i, x] of [[1, -85], [2, 85], [3, 255]]) { const n = CHICAS[i].veces, ancho = (Math.min(n, 10) / 5) * 48 * 1.25 - 12; rayitas(g, x - ancho / 2, -1150, Math.min(n, 10), 48); if (n > 10) rayitas(g, x - ancho / 2, -1090, n - 10, 48); }
  // el resto del aula se oscurece al final
  if (osc > 0) { g.fillStyle = `rgba(6,4,4,${0.55 * osc})`; g.fillRect(-2000, -2400, 4000, 5000); }
  // el foco sobre el sitio vacío
  if (f > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    const gr = g.createLinearGradient(vacio.x, -1500, vacio.x, vacio.y + 40);
    gr.addColorStop(0, "rgba(255,240,210,0)"); gr.addColorStop(1, `rgba(255,240,210,${0.35 * f})`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(vacio.x - 30, -1500); g.lineTo(vacio.x + 30, -1500); g.lineTo(vacio.x + 110, vacio.y + 60); g.lineTo(vacio.x - 110, vacio.y + 60); g.closePath(); g.fill();
    g.fillStyle = `rgba(255,236,200,${0.4 * f})`; g.beginPath(); g.ellipse(vacio.x, vacio.y + 30, 120, 34, 0, 0, 6.2832); g.fill();
    g.restore();
  }
  // la foto de la coral, gris, en el pupitre vacío
  const pf = k.entra(tr(t, posaFoto, posaFoto + 0.35));
  if (pf > 0) {
    g.save(); g.filter = "grayscale(1)";
    polaroid(g, 0, vacio.x + 6, mez(vacio.y - 260, vacio.y - 52, pf), mez(110, 70, pf), mez(-0.4, -0.08, pf), { al: Math.min(1, pf * 2), alto: 1 - pf });
    g.restore();
  }
  sinVista(g);
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(12,8,6,0.55)"); vg.addColorStop(1, "rgba(12,8,6,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { foco, posaFoto, aleja: f11.inicio + 0.1, oscurece: Tnada - 0.3 };
