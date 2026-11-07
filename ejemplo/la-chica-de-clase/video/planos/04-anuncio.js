// «Y con los anuncios pasa igual, porque cuantas más veces ves uno en una esquina mientras lees otra cosa, más te gusta,
// aunque ni te acuerdes de haberlo visto.»
// Otro sitio: una tablet grande con un artículo. Se entra con un corte en «Y».
// - «anuncios»: en la esquina de arriba sale un anuncio de limonada; «pasa igual»: lo cambia otro anuncio.
// - «cuantas más veces ves uno»: la limonada vuelve una y otra vez, entre otros anuncios, cada vez un poco más luminosa.
// - «mientras lees otra cosa»: el artículo baja y la línea que se lee va resaltada: los ojos están en el texto.
// - «más te gusta»: el anuncio de limonada brilla, cálido.
// - «aunque ni te acuerdes»: la tablet se apaga y el anuncio se va con ella; queda flotando su brillo amarillo.
// Se corta en «Pues».
import * as k from "#kit";
import { v } from "#voz";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar, redondo } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tanun = f7.t("anuncios"), Tigual = f7.t("igual"), Tcuan = f7.t("cuantas"), Tves = f7.t("ves"), Tesq = f7.t("esquina"), Tlees = f7.t("lees"), Tgusta = f7.t("gusta"), Tacu = f7.t("acuerdes"), Tvisto = f7.t("visto"), Fin = f7.fin;
const AMARILLO = "255,214,60";

// los anuncios que van pasando por la esquina: [cuándo entra, cuál]; «lim» es la limonada
const TURNOS = [[Tanun - 0.1, "lim"], [Tigual - 0.05, "coche"], [Tcuan - 0.1, "lim"], [Tcuan + 0.38, "banco"], [Tves - 0.2, "lim"], [Tesq - 0.25, "moda"], [Tesq + 0.3, "lim"]];
export const salidasLimonada = TURNOS.filter(([, c]) => c === "lim").map(([tt]) => tt);
const turno = (t) => { let r = null; for (const x of TURNOS) if (t >= x[0]) r = x; return r; };

// los anuncios, dibujados una vez (380 × 200)
const AW = 380, AH = 200;
function anuncio(nombre) {
  const cv = k.lienzo(AW, AH), g = cv.getContext("2d");
  if (nombre === "lim") {
    const bg = g.createLinearGradient(0, 0, AW, AH); bg.addColorStop(0, "#ffe46b"); bg.addColorStop(1, "#ffb21e"); g.fillStyle = bg; g.fillRect(0, 0, AW, AH);
    // un vaso de limonada con su pajita y dos rodajas de limón
    g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.moveTo(70, 40); g.lineTo(150, 40); g.lineTo(140, 180); g.lineTo(80, 180); g.closePath(); g.fill();
    g.fillStyle = "#fff6b0"; g.beginPath(); g.moveTo(74, 70); g.lineTo(146, 70); g.lineTo(140, 176); g.lineTo(80, 176); g.closePath(); g.fill();
    g.strokeStyle = "#e8432e"; g.lineWidth = 7; g.beginPath(); g.moveTo(125, 60); g.lineTo(150, 14); g.stroke();
    for (const [x, y, r] of [[250, 80, 46], [320, 135, 38]]) { g.fillStyle = "#f7d21c"; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); g.fillStyle = "#fff4a8"; g.beginPath(); g.arc(x, y, r * 0.82, 0, 6.2832); g.fill(); g.strokeStyle = "#f2c200"; g.lineWidth = 3; for (let a = 0; a < 8; a++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a * 0.785) * r * 0.8, y + Math.sin(a * 0.785) * r * 0.8); g.stroke(); } }
  } else if (nombre === "coche") {
    g.fillStyle = "#1f3b73"; g.fillRect(0, 0, AW, AH); g.fillStyle = "#d8dde6"; redondo(g, 80, 100, 220, 50, 20); g.fill(); g.beginPath(); g.moveTo(130, 102); g.quadraticCurveTo(190, 60, 250, 102); g.fill(); g.fillStyle = "#111"; for (const x of [120, 260]) { g.beginPath(); g.arc(x, 150, 20, 0, 6.2832); g.fill(); }
  } else if (nombre === "banco") {
    g.fillStyle = "#0f6b5a"; g.fillRect(0, 0, AW, AH); g.fillStyle = "#e9f5ef"; redondo(g, 110, 50, 160, 100, 14); g.fill(); g.fillStyle = "#0f6b5a"; g.fillRect(110, 75, 160, 18);
  } else {
    g.fillStyle = "#b03a6b"; g.fillRect(0, 0, AW, AH); g.fillStyle = "#ffd6e6"; g.beginPath(); g.moveTo(190, 30); g.lineTo(250, 70); g.lineTo(230, 180); g.lineTo(150, 180); g.lineTo(130, 70); g.closePath(); g.fill();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.15; g.drawImage(k.manchas, 0, 0, AW, AH);
  return cv;
}
const ANUNCIOS = { lim: anuncio("lim"), coche: anuncio("coche"), banco: anuncio("banco"), moda: anuncio("moda") };

// el artículo: un título, una foto y párrafos (en un lienzo alto que baja)
const ART = (() => {
  const cv = k.lienzo(760, 3000), g = cv.getContext("2d"), az = azar(77);
  g.fillStyle = "#fbfaf7"; g.fillRect(0, 0, 760, 3000);
  g.fillStyle = "#1c1c22"; for (let i = 0; i < 2; i++) redondo(g, 40, 40 + i * 64, i ? 420 : 640, 44, 10), g.fill();
  let y = 190;
  for (let p = 0; p < 9; p++) {
    if (p === 2 || p === 6) { const fg = g.createLinearGradient(0, y, 0, y + 300); fg.addColorStop(0, "#9ec9e8"); fg.addColorStop(1, "#d9c49a"); g.fillStyle = fg; redondo(g, 40, y, 680, 300, 18); g.fill(); y += 340; continue; }
    const n = 4 + Math.floor(az() * 3);
    for (let l = 0; l < n; l++) { g.fillStyle = "#9a9aa4"; redondo(g, 40, y, l === n - 1 ? 300 + az() * 200 : 640 + az() * 40, 18, 9); g.fill(); y += 40; }
    y += 36;
  }
  return cv;
})();

const BOKEH = k.lienzo(1080, 1920);
{ const g = BOKEH.getContext("2d"), az = azar(5); g.fillStyle = "#0d0b14"; g.fillRect(0, 0, 1080, 1920); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 14; i++) k.brillo(g, az() * 1080, az() * 1920, 300 + az() * 300, ["255,200,120", "120,170,255", "255,140,200"][i % 3], 0.18); }

const W = 860, H = 1240, SW = W - 50, SH = H - 50;
export function dibuja(g, t) {
  g.drawImage(BOKEH, 0, 0);
  const apaga = su(tr(t, Tacu - 0.25, Tacu + 0.35));
  const esc = mez(1.12, 1.04, su(tr(t, Tacu - 0.3, Fin))), Y = 1150, XC = 470;
  g.save(); g.translate(XC, Y); g.scale(esc, esc); g.rotate(-0.025);
  // la tablet: el marco de metal y la pantalla
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 80; g.shadowOffsetY = 40; redondo(g, -W / 2, -H / 2, W, H, 70); g.fillStyle = "#1a1a1e"; g.fill(); g.restore();
  redondo(g, -W / 2, -H / 2, W, H, 70); k.metal(g, -W / 2, W / 2, ["#2c2e34", "#9ea3ac", "#4a4d55", "#c7cbd2", "#26282d"]);
  g.save(); redondo(g, -SW / 2, -SH / 2, SW, SH, 48); g.clip();
  // el artículo, que baja mientras se lee
  const scroll = mez(0, 900, su(tr(t, T0, Tacu)));
  g.drawImage(ART, -SW / 2, -SH / 2 + 250 - scroll, SW, SW * (3000 / 760));
  // la línea que se lee, resaltada (los ojos están en el texto)
  const ly = mez(-60, 260, tr(t, Tcuan, Tacu)) + Math.sin(t * 2) * 6;
  g.fillStyle = "rgba(90,160,255,0.22)"; g.fillRect(-SW / 2 + 30, ly, SW - 60, 38);
  // la barra de arriba de la web, con el hueco del anuncio a la derecha
  g.fillStyle = "#ffffff"; g.fillRect(-SW / 2, -SH / 2, SW, 270);
  g.fillStyle = "#e9e9ee"; g.fillRect(-SW / 2, -SH / 2 + 268, SW, 3);
  g.fillStyle = "#26262e"; redondo(g, -SW / 2 + 40, -SH / 2 + 110, 200, 40, 10); g.fill();
  // el anuncio de la esquina
  const tu = turno(t);
  if (tu) {
    const [ti, cual] = tu, u = k.entra(tr(t, ti, ti + 0.18));
    const ax = SW / 2 - 40 - AW / 2, ay = -SH / 2 + 135;
    const veces = salidasLimonada.filter((x) => x <= t).length;
    const brillo = cual === "lim" ? mez(0.15, 0.6, (veces - 1) / 3) + 0.5 * su(tr(t, Tgusta - 0.25, Tgusta + 0.3)) : 0;
    if (brillo > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, ax, ay, 520 + 200 * brillo, AMARILLO, brillo); g.restore(); }
    g.save(); g.globalAlpha = u; g.translate(ax, ay + (1 - u) * -40); const sc = cual === "lim" ? 1 + 0.08 * su(tr(t, Tgusta - 0.2, Tgusta + 0.3)) : 1; g.scale(sc, sc);
    g.drawImage(ANUNCIOS[cual], -AW / 2, -AH / 2); g.strokeStyle = "rgba(0,0,0,0.15)"; g.lineWidth = 2; g.strokeRect(-AW / 2, -AH / 2, AW, AH);
    g.restore();
  }
  // se apaga la pantalla
  if (apaga > 0) { g.fillStyle = `rgba(4,4,8,${apaga})`; g.fillRect(-SW / 2, -SH / 2, SW, SH); }
  g.restore();
  g.restore();
  // lo que queda: el brillo amarillo, flotando donde estaba el anuncio
  if (apaga > 0) {
    const sube = su(tr(t, Tacu, Fin + 0.3));
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, XC + (SW / 2 - 40 - AW / 2) * esc, Y + (-SH / 2 + 135) * esc - 120 * sube, 700, AMARILLO, 0.75 * apaga * (1 - 0.3 * sube));
    g.restore();
  }
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(8,6,12,0.55)"); vg.addColorStop(1, "rgba(8,6,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { turnos: TURNOS.map(([tt]) => tt), gusta: Tgusta - 0.25, apaga: Tacu - 0.25 };
