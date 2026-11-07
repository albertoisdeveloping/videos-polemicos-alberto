// «Lo descubrieron con cuatro chicas que iban a clase sin hablar con nadie.»
// «Una no fue nunca, otra fue cinco veces, otra diez y la última quince.»
// El aula de la universidad, desde atrás y arriba, con una sola cámara que baja hacia la pizarra.
// - «Lo descubrieron»: el aula llena de alumnos de espaldas, con la luz de los ventanales.
// - «cuatro chicas»: se abre la puerta de la tarima y entran una detrás de otra (coral, amarilla, turquesa, violeta)
//   hasta ponerse en fila delante de la pizarra. «sin hablar con nadie»: los alumnos ni se mueven.
// - «nunca»: la coral se apaga, gris, y debajo «0»; «cinco»: en la pizarra, encima de la amarilla, cinco rayitas de
//   tiza, una a una, y su «5»; «diez»: diez encima de la turquesa; «quince»: quince encima de la violeta, que brilla.
// «Llegaban, se sentaban delante de más de cien alumnos, tomaban apuntes y se iban.» (el mismo sitio: no se corta)
// - «Llegaban»: la coral se borra (nunca fue); las otras tres bajan de la tarima a la primera fila.
// - «sentaban»: se sientan, de espaldas, cada una con su color entre las cabezas.
// - «delante de más de cien alumnos»: la cámara se aleja hasta ver el aula entera, llena.
// - «tomaban apuntes»: la cámara se acerca a ellas: escriben en sus libretas.
// - «se iban»: se levantan y se van por la puerta; quedan sus tres sitios vacíos.
// Se corta en «A» (la mesa de las fotos).
import * as k from "#kit";
import { v } from "#voz";
import { CHICAS, TARIMA, aula, camino2D, chica, rayitas, sentada, sinVista, sitio, vista } from "../mundo.js";

export const desde = "lo";

const { suave: su, tramo: tr, mez } = k;
const f2 = v.frase(2), f3 = v.frase(3);
const T0 = f2.inicio, Tchicas = f2.t("cuatro"), Tnadie = f2.t("nadie");
const Tnunca = f3.t("nunca"), Tcinco = f3.t("cinco"), Tdiez = f3.t("diez"), Tquince = f3.t("quince"), Fin3 = f3.fin;
const f4 = v.frase(4), Tlleg = f4.t("llegaban"), Tsent = f4.t("sentaban"), Tdel = f4.t("delante"), Tcien = f4.t("cien"), Talum = f4.t("alumnos"), Ttom = f4.t("tomaban"), Tapun = f4.t("apuntes"), Tiban = f4.t("iban"), Fin = f4.fin;

const X = [-255, -85, 85, 255], H = 330;
// los sitios de la primera fila donde se sientan (los más cercanos a donde estaban, sin repetir)
const SITIOS = [];
for (const i of [1, 2, 3]) { let mejor = -1, d = 1e9; for (let j = 0; j < 30; j++) { let p; try { p = sitio(0, j); } catch { break; } if (!p || SITIOS.includes(j)) continue; const dd = Math.abs(p.x - X[i] * 1.6); if (dd < d) { d = dd; mejor = j; } } SITIOS.push(mejor); }
const CENTRO = SITIOS.reduce((a, j) => a + sitio(0, j).x, 0) / 3;
const cam = camino2D([
  [T0, [0.52, 60, -260]],
  [Tchicas + 0.2, [0.6, 120, -480]],
  [Tnadie + 0.6, [1.3, 0, -830]],
  [Tnunca + 0.1, [1.55, X[0] * 0.55, -840]],
  [Tcinco + 0.15, [1.62, X[1] * 0.55, -840]],
  [Tdiez + 0.15, [1.62, X[2] * 0.55, -840]],
  [Tquince + 0.2, [1.62, X[3] * 0.55, -840]],
  [Fin3, [1.45, 0, -820]],
  [Tlleg + 0.2, [1.45, 0, -820]],
  [Tsent + 0.15, [1.25, 0, -700]],
  [Talum + 0.25, [0.53, 0, 0]],
  [Ttom - 0.1, [0.53, 0, 0]],
  [Tapun + 0.15, [1.7, CENTRO, -560]],
  [Fin, [1.72, CENTRO, -560]],
]);


// dónde se para cada una y cuándo entra
const ENTRA = CHICAS.map((c, i) => ({ ...c, x: X[i], sale: Tchicas - 0.1 + i * 0.22, llega: Tnadie + 0.15 + i * 0.12 }));
// cuándo se dibujan sus rayitas: de una palabra un poco antes a un poco después
const RAYAS = [null, [Tcinco - 0.35, Tcinco + 0.35], [Tdiez - 0.4, Tdiez + 0.4], [Tquince - 0.6, Tquince + 0.35]];
export const rayasTiempos = RAYAS.map((r, i) => r && Array.from({ length: CHICAS[i].veces }, (_, j) => r[0] + ((j + 1) / CHICAS[i].veces) * (r[1] - r[0])));

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  sinVista(g); g.fillStyle = "#1c1412"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  const puerta = su(tr(t, Tchicas - 0.45, Tchicas - 0.1)) * (1 - su(tr(t, Tnadie + 0.3, Tnadie + 0.8)));
  const puerta2 = su(tr(t, Tiban - 0.3, Tiban)) ;
  const sentadas = (t >= Tsent - 0.15 && t < Tiban + 0.15);
  aula(g, t, { puerta: Math.max(puerta, puerta2), luzDia: mez(0.7, 0.35, su(tr(t, Tiban - 0.2, Fin))), libres: t >= Tsent - 0.15 ? SITIOS : null,
    enSitio: (gg, j) => {
      const i = SITIOS.indexOf(j) + 1, p = sitio(0, j);
      if (!sentadas) return;
      const al = Math.min(su(tr(t, Tsent - 0.15, Tsent + 0.1)), 1 - su(tr(t, Tiban - 0.1, Tiban + 0.15)));
      const escribe = t > Tapun - 0.3 && t < Tiban - 0.1 ? t : 0;
      sentada(gg, p.x, p.y + (escribe ? Math.sin(t * 9 + i) * 2 : 0), p.e, CHICAS[i].c, CHICAS[i].pelo, { al, halo: 0.5 });
      // su libreta en el pupitre, con las líneas que va escribiendo
      const lu = tr(t, Tapun - 0.3, Tiban - 0.2);
      if (lu > 0) { const lx = p.x + 30 * p.e, ly = p.y - 62 * p.e; gg.save(); gg.globalAlpha = al; gg.fillStyle = "#f4f1e8"; gg.fillRect(lx - 50 * p.e, ly - 22 * p.e, 100 * p.e, 44 * p.e); gg.fillStyle = `rgb(${CHICAS[i].c})`; for (let r = 0; r < 4; r++) gg.fillRect(lx - 42 * p.e, ly - 14 * p.e + r * 9 * p.e, 84 * p.e * Math.min(1, Math.max(0, lu * 4 - r)), 3 * p.e); gg.restore(); }
    } });
  // las rayitas de tiza encima de cada una
  for (let i = 1; i < 4; i++) {
    const [a, b] = RAYAS[i], n = CHICAS[i].veces * tr(t, a, b);
    if (n > 0) { const fila1 = Math.min(n, 10), fila2 = Math.max(0, n - 10), ancho = (Math.min(CHICAS[i].veces, 10) / 5) * 48 * 1.25 - 12;
      rayitas(g, X[i] - ancho / 2, -1150, fila1, 48); if (fila2 > 0) rayitas(g, X[i] - ancho / 2, -1090, fila2, 48); }
  }
  // polvo de tiza en cada rayita que se dibuja
  for (let i = 1; i < 4; i++) {
    const lista = rayasTiempos[i]; if (!lista) continue;
    const ancho = (Math.min(CHICAS[i].veces, 10) / 5) * 48 * 1.25 - 12;
    lista.forEach((tt, j) => {
      const d = t - tt; if (d < 0 || d > 0.6) return;
      const fila = j >= 10 ? 1 : 0, jj = j % 10, gx = X[i] - ancho / 2 + Math.floor(jj / 5) * 60 + (jj % 5) * 10, gy = -1150 + fila * 60 + 48;
      for (let q = 0; q < 6; q++) { const a = -Math.PI / 2 + (q - 2.5) * 0.45, dd = 18 + 40 * k.entra(d / 0.6); g.fillStyle = `rgba(245,245,235,${0.6 * (1 - d / 0.6)})`; g.beginPath(); g.arc(gx + Math.cos(a) * dd, gy + Math.sin(a) * dd * 0.6 + 30 * d, 3, 0, 6.2832); g.fill(); }
    });
  }
  // las chicas: salen de la puerta y caminan hasta su sitio
  for (let i = 0; i < 4; i++) {
    const c = ENTRA[i];
    if (t < c.sale) continue;
    let u = su(tr(t, c.sale, c.llega)), x = mez(930, c.x, u), y = TARIMA, anda = u > 0 && u < 1;
    if (i === 0 && t > Tlleg - 0.1) { const se = su(tr(t, Tlleg - 0.1, Tlleg + 0.5)); if (se >= 1) continue; chica(g, x, y, H, c.c, c.pelo, { al: 0.55 * (1 - se), gris: 1 }); continue; }
    if (i > 0 && t > Tlleg - 0.05) {
      // bajan a su sitio de la primera fila (y luego se van)
      const p = sitio(0, SITIOS[i - 1]), b = su(tr(t, Tlleg - 0.05, Tsent + 0.05));
      if (t < Tiban - 0.1) {
        if (b >= 1) continue;
        x = mez(c.x, p.x, b); y = mez(TARIMA, p.y + 40, b);
        chica(g, x, y, mez(H, H * 1.05, b), c.c, c.pelo, { paso: b * 9, al: 1 - su(tr(t, Tsent - 0.15, Tsent + 0.1)), halo: i === 3 ? 0.5 : 0 });
        continue;
      }
      const fu = su(tr(t, Tiban - 0.1, Fin + 0.1)), xx = mez(p.x, 1150, fu);
      chica(g, xx, mez(p.y + 40, TARIMA, Math.min(1, fu * 2)), H, c.c, c.pelo, { paso: fu * 12, al: su(tr(t, Tiban - 0.1, Tiban + 0.15)) });
      continue;
    }
    const gris = i === 0 ? su(tr(t, Tnunca - 0.25, Tnunca + 0.35)) : 0;
    const Tcuenta = [0, Tcinco, Tdiez, Tquince][i];
    const halo = i === 0 ? 0 : (i === 3 ? 0.55 * su(tr(t, Tquince - 0.3, Tquince + 0.3)) : 0) + 0.6 * k.pulso(t, Tcuenta + 0.2, 0.35) * (1 - su(tr(t, Tlleg - 0.2, Tlleg)));
    chica(g, x, y, H, c.c, c.pelo, { paso: anda ? (930 - x) / 55 : 0, al: Math.min(1, tr(t, c.sale, c.sale + 0.15)) * (1 - 0.45 * gris), gris, halo });
  }
  // debajo de cada una, sus clases
  sinVista(g);
  const etq = [[Tnunca - 0.05, "0"], [Tcinco + 0.35, "5"], [Tdiez + 0.4, "10"], [Tquince + 0.35, "15"]];
  for (let i = 0; i < 4; i++) {
    const [Ta, txt] = etq[i], al = k.entra(tr(t, Ta - 0.1, Ta + 0.2)) * (1 - su(tr(t, Tlleg - 0.1, Tlleg + 0.25)));
    if (al <= 0) continue;
    const sx = 540 + (X[i] - cx) * Z, sy = 960 + (TARIMA + 70 - cy) * Z;
    const col = i === 0 ? "170,170,178" : CHICAS[i].c;
    k.pastilla(g, sx, sy + 30 * (1 - al), txt, "", col, al, 70);
  }
  // un velo arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(12,8,6,0.55)"); vg.addColorStop(1, "rgba(12,8,6,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { sientan: Tsent, aleja: Tdel, acerca: Ttom, levantan: Tiban - 0.1, puerta: Tchicas - 0.45, pasos: ENTRA.map((c) => [c.sale, c.llega]), rayas: rayasTiempos, nunca: Tnunca - 0.05 };
