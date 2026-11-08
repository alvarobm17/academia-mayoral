/* =========================================================================
   Academia Mayoral — avatares coleccionables, títulos y fondos del perfil
   · 12 criaturas en SVG con 4 fases: huevo → cría → adulto → legendario.
   · La fase depende de la liga más alta alcanzada en el mes en curso:
       Bronce/Plata = huevo · Oro = cría · Zafiro = adulto · Diamante = legendario
   · Los avatares se consiguen abriendo cofres (ver api/profile.php).
   IMPORTANTE: si añades criaturas, títulos o fondos, añádelos también en api/lib.php.
   ========================================================================= */
(function () {
  "use strict";
  var AM = (window.AM = window.AM || {});

  var PHASES = ["Huevo", "Cría", "Adulto", "Legendario"];
  var RARITY = { comun: { name: "Común", color: "#8FA3B8" }, rara: { name: "Rara", color: "#3B82F6" }, epica: { name: "Épica", color: "#A855F7" } };

  /* ---------- Piezas comunes ---------- */
  function eyes(st, big) {
    var r = big ? 9 : 6.5, pr = big ? 5.2 : 3.6, y = 54, out = "";
    [39, 61].forEach(function (x) {
      if (st === "dark") {
        out += '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 1) + '" fill="#141826"/><circle cx="' + (x + 2) + '" cy="' + (y - 2) + '" r="' + (big ? 2.4 : 1.6) + '" fill="#fff"/>';
      } else if (st === "slit") {
        out += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r - .5) + '" fill="#FDE047" stroke="#1f2937" stroke-width="1.2"/><ellipse cx="' + x + '" cy="' + y + '" rx="' + (big ? 2.2 : 1.5) + '" ry="' + (r - 1.5) + '" fill="#141826"/>';
      } else {
        out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" stroke="#1f2937" stroke-width="1.2"/><circle cx="' + (x + .8) + '" cy="' + (y + .6) + '" r="' + pr + '" fill="#141826"/><circle cx="' + (x + 2.4) + '" cy="' + (y - 1.6) + '" r="' + (big ? 2.2 : 1.4) + '" fill="#fff"/>';
        if (big) out += '<circle cx="' + (x - 1.8) + '" cy="' + (y + 2.6) + '" r="1" fill="#fff"/>';
        if (st === "lash") out += '<path d="M' + (x - 6) + " " + (y - 5) + " l-3 -3 M" + (x - 2) + " " + (y - 7) + " l-1.5 -3.5 M" + (x + 3) + " " + (y - 7) + ' l1.5 -3.5" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>';
      }
    });
    return out;
  }
  function head(p, h) { return '<ellipse cx="50" cy="' + (h.cy || 58) + '" rx="' + (h.rx || 28) + '" ry="' + (h.ry || 26) + '" fill="' + p.c1 + '" stroke="' + p.o + '" stroke-width="2.2"/>'; }
  function muzzle(p, m) { return m ? '<ellipse cx="50" cy="' + (m.cy || 70) + '" rx="' + (m.rx || 15) + '" ry="' + (m.ry || 10) + '" fill="' + p.c2 + '"/>' : ""; }
  function nostrils(y) { return '<ellipse cx="46" cy="' + y + '" rx="1.6" ry="1.1" fill="#1f2937"/><ellipse cx="54" cy="' + y + '" rx="1.6" ry="1.1" fill="#1f2937"/>'; }
  function smile(y, w) { w = w || 6; return '<path d="M' + (50 - w) + " " + y + " Q50 " + (y + w * .8) + " " + (50 + w) + " " + y + '" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/>'; }
  function teeth(y, n, w) {
    var s = "", step = (w * 2) / n;
    for (var i = 0; i < n; i++) { var x = 50 - w + i * step; s += '<path d="M' + x + " " + y + " l" + step / 2 + " 4 l" + step / 2 + ' -4" fill="#fff" stroke="#1f2937" stroke-width=".8"/>'; }
    return '<path d="M' + (50 - w) + " " + y + " L" + (50 + w) + " " + y + '" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>' + s;
  }
  function mirror(path) { return '<g transform="translate(100 0) scale(-1 1)">' + path + "</g>"; }

  /* ---------- Las 12 criaturas ---------- */
  var C = [
    {
      id: "leon", name: "León", rarity: "comun", egg: "zigzag",
      p: { c1: "#E8A33D", c2: "#F8DDA8", c3: "#A0522D", o: "#7A4614" },
      back: function (p) {
        var s = ""; for (var a = 0; a < 360; a += 30) s += '<ellipse cx="50" cy="28" rx="12" ry="15" fill="' + p.c3 + '" stroke="' + p.o + '" stroke-width="1.5" transform="rotate(' + a + ' 50 58)"/>';
        return s + '<circle cx="31" cy="38" r="8" fill="' + p.c1 + '" stroke="' + p.o + '" stroke-width="2"/><circle cx="69" cy="38" r="8" fill="' + p.c1 + '" stroke="' + p.o + '" stroke-width="2"/><circle cx="31" cy="38" r="4" fill="' + p.c2 + '"/><circle cx="69" cy="38" r="4" fill="' + p.c2 + '"/>';
      },
      muzzle: { cy: 70, rx: 15, ry: 10 },
      front: function () { return '<path d="M45 64 L55 64 L50 70 Z" fill="#6B3A12"/>' + '<path d="M50 70 q-4 5 -8 2 M50 70 q4 5 8 2" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/><circle cx="40" cy="71" r=".9" fill="#6B3A12"/><circle cx="60" cy="71" r=".9" fill="#6B3A12"/>'; }
    },
    {
      id: "lobo", name: "Lobo", rarity: "comun", egg: "stripes",
      p: { c1: "#8E9AAF", c2: "#EEF0F5", c3: "#5C677D", o: "#3A4252" },
      back: function (p) { var ear = '<polygon points="25,46 29,12 47,34" fill="' + p.c1 + '" stroke="' + p.o + '" stroke-width="2" stroke-linejoin="round"/><polygon points="30,40 32,20 42,33" fill="' + p.c3 + '"/>'; return ear + mirror(ear); },
      mid: function (p) { return '<path d="M30 52 Q50 40 70 52 L70 66 Q50 58 30 66 Z" fill="' + p.c3 + '" opacity=".35"/>'; },
      muzzle: { cy: 71, rx: 14, ry: 12 },
      front: function () { return '<ellipse cx="50" cy="65" rx="5.5" ry="3.8" fill="#1f2937"/><path d="M50 69 L50 74 M50 74 q-4 3 -7 1 M50 74 q4 3 7 1" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>'; }
    },
    {
      id: "buho", name: "Búho", rarity: "comun", egg: "spots",
      p: { c1: "#9C6B3E", c2: "#F1DEC0", c3: "#6B4423", o: "#4A2E15" },
      back: function (p) { var t = '<polygon points="28,42 22,16 42,34" fill="' + p.c3 + '" stroke="' + p.o + '" stroke-width="2" stroke-linejoin="round"/>'; return t + mirror(t); },
      head: { rx: 29, ry: 28, cy: 58 },
      mid: function (p) { return '<circle cx="39" cy="54" r="12" fill="' + p.c2 + '"/><circle cx="61" cy="54" r="12" fill="' + p.c2 + '"/><path d="M34 76 q4 4 8 0 M46 79 q4 4 8 0 M58 76 q4 4 8 0" fill="none" stroke="' + p.c3 + '" stroke-width="1.6" stroke-linecap="round"/>'; },
      front: function () { return '<path d="M45 62 L55 62 L50 71 Z" fill="#F2A93B" stroke="#9A5B10" stroke-width="1.2" stroke-linejoin="round"/>'; }
    },
    {
      id: "tiburon", name: "Tiburón", rarity: "comun", egg: "waves", eyes: "dark",
      p: { c1: "#5B8DB8", c2: "#EAF3FA", c3: "#3E6A91", o: "#264B6B" },
      back: function (p) { return '<path d="M42 36 Q52 18 60 4 Q62 22 66 36 Z" fill="' + p.c3 + '" stroke="' + p.o + '" stroke-width="2" stroke-linejoin="round"/>'; },
      mid: function (p) { return '<path d="M24 64 Q50 92 76 64 Q76 84 50 84 Q24 84 24 64 Z" fill="' + p.c2 + '"/><path d="M25 52 q3 4 0 8 M28 50 q3 5 0 10 M75 52 q-3 4 0 8 M72 50 q-3 5 0 10" fill="none" stroke="' + p.o + '" stroke-width="1.4"/>'; },
      front: function () { return teeth(68, 6, 13); }
    },
    {
      id: "cobra", name: "Cobra", rarity: "comun", egg: "scales", eyes: "slit",
      p: { c1: "#4CAF50", c2: "#C5E1A5", c3: "#2E7D32", o: "#1B5E20" },
      back: function (p) { return '<ellipse cx="50" cy="54" rx="42" ry="36" fill="' + p.c3 + '" stroke="' + p.o + '" stroke-width="2"/><ellipse cx="22" cy="54" rx="7" ry="10" fill="#FBC02D" opacity=".85"/><ellipse cx="78" cy="54" rx="7" ry="10" fill="#FBC02D" opacity=".85"/>'; },
      head: { rx: 22, ry: 25, cy: 58 },
      mid: function (p) { return '<path d="M38 40 q4 -3 8 0 M54 40 q4 -3 8 0 M44 46 q6 -3 12 0" fill="none" stroke="' + p.c3 + '" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="50" cy="72" rx="12" ry="9" fill="' + p.c2 + '"/>'; },
      front: function () { return nostrils(66) + '<path d="M50 76 L50 86 M50 86 l-3 4 M50 86 l3 4" fill="none" stroke="#E53935" stroke-width="2" stroke-linecap="round"/>'; }
    },
    {
      id: "trex", name: "T-Rex", rarity: "rara", egg: "spots",
      p: { c1: "#7CB342", c2: "#DCEDC8", c3: "#558B2F", o: "#33691E" },
      back: function (p) { return '<polygon points="38,36 42,24 46,34" fill="' + p.c3 + '"/><polygon points="46,33 50,20 54,33" fill="' + p.c3 + '"/><polygon points="54,34 58,24 62,36" fill="' + p.c3 + '"/>'; },
      head: { rx: 30, ry: 26, cy: 58 },
      mid: function (p) { return '<path d="M32 47 q7 -5 14 0 M54 47 q7 -5 14 0" fill="none" stroke="' + p.o + '" stroke-width="2.4" stroke-linecap="round"/><circle cx="32" cy="66" r="2.4" fill="' + p.c3 + '"/><circle cx="68" cy="64" r="2" fill="' + p.c3 + '"/>'; },
      muzzle: { cy: 72, rx: 21, ry: 11 },
      front: function () { return nostrils(66) + teeth(73, 8, 17); }
    },
    {
      id: "triceratops", name: "Tricératops", rarity: "rara", egg: "stripes",
      p: { c1: "#E07B53", c2: "#F7D2C2", c3: "#F4A261", o: "#9A3F22" },
      back: function (p) {
        var s = '<ellipse cx="50" cy="44" rx="45" ry="34" fill="' + p.c3 + '" stroke="' + p.o + '" stroke-width="2"/>';
        for (var a = -70; a <= 70; a += 28) s += '<circle cx="50" cy="13" r="4" fill="' + p.o + '" opacity=".55" transform="rotate(' + a + ' 50 44)"/>';
        return s;
      },
      muzzle: { cy: 71, rx: 14, ry: 10 },
      front: function (p) {
        var horn = '<path d="M35 46 Q26 30 30 14 Q38 30 42 44 Z" fill="#FFF3E0" stroke="' + p.o + '" stroke-width="1.6" stroke-linejoin="round"/>';
        return horn + mirror(horn) + '<path d="M46 66 Q50 54 54 66 Z" fill="#FFF3E0" stroke="' + p.o + '" stroke-width="1.4"/>' + smile(74, 5);
      }
    },
    {
      id: "kraken", name: "Kraken", rarity: "rara", egg: "waves",
      p: { c1: "#8E44AD", c2: "#D7BDE2", c3: "#6C3483", o: "#4A235A" },
      back: function (p) {
        var t = function (d) { return '<path d="' + d + '" fill="none" stroke="' + p.c1 + '" stroke-width="9" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + p.c2 + '" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>'; };
        return t("M32 76 Q18 86 22 98") + t("M42 80 Q36 94 44 100") + t("M58 80 Q64 94 56 100") + t("M68 76 Q82 86 78 98");
      },
      head: { rx: 27, ry: 32, cy: 52 },
      mid: function (p) { return '<circle cx="36" cy="34" r="3" fill="' + p.c2 + '"/><circle cx="62" cy="30" r="2.4" fill="' + p.c2 + '"/><circle cx="56" cy="40" r="1.8" fill="' + p.c2 + '"/>'; },
      front: function () { return smile(70, 5); }
    },
    {
      id: "unicornio", name: "Unicornio", rarity: "rara", egg: "stars", eyes: "lash",
      p: { c1: "#F5F0FF", c2: "#FFFFFF", c3: "#F48FB1", o: "#9C8BB8" },
      back: function (p) {
        var ear = '<polygon points="30,42 30,22 42,36" fill="' + p.c1 + '" stroke="' + p.o + '" stroke-width="2" stroke-linejoin="round"/>';
        return ear + mirror(ear) + '<path d="M70 34 Q86 46 80 70 Q74 56 66 46 Z" fill="#81D4FA"/><path d="M66 32 Q84 38 84 58 Q74 46 62 40 Z" fill="' + p.c3 + '"/>';
      },
      muzzle: { cy: 71, rx: 14, ry: 10 },
      front: function (p) {
        return '<path d="M50 4 L44 34 L56 34 Z" fill="#FFD54F" stroke="#C9A227" stroke-width="1.4" stroke-linejoin="round"/><path d="M46 26 L54 22 M45 31 L55 27 M48 16 L52 14" stroke="#C9A227" stroke-width="1.3"/>' +
          '<path d="M38 38 Q46 30 54 38 Q48 34 42 42 Z" fill="' + p.c3 + '"/>' + nostrils(70) + '<circle cx="34" cy="64" r="3" fill="#F8BBD0"/><circle cx="66" cy="64" r="3" fill="#F8BBD0"/>';
      }
    },
    {
      id: "dragon", name: "Dragón", rarity: "epica", egg: "scales",
      p: { c1: "#E53935", c2: "#FFCDD2", c3: "#B71C1C", o: "#7F1010" },
      back: function (p) {
        var horn = '<path d="M36 40 Q20 26 24 6 Q32 22 44 34 Z" fill="#FFE082" stroke="#B8860B" stroke-width="1.6" stroke-linejoin="round"/><polygon points="22,58 8,50 22,48" fill="' + p.c3 + '"/>';
        return horn + mirror(horn) + '<polygon points="46,34 50,24 54,34" fill="' + p.c3 + '"/>';
      },
      mid: function (p) { return '<path d="M40 40 q3 -3 6 0 M54 40 q3 -3 6 0 M47 36 q3 -3 6 0" fill="none" stroke="' + p.c3 + '" stroke-width="1.5"/><path d="M31 47 L46 50 M69 47 L54 50" stroke="' + p.o + '" stroke-width="2.4" stroke-linecap="round"/>'; },
      muzzle: { cy: 71, rx: 17, ry: 11 },
      front: function () { return nostrils(67) + '<path d="M38 74 Q50 80 62 74" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/><path d="M42 75 l2 4 l2 -3.5 M58 75 l-2 4 l-2 -3.5" fill="#fff" stroke="#1f2937" stroke-width=".8"/>'; }
    },
    {
      id: "sirena", name: "Sirena", rarity: "epica", egg: "waves", eyes: "lash",
      p: { c1: "#F5CBA7", c2: "#F5CBA7", c3: "#26A69A", o: "#B9805A" },
      back: function (p) { return '<path d="M50 24 C20 24 16 50 18 100 L82 100 C84 50 80 24 50 24 Z" fill="' + p.c3 + '"/><path d="M22 60 L10 52 L14 66 Z M78 60 L90 52 L86 66 Z" fill="#4DD0E1"/>'; },
      head: { rx: 25, ry: 27, cy: 58 },
      front: function (p) {
        return '<path d="M26 52 C26 32 74 32 74 52 C66 40 52 38 44 44 C38 40 30 44 26 52 Z" fill="' + p.c3 + '"/>' +
          '<path d="M66 32 l2.5 5 5.5 .8 -4 3.8 1 5.4 -5 -2.6 -5 2.6 1 -5.4 -4 -3.8 5.5 -.8 Z" fill="#FFB74D" stroke="#E08E0B" stroke-width=".8"/>' +
          '<circle cx="35" cy="66" r="3.5" fill="#F8A5A5" opacity=".7"/><circle cx="65" cy="66" r="3.5" fill="#F8A5A5" opacity=".7"/><path d="M49 62 q1 2 2 0" fill="none" stroke="' + p.o + '" stroke-width="1.2"/>' + smile(70, 5);
      }
    },
    {
      id: "fenix", name: "Fénix", rarity: "epica", egg: "stars",
      p: { c1: "#FF7043", c2: "#FFE0B2", c3: "#FFB300", o: "#BF360C" },
      back: function (p) {
        var f = function (a, c) { return '<path d="M50 40 C40 30 42 12 50 2 C58 12 60 30 50 40 Z" fill="' + c + '" stroke="' + p.o + '" stroke-width="1.4" transform="rotate(' + a + ' 50 40)"/>'; };
        return f(-38, "#FF3D00") + f(38, "#FF3D00") + f(-18, p.c3) + f(18, p.c3) + f(0, "#FFEB3B");
      },
      mid: function (p) { return '<path d="M30 70 q6 6 4 12 q4 -4 8 -2 M70 70 q-6 6 -4 12 q-4 -4 -8 -2" fill="' + p.c3 + '" stroke="' + p.o + '" stroke-width="1"/><path d="M32 50 L44 52 M68 50 L56 52" stroke="' + p.o + '" stroke-width="2" stroke-linecap="round"/>'; },
      front: function () { return '<path d="M44 62 L56 62 L50 74 Z" fill="#FFD54F" stroke="#B8860B" stroke-width="1.3" stroke-linejoin="round"/>'; }
    }
  ];
  var BY_ID = {}; C.forEach(function (c) { BY_ID[c.id] = c; });

  /* ---------- Huevo con el dibujo de su criatura ---------- */
  function eggPattern(c) {
    var p = c.p, k = p.c3, s = "";
    if (c.egg === "spots") s = '<circle cx="38" cy="40" r="6" fill="' + k + '"/><circle cx="62" cy="52" r="8" fill="' + k + '"/><circle cx="42" cy="72" r="7" fill="' + k + '"/><circle cx="66" cy="78" r="4" fill="' + k + '"/><circle cx="54" cy="26" r="4" fill="' + k + '"/>';
    if (c.egg === "stripes") s = '<path d="M20 48 Q50 40 80 48 M17 64 Q50 56 83 64 M20 80 Q50 72 80 80" fill="none" stroke="' + k + '" stroke-width="6" stroke-linecap="round"/>';
    if (c.egg === "zigzag") s = '<path d="M18 58 L28 50 L38 58 L48 50 L58 58 L68 50 L78 58 L84 54" fill="none" stroke="' + k + '" stroke-width="6" stroke-linejoin="round"/><path d="M22 76 L32 70 L42 76 L52 70 L62 76 L72 70 L80 75" fill="none" stroke="' + k + '" stroke-width="4" stroke-linejoin="round"/>';
    if (c.egg === "scales") { for (var y = 32; y < 92; y += 12) for (var x = 24 + ((y / 12) % 2) * 6; x < 80; x += 12) s += '<path d="M' + (x - 5) + " " + y + " q5 7 10 0" + '" fill="none" stroke="' + k + '" stroke-width="2.4"/>'; }
    if (c.egg === "waves") s = '<path d="M18 46 q8 -6 16 0 t16 0 t16 0 t16 0 M16 62 q8 -6 16 0 t16 0 t16 0 t16 0 M18 78 q8 -6 16 0 t16 0 t16 0 t16 0" fill="none" stroke="' + k + '" stroke-width="3.5" stroke-linecap="round"/>';
    if (c.egg === "stars") ["34,40", "62,32", "58,64", "36,74", "70,82"].forEach(function (pt) { var q = pt.split(","); s += '<path d="M' + q[0] + " " + (q[1] - 6) + " l2 4.5 5 .5 -3.8 3.4 1.2 5 -4.4 -2.6 -4.4 2.6 1.2 -5 -3.8 -3.4 5 -.5 Z" + '" fill="' + k + '"/>'; });
    return s;
  }
  var EGG = "M50 8 C30 8 16 40 16 62 C16 84 32 96 50 96 C68 96 84 84 84 62 C84 40 70 8 50 8 Z";
  function egg(c, uid) {
    var p = c.p;
    return '<defs><clipPath id="eg' + uid + '"><path d="' + EGG + '"/></clipPath></defs><path d="' + EGG + '" fill="' + p.c2 + '" stroke="' + p.o + '" stroke-width="2.4"/>' +
      '<g clip-path="url(#eg' + uid + ')">' + eggPattern(c) + "</g>" + '<ellipse cx="36" cy="30" rx="6" ry="10" fill="#fff" opacity=".55" transform="rotate(-20 36 30)"/>';
  }

  /* ---------- Criatura completa ---------- */
  function creature(c, big) {
    var p = c.p, h = c.head || {};
    return (c.back ? c.back(p) : "") + head(p, h) + (c.mid ? c.mid(p) : "") + muzzle(p, c.muzzle) + eyes(c.eyes, big) +
      (c.front ? c.front(p) : "") + (big ? '<ellipse cx="33" cy="64" rx="4.5" ry="3" fill="#FF8A80" opacity=".55"/><ellipse cx="67" cy="64" rx="4.5" ry="3" fill="#FF8A80" opacity=".55"/>' : "");
  }
  function shell(c) {
    return '<path d="M12 80 L22 71 L31 81 L41 71 L50 81 L59 71 L69 81 L78 71 L88 80 C88 94 72 100 50 100 C28 100 12 94 12 80 Z" fill="' + c.p.c2 + '" stroke="' + c.p.o + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<circle cx="30" cy="90" r="3" fill="' + c.p.c3 + '"/><circle cx="64" cy="92" r="4" fill="' + c.p.c3 + '"/>';
  }
  function legendary(uid) {
    var rays = ""; for (var a = 0; a < 360; a += 30) rays += '<path d="M50 50 L47 0 L53 0 Z" fill="#FFE082" opacity=".45" transform="rotate(' + a + ' 50 50)"/>';
    return '<defs><radialGradient id="lg' + uid + '"><stop offset="0" stop-color="#FFF8E1"/><stop offset=".6" stop-color="#FFD54F" stop-opacity=".55"/><stop offset="1" stop-color="#FFB300" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#lg' + uid + ')"/>' + rays;
  }
  var CROWN = '<path d="M34 22 L36 8 L43 15 L50 4 L57 15 L64 8 L66 22 Z" fill="#FFD54F" stroke="#B8860B" stroke-width="1.6" stroke-linejoin="round"/><circle cx="50" cy="16" r="2.4" fill="#E53935"/><circle cx="41" cy="18" r="1.6" fill="#1E88E5"/><circle cx="59" cy="18" r="1.6" fill="#1E88E5"/>';
  function sparkle(x, y, s) { return '<path d="M' + x + " " + (y - s) + " Q" + x + " " + y + " " + (x + s) + " " + y + " Q" + x + " " + y + " " + x + " " + (y + s) + " Q" + x + " " + y + " " + (x - s) + " " + y + " Q" + x + " " + y + " " + x + " " + (y - s) + ' Z" fill="#FFF59D"/>'; }

  var uidN = 0;
  /* SVG de un avatar. phase: 0 huevo · 1 cría · 2 adulto · 3 legendario */
  function svg(id, phase, opts) {
    var c = BY_ID[id]; if (!c) return "";
    opts = opts || {}; phase = Math.max(0, Math.min(3, phase | 0));
    var uid = "a" + (++uidN), body;
    if (phase === 0) body = egg(c, uid);
    else if (phase === 1) body = '<g transform="translate(50 50) scale(.8) translate(-50 -46)">' + creature(c, true) + "</g>" + shell(c);
    else if (phase === 2) body = creature(c, false);
    else body = legendary(uid) + '<g transform="translate(50 54) scale(.86) translate(-50 -54)">' + creature(c, false) + "</g>" + CROWN + sparkle(14, 22, 6) + sparkle(86, 30, 5) + sparkle(84, 84, 4);
    var label = opts.title ? '<title>' + c.name + " · " + PHASES[phase] + "</title>" : "";
    return '<svg class="crit" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + c.name + " (" + PHASES[phase] + ')">' + label + body + "</svg>";
  }

  /* ---------- Fase según la liga máxima del mes ---------- */
  function phaseFor(monthLeague) { return monthLeague >= 4 ? 3 : monthLeague >= 3 ? 2 : monthLeague >= 2 ? 1 : 0; }

  /* ---------- Títulos (se desbloquean con los logros) ---------- */
  var TITLES = [
    { id: "iniciado", name: "Iniciado", req: "Disponible desde el principio", ok: function () { return true; } },
    { id: "aprendiz", name: "Aprendiz", req: "Consigue 3 logros", ok: function (a) { return a.length >= 3; } },
    { id: "explorador", name: "Explorador", req: "Logro «Explorador»: prueba los 6 tipos de juego", ok: function (a) { return a.indexOf("explorador") !== -1; } },
    { id: "sabio", name: "Sabio", req: "Consigue 6 logros", ok: function (a) { return a.length >= 6; } },
    { id: "maestro", name: "Maestro", req: "Consigue 10 logros", ok: function (a) { return a.length >= 10; } }
  ];

  /* ---------- Fondos del panel personal ---------- */
  var THEMES = [
    { id: "aurora", name: "Aurora", req: "Gratis", css: "linear-gradient(135deg,#0ea5a4 0%,#6366f1 55%,#a855f7 100%)" },
    { id: "oceano", name: "Océano", req: "Gratis", css: "linear-gradient(160deg,#0c4a6e 0%,#0284c7 50%,#67e8f9 100%)" },
    { id: "bosque", name: "Bosque", req: "Alcanza la Liga Oro", minLeague: 2, css: "linear-gradient(150deg,#14532d 0%,#15803d 50%,#a3e635 100%)" },
    { id: "atardecer", name: "Atardecer", req: "Alcanza la Liga Zafiro", minLeague: 3, css: "linear-gradient(160deg,#7c2d12 0%,#ea580c 45%,#fbbf24 100%)" },
    { id: "galaxia", name: "Galaxia", req: "Alcanza la Liga Diamante", minLeague: 4, css: "radial-gradient(circle at 20% 30%,rgba(255,255,255,.35) 0 1px,transparent 2px) 0 0/22px 22px,radial-gradient(circle at 70% 60%,rgba(255,255,255,.25) 0 1px,transparent 2px) 0 0/31px 31px,linear-gradient(135deg,#0f0c29 0%,#302b63 55%,#7c3aed 100%)" },
    { id: "sakura", name: "Sakura", req: "★ Exclusivo de Mayoral Plus", plus: true, css: "linear-gradient(150deg,#831843 0%,#db2777 45%,#fbcfe8 100%)" },
    { id: "dorado", name: "Dorado", req: "★ Exclusivo de Mayoral Plus", plus: true, css: "linear-gradient(135deg,#78350f 0%,#d97706 45%,#fde68a 100%)" }
  ];
  function themeUnlocked(t, u) { return !!u && (t.plus ? !!u.plus : (u.max_league || 0) >= (t.minLeague || 0)); }

  AM.AV = { list: C, byId: BY_ID, svg: svg, phaseFor: phaseFor, PHASES: PHASES, RARITY: RARITY, TITLES: TITLES, THEMES: THEMES, themeUnlocked: themeUnlocked };
})();
