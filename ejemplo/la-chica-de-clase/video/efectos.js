// Lo que va por encima de todos los planos (el estándar: más dopamina y subtítulos que se mueven):
// - camara(t): un golpe de zoom en la palabra clave de cada frase, temblor en cada impacto que suena, y las transiciones
//   entre planos (la imagen se lanza hacia delante con desenfoque y la nueva llega frenando).
// - encima(g, t): la ráfaga de chispas de cada palabra clave, las cifras que saltan, el grano y la viñeta.
// - subtitulo(t, bloque, plano): dónde va el subtítulo en cada escena, a qué tamaño y de qué color es su clave.
import * as k from "#kit";
import { v } from "#voz";
import sonidos from "../sonidos.js";

const { suave: su, tramo: tr, mez, azar } = k;

// ---------------------------------------------------------------- los momentos
const COLOR = ["255,138,40", "255,96,96", "170,110,255", "40,210,200", "235,235,245", "170,110,255", "255,214,60", "255,138,40", "255,138,40", "255,96,96", "255,138,40"];
const CLAVES = v.frases.map((f, i) => {
  const p = v.palabras.find((w) => w.frase === f.n && w.clave);
  return { t: p ? p.inicio : f.inicio, color: COLOR[i] || "255,214,60", n: i + 1 };
});
// los cortes entre planos (cuando entra cada sitio nuevo: dos fotogramas antes de su palabra)
const CORTES = [v.t("lo"), v.frase(5).inicio, v.frase(7).inicio, v.frase(8).inicio, v.frase(9).inicio, v.frase(10).inicio].map((x) => x - 0.04);
// los impactos: los sonidos que golpean
const GOLPES = sonidos.filter((s) => ["empujon", "golpe", "golpe-hondo", "estallido"].includes(s.sonido)).map((s) => ({ t: s.t, fuerza: s.sonido === "golpe-hondo" || s.sonido === "empujon" ? 1 : 0.6 }));

// un golpe: sube rápido y vuelve despacio
const golpe = (d, sube = 0.07, vuelve = 4.5) => (d < 0 ? 0 : d < sube ? su(d / sube) : Math.exp(-(d - sube) * vuelve));

export function camara(t) {
  let zoom = 1, x = 0, y = 0, giro = 0, desenfoque = 0;
  for (const c of CLAVES) zoom += 0.06 * golpe(t - c.t + 0.03);
  for (const gp of GOLPES) {
    const d = t - gp.t;
    if (d < 0 || d > 0.35) continue;
    const a = 16 * gp.fuerza * Math.exp(-d * 11);
    x += a * Math.sin(d * 95 + gp.t * 7); y += a * Math.cos(d * 83 + gp.t * 3); giro += 0.004 * gp.fuerza * Math.sin(d * 70) * Math.exp(-d * 11);
  }
  for (const C of CORTES) {
    const antes = tr(t, C - 0.12, C), despues = 1 - tr(t, C, C + 0.2);
    if (t < C && antes > 0) { const u = k.sale(antes); zoom *= 1 + 0.3 * u; desenfoque = Math.max(desenfoque, 14 * u); giro += 0.02 * u; }
    if (t >= C && despues > 0) { const u = k.sale(despues); zoom *= 1 + 0.22 * u; desenfoque = Math.max(desenfoque, 12 * u); giro -= 0.015 * u; }
  }
  return { zoom, x, y, giro, desenfoque };
}

// ---------------------------------------------------------------- lo de encima
// las chispas de cada clave: salen del centro de la acción y se apagan
const CHISPAS = Array.from({ length: 34 }, (_, i) => { const az = azar(900 + i); return { a: az() * 6.2832, v: 500 + az() * 900, r: 4 + az() * 7, vida: 0.45 + az() * 0.4 }; });
const CENTRO = { "01-feed": [540, 960], "02-aula": [540, 900], "03-fotos": [540, 1050], "04-anuncio": [760, 640], "05-movil": [330, 1300], "06-calle": [540, 1000], "07-final": [540, 1000] };
// las cifras que saltan (datos de idea.md)
const CIFRAS = [
  { t: v.frase(4).t("cien") - 0.05, hasta: v.frase(4).t("tomaban") - 0.1, texto: (u) => `${Math.round(130 * u)}`, sub: "alumnos", y: 760, color: "255,255,255", corre: 0.5 },
  { t: v.frase(7).t("veces") - 0.05, hasta: v.frase(7).t("gusta") - 0.1, texto: () => "hasta 20", sub: "veces", y: 1310, color: "255,214,60", corre: 0 },
];
// grano: cuatro texturas que se turnan
const GRANO = [0, 1, 2, 3].map((s) => { const cv = k.lienzo(540, 960), g = cv.getContext("2d"), img = g.createImageData(540, 960), az = azar(70 + s); for (let i = 0; i < img.data.length; i += 4) { const n = 110 + az() * 40; img.data[i] = img.data[i + 1] = img.data[i + 2] = n; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); return cv; });

export function encima(g, t, plano) {
  // chispas en cada palabra clave
  const [cx, cy] = CENTRO[plano] || [540, 960];
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CLAVES) {
    const d = t - c.t;
    if (d < 0 || d > 0.9) continue;
    for (const p of CHISPAS) {
      if (d > p.vida) continue;
      const u = d / p.vida, dist = p.v * k.entra(Math.min(1, d / 0.5)) * 0.6;
      const x = cx + Math.cos(p.a) * dist, y = cy + Math.sin(p.a) * dist * 1.1;
      const al = (1 - u) * (1 - u);
      g.fillStyle = `rgba(${c.color},${0.9 * al})`; g.beginPath(); g.arc(x, y, p.r * (1 - 0.5 * u), 0, 6.2832); g.fill();
      k.brillo(g, x, y, p.r * 8, c.color, 0.25 * al);
    }
  }
  g.restore();
  // un destello suave en cada corte
  for (const C of CORTES) { const f = k.pulso(t, C + 0.02, 0.05); if (f > 0.01) { g.fillStyle = `rgba(255,255,255,${0.22 * f})`; g.fillRect(0, 0, 1080, 1920); } }
  // las cifras: llegan con un golpe, corren si son una cuenta, y se van
  for (const c of CIFRAS) {
    if (t < c.t || t > c.hasta + 0.25) continue;
    const u = tr(t, c.t, c.t + 0.22), va = 1 - tr(t, c.hasta, c.hasta + 0.25), corre = c.corre ? su(tr(t, c.t, c.t + c.corre)) : 1;
    const esc = (0.3 + 0.7 * k.entra(u)) * (1 + 0.15 * golpe(t - c.t - 0.22, 0.05, 6));
    g.save(); g.translate(540, c.y); g.scale(esc, esc); g.globalAlpha = Math.min(1, u * 2) * va;
    k.pastilla(g, 0, 0, c.texto(corre), c.sub, c.color, 1, 120);
    g.restore();
  }
  // el grano y la viñeta: le dan textura a todo
  g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.07; g.drawImage(GRANO[Math.floor(t * 24) % 4], 0, 0, 1080, 1920); g.restore();
  const vg = g.createRadialGradient(540, 960, 700, 540, 960, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.38)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}

// ---------------------------------------------------------------- dónde va el subtítulo
// Según la escena: donde no tape lo que importa, más grande cuando la imagen deja sitio. Alterna un poco el giro.
const f = (n) => v.frase(n);
export function subtitulo(t, b, plano) {
  const color = COLOR[b.frase - 1] || "255,214,60", giro = (b.palabras[0].inicio * 7) % 2 < 1 ? -0.025 : 0.025;
  const r = (y, tam) => ({ y, tam, giro, color });
  t = b.palabras[0].inicio; // el sitio se decide por bloque: no salta a mitad de una frase
  const tiene = (w) => b.palabras.some((p) => p.texto.toLowerCase().replace(/[^a-záéíóúñ]/g, "") === w);
  switch (plano) {
    case "01-feed": return t < f(1).t("hace") - 0.1 ? r(960, 104) : r(360, 92);
    case "02-aula":
      if (b.frase === 2) return t < f(2).t("chicas") ? r(1300, 96) : r(380, 88);
      if (b.frase === 3) return r(330, 78);
      return t < f(4).t("tomaban") - 0.1 ? r(1330, 88) : r(380, 88);
    case "03-fotos": return b.frase === 5 ? r(560, 96) : r(380, 88);
    case "04-anuncio": return tiene("acuerdes") ? r(960, 104) : r(370, 80);
    case "05-movil": return r(360, 86);
    case "06-calle": return r(470, 100);
    case "07-final":
      if (tiene("nada")) return r(960, 130);
      return b.frase === 10 ? r(640, 100) : r(1320, 92);
    default: return r(380, 86);
  }
}
