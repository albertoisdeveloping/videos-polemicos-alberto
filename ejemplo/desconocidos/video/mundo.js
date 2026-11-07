// Lo que comparten los planos: el estadio a oscuras (miles de desconocidos en gradas que se encienden por filas), la
// pista, tu vídeo (la tarjeta), tú (el dueño del negocio, imagen de IA recortada), la primera fila (seis desconocidos,
// imagen de IA) y el banco de tus seguidores (cuatro amigos, imagen de IA). Las imágenes están en video/img/ y su
// origen en notas.md.
import * as k from "#kit";
import { loadImage } from "@napi-rs/canvas";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { azar, lienzo, redondo, mez, mezRgb, suave: su, tramo: tr } = k;
const DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- colores fijos de todo el vídeo
export const AZUL = "80,180,255";        // la luz de los móviles: una fila que te está viendo
export const CIAN = "120,235,255";
export const VIOLETA = "170,120,255";
export const NARANJA = "255,138,40";     // tu vídeo y tus seguidores (tu marca)
export const NOCHE = "#05060f";

// ---------------------------------------------------------------- las imágenes de IA (recortadas, con transparencia)
const cargar = async (n) => loadImage(join(DIR, "img", n));
export const IMG = {
  dueno: await cargar("dueno-movil.png"),   // tú, mirando el móvil (1104 px de alto)
  camina: await cargar("dueno-camina.png"), // tú, saliendo a la pista
  trofeo: await cargar("dueno-trofeo.png"), // tú, con el móvil en alto
  fila: await cargar("fila.png"),           // la primera fila: seis desconocidos con el móvil (1280 × ~560)
  amigos: await cargar("amigos.png"),       // tus cuatro seguidores en su banco
};
// la misma imagen a oscuras (para apagarla sin que se vea un rectángulo): se pinta negro solo donde hay dibujo
function oscura(img, cuanto = 0.88, tinte = "8,10,24") {
  const cv = lienzo(img.width, img.height), c = cv.getContext("2d");
  c.drawImage(img, 0, 0); c.globalCompositeOperation = "source-atop"; c.fillStyle = `rgba(${tinte},${cuanto})`; c.fillRect(0, 0, img.width, img.height);
  return cv;
}
export const IMG_OSCURA = { fila: oscura(IMG.fila), amigos: oscura(IMG.amigos), dueno: oscura(IMG.dueno, 0.7), camina: oscura(IMG.camina, 0.7), trofeo: oscura(IMG.trofeo, 0.7) };

// Una imagen como cartel en el mundo (siempre de cara a la cámara): centro de su base en P, alto en unidades del mundo.
// luz: 1 encendida, 0 a oscuras. Devuelve dónde ha salido ({ x, y, w, h, z }) o null.
export function cartel(g, cam, P, alto, img, osc = null, luz = 1, op = {}) {
  const p = k.proyecta(cam, P);
  if (!p) return null;
  const h = k.tamano(alto, p.z), w = (h * img.width) / img.height;
  if (h < 2 || p.x < -w || p.x > 1080 + w || p.y < 0 || p.y - h > 1920) return { x: p.x, y: p.y, w, h, z: p.z, fuera: true };
  g.save();
  g.globalAlpha *= op.al ?? 1;
  if (osc && luz < 0.995) g.drawImage(osc, p.x - w / 2, p.y - h, w, h);
  if (luz > 0.005) { g.globalAlpha *= osc ? luz : 1; g.drawImage(img, p.x - w / 2, p.y - h, w, h); }
  g.restore();
  return { x: p.x, y: p.y, w, h, z: p.z };
}

// ---------------------------------------------------------------- el estadio
// La pista es el centro [0, 0, 0]. Las gradas suben en anillos: la fila r está a R0 + r·DR del centro y a r·DH de alto.
// Un asiento es una persona sentada; delante del todo (a = 0, hacia -z) la primera fila es la imagen de los seis.
export const FILAS = 34, R0 = 13, DR = 1.3, DH = 0.72, PASO = 1.12;
export const ALTO_GRADA = FILAS * DH, RADIO = R0 + FILAS * DR;
const HUECO_FILA = 3.6;                   // media anchura de la imagen de la primera fila (unidades): ahí no hay puntos
export const ANCHO_FILA = 2 * HUECO_FILA, ALTO_FILA = ANCHO_FILA * (IMG.fila.height / IMG.fila.width);

// todos los asientos, una vez: [x, y, z, fila, ángulo, variante]
const ASIENTOS = [];
{
  const az = azar(31);
  for (let r = 0; r < FILAS; r++) {
    const R = R0 + r * DR, y = r * DH + 0.3, n = Math.round((2 * Math.PI * R) / PASO);
    for (let i = 0; i < n; i++) {
      let a = (i / n) * 2 * Math.PI - Math.PI;             // -π..π, 0 = delante (hacia -z)
      if (r === 0 && Math.abs(a) * R < HUECO_FILA + 0.4) continue; // el sitio de la imagen de la primera fila
      a += (az() - 0.5) * 0.004;
      ASIENTOS.push({ x: -Math.sin(a) * R, y, z: -Math.cos(a) * R, r, a, v: Math.floor(az() * 4), s: az() });
    }
  }
}
export const N_ASIENTOS = ASIENTOS.length;

// las personas sentadas, dibujadas una vez: cuatro siluetas apagadas y cuatro encendidas (la cara con la luz del móvil)
const SW = 48, SH = 72;
function persona(c, v, luz) {
  const az = azar(100 + v);
  const col = ["#2b2f5a", "#4a2a4f", "#1f3b4a", "#3a2b22"][v], pelo = ["#120c0a", "#2a1c12", "#0b0b10", "#3b2a1a"][v];
  const cab = 10 + az() * 2, hombro = 20 + az() * 3;
  c.clearRect(0, 0, SW, SH);
  // cuerpo
  c.fillStyle = luz ? col : "#171d3a"; redondo(c, SW / 2 - hombro, 30, hombro * 2, 42, 10); c.fill();
  // cabeza
  c.fillStyle = luz ? "#c9956a" : "#1c2344"; c.beginPath(); c.arc(SW / 2, 20, cab, 0, 6.2832); c.fill();
  c.fillStyle = luz ? pelo : "#141a36"; c.beginPath(); c.arc(SW / 2, 17, cab, Math.PI, 2 * Math.PI); c.fill();
  if (!luz) { c.strokeStyle = "rgba(120,140,220,0.35)"; c.lineWidth = 1.5; c.beginPath(); c.arc(SW / 2, 20, cab - 0.5, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  if (luz) {
    // la luz del móvil en la cara y el móvil en las manos
    const gr = c.createRadialGradient(SW / 2, 30, 0, SW / 2, 30, 22); gr.addColorStop(0, `rgba(${CIAN},0.95)`); gr.addColorStop(1, `rgba(${AZUL},0)`);
    c.fillStyle = gr; c.fillRect(0, 10, SW, 40);
    c.fillStyle = "#0b1020"; redondo(c, SW / 2 - 5, 42, 10, 14, 2); c.fill();
    c.fillStyle = `rgb(${CIAN})`; redondo(c, SW / 2 - 4, 43, 8, 12, 1.5); c.fill();
  }
}
const APAGADA = [0, 1, 2, 3].map((v) => { const cv = lienzo(SW, SH); persona(cv.getContext("2d"), v, false); return cv; });
const ENCENDIDA = [0, 1, 2, 3].map((v) => { const cv = lienzo(SW, SH); persona(cv.getContext("2d"), v, true); return cv; });
const HALO = k.halo(AZUL), HALO2 = k.halo(VIOLETA);

// El estadio entero visto desde cam. luz(r, a, s) devuelve de 0 a 1 cuánto está encendido cada asiento (r fila, a ángulo
// -π..π con 0 delante, s un azar fijo del asiento). op: { centro, fila: 0..1 luz de la imagen de la primera fila,
// sinFila: true para no dibujar la imagen, detalle: 1 (todo) o 0.5 (lejos: puntos sin halo) }.
export function estadio(g, cam, luz, op = {}) {
  const C = op.centro || [0, 0, 0], det = op.detalle ?? 1;
  const cosas = [];
  // el suelo: un disco oscuro bajo todo el estadio (que no se vean las estrellas entre los asientos)
  { const sp = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * 6.2832; const p = k.proyecta(cam, [C[0] + Math.cos(a) * (RADIO + 9), C[1] - 0.2, C[2] + Math.sin(a) * (RADIO + 9)]); if (!p) { sp.length = 0; break; } sp.push(p); }
    if (sp.length) { g.beginPath(); sp.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); g.fillStyle = "#07091a"; g.fill(); }
    else { const dx = cam.p[0] - C[0], dz = cam.p[2] - C[2]; if (Math.sqrt(dx * dx + dz * dz) < RADIO + 9 && cam.p[1] < ALTO_GRADA + 20) { g.fillStyle = "#07091a"; g.fillRect(0, 0, 1080, 1920); } } }
  // la pista: un disco oscuro con un poco de luz en el centro
  const pista = [];
  for (let i = 0; i < 40; i++) { const a = (i / 40) * 6.2832; const p = k.proyecta(cam, [C[0] + Math.cos(a) * (R0 - 0.8), C[1], C[2] + Math.sin(a) * (R0 - 0.8)]); if (!p) { pista.length = 0; break; } pista.push(p); }
  if (pista.length) {
    const c = k.proyecta(cam, C);
    cosas.push({ z: Math.max(...pista.map((p) => p.z)) + 0.5, dibuja() {
      g.beginPath(); pista.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath();
      const gr = c ? g.createRadialGradient(c.x, c.y, 0, c.x, c.y, k.tamano(R0, c.z)) : null;
      if (gr) { gr.addColorStop(0, "#2a2448"); gr.addColorStop(0.45, "#141632"); gr.addColorStop(1, "#0a0c1c"); g.fillStyle = gr; } else g.fillStyle = "#0b0d1c";
      g.fill();
      g.strokeStyle = "rgba(120,140,200,0.18)"; g.lineWidth = 2; g.stroke();
    } });
  }
  // la estructura: una línea tenue por fila (el cuenco se ve aunque esté a oscuras) y el muro de fuera
  g.save(); g.lineWidth = 1.5;
  for (let r = 0; r <= FILAS; r += 1) {
    const R = R0 + r * DR - 0.5, y = r * DH; let abierta = false; g.beginPath();
    for (let i = 0; i <= 72; i++) { const a = (i / 72) * 6.2832; const p = k.proyecta(cam, [C[0] - Math.sin(a) * R, C[1] + y, C[2] - Math.cos(a) * R]); if (!p) { abierta = false; continue; } abierta ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); abierta = true; }
    g.strokeStyle = r === FILAS ? "rgba(150,170,240,0.35)" : `rgba(120,140,220,${0.07 + 0.05 * (r % 5 === 0)})`; g.stroke();
  }
  g.restore();
  // los asientos
  for (const s of ASIENTOS) {
    const p = k.proyecta(cam, [s.x + C[0], s.y + C[1], s.z + C[2]]);
    if (!p || p.x < -60 || p.x > 1140 || p.y < -60 || p.y > 1980) continue;
    const l = luz(s.r, s.a, s.s);
    cosas.push({ z: p.z, p, s, l });
  }
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) {
    if (c.dibuja) { c.dibuja(); continue; }
    const { p, s, l } = c, h = k.tamano(1.5, p.z), w = (h * SW) / SH;
    if (h < 2.2) {
      // muy lejos: un punto
      g.fillStyle = l > 0.02 ? `rgba(${mezRgb("90,105,170", AZUL, l)},${0.8 + 0.2 * l})` : "rgba(90,105,170,0.8)";
      g.fillRect(p.x - 1, p.y - 2, 2.2, 2.2);
      if (l > 0.02) { g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.7 * l; g.drawImage(s.v % 3 ? HALO : HALO2, p.x - 11, p.y - 12, 22, 22); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; }
      continue;
    }
    const x = p.x - w / 2, y = p.y - h;
    if (l < 0.995) g.drawImage(APAGADA[s.v], x, y, w, h);
    if (l > 0.005) {
      g.globalAlpha = l; g.drawImage(ENCENDIDA[s.v], x, y, w, h); g.globalAlpha = 1;
      if (det > 0.5) { g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.55 * l; g.drawImage(s.v % 3 ? HALO : HALO2, p.x - w * 0.9, y - h * 0.15, w * 1.8, w * 1.8); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; }
    }
  }
  // la primera fila: la imagen de los seis, delante
  if (!op.sinFila) {
    const l = op.fila ?? luz(0, 0, 0.5);
    const r = cartel(g, cam, [C[0], C[1] + 0.05, C[2] - R0 + 0.2], ALTO_FILA, IMG.fila, IMG_OSCURA.fila, l);
    if (r && !r.fuera && l > 0.01) { g.globalCompositeOperation = "lighter"; k.brillo(g, r.x, r.y - r.h * 0.45, r.w * 1.3, AZUL, 0.22 * l); g.globalCompositeOperation = "source-over"; }
    return r;
  }
  return null;
}

// La imagen de la fila con una luz distinta para cada uno de los seis (luces[i] de 0 a 1), en su sitio del mundo.
export function filaPorPersona(g, cam, luces, C = [0, 0, 0]) {
  const P = [C[0], C[1] + 0.05, C[2] - R0 + 0.2], p = k.proyecta(cam, P);
  if (!p) return null;
  const h = k.tamano(ALTO_FILA, p.z), w = (h * IMG.fila.width) / IMG.fila.height, x0 = p.x - w / 2, y0 = p.y - h;
  const cortes = [0, 0.17, 0.35, 0.525, 0.695, 0.86, 1];
  g.drawImage(IMG_OSCURA.fila, x0, y0, w, h);
  for (let i = 0; i < 6; i++) {
    const l = luces[i]; if (l <= 0.005) continue;
    g.save(); g.beginPath(); g.rect(x0 + cortes[i] * w - 1, y0 - 1, (cortes[i + 1] - cortes[i]) * w + 2, h + 2); g.clip();
    g.globalAlpha *= l; g.drawImage(IMG.fila, x0, y0, w, h); g.restore();
    g.globalCompositeOperation = "lighter"; k.brillo(g, x0 + (cortes[i] + cortes[i + 1]) / 2 * w, y0 + h * 0.55, w * 0.3, AZUL, 0.2 * l); g.globalCompositeOperation = "source-over";
  }
  return { x: p.x, y: p.y, w, h, z: p.z };
}

// Dónde está en el mundo cada uno de los seis de la primera fila (centro de su cara, para barritas y avioncitos).
export const SEIS = [0.085, 0.26, 0.44, 0.61, 0.775, 0.94].map((u) => ({ u, x: (u - 0.5) * ANCHO_FILA, y: ALTO_FILA * 0.62 }));

// ---------------------------------------------------------------- tu vídeo: la tarjeta
// La miniatura: un fondo cálido con tu cara (la imagen del dueño) y el símbolo de reproducir. Se dibuja una vez.
const TW = 360, TH = 640;
export const MINIS = {};
function miniatura(col1, col2, dueno = true, marca = 0) {
  const cv = lienzo(TW, TH), c = cv.getContext("2d");
  const gr = c.createLinearGradient(0, 0, 0, TH); gr.addColorStop(0, col1); gr.addColorStop(1, col2); c.fillStyle = gr; c.fillRect(0, 0, TW, TH);
  c.globalCompositeOperation = "lighter"; k.brillo(c, 180, 220, 520, "255,220,170", 0.35); c.globalCompositeOperation = "source-over";
  if (dueno) { const h = 620, w = (h * IMG.dueno.width) / IMG.dueno.height; c.drawImage(IMG.dueno, 180 - w / 2 + 20, 130, w, h); }
  // el degradado de abajo con dos líneas de texto y el play
  const ug = c.createLinearGradient(0, TH * 0.62, 0, TH); ug.addColorStop(0, "rgba(0,0,0,0)"); ug.addColorStop(1, "rgba(0,0,0,0.7)"); c.fillStyle = ug; c.fillRect(0, TH * 0.62, TW, TH * 0.38);
  c.fillStyle = "rgba(255,255,255,0.9)"; redondo(c, 24, TH - 96, 170 + marca * 30, 15, 7); c.fill(); c.fillStyle = "rgba(255,255,255,0.55)"; redondo(c, 24, TH - 68, 230 - marca * 40, 12, 6); c.fill();
  c.fillStyle = "rgba(255,255,255,0.85)"; c.beginPath(); c.moveTo(160, 290); c.lineTo(160, 350); c.lineTo(212, 320); c.closePath(); c.fill();
  c.save(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.18; c.drawImage(k.manchas, 0, 0, TW, TH); c.restore();
  return cv;
}
MINIS.tuyo = miniatura("#ff9a3c", "#7a2d8f");          // tu vídeo (naranja de tu marca)
MINIS.a = miniatura("#3cb4ff", "#1a2a7a", true, 1);     // los tres principios
MINIS.b = miniatura("#ff9a3c", "#7a2d8f", true, 0);
MINIS.c = miniatura("#6ee7a0", "#1f4d3a", true, 2);

// La tarjeta en pantalla: centro (x, y), alto h. op: { al, brillo (0..1 halo naranja), color, mini, borde, giro }.
export function tarjeta2D(g, x, y, h, op = {}) {
  const w = h * (TW / TH), r = h * 0.05, al = op.al ?? 1;
  if (al <= 0.003 || h < 2) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(op.giro || 0);
  if (op.brillo) { g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 0, h * 1.25, op.color || NARANJA, op.brillo); g.globalCompositeOperation = "source-over"; }
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = h * 0.06; g.shadowOffsetY = h * 0.02;
  redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = "#000"; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  g.save(); redondo(g, -w / 2, -h / 2, w, h, r); g.clip(); g.drawImage(op.mini || MINIS.tuyo, -w / 2, -h / 2, w, h);
  if (op.apagada) { g.fillStyle = `rgba(8,10,24,${0.75 * op.apagada})`; g.fillRect(-w / 2, -h / 2, w, h); }
  const rg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); rg.addColorStop(0.15, "rgba(255,255,255,0)"); rg.addColorStop(0.28, "rgba(255,255,255,0.14)"); rg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(-w / 2, -h / 2, w, h); g.restore();
  redondo(g, -w / 2, -h / 2, w, h, r); g.lineWidth = Math.max(2, h * 0.008); g.strokeStyle = `rgba(${op.color || NARANJA},${op.borde ?? 0.9})`; g.stroke();
  g.restore();
}
// La tarjeta en el mundo (de cara a la cámara), con el centro de su base en P y alto en unidades.
export function tarjeta(g, cam, P, alto, op = {}) {
  const p = k.proyecta(cam, P);
  if (!p) return null;
  const h = k.tamano(alto, p.z);
  tarjeta2D(g, p.x, p.y - h / 2, h, op);
  return { x: p.x, y: p.y - h / 2, h, w: h * (TW / TH), z: p.z };
}

// ---------------------------------------------------------------- tú, y tus seguidores
// op.pose: "dueno" (mirando el móvil), "camina" o "trofeo"; op.mezcla: { pose, u } para pasar de una a otra sin salto
export function dueno(g, cam, P, alto = 1.85, op = {}) {
  const pose = op.pose || "dueno";
  if (op.mezcla && op.mezcla.u > 0.003 && op.mezcla.u < 0.997) {
    const a = cartel(g, cam, P, alto, IMG[pose], IMG_OSCURA[pose], op.luz ?? 1, { ...op, al: (op.al ?? 1) * (1 - op.mezcla.u) });
    cartel(g, cam, P, alto, IMG[op.mezcla.pose], IMG_OSCURA[op.mezcla.pose], op.luz ?? 1, { ...op, al: (op.al ?? 1) * op.mezcla.u });
    return a;
  }
  const q = op.mezcla && op.mezcla.u >= 0.997 ? op.mezcla.pose : pose;
  return cartel(g, cam, P, alto, IMG[q], IMG_OSCURA[q], op.luz ?? 1, op);
}
// el banco de los seguidores: la imagen de los cuatro, con su luz naranja (luz 0..1)
export function banco(g, cam, P, luz = 1, alto = 2.2) {
  const r = cartel(g, cam, P, alto, IMG.amigos, IMG_OSCURA.amigos, luz);
  if (r && !r.fuera && luz > 0.01) { g.globalCompositeOperation = "lighter"; k.brillo(g, r.x, r.y - r.h * 0.5, r.w * 1.4, NARANJA, 0.35 * luz); g.globalCompositeOperation = "source-over"; }
  return r;
}
export const BANCO = [R0 - 4.2, 0, 2.5];   // a la derecha de la pista

// ---------------------------------------------------------------- el cielo de noche y el suelo de fuera
const CIELO = lienzo(1080, 1920);
{ const c = CIELO.getContext("2d"); const gr = c.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, "#04040c"); gr.addColorStop(0.6, "#070a1c"); gr.addColorStop(1, "#0b0e26"); c.fillStyle = gr; c.fillRect(0, 0, 1080, 1920);
  const az = azar(77); for (let i = 0; i < 260; i++) { const x = az() * 1080, y = az() * 1920, r = 0.6 + az() * 1.4; c.fillStyle = `rgba(255,255,255,${0.25 + az() * 0.6})`; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); }
  c.globalCompositeOperation = "lighter"; k.brillo(c, 300, 500, 1400, "60,70,140", 0.25); k.brillo(c, 900, 1500, 1200, "90,50,120", 0.2); }
export function cielo(g, al = 1) { g.save(); g.globalAlpha = al; g.drawImage(CIELO, 0, 0); g.restore(); }

// ---------------------------------------------------------------- utilidades de luz por filas
// Una ola: filas hasta `frente` encendidas en un sector de media anchura `ancho` (radianes), con el borde suave.
export const ola = (frente, ancho = Math.PI, suaveF = 1.2) => (r, a) => {
  if (Math.abs(a) > ancho) return 0;
  const d = frente - r;
  return d >= suaveF ? 1 : d <= 0 ? 0 : d / suaveF;
};
export const nada = () => 0;
export const todo = () => 1;
