// Lo que comparten los planos: los vídeos del feed (cada uno con su escena), tu vídeo (la tienda del toldo naranja),
// la tienda misma, la silueta de quien mira el móvil y las cuatro chicas.
import * as k from "#kit";

const { azar, lienzo, redondo, mez, mezRgb } = k;

// ---------------------------------------------------------------- colores que no cambian en todo el vídeo
export const NARANJA = "255,138,40";      // tu vídeo, tu tienda, lo que le vas sonando
export const CHICAS = [                   // nunca · 5 · 10 · 15 clases
  { nombre: "coral", c: "255,96,96", pelo: "#3a1a14", veces: 0 },
  { nombre: "amarilla", c: "255,200,60", pelo: "#2a1a10", veces: 5 },
  { nombre: "turquesa", c: "40,210,200", pelo: "#140c08", veces: 10 },
  { nombre: "violeta", c: "170,110,255", pelo: "#24140c", veces: 15 },
];
// lo que gustó cada una (atractivo de 1 a 7, Moreland y Beach 1992): para la altura de las fotos
export const GUSTO = [3.62, 3.88, 4.25, 4.38];

// ---------------------------------------------------------------- la tienda (tu negocio)
// Una fachada de tienda de barrio de frente, en un rectángulo de ancho w con la base en (x, y): el toldo de rayas
// naranjas y blancas, el escaparate con luz cálida, la puerta y la lámpara. luz: 0 apagada, 1 encendida.
export function tienda(g, x, y, w, luz = 1, t = 0, toldo = NARANJA) {
  const h = w * 1.05, X = x - w / 2, Y = y - h;
  g.save();
  // la pared: ladrillo claro
  const pg = g.createLinearGradient(X, Y, X + w, y);
  pg.addColorStop(0, `rgb(${mezRgb("70,52,50", "196,150,120", luz)})`); pg.addColorStop(1, `rgb(${mezRgb("40,30,30", "140,96,78", luz)})`);
  g.fillStyle = pg; g.fillRect(X, Y, w, h);
  g.globalAlpha = 0.18; g.strokeStyle = "#000"; g.lineWidth = Math.max(1, w * 0.004);
  for (let fy = 0; fy < 14; fy++) { const yy = Y + (fy / 14) * h; g.beginPath(); g.moveTo(X, yy); g.lineTo(X + w, yy); g.stroke(); for (let fx = 0; fx < 8; fx++) { const xx = X + ((fx + (fy % 2) * 0.5) / 8) * w; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + h / 14); g.stroke(); } }
  g.globalAlpha = 1;
  // el escaparate y la puerta, con la luz de dentro
  const ew = w * 0.56, eh = h * 0.46, ex = X + w * 0.08, ey = y - eh - h * 0.06;
  const dw = w * 0.24, dh = h * 0.58, dx = X + w * 0.7, dy = y - dh;
  for (const [rx, ry, rw, rh] of [[ex, ey, ew, eh], [dx, dy, dw, dh]]) {
    const lg = g.createLinearGradient(rx, ry, rx, ry + rh);
    lg.addColorStop(0, `rgb(${mezRgb("20,22,30", "255,214,150", luz)})`); lg.addColorStop(1, `rgb(${mezRgb("10,10,16", "255,160,70", luz)})`);
    g.fillStyle = lg; g.fillRect(rx, ry, rw, rh);
    g.strokeStyle = `rgb(${mezRgb("30,30,34", "70,44,30", luz)})`; g.lineWidth = w * 0.018; g.strokeRect(rx, ry, rw, rh);
  }
  // dentro del escaparate: estantes con cosas de colores
  if (luz > 0.02) {
    g.save(); g.globalAlpha = luz; const az = azar(5);
    for (let e = 0; e < 2; e++) {
      const sy = ey + eh * (0.45 + e * 0.32);
      g.fillStyle = "rgba(90,50,30,0.8)"; g.fillRect(ex + ew * 0.06, sy, ew * 0.88, eh * 0.03);
      for (let i = 0; i < 6; i++) { const bw = ew * 0.09, bh = eh * (0.12 + az() * 0.1), bx = ex + ew * (0.1 + i * 0.14); g.fillStyle = ["#e8553a", "#f2c14e", "#4fb3a9", "#f6f1e7", "#c4572e", "#7a9e3d"][i]; g.fillRect(bx, sy - bh, bw, bh); }
    }
    g.restore();
  }
  // el reflejo del cristal
  g.save(); g.globalAlpha = 0.25; g.fillStyle = "#fff"; g.beginPath(); g.moveTo(ex + ew * 0.1, ey); g.lineTo(ex + ew * 0.26, ey); g.lineTo(ex + ew * 0.1, ey + eh * 0.6); g.lineTo(ex, ey + eh * 0.6); g.closePath(); g.fill(); g.restore();
  // el toldo de rayas, con su sombra y el volante de abajo
  const ty = Y + h * 0.18, th = h * 0.16, sal = w * 0.06;
  g.save(); g.beginPath(); g.moveTo(X - sal, ty + th); g.lineTo(X + w + sal, ty + th); g.lineTo(X + w, ty); g.lineTo(X, ty); g.closePath(); g.clip();
  const n = 9;
  for (let i = 0; i < n + 2; i++) { g.fillStyle = i % 2 ? `rgb(${mezRgb("70,60,60", "250,244,232", luz)})` : `rgb(${mezRgb("80,50,30", toldo, luz)})`; g.fillRect(X - sal + (i * (w + 2 * sal)) / n, ty, (w + 2 * sal) / n + 1, th); }
  const sg = g.createLinearGradient(0, ty, 0, ty + th); sg.addColorStop(0, "rgba(0,0,0,0.35)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(X - sal, ty, w + 2 * sal, th);
  g.restore();
  for (let i = 0; i < n; i++) { const vx = X - sal + (i * (w + 2 * sal)) / n, vw = (w + 2 * sal) / n; g.fillStyle = i % 2 ? `rgb(${mezRgb("60,50,50", "240,232,220", luz)})` : `rgb(${mezRgb("70,44,26", mezRgb(toldo, "120,40,0", 0.2), luz)})`; g.beginPath(); g.moveTo(vx, ty + th); g.lineTo(vx + vw, ty + th); g.quadraticCurveTo(vx + vw / 2, ty + th + w * 0.07, vx, ty + th); g.fill(); }
  // el rótulo (sin letras: una placa con luz)
  redondo(g, X + w * 0.22, Y + h * 0.03, w * 0.56, h * 0.11, w * 0.02); g.fillStyle = `rgb(${mezRgb("40,34,34", "60,36,24", luz)})`; g.fill();
  g.fillStyle = `rgba(255,220,170,${0.85 * luz})`; redondo(g, X + w * 0.3, Y + h * 0.065, w * 0.4, h * 0.04, h * 0.02); g.fill();
  // la luz que sale a la calle
  if (luz > 0.02) { g.globalCompositeOperation = "lighter"; k.brillo(g, ex + ew / 2, ey + eh * 0.6, w * 0.9, "255,170,80", 0.35 * luz); g.globalCompositeOperation = "source-over"; }
  g.restore();
}

// ---------------------------------------------------------------- las escenas de los vídeos del feed
// Cada una se dibuja una vez en su lienzo vertical (9:16). Son vídeos de otros: color, luz y una cosa clara.
const TW = 360, TH = 640;
const cielo = (c, arriba, abajo, cort = 1) => { const g = c.createLinearGradient(0, 0, 0, TH * cort); g.addColorStop(0, arriba); g.addColorStop(1, abajo); c.fillStyle = g; c.fillRect(0, 0, TW, TH); };
const ESCENAS = {
  playa(c) {
    cielo(c, "#ff7a59", "#ffd27a", 0.55);
    k.brillo(c, 180, 330, 260, "255,240,200", 1); c.fillStyle = "#fff3c4"; c.beginPath(); c.arc(180, 330, 52, 0, 6.2832); c.fill();
    const mg = c.createLinearGradient(0, 350, 0, TH); mg.addColorStop(0, "#2a7fb8"); mg.addColorStop(1, "#0b3a63"); c.fillStyle = mg; c.fillRect(0, 350, TW, TH);
    c.fillStyle = "rgba(255,230,170,0.6)"; for (let i = 0; i < 14; i++) c.fillRect(150 - i * 4, 360 + i * 18, 60 + i * 8, 4);
  },
  plato(c) {
    cielo(c, "#3b2418", "#1a0e08");
    c.fillStyle = "#f4efe6"; c.beginPath(); c.arc(180, 330, 150, 0, 6.2832); c.fill(); c.fillStyle = "#e2dacb"; c.beginPath(); c.arc(180, 330, 118, 0, 6.2832); c.fill();
    c.fillStyle = "#e0a13a"; c.beginPath(); c.ellipse(170, 320, 80, 60, 0.3, 0, 6.2832); c.fill();
    c.fillStyle = "#c2412d"; for (const [x, y] of [[140, 300], [200, 340], [175, 290], [215, 305]]) { c.beginPath(); c.arc(x, y, 14, 0, 6.2832); c.fill(); }
    c.fillStyle = "#4f9a3a"; for (const [x, y] of [[155, 345], [205, 285], [130, 330]]) { c.beginPath(); c.ellipse(x, y, 16, 8, 0.8, 0, 6.2832); c.fill(); }
  },
  gimnasio(c) {
    cielo(c, "#0c1430", "#1d0f3a");
    c.globalCompositeOperation = "lighter"; k.brillo(c, 180, 200, 320, "60,120,255", 0.8); k.brillo(c, 60, 500, 220, "255,40,160", 0.6); c.globalCompositeOperation = "source-over";
    c.fillStyle = "#c9ced6"; c.fillRect(40, 380, 280, 12);
    for (const x of [40, 280]) { c.fillStyle = "#222"; c.fillRect(x - 10, 330, 40, 110); c.fillStyle = "#555"; c.fillRect(x - 4, 340, 8, 90); }
  },
  ciudad(c) {
    cielo(c, "#1b1f4a", "#5a2a6a");
    const az = azar(9);
    for (let i = 0; i < 7; i++) { const bw = 50 + az() * 40, bh = 220 + az() * 260, bx = i * 54 - 10; c.fillStyle = "#151026"; c.fillRect(bx, TH - bh, bw, bh); for (let w = 0; w < 30; w++) { if (az() < 0.5) { c.fillStyle = az() < 0.7 ? "#ffd27a" : "#7ad7ff"; c.fillRect(bx + 6 + (w % 3) * 15, TH - bh + 14 + Math.floor(w / 3) * 22, 8, 10); } } }
  },
  montana(c) {
    cielo(c, "#7fc8ff", "#d8f1ff", 0.6);
    c.fillStyle = "#3d6e4a"; c.beginPath(); c.moveTo(0, 460); c.lineTo(120, 250); c.lineTo(200, 360); c.lineTo(290, 220); c.lineTo(TW, 330); c.lineTo(TW, TH); c.lineTo(0, TH); c.fill();
    c.fillStyle = "#f4f8ff"; c.beginPath(); c.moveTo(120, 250); c.lineTo(145, 292); c.lineTo(100, 286); c.fill(); c.beginPath(); c.moveTo(290, 220); c.lineTo(320, 262); c.lineTo(265, 258); c.fill();
    c.fillStyle = "#2b5236"; c.fillRect(0, 520, TW, TH);
  },
  concierto(c) {
    cielo(c, "#120626", "#3a0b2a");
    c.globalCompositeOperation = "lighter";
    for (let i = 0; i < 5; i++) { const x = 40 + i * 70, col = ["255,60,180", "60,200,255", "255,200,60", "160,90,255", "60,255,160"][i]; const gr = c.createLinearGradient(x, 0, 180, 520); gr.addColorStop(0, `rgba(${col},0.6)`); gr.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gr; c.beginPath(); c.moveTo(x - 10, 0); c.lineTo(x + 10, 0); c.lineTo(200 + i * 10, 520); c.lineTo(160 + i * 10, 520); c.fill(); }
    c.globalCompositeOperation = "source-over";
    c.fillStyle = "#05020a"; for (let i = 0; i < 9; i++) { const x = i * 44, h = 90 + (i % 3) * 20; c.beginPath(); c.arc(x, TH - h - 22, 22, 0, 6.2832); c.fill(); redondo(c, x - 26, TH - h, 52, h, 18); c.fill(); }
  },
  coche(c) {
    cielo(c, "#ffb347", "#ff5e62", 0.7);
    c.fillStyle = "#2a2a30"; c.fillRect(0, 470, TW, TH);
    c.fillStyle = "#d81e2c"; redondo(c, 40, 380, 280, 80, 30); c.fill(); c.beginPath(); c.moveTo(100, 382); c.quadraticCurveTo(160, 320, 250, 382); c.fill();
    c.fillStyle = "#9fd3ff"; c.beginPath(); c.moveTo(118, 380); c.quadraticCurveTo(165, 338, 236, 380); c.fill();
    c.fillStyle = "#111"; for (const x of [100, 260]) { c.beginPath(); c.arc(x, 462, 30, 0, 6.2832); c.fill(); }
  },
  tuyo(c) {
    cielo(c, "#1d2a5a", "#6a4a8a", 0.7);
    c.fillStyle = "#3a3040"; c.fillRect(0, 540, TW, TH);
    tienda(c, 180, 560, 300, 1, 0);
  },
};
const LIENZOS = {};
for (const [nombre, dibuja] of Object.entries(ESCENAS)) {
  const cv = lienzo(TW, TH), c = cv.getContext("2d"); dibuja(c);
  // la interfaz del feed: el degradado de abajo, dos líneas de texto, la barra de progreso
  const ug = c.createLinearGradient(0, TH * 0.7, 0, TH); ug.addColorStop(0, "rgba(0,0,0,0)"); ug.addColorStop(1, "rgba(0,0,0,0.55)"); c.fillStyle = ug; c.fillRect(0, TH * 0.7, TW, TH * 0.3);
  c.fillStyle = "rgba(255,255,255,0.85)"; redondo(c, 22, TH - 92, 150, 14, 7); c.fill(); c.fillStyle = "rgba(255,255,255,0.55)"; redondo(c, 22, TH - 66, 220, 11, 5); c.fill();
  c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(0, TH - 6, TW, 6);
  c.save(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.25; c.drawImage(k.manchas, 0, 0, TW, TH); c.restore();
  LIENZOS[nombre] = cv;
}
export const OTROS = ["playa", "plato", "gimnasio", "ciudad", "montana", "concierto", "coche"];

// Un vídeo del feed como una tarjeta vertical en pantalla: centro (x, y), alto h, con esquinas redondas, borde de luz
// y sombra. brillo: el halo de su color (para el tuyo, naranja).
export function tarjeta(g, nombre, x, y, h, op = {}) {
  const w = h * 0.5625, r = h * 0.045, al = op.al ?? 1;
  if (al <= 0.003 || h < 2) return;
  g.save(); g.globalAlpha = al;
  if (op.brillo) { g.globalCompositeOperation = "lighter"; k.brillo(g, x, y, h * 1.1, op.color || NARANJA, op.brillo); g.globalCompositeOperation = "source-over"; }
  if (op.sombra) { g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = h * 0.08; g.shadowOffsetY = h * 0.03; }
  redondo(g, x - w / 2, y - h / 2, w, h, r); g.fillStyle = "#000"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  g.save(); redondo(g, x - w / 2, y - h / 2, w, h, r); g.clip();
  g.drawImage(LIENZOS[nombre], x - w / 2, y - h / 2, w, h);
  if (op.gris) { g.globalAlpha = al * op.gris; g.fillStyle = "rgba(20,20,26,0.75)"; g.fillRect(x - w / 2, y - h / 2, w, h); g.globalAlpha = al; }
  // un reflejo en diagonal
  const rg = g.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.10)"); rg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(x - w / 2, y - h / 2, w, h);
  g.restore();
  redondo(g, x - w / 2, y - h / 2, w, h, r); g.lineWidth = Math.max(1, h * 0.006);
  g.strokeStyle = op.borde ? `rgba(${op.borde},0.95)` : "rgba(255,255,255,0.25)"; g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la silueta de quien mira (de espaldas)
// La cabeza y los hombros a contraluz: negro, con el pelo apenas marcado y un halo del color de lo que tiene delante
// por todo el contorno (luz: "r,g,b"; cuanto: de 0 a 1). (x, y): la nuca; s: el ancho de la cabeza.
function caminoEspalda(g, x, y, s) {
  g.beginPath();
  // la cabeza: más estrecha arriba, con las orejas
  g.moveTo(x, y - s * 0.78);
  g.bezierCurveTo(x + s * 0.34, y - s * 0.78, x + s * 0.5, y - s * 0.52, x + s * 0.49, y - s * 0.2);
  g.quadraticCurveTo(x + s * 0.58, y - s * 0.16, x + s * 0.55, y + s * 0.02);
  g.quadraticCurveTo(x + s * 0.5, y + s * 0.16, x + s * 0.4, y + s * 0.18);
  g.quadraticCurveTo(x + s * 0.32, y + s * 0.36, x + s * 0.26, y + s * 0.52);
  // el cuello y los hombros
  g.bezierCurveTo(x + s * 0.32, y + s * 0.78, x + s * 0.95, y + s * 0.8, x + s * 1.35, y + s * 1.02);
  g.bezierCurveTo(x + s * 1.62, y + s * 1.18, x + s * 1.75, y + s * 1.6, x + s * 1.8, y + s * 2.4);
  g.lineTo(x - s * 1.8, y + s * 2.4);
  g.bezierCurveTo(x - s * 1.75, y + s * 1.6, x - s * 1.62, y + s * 1.18, x - s * 1.35, y + s * 1.02);
  g.bezierCurveTo(x - s * 0.95, y + s * 0.8, x - s * 0.32, y + s * 0.78, x - s * 0.26, y + s * 0.52);
  g.quadraticCurveTo(x - s * 0.32, y + s * 0.36, x - s * 0.4, y + s * 0.18);
  g.quadraticCurveTo(x - s * 0.5, y + s * 0.16, x - s * 0.55, y + s * 0.02);
  g.quadraticCurveTo(x - s * 0.58, y - s * 0.16, x - s * 0.49, y - s * 0.2);
  g.bezierCurveTo(x - s * 0.5, y - s * 0.52, x - s * 0.34, y - s * 0.78, x, y - s * 0.78);
  g.closePath();
}
export function espalda(g, x, y, s, luz = "120,140,200", cuanto = 0.4, dentro = 0) {
  g.save();
  // el halo de detrás: la luz que le rodea
  g.save(); g.shadowColor = `rgba(${luz},${Math.min(1, 0.95 * cuanto)})`; g.shadowBlur = s * 0.35;
  caminoEspalda(g, x, y, s); g.fillStyle = "#050409"; g.fill(); g.restore();
  // dentro: casi negro, un poco más claro hacia arriba donde le da la luz
  g.save(); caminoEspalda(g, x, y, s); g.clip();
  const dg = g.createLinearGradient(0, y - s, 0, y + s * 2.4);
  dg.addColorStop(0, "#14101a"); dg.addColorStop(0.4, "#0a080e"); dg.addColorStop(1, "#040306");
  g.fillStyle = dg; g.fillRect(x - s * 2, y - s, s * 4, s * 3.5);
  // el pelo: una textura fina, no rayas
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.05;
  g.drawImage(k.red2, x - s * 0.6, y - s * 0.85, s * 1.2, s * 1.1);
  g.globalAlpha = 1;
  // el borde de luz por dentro del contorno (la luz que roza el pelo y los hombros)
  g.globalCompositeOperation = "lighter";
  caminoEspalda(g, x, y, s); g.lineWidth = s * 0.06; g.strokeStyle = `rgba(${luz},${0.35 * cuanto})`; g.filter = "none"; g.stroke();
  caminoEspalda(g, x, y, s); g.lineWidth = s * 0.018; g.strokeStyle = `rgba(${mezRgb(luz, "255,255,255", 0.4)},${0.9 * cuanto})`; g.stroke();
  // lo que lleva dentro de la cabeza: una luz naranja que crece (lo que le vas sonando)
  if (dentro > 0.003) {
    const dg = g.createRadialGradient(x, y - s * 0.25, 0, x, y - s * 0.25, s * 0.75 * (0.5 + 0.5 * dentro));
    dg.addColorStop(0, `rgba(255,200,120,${0.95 * dentro})`); dg.addColorStop(0.4, `rgba(${NARANJA},${0.8 * dentro})`); dg.addColorStop(1, `rgba(${NARANJA},0)`);
    g.fillStyle = dg; g.fillRect(x - s, y - s * 1.1, s * 2, s * 1.8);
  }
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- la cámara 2D (para el aula, la mesa, la calle)
// Mira al punto (cx, cy) del mundo con zoom Z: lo que está en (cx, cy) sale en el centro de la pantalla.
export const vista = (g, Z, cx, cy) => g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log, para que se acerque con ritmo parejo).
export function camino2D(lista) {
  const Zs = k.claves(lista.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(lista.map(([t, c]) => [t, c[1]])), Y = k.claves(lista.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}

// ---------------------------------------------------------------- una chica, de frente
// (x, y): los pies; h: la altura. col: su color ("r,g,b"); pelo: el color del pelo. paso: la fase del paso (0 quieta).
// gris: 0 con su color, 1 apagada (la que nunca fue). al: transparencia (se dibuja aparte para que no salga un fantasma).
const LIENZO_CHICA = lienzo(400, 900);
const hexRgb = (h) => `${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)}`;
export function chica(g, x, y, h, col, pelo, op = {}) {
  const al = op.al ?? 1, gris = op.gris ?? 0, paso = op.paso ?? 0;
  if (al <= 0.003) return;
  const c = LIENZO_CHICA.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 400, 900); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  // dibujada en un lienzo de 400 × 900 con los pies en (200, 880); la escala va al ponerla
  const ropa = `rgb(${mezRgb(col, "120,120,128", gris)})`, ropaO = `rgb(${mezRgb(mezRgb(col, "0,0,0", 0.35), "70,70,78", gris)})`;
  const piel = mezRgb("236,188,160", "150,150,155", gris), pielO = mezRgb("196,140,112", "110,110,115", gris);
  const s1 = Math.sin(paso), bob = Math.abs(Math.cos(paso)) * 8;
  c.translate(0, -bob);
  // las piernas (vaqueros oscuros) y los zapatos
  const pierna = (dx, ang) => { c.save(); c.translate(200 + dx, 520); c.rotate(ang); const pg = c.createLinearGradient(-30, 0, 30, 0); pg.addColorStop(0, "#2b3550"); pg.addColorStop(1, "#1a2033"); c.fillStyle = pg; redondo(c, -26, 0, 52, 330, 22); c.fill(); c.fillStyle = "#f2f2f2"; redondo(c, -30, 322, 66, 34, 14); c.fill(); c.restore(); };
  pierna(-34, 0.28 * s1); pierna(34, -0.28 * s1);
  // el brazo de detrás
  const brazo = (dx, ang, delante) => { c.save(); c.translate(200 + dx, 300); c.rotate(ang); c.fillStyle = delante ? ropa : ropaO; redondo(c, -24, 0, 48, 200, 22); c.fill(); c.fillStyle = `rgb(${delante ? piel : pielO})`; c.beginPath(); c.arc(0, 212, 24, 0, 6.2832); c.fill(); c.restore(); };
  brazo(-92, 0.12 - 0.3 * s1, false); brazo(92, -0.12 + 0.3 * s1, false);
  // el cuerpo: un jersey de su color, con luz por la izquierda
  const cg = c.createLinearGradient(110, 0, 290, 0); cg.addColorStop(0, `rgb(${mezRgb(ropa.slice(4, -1), "255,255,255", 0.18)})`); cg.addColorStop(0.55, ropa); cg.addColorStop(1, ropaO);
  c.fillStyle = cg; c.beginPath(); c.moveTo(130, 290); c.quadraticCurveTo(200, 262, 270, 290); c.lineTo(292, 540); c.quadraticCurveTo(200, 560, 108, 540); c.closePath(); c.fill();
  c.save(); c.clip(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.22; c.drawImage(k.red, 100, 260, 200, 300); c.restore();
  // el pelo de detrás: cae por los hombros, con las puntas onduladas
  const hg = c.createLinearGradient(130, 0, 270, 0); hg.addColorStop(0, `rgb(${mezRgb(hexRgb(pelo), "255,255,255", 0.12)})`); hg.addColorStop(1, pelo);
  c.fillStyle = hg; c.beginPath(); c.moveTo(200, 98);
  c.bezierCurveTo(262, 98, 272, 150, 268, 210); c.bezierCurveTo(266, 260, 276, 300, 262, 318);
  c.quadraticCurveTo(250, 330, 240, 318); c.quadraticCurveTo(225, 332, 214, 316);
  c.lineTo(186, 316); c.quadraticCurveTo(175, 332, 160, 318); c.quadraticCurveTo(150, 330, 138, 318);
  c.bezierCurveTo(124, 300, 134, 260, 132, 210); c.bezierCurveTo(128, 150, 138, 98, 200, 98); c.fill();
  // el cuello y la cara
  c.fillStyle = `rgb(${pielO})`; c.fillRect(182, 230, 36, 50);
  const fg = c.createRadialGradient(185, 165, 10, 200, 180, 80); fg.addColorStop(0, `rgb(${mezRgb(piel, "255,255,255", 0.15)})`); fg.addColorStop(1, `rgb(${pielO})`);
  c.fillStyle = fg; c.beginPath(); c.ellipse(200, 175, 56, 70, 0, 0, 6.2832); c.fill();
  // el flequillo y la raya, que enmarcan la cara
  c.fillStyle = pelo; c.beginPath(); c.moveTo(140, 180); c.quadraticCurveTo(138, 92, 200, 92); c.quadraticCurveTo(268, 92, 262, 190); c.quadraticCurveTo(250, 128, 205, 118); c.quadraticCurveTo(170, 140, 140, 180); c.fill();
  c.globalAlpha = 0.25; c.strokeStyle = "#fff"; c.lineWidth = 4; c.beginPath(); c.arc(200, 150, 56, -2.4, -1.2); c.stroke(); c.globalAlpha = 1;
  // un brillo de borde de su color: así se la ve entre la gente
  c.globalCompositeOperation = "source-atop"; c.globalAlpha = 0.25 * (1 - gris);
  const bg = c.createLinearGradient(0, 0, 400, 0); bg.addColorStop(0, "rgba(255,255,255,0.6)"); bg.addColorStop(0.3, "rgba(255,255,255,0)"); c.fillStyle = bg; c.fillRect(0, 0, 400, 900);
  c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  // ponerla en su sitio, con su sombra en el suelo
  const e = h / 860;
  g.save(); g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(x, y, 120 * e, 22 * e, 0, 0, 6.2832); g.fill();
  if (op.halo) { g.globalCompositeOperation = "lighter"; k.brillo(g, x, y - h * 0.5, h * 1.1, col, op.halo * (1 - gris)); g.globalCompositeOperation = "source-over"; }
  g.drawImage(LIENZO_CHICA, x - 200 * e, y - 880 * e, 400 * e, 900 * e);
  g.restore();
}

// ---------------------------------------------------------------- el aula
// Un anfiteatro de universidad visto desde atrás y arriba, en coordenadas del mundo (px con zoom 1):
// la pizarra verde arriba (y -1250 a -880), la tarima donde se ponen las chicas (pies en y ≈ -690), las filas de
// alumnos de espaldas bajando hacia nosotros (de y -560 a 1350) y los ventanales a la izquierda con su luz.
export const TARIMA = -690;
const az = azar(808);
const FILAS = [];
let yFila = -560;
for (let r = 0; r < 11; r++) {
  const e = 0.75 + r * 0.075, y = yFila, ancho = 1500 + r * 120, n = Math.round(ancho / (150 * e)), alumnos = [];
  yFila += 150 * e;
  for (let i = 0; i < n; i++) alumnos.push({ x: -ancho / 2 + (i + 0.5) * (ancho / n) + (az() - 0.5) * 40, pelo: ["#1a120c", "#2b1d12", "#0e0b0a", "#4a3220", "#6b4a2a", "#1d1a1a"][Math.floor(az() * 6)], ropa: ["#3c4a63", "#5a3c3c", "#2f4b40", "#4b4b52", "#6b5a3a", "#3a3150"][Math.floor(az() * 6)], f: az() * 6, ladea: (az() - 0.5) * 0.12 });
  FILAS.push({ y, e, ancho, alumnos });
}
export const NUM_ALUMNOS = FILAS.reduce((s, f) => s + f.alumnos.length, 0);
const vetas = (() => { const cv = lienzo(512, 64), c = cv.getContext("2d"); const a2 = azar(12); for (let i = 0; i < 60; i++) { c.strokeStyle = `rgba(60,30,10,${0.15 + a2() * 0.25})`; c.lineWidth = 1 + a2() * 2; c.beginPath(); const y0 = a2() * 64; c.moveTo(0, y0); c.bezierCurveTo(170, y0 + (a2() - 0.5) * 20, 340, y0 + (a2() - 0.5) * 20, 512, y0 + (a2() - 0.5) * 10); c.stroke(); } return cv; })();

// un alumno de espaldas: cabeza y hombros (escala e)
function alumno(g, x, y, e, a, t, luz) {
  const s = 62 * e;
  g.save(); g.translate(x, y); g.rotate(a.ladea + 0.015 * Math.sin(t * 0.8 + a.f));
  const rg = g.createLinearGradient(-s * 1.6, 0, s * 1.6, 0); rg.addColorStop(0, `rgba(${luz},1)`); rg.addColorStop(0.25, a.ropa); rg.addColorStop(1, "#15131a");
  g.fillStyle = a.ropa; g.beginPath(); g.moveTo(-s * 1.55, s * 2.2); g.bezierCurveTo(-s * 1.5, s * 0.9, -s * 0.9, s * 0.62, 0, s * 0.62); g.bezierCurveTo(s * 0.9, s * 0.62, s * 1.5, s * 0.9, s * 1.55, s * 2.2); g.fill();
  g.globalAlpha = 0.35; g.fillStyle = rg; g.fill(); g.globalAlpha = 1;
  g.fillStyle = a.pelo; g.beginPath(); g.ellipse(0, 0, s * 0.52, s * 0.62, 0, 0, 6.2832); g.fill();
  g.fillStyle = `rgba(${luz},0.35)`; g.beginPath(); g.ellipse(-s * 0.2, -s * 0.25, s * 0.22, s * 0.3, -0.5, 0, 6.2832); g.fill();
  g.restore();
}

// El aula entera. op.vacio: el sitio de la primera fila que queda libre (para el final). op.luzDia: de 0 a 1, la luz de
// los ventanales (la mañana o la tarde). Las chicas y lo que pase en la tarima se dibujan aparte, encima o entre filas
// con op.entreFilas(g, r) (se llama antes de dibujar la fila r).
export function aula(g, t, op = {}) {
  const dia = op.luzDia ?? 0.6, luz = mezRgb("255,190,120", "255,236,200", dia);
  // la pared del fondo y la pizarra
  const pg = g.createLinearGradient(0, -1700, 0, -600); pg.addColorStop(0, "#3d2f2a"); pg.addColorStop(1, "#5a463c");
  g.fillStyle = pg; g.fillRect(-1400, -1800, 2800, 1300);
  g.fillStyle = "#6b4a2e"; g.fillRect(-760, -1290, 1520, 430);
  const pz = g.createLinearGradient(0, -1270, 0, -880); pz.addColorStop(0, "#2f5a44"); pz.addColorStop(1, "#1f3f30");
  g.fillStyle = pz; g.fillRect(-740, -1270, 1480, 390);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.12; g.drawImage(k.manchas, -740, -1270, 1480, 390); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  g.fillStyle = "rgba(255,255,255,0.10)"; for (let i = 0; i < 5; i++) g.fillRect(-640 + i * 260, -1180 + (i % 2) * 90, 180, 6);
  // la tarima de madera
  const tg = g.createLinearGradient(0, -880, 0, -600); tg.addColorStop(0, "#8a5a36"); tg.addColorStop(1, "#5a3820");
  g.fillStyle = tg; g.fillRect(-1400, -880, 2800, 300);
  g.globalAlpha = 0.5; g.drawImage(vetas, -1400, -880, 2800, 300); g.globalAlpha = 1;
  // la puerta, a la derecha de la tarima, con su luz si está abierta
  const ab = op.puerta ?? 0;
  g.fillStyle = "#2a1b12"; g.fillRect(800, -1180, 260, 470);
  if (ab > 0) { const lg = g.createLinearGradient(800, 0, 1060, 0); lg.addColorStop(0, `rgba(255,236,200,${0.9 * ab})`); lg.addColorStop(1, `rgba(255,210,160,${0.6 * ab})`); g.fillStyle = lg; g.fillRect(800, -1180, 260 * ab, 470); }
  g.fillStyle = "#5a3a24"; g.fillRect(800 + 260 * ab, -1180, 260 * (1 - ab) + 4, 470);
  // el suelo de las gradas, oscuro, hasta abajo del todo
  g.fillStyle = "#211612"; g.fillRect(-1600, -600, 3200, 3400);
  // las filas, de delante (arriba) hacia nosotros (abajo)
  for (let r = 0; r < FILAS.length; r++) {
    if (op.entreFilas) op.entreFilas(g, r);
    const f = FILAS[r];
    // el pupitre corrido de la fila (delante de los alumnos)
    const prev = r > 0 ? FILAS[r - 1] : null;
    const dy = prev ? prev.y + 72 * prev.e : f.y - 70 * f.e, dh = 22 * f.e, dw = f.ancho + 200;
    const mg = g.createLinearGradient(0, dy, 0, dy + dh * 2.2); mg.addColorStop(0, "#c48a56"); mg.addColorStop(0.35, "#8a5a34"); mg.addColorStop(1, "#3a2414");
    g.fillStyle = mg; g.fillRect(-dw / 2, dy, dw, dh * 2.2);
    g.globalAlpha = 0.4; g.drawImage(vetas, -dw / 2, dy, dw, dh); g.globalAlpha = 1;
    g.fillStyle = "rgba(255,220,180,0.35)"; g.fillRect(-dw / 2, dy, dw, 2.5 * f.e);
    for (let i = 0; i < f.alumnos.length; i++) {
      if (r === 0 && op.libres && op.libres.includes(i)) { if (op.enSitio) op.enSitio(g, i); continue; }
      const a = f.alumnos[i];
      alumno(g, a.x, f.y, f.e, a, t, luz);
    }
  }
  // la luz de los ventanales (desde la izquierda, en diagonal) y las motas de polvo
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const x0 = -1500, y0 = -1500 + i * 520, gr = g.createLinearGradient(x0, y0, x0 + 2200, y0 + 1500);
    gr.addColorStop(0, `rgba(${luz},${0.16 + 0.1 * dia})`); gr.addColorStop(1, `rgba(${luz},0)`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0, y0 + 260); g.lineTo(x0 + 2400, y0 + 1900); g.lineTo(x0 + 2400, y0 + 1500); g.closePath(); g.fill();
  }
  const a2 = azar(3);
  for (let i = 0; i < 70; i++) { const x = -1300 + a2() * 2600, y = -1500 + ((a2() * 3000 + t * 20 * (0.5 + a2())) % 3000); g.fillStyle = `rgba(${luz},${0.25 + 0.25 * Math.sin(t * 2 + i)})`; g.fillRect(x, y, 5, 5); }
  g.restore();
}
// Una chica sentada, de espaldas, en su sitio: como un alumno, con su jersey y su pelo largo, y un halo de su color.
export function sentada(g, x, y, e, col, pelo, op = {}) {
  const s = 62 * e, al = op.al ?? 1;
  if (al <= 0.003) return;
  g.save(); g.globalAlpha *= al;
  if (op.halo) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, y + s * 0.6, s * 4, col, op.halo); g.restore(); }
  g.translate(x, y + (op.baja ?? 0) * s);
  g.fillStyle = `rgb(${col})`; g.beginPath(); g.moveTo(-s * 1.5, s * 2.2); g.bezierCurveTo(-s * 1.45, s * 0.9, -s * 0.9, s * 0.62, 0, s * 0.62); g.bezierCurveTo(s * 0.9, s * 0.62, s * 1.45, s * 0.9, s * 1.5, s * 2.2); g.fill();
  const sg = g.createLinearGradient(-s * 1.5, 0, s * 1.5, 0); sg.addColorStop(0, "rgba(255,255,255,0.25)"); sg.addColorStop(0.5, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = sg; g.fill();
  // el pelo largo por la espalda
  g.fillStyle = pelo; g.beginPath(); g.moveTo(0, -s * 0.66); g.bezierCurveTo(s * 0.62, -s * 0.66, s * 0.66, s * 0.2, s * 0.56, s * 1.35); g.quadraticCurveTo(0, s * 1.5, -s * 0.56, s * 1.35); g.bezierCurveTo(-s * 0.66, s * 0.2, -s * 0.62, -s * 0.66, 0, -s * 0.66); g.fill();
  g.fillStyle = "rgba(255,230,200,0.18)"; g.beginPath(); g.ellipse(-s * 0.2, -s * 0.28, s * 0.2, s * 0.32, -0.4, 0, 6.2832); g.fill();
  // el brazo que escribe: se mueve un poco cuando toma apuntes
  g.restore();
}

// Dónde se sienta cada alumno de una fila (para poner a alguien en su sitio).
export const sitio = (r, i) => ({ x: FILAS[r].alumnos[i].x, y: FILAS[r].y, e: FILAS[r].e });

// Rayitas de tiza en la pizarra, en grupos de cinco (cuatro de pie y una cruzada): n de ellas, la última a medio
// dibujar si n no es entero. (x, y): arriba a la izquierda; tam: alto de una rayita.
export function rayitas(g, x, y, n, tam, col = "245,245,235") {
  g.save(); g.strokeStyle = `rgba(${col},0.92)`; g.lineCap = "round"; g.lineWidth = tam * 0.09;
  const ent = Math.floor(n), fr = n - ent;
  for (let i = 0; i < Math.ceil(n); i++) {
    const u = i < ent ? 1 : fr, grupo = Math.floor(i / 5), j = i % 5, gx = x + grupo * tam * 1.25;
    g.beginPath();
    if (j < 4) { const xx = gx + j * tam * 0.22, y0 = y + (j % 2) * tam * 0.04; g.moveTo(xx, y0); g.lineTo(xx + tam * 0.03, y0 + tam * u); }
    else { g.moveTo(gx - tam * 0.1, y + tam * 0.8); g.lineTo(gx - tam * 0.1 + tam * 0.95 * u, y + tam * 0.8 - tam * 0.6 * u); }
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- las fotos de las chicas (polaroids)
// Un retrato de cada una (cabeza y hombros sobre un fondo de su color), dibujado una vez.
export const FOTOS = CHICAS.map((c, i) => {
  const cv = lienzo(300, 360), g = cv.getContext("2d");
  g.fillStyle = "#f6f2ea"; g.fillRect(0, 0, 300, 360);
  const fx = 18, fy = 18, fw = 264, fh = 264;
  const bg = g.createLinearGradient(0, fy, 0, fy + fh); bg.addColorStop(0, `rgb(${mezRgb(c.c, "255,255,255", 0.35)})`); bg.addColorStop(1, `rgb(${mezRgb(c.c, "40,30,40", 0.35)})`);
  g.fillStyle = bg; g.fillRect(fx, fy, fw, fh);
  g.save(); g.beginPath(); g.rect(fx, fy, fw, fh); g.clip();
  chica(g, 150, fy + 577, 600, c.c, c.pelo);
  g.restore();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.12; g.drawImage(k.manchas, 0, 0, 300, 360); g.restore();
  return cv;
});
// Una polaroid en pantalla: centro (x, y), ancho w, girada ang.
export function polaroid(g, i, x, y, w, ang = 0, op = {}) {
  const h = w * 1.2, al = op.al ?? 1;
  if (al <= 0.003) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = w * 0.12; g.shadowOffsetY = w * (0.04 + 0.2 * (op.alto ?? 0));
  g.drawImage(FOTOS[i], -w / 2, -h / 2, w, h);
  g.restore();
}
