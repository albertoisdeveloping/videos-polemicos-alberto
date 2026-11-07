// Lo que va por encima de todos los planos (el estándar: más dopamina y subtítulos que se mueven):
// camara(t): golpe de zoom en la clave de cada frase, temblor en cada impacto que suena, transición con zoom y
// desenfoque en cada corte. encima(g, t, plano): chispas en cada clave, cifras que saltan, grano y viñeta.
// subtitulo(t, bloque, plano): dónde va el subtítulo en cada escena, a qué tamaño y de qué color es su clave.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, NARANJA, CIAN, VIOLETA } from "./mundo.js";
let sonidos = [];
try { sonidos = (await import("../sonidos.js")).default; } catch { /* aún sin sonidos.js */ }

const { suave: su, tramo: tr, mez, azar } = k;

const COLOR = [AZUL, NARANJA, CIAN, AZUL, VIOLETA, NARANJA, CIAN, "255,214,60", AZUL, NARANJA];
const CLAVES = v.frases.map((f, i) => { const p = v.palabras.find((w) => w.frase === f.n && w.clave); return { t: p ? p.inicio : f.inicio, color: COLOR[i] || "255,214,60", n: i + 1 }; });
// los cortes entre planos (dos fotogramas antes de la palabra que trae el sitio nuevo)
export const CORTES = [v.frase(3).inicio, v.frase(6).inicio, v.frase(7).inicio].map((x) => x - 0.04);
const GOLPES = sonidos.filter((s) => ["empujon", "golpe", "golpe-hondo", "estallido", "muro"].includes(s.sonido)).map((s) => ({ t: s.t, fuerza: s.sonido === "golpe-hondo" || s.sonido === "empujon" || s.sonido === "muro" ? 1 : 0.6 }));

const golpe = (d, sube = 0.07, vuelve = 4.5) => (d < 0 ? 0 : d < sube ? su(d / sube) : Math.exp(-(d - sube) * vuelve));

export function camara(t) {
  let zoom = 1, x = 0, y = 0, giro = 0, desenfoque = 0;
  for (const c of CLAVES) zoom += 0.06 * golpe(t - c.t + 0.03);
  for (const gp of GOLPES) {
    const d = t - gp.t; if (d < 0 || d > 0.35) continue;
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

const CHISPAS = Array.from({ length: 34 }, (_, i) => { const az = azar(900 + i); return { a: az() * 6.2832, v: 500 + az() * 900, r: 4 + az() * 7, vida: 0.45 + az() * 0.4 }; });
const CENTRO = { "01-estadio": [540, 900], "01-movil": [540, 900], "03-ola": [540, 860], "06-largo": [540, 900], "07-prueba": [540, 950], "10-cielo": [540, 960] };
const f = (n) => v.frase(n);
// las cifras: solo las que el subtítulo no dice ya con su forma (300 visitas como contador; el día que pasa)
const CIFRAS = [
  { t: f(2).t("trescientas") - 0.05, hasta: f(2).t("seguidores") - 0.1, texto: (u) => `${Math.round(300 * u)}`, sub: "visitas", y: 1290, color: NARANJA, corre: 0.45 },
  { t: f(6).t("trescientas") - 0.05, hasta: f(6).t("y") - 0.1, texto: () => "300", sub: "visitas", y: 1290, color: NARANJA, corre: 0 },
  { t: f(8).t("día") - 0.05, hasta: f(8).t("publicas") - 0.05, texto: () => "24", sub: "horas", y: 1290, color: "255,214,60", corre: 0 },
];
const GRANO = [0, 1, 2, 3].map((s) => { const cv = k.lienzo(540, 960), g = cv.getContext("2d"), img = g.createImageData(540, 960), az = azar(70 + s); for (let i = 0; i < img.data.length; i += 4) { const n = 110 + az() * 40; img.data[i] = img.data[i + 1] = img.data[i + 2] = n; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); return cv; });

export function encima(g, t, plano) {
  const [cx, cy] = CENTRO[plano] || [540, 960];
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CLAVES) {
    const d = t - c.t; if (d < 0 || d > 0.9) continue;
    for (const p of CHISPAS) {
      if (d > p.vida) continue;
      const u = d / p.vida, dist = p.v * k.entra(Math.min(1, d / 0.5)) * 0.6;
      const x = cx + Math.cos(p.a) * dist, y = cy + Math.sin(p.a) * dist * 1.1, al = (1 - u) * (1 - u);
      g.fillStyle = `rgba(${c.color},${0.9 * al})`; g.beginPath(); g.arc(x, y, p.r * (1 - 0.5 * u), 0, 6.2832); g.fill();
      k.brillo(g, x, y, p.r * 8, c.color, 0.25 * al);
    }
  }
  g.restore();
  for (const C of CORTES) { const fl = k.pulso(t, C + 0.02, 0.05); if (fl > 0.01) { g.fillStyle = `rgba(255,255,255,${0.22 * fl})`; g.fillRect(0, 0, 1080, 1920); } }
  for (const c of CIFRAS) {
    if (t < c.t || t > c.hasta + 0.25) continue;
    const u = tr(t, c.t, c.t + 0.22), va = 1 - tr(t, c.hasta, c.hasta + 0.25), corre = c.corre ? su(tr(t, c.t, c.t + c.corre)) : 1;
    const esc = (0.3 + 0.7 * k.entra(u)) * (1 + 0.15 * golpe(t - c.t - 0.22, 0.05, 6));
    g.save(); g.translate(c.x || 540, c.y); g.scale(esc, esc); g.globalAlpha = Math.min(1, u * 2) * va;
    k.pastilla(g, 0, 0, c.texto(corre), c.sub, c.color, 1, 120);
    g.restore();
  }
  g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.07; g.drawImage(GRANO[Math.floor(t * 24) % 4], 0, 0, 1080, 1920); g.restore();
  const vg = g.createRadialGradient(540, 960, 700, 540, 960, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.38)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}

export function subtitulo(t, b, plano) {
  const color = COLOR[b.frase - 1] || "255,214,60", giro = (b.palabras[0].inicio * 7) % 2 < 1 ? -0.025 : 0.025;
  const r = (y, tam) => ({ y, tam, giro, color });
  t = b.palabras[0].inicio;
  const tiene = (w) => b.palabras.some((p) => p.texto.toLowerCase().replace(/[^a-záéíóúñ]/g, "") === w);
  switch (plano) {
    case "01-estadio": case "01-movil":
      if (b.frase === 1) return t < f(1).t("primero") - 0.1 ? r(1180, 104) : tiene("desconocidos") ? r(1290, 112) : t < f(1).t("alguien") - 0.1 ? r(1300, 96) : r(380, 96);
      return t < f(2).t("pocos") - 0.1 ? r(360, 92) : t < f(2).t("pero") - 0.1 ? r(1330, 96) : r(1180, 104);
    case "03-ola":
      if (b.frase === 3) return r(380, 92);
      if (b.frase === 4) return t < f(4).t("solo") - 0.1 ? r(380, 92) : r(1300, 100);
      return t < f(5).t("siguiente") - 0.1 ? r(380, 92) : r(380, 96);
    case "06-largo": return t < f(6).t("ahí") - 0.1 ? r(380, 96) : t < f(6).t("y") - 0.1 ? r(380, 92) : r(380, 96);
    case "07-prueba":
      if (b.frase === 7) return t < f(7).t("solo") - 0.1 ? r(380, 92) : r(1300, 96);
      if (b.frase === 8) return r(380, 92);
      return t < f(9).t("fila") - 0.1 ? r(380, 92) : t < f(9).t("tú") - 0.1 ? r(1300, 100) : r(380, 100);
    case "10-cielo": return tiene("nada") ? r(960, 130) : r(960, 104);
    default: return r(380, 86);
  }
}
