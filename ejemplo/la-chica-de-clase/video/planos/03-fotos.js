// «A final de curso les enseñaron sus fotos, y ninguna les sonaba más que las otras.»
// «Pero cuantas más veces había ido una, más guapa, más lista y más maja les parecía.» (el mismo sitio: no se corta)
// La mesa, vista desde arriba, con la luz de un flexo.
// - «enseñaron sus fotos»: caen las cuatro polaroids, una a una, en fila.
// - «ninguna les sonaba más que las otras»: debajo de cada una sube una barrita gris, y las cuatro se quedan iguales.
// - «Pero»: las barritas toman el color de cada una; «cuantas más veces», «más guapa», «más lista», «más maja»: en
//   cada «más», crecen y empujan su foto hacia arriba: la coral casi no se mueve, la violeta sube la que más.
// Se corta en «Y» (los anuncios).
import * as k from "#kit";
import { v } from "#voz";
import { CHICAS, GUSTO, polaroid } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const Tens = f5.t("enseñaron"), Tfotos = f5.t("fotos"), Tning = f5.t("ninguna"), Tsonaba = f5.t("sonaba"), Totras = f5.t("otras");
const Tpero = f6.t("pero"), Tguapa = f6.t("guapa"), Tlista = f6.t("lista"), Tmaja = f6.t("maja"), Fin = f6.fin;
const Tmas0 = f6.t("mas");
const MAS = [Tmas0 - 0.1, Tguapa - 0.2, Tlista - 0.35, Tmaja - 0.2];

const X = [168, 416, 664, 912], W = 232, BASE = 1290;
export const caidas = [0, 1, 2, 3].map((i) => f5.inicio - 0.12 + i * 0.36);
const ANG = [-0.06, 0.04, -0.03, 0.05];
// cuánto sube cada foto al final (de lo que gustó: atractivo 3,62 · 3,88 · 4,25 · 4,38 sobre 7)
const SUBE = GUSTO.map((x) => ((x - 3.5) / (GUSTO[3] - 3.5)) * 560);

// la madera de la mesa, dibujada una vez
const MESA = (() => {
  const cv = k.lienzo(1080, 1920), g = cv.getContext("2d"), az = azar(31);
  const bg = g.createLinearGradient(0, 0, 1080, 1920); bg.addColorStop(0, "#6b4024"); bg.addColorStop(1, "#3a2010"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(${az() < 0.5 ? "40,20,8" : "150,95,55"},${0.08 + az() * 0.18})`; g.lineWidth = 1 + az() * 3; const x0 = az() * 1300 - 100; g.beginPath(); g.moveTo(x0, -20); g.bezierCurveTo(x0 + (az() - 0.5) * 80, 640, x0 + (az() - 0.5) * 80, 1280, x0 + (az() - 0.5) * 60, 1940); g.stroke(); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, 0, 0, 1080, 1920);
  return cv;
})();

export function dibuja(g, t) {
  // la mesa y la luz del flexo (se aleja un poco cuando suben las fotos)
  const ale = su(tr(t, Tpero, Tmaja + 0.3)), Z = mez(1, 0.92, ale);
  g.save(); g.translate(540, 1100); g.scale(Z, Z); g.translate(-540, -1100);
  g.drawImage(MESA, -60, -60, 1200, 2040);
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 560, 1050, 1700, "255,200,140", 0.45); g.restore();
  // las barritas y las fotos
  for (let i = 0; i < 4; i++) {
    const tc = caidas[i];
    if (t < tc) continue;
    const u = tr(t, tc, tc + 0.32), cae = k.entra(u);
    // lo que gusta: tres escalones, uno en cada «más»
    let s = 0; MAS.forEach((m) => { s += su(tr(t, m, m + 0.4)) / MAS.length; });
    const sube = SUBE[i] * s;
    // la barrita: gris e igual para las cuatro en «sonaba»; luego de su color y crece con su foto
    const gris = su(tr(t, Tning - 0.1, Tsonaba + 0.2)), color = su(tr(t, Tpero - 0.1, Tpero + 0.3));
    const hb = 90 * gris + sube, col = k.mezRgb("150,150,158", CHICAS[i].c, color);
    if (hb > 1) {
      const by = BASE + 150, gr = g.createLinearGradient(0, by - hb, 0, by);
      gr.addColorStop(0, `rgba(${col},0.95)`); gr.addColorStop(1, `rgba(${col},0.35)`);
      g.fillStyle = gr; k.redondo(g, X[i] - 46, by - hb, 92, hb, 16); g.fill();
      if (color > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, X[i], by - hb, 260, CHICAS[i].c, 0.5 * color * (0.6 + 0.4 * s)); g.restore(); }
    }
    // la foto: cae desde arriba girando y se posa; luego sube con su barrita
    const y = mez(-300, BASE, cae) - sube - 90 * gris, ang = mez(ANG[i] * 6, ANG[i], cae);
    const ww = W * mez(1.5, 1, cae);
    const pulso = MAS.reduce((a, m) => a + k.pulso(t, m + 0.3, 0.12), 0) * (s > 0 ? 1 : 0);
    if (pulso > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, X[i], y, W * 1.6, CHICAS[i].c, 0.35 * pulso * (SUBE[i] / SUBE[3])); g.restore(); }
    polaroid(g, i, X[i], y, ww, ang, { alto: 1 - cae });
  }
  // el polvo que levanta cada foto al posarse
  for (let i = 0; i < 4; i++) {
    const d = t - (caidas[i] + 0.32); if (d < 0 || d > 0.5) continue;
    for (let q = 0; q < 10; q++) { const a = (q / 10) * 6.2832, dd = 140 + 120 * k.entra(d / 0.5); g.fillStyle = `rgba(255,230,190,${0.35 * (1 - d / 0.5)})`; g.beginPath(); g.arc(X[i] + Math.cos(a) * dd, BASE + Math.sin(a) * dd * 0.35, 5, 0, 6.2832); g.fill(); }
  }
  // «ninguna les sonaba más que las otras»: una luz recorre las cuatro y ninguna se enciende más
  const barre = tr(t, Tsonaba - 0.1, Totras + 0.35);
  if (barre > 0 && barre < 1) {
    const bx = mez(-150, 1230, su(barre)), al = Math.sin(Math.PI * barre);
    g.save(); g.globalCompositeOperation = "lighter";
    const bg = g.createLinearGradient(bx - 160, 0, bx + 160, 0); bg.addColorStop(0, "rgba(255,240,210,0)"); bg.addColorStop(0.5, `rgba(255,240,210,${0.28 * al})`); bg.addColorStop(1, "rgba(255,240,210,0)");
    g.fillStyle = bg; g.fillRect(bx - 160, 900, 320, 700);
    g.restore();
  }
  g.restore();
  // «fotos»: el flash de una cámara de fotos
  const flash = k.pulso(t, Tfotos + 0.05, 0.06);
  if (flash > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 1100, 2200, "255,255,255", 0.85 * flash); g.restore(); }
  // un velo arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(20,10,4,0.55)"); vg.addColorStop(1, "rgba(20,10,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}

export const momentos = { flash: Tfotos + 0.05, barre: Tsonaba - 0.1, caidas, iguales: Tning - 0.1, color: Tpero - 0.1, mas: MAS };
