/* =========================================================================
   Academia Mayoral — renderizado de páginas
   Cada página declara <body data-page="..."> y aquí se monta su contenido.
   ========================================================================= */
(function () {
  "use strict";
  var AM = window.AM, D = AM.DATA, $ = AM.$, $$ = AM.$$, esc = AM.esc;

  function loadContent(c, a) {
    var key = c + "-" + a;
    if (D.contentFiles.indexOf(key) === -1) return Promise.resolve();
    if (loadContent.cache[key]) return loadContent.cache[key];
    return (loadContent.cache[key] = new Promise(function (res) {
      var s = document.createElement("script");
      s.src = "assets/js/content/" + key + ".js?v=20261108b";
      s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    }));
  }
  loadContent.cache = {};
  function hasContent(c, a, t) { return !!AM.CONTENT[c + "/" + a + "/" + t]; }
  function topicXP(ct) { return ct.games.reduce(function (s, g) { return s + (g.base || 20); }, 0); }
  function completions() {
    return (AM.ready || Promise.resolve()).then(function () {
      if (!AM.user) return {};
      return AM.api("progress", "list").then(function (r) { return r.completions || {}; }).catch(function () { return {}; });
    });
  }
  function setTitle(t) { document.title = t + " · Academia Mayoral"; }
  function crumbs(list) {
    return '<nav class="crumbs" aria-label="Migas de pan"><a href="index.html">Inicio</a>' + list.map(function (l) { return l[1] ? '<span><a href="' + l[1] + '">' + esc(l[0]) + "</a></span>" : "<span>" + esc(l[0]) + "</span>"; }).join("") + "</nav>";
  }
  function notFound(root, msg) {
    root.innerHTML = '<section class="page-head"><div class="container"><h1>Vaya…</h1><p class="lead">' + msg + '</p><a class="btn btn-primary" href="index.html#cursos">Ver cursos</a></div></section>';
  }

  /* ---------- Tarjetas de asignatura (portada y curso) ---------- */
  function subjectCards(c) {
    return AM.subjectsFor(c).map(function (s) {
      var S = D.subjects[s], list = D.topics[c][s], note = D.notes[c + "/" + s];
      var meta = note ? "No se cursa" : list.length + " temas" + (D.contentFiles.indexOf(c + "-" + s) !== -1 ? " · 🎮" : "");
      return '<a class="subject-card reveal' + (note ? " is-soon" : "") + '" data-subject="' + s + '" data-glyph="' + esc(S.glyph) + '" href="asignatura.html?c=' + c + "&a=" + s + '">' +
        '<span class="ico" aria-hidden="true">' + S.ico + "</span><h3>" + esc(AM.cardName(s, c)) + "</h3><p>" + esc(AM.cardDesc(s, c)) + '</p><div class="meta"><span>' + meta + '</span><span class="go" aria-hidden="true">→</span></div></a>';
    }).join("");
  }

  /* ---------- Portada ---------- */
  function home() {
    var tabs = $("#courseTabs"), grid = $("#subjectGrid");
    if (!tabs || !grid) return;
    var cur = AM.currentCourse() || "3eso";
    function paint(c) {
      $$(".course-tab", tabs).forEach(function (b) { b.classList.toggle("active", b.dataset.c === c); b.setAttribute("aria-selected", b.dataset.c === c); });
      grid.innerHTML = subjectCards(c);
      grid.setAttribute("data-n", AM.subjectsFor(c).length);
      AM.reveal(grid);
      var link = $("#courseLink"); if (link) { link.href = "curso.html?c=" + c; link.textContent = "Ir a " + AM.course(c).name + " →"; }
    }
    tabs.innerHTML = D.courses.map(function (c) { return '<button class="course-tab" role="tab" data-c="' + c.id + '">' + c.name + "<small>" + c.age + "</small></button>"; }).join("");
    $$(".course-tab", tabs).forEach(function (b) { b.addEventListener("click", function () { AM.store.set("am_course", b.dataset.c); paint(b.dataset.c); }); });
    paint(cur);
  }

  /* ---------- Curso ---------- */
  function curso(root) {
    var c = AM.param("c") || AM.currentCourse() || "3eso", C = AM.course(c);
    if (!C) return notFound(root, "No encontramos ese curso.");
    AM.store.set("am_course", c);
    setTitle(C.name);
    var subs = AM.subjectsFor(c);
    var total = subs.reduce(function (n, s) { return n + D.topics[c][s].length; }, 0);
    root.innerHTML = '<section class="page-head"><div class="container">' + crumbs([[C.name]]) +
      '<span class="eyebrow">' + (C.stage === "ESO" ? "Educación Secundaria" : "Bachillerato") + " · " + C.age + "</span><h1>" + C.name + '</h1><p class="lead">Elige la asignatura que quieres repasar. Dentro encontrarás la presentación, el índice de temas y, en cada tema, teoría esquemática, vídeo, mapa mental y ejercicios-juego.</p>' +
      '<div class="stats-row"><span class="stat">' + subs.length + ' asignaturas</span><span class="stat">' + total + ' temas</span><span class="stat">🎮 Ejercicios que dan XP</span></div></div></section>' +
      '<section class="section" style="padding-top:0"><div class="container"><div class="subjects" data-n="' + subs.length + '">' + subjectCards(c) + "</div></div></section>";
    AM.reveal(root);
  }

  /* ---------- Asignatura ---------- */
  function asignatura(root) {
    var c = AM.param("c") || "3eso", a = AM.param("a"), C = AM.course(c), S = D.subjects[a];
    if (!C || !S || !D.topics[c][a]) return notFound(root, "No encontramos esa asignatura en " + (C ? C.name : "ese curso") + ".");
    document.body.setAttribute("data-subject", a);
    AM.store.set("am_course", c);
    setTitle(AM.cardName(a, c) + " " + C.name);
    var list = D.topics[c][a], note = D.notes[c + "/" + a];
    loadContent(c, a).then(function () { return completions(); }).then(function (done) {
      var ready = list.filter(function (t) { return hasContent(c, a, t.id); });
      var html = '<section class="page-head"><div class="container">' + crumbs([[C.name, "curso.html?c=" + c], [AM.cardName(a, c)]]) +
        '<div class="subject-hero"><div class="big-ico" aria-hidden="true">' + S.ico + '</div><div><span class="eyebrow">' + C.name + "</span><h1>" + esc(AM.subjectName(a, c)) + '</h1></div></div><p class="lead" style="margin-top:18px">' + D.intros[a] + "</p>" +
        '<div class="stats-row"><span class="stat">' + list.length + ' temas</span><span class="stat">' + ready.length + " desarrollados</span>" + (ready.length ? '<span class="stat">🎮 ' + ready.reduce(function (n, t) { return n + AM.CONTENT[c + "/" + a + "/" + t.id].games.length; }, 0) + " ejercicios-juego</span>" : "") + "</div></div></section>";
      if (note) {
        html += '<section class="section" style="padding-top:0"><div class="container"><div class="callout"><span class="ctitle">Aviso</span>' + note + '</div><a class="btn btn-primary" href="asignatura.html?c=2eso&a=' + a + '">Ver ' + S.name + " de 2º ESO</a></div></section>";
      } else {
        html += '<section class="section" style="padding-top:0"><div class="container"><h2 style="font-size:1.6rem">Índice de temas</h2><p class="muted">Toca un tema para ir a su explicación y sus ejercicios.</p><ol class="toc-list">' +
          list.map(function (t, i) {
            var key = c + "/" + a + "/" + t.id, ct = AM.CONTENT[key], st;
            if (ct) {
              var n = ct.games.filter(function (g) { return done[key + "/" + g.id] != null; }).length;
              st = n === ct.games.length ? '<span class="state done">✓ Completado</span>' : n ? '<span class="state ready">' + n + "/" + ct.games.length + "</span>" : '<span class="state ready">Disponible</span>';
            } else st = '<span class="state soon">Próximamente</span>';
            return '<li class="toc-item reveal"><a href="tema.html?c=' + c + "&a=" + a + "&t=" + t.id + '"><span class="num">' + (i + 1) + "</span><span><b>" + esc(t.title) + "</b><small>" + esc(t.desc || (ct ? ct.minutes + " min de lectura" : "En preparación")) + "</small></span>" + st + "</a></li>";
          }).join("") + "</ol>" +
          '<div class="premium-box reveal" style="margin-top:40px"><div><span class="plus-tag">★ PLUS</span><h3 style="margin-top:12px">Repaso general y apuntes completos de ' + esc(AM.cardName(a, c)) + " · " + C.name + '</h3><p class="muted">Un repaso de todo el curso, exámenes simulados con corrección y los apuntes en PDF de cada tema.</p><a class="btn btn-primary" href="plus.html" style="--b:var(--gold);color:var(--on-gold)">Descubrir Mayoral Plus</a></div><div class="premium-items">' +
          ["📚 Repaso general del curso", "🎯 Simulacros de examen", "📝 Apuntes completos en PDF", "🗺️ Guía de estudio por evaluaciones"].map(function (x) { return '<div class="premium-item">' + x + '<span class="lock">🔒</span></div>'; }).join("") + "</div></div></div></section>";
      }
      root.innerHTML = html;
      AM.reveal(root);
    });
  }

  /* ---------- Mapa mental (SVG) ---------- */
  function mindmap(m) {
    var W = 900, rowH = 46, pad = 30, left = [], right = [];
    m.branches.forEach(function (b, i) { (i % 2 === 0 ? left : right).push(b); });
    function sideH(list) { return list.reduce(function (h, b) { return h + Math.max(1, b.leaves.length) * rowH + 24; }, 0); }
    var H = Math.max(sideH(left), sideH(right)) + pad * 2;
    var w = function (t, min) { return Math.max(min || 0, t.length * 8.1 + 26); };
    var out = [], links = [];
    function node(x, y, t, cls, minW) {
      var bw = w(t, minW), bh = cls === "root" ? 54 : 36;
      out.push('<g class="mm-node ' + cls + '"><rect x="' + (x - bw / 2) + '" y="' + (y - bh / 2) + '" width="' + bw + '" height="' + bh + '" rx="' + (bh / 2) + '"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle">' + esc(t) + "</text></g>");
      return bw;
    }
    var cx = W / 2, cy = H / 2;
    function side(list, dir) {
      var y = (H - sideH(list)) / 2 + 12, bx = cx + dir * 200, lx = cx + dir * 340;
      list.forEach(function (b) {
        var h = Math.max(1, b.leaves.length) * rowH, by = y + h / 2;
        links.push('<path class="mm-link" d="M' + cx + " " + cy + " C" + (cx + dir * 120) + " " + cy + "," + (bx - dir * 100) + " " + by + "," + bx + " " + by + '"/>');
        node(bx, by, b.t, "branch", 130);
        b.leaves.forEach(function (l, k) {
          var ly = y + k * rowH + rowH / 2;
          links.push('<path class="mm-link" style="stroke-width:1.5;opacity:.7" d="M' + (bx + dir * 60) + " " + by + " C" + (bx + dir * 100) + " " + by + "," + (lx - dir * 90) + " " + ly + "," + (lx - dir * 70) + " " + ly + '"/>');
          node(lx + dir * 10, ly, l, "leaf", 140);
        });
        y += h + 24;
      });
    }
    side(left, -1); side(right, 1);
    node(cx, cy, m.root, "root", 190);
    var rootNode = out.pop();
    return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Mapa mental: ' + esc(m.root) + '">' + links.join("") + out.join("") + rootNode + "</svg>";
  }

  /* ---------- Tema ---------- */
  function tema(root) {
    var c = AM.param("c") || "3eso", a = AM.param("a"), t = AM.param("t"), C = AM.course(c), S = D.subjects[a];
    if (!C || !S || !D.topics[c][a]) return notFound(root, "No encontramos ese tema.");
    var list = D.topics[c][a], idx = -1, SN = AM.cardName(a, c);
    list.forEach(function (x, i) { if (x.id === t) idx = i; });
    if (idx < 0) return notFound(root, "No encontramos ese tema.");
    var T = list[idx], key = c + "/" + a + "/" + t;
    document.body.setAttribute("data-subject", a);
    setTitle(T.title + " · " + SN + " " + C.name);
    var prev = list[idx - 1], next = list[idx + 1];
    var pager = '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:24px">' +
      (prev ? '<a class="btn btn-ghost" href="tema.html?c=' + c + "&a=" + a + "&t=" + prev.id + '">← ' + esc(prev.title) + "</a>" : "<span></span>") +
      (next ? '<a class="btn btn-ghost" href="tema.html?c=' + c + "&a=" + a + "&t=" + next.id + '">' + esc(next.title) + " →</a>" : "") + "</div>";

    loadContent(c, a).then(function () { return completions(); }).then(function (done) {
      var ct = AM.CONTENT[key];
      var head = '<section class="page-head"><div class="container">' + crumbs([[C.name, "curso.html?c=" + c], [SN, "asignatura.html?c=" + c + "&a=" + a], ["Tema " + (idx + 1)]]) +
        '<span class="eyebrow">' + esc(SN) + " · Tema " + (idx + 1) + "</span><h1>" + esc(T.title) + "</h1>";
      if (!ct) {
        root.innerHTML = head + '<p class="lead">Estamos preparando este tema con su teoría, mapa mental y ejercicios-juego. Mientras tanto, prueba los temas ya disponibles.</p><a class="btn btn-primary" href="asignatura.html?c=' + c + "&a=" + a + '">Volver al índice</a>' + pager + "</div></section>";
        return;
      }
      var games = ct.games, xp = topicXP(ct);
      var nav = [["intro", "Introducción"]].concat(ct.sections.map(function (s) { return [s.id, s.title]; }), [["resumen", "Resumen"], ["mapa", "Mapa mental"], ["video", "Vídeo"], ["ejercicios", "Ejercicios"], ["plus", "★ Plus"]]);
      var html = head + '<p class="lead">' + ct.intro + '</p><div class="stats-row"><span class="stat">⏱ ' + ct.minutes + ' min</span><a class="stat stat-link" href="#ejercicios" title="Ir a los ejercicios">🎮 ' + games.length + ' ejercicios <span aria-hidden="true">↓</span></a><span class="stat">⭐ hasta ' + xp + " XP</span></div></div></section>" +
        '<section class="section" style="padding-top:8px"><div class="container topic-layout"><aside class="topic-nav" aria-label="Índice del tema"><a class="to-top" href="#" id="toTop">↑ Volver al principio</a><h4>En este tema</h4><ol>' +
        nav.map(function (n) {
          var cls = n[0] === "ejercicios" ? ' class="nav-ej"' : n[0] === "plus" ? ' class="nav-plus"' :
            (n[0] === "resumen" || n[0] === "mapa" || n[0] === "video") ? ' class="nav-extra' + (n[0] === "resumen" ? " first" : "") + '"' : "";
          var label = n[0] === "ejercicios" ? "🎮 Ejercicios" : esc(n[1]);
          return "<li" + cls + '><a href="#' + n[0] + '">' + label + "</a></li>";
        }).join("") + "</ol></aside><div>";
      html += '<div class="block" id="intro"><h2>Antes de empezar <span class="tag">Idea clave</span></h2><div class="prose"><div class="callout tip"><span class="ctitle">Cómo usar este tema</span>Lee cada apartado, abre los ejemplos resueltos (pulsa sobre ellos), repasa con el resumen y el mapa mental, y termina con los ejercicios para ganar XP.</div></div></div>';
      ct.sections.forEach(function (s, i) { html += '<div class="block" id="' + s.id + '"><h2>' + (i + 1) + ". " + esc(s.title) + '</h2><div class="prose">' + s.html + "</div></div>"; });
      html += '<div class="block" id="resumen"><h2>Resumen <span class="tag">Chuleta</span></h2><div class="summary-grid">' + ct.summary.map(function (s) { return '<div class="summary-card' + (s.key ? " key" : "") + '"><b>' + esc(s.t) + "</b><p>" + esc(s.d) + "</p></div>"; }).join("") + "</div></div>";
      html += '<div class="block" id="mapa"><h2>Mapa mental</h2><div class="mindmap">' + mindmap(ct.mindmap) + "</div></div>";
      html += '<div class="block" id="video"><h2>Vídeo explicativo</h2><div class="video">' +
        (ct.video && ct.video.youtube ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(ct.video.youtube) + '" title="' + esc(ct.video.title) + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
          : '<div class="video-placeholder"><div><div class="play">▶</div><b>' + esc(ct.video ? ct.video.title : "Vídeo") + '</b><p class="muted" style="margin:6px 0 0">Vídeo en preparación</p></div></div>') + "</div></div>";
      html += '<div class="block" id="ejercicios"><h2>Ejercicios <span class="tag">Gana XP</span></h2><p class="muted">Cada ejercicio da puntos la primera vez; si lo repites, sumas un 30 %. ¡Intenta sacar el 100 %!</p><div class="games-grid">' +
        games.map(function (g, i) {
          var gt = D.gameTypes[g.type], isDone = done[key + "/" + g.id] != null;
          return '<button class="game-card' + (isDone ? " done" : "") + '" data-g="' + i + '"><span class="g-ico" aria-hidden="true">' + gt.ico + "</span><span><b>" + esc(g.title) + "</b><small>" + gt.name + " · " + esc(g.desc || "") + '</small></span><span class="xp">+' + (g.base || 20) + " XP</span></button>";
        }).join("") + "</div>" +
        '<div class="card topic-rank"><div class="tr-head"><h3>🏆 Ranking de este tema</h3><p class="muted">Puntos del mejor intento de cada ejercicio. El tiempo total aparece cuando se completan los ' + games.length + ' ejercicios; a igualdad de puntos gana quien tarda menos.</p></div>' +
        '<div class="tr-cols" aria-hidden="true"><span></span><span></span><span>Alumno</span><span>Tiempo</span><span>Puntos</span></div><ol class="board topic-board" id="topicBoard"></ol><p class="demo-note hidden" id="trDemo" style="margin:14px 0 0">Modo demo: el ranking del tema muestra alumnos de ejemplo junto a tus resultados.</p></div></div>';
      html += '<div class="block" id="plus"><div class="premium-box"><div><span class="plus-tag">★ PLUS</span><h3 style="margin-top:12px">Ve un paso más allá</h3><p class="muted">Ejercicios avanzados, simulacros y apuntes completos de este tema.</p><div id="plusCta"></div></div><div class="premium-items">' +
        ct.premium.map(function (p, i) { return '<button class="premium-item" data-p="' + i + '" style="text-align:left;width:100%">' + p.ico + " <span><b>" + esc(p.title) + '</b><br><small class="muted">' + esc(p.desc) + '</small></span><span class="lock">🔒</span></button>'; }).join("") + "</div></div></div>";
      html += pager + "</div></div></section>";
      root.innerHTML = html;
      wireTopic(root, ct, key, games);
    });
  }

  function wireTopic(root, ct, key, games) {
    // Juegos
    $$(".game-card", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var g = Object.assign({}, games[+b.dataset.g]); g.id = key + "/" + g.id;
        AM.Games.open(g, { topic: key, topicTotal: games.length, onDone: function () { b.classList.add("done"); loadTopicRank(); } });
      });
    });
    // Ranking del tema
    var maxPts = games.reduce(function (s, g) { return s + Math.min(50, Math.max(5, g.base || 20)); }, 0);
    function loadTopicRank() {
      var box = $("#topicBoard", root); if (!box) return;
      AM.api("ranking", "topic", { topic: key, total: games.length, max_points: maxPts }).then(function (r) {
        var rows = r.rows || [];
        box.innerHTML = rows.length ? rows.slice(0, 20).map(function (x, i) {
          var full = x.seconds != null && x.done >= games.length;
          return '<li class="' + (x.me ? "me" : "") + '"><span class="pos">' + (i + 1) + "</span>" + AM.avatar(x) +
            '<span class="who"><b>' + esc(x.nick) + (x.me ? " (tú)" : "") + " " + AM.leagueBadge(x.weekly_xp) + "</b><small>" + AM.titlePill(x.title) + " · " + x.done + "/" + games.length + " ejercicios" + (full ? " ✓" : "") + "</small></span>" +
            '<span class="tr-time' + (full ? "" : " muted") + '">' + (full ? "⏱ " + AM.fmtTime(x.seconds) : "—") + '</span><span class="pts">' + AM.fmt(x.points) + " pts</span></li>";
        }).join("") : '<li style="grid-template-columns:1fr"><span class="muted">Nadie ha hecho aún los ejercicios de este tema. ¡Sé el primero!</span></li>';
        $("#trDemo", root).classList.toggle("hidden", !r.demo);
        if (!AM.user && rows.length) box.insertAdjacentHTML("beforeend", '<li style="grid-template-columns:1fr"><span class="muted"><a href="cuenta.html?r=1" style="text-decoration:underline">Crea tu perfil</a> para aparecer en este ranking.</span></li>');
      }).catch(function () { box.innerHTML = '<li style="grid-template-columns:1fr"><span class="muted">No se pudo cargar el ranking del tema.</span></li>'; });
    }
    loadTopicRank();
    document.addEventListener("am:user", loadTopicRank);
    // Plus
    function paintPlus() {
      var plus = AM.user && AM.user.plus, box = $("#plusCta", root); if (!box) return;
      box.innerHTML = plus ? '<span class="stat">✓ Tienes Mayoral Plus: toca un recurso para abrirlo</span>' : '<a class="btn btn-primary" href="plus.html" style="--b:var(--gold);color:var(--on-gold)">Desbloquear con Plus</a>';
      $$(".premium-item .lock", root).forEach(function (l) { l.textContent = plus ? "→" : "🔒"; });
    }
    paintPlus(); document.addEventListener("am:user", paintPlus);
    $$(".premium-item", root).forEach(function (b) {
      b.addEventListener("click", function () {
        if (!(AM.user && AM.user.plus)) { location.href = "plus.html"; return; }
        AM.api("premium", "get", { id: key + "/" + b.dataset.p }).then(function (r) {
          showPremium(ct.premium[+b.dataset.p].title, r.html);
        }).catch(function (e) { AM.toast("No disponible", (e && e.error) || "Inténtalo más tarde.", "🔒"); });
      });
    });
    // Índice activo + barra de lectura
    var bar = document.createElement("div"); bar.className = "read-progress"; document.body.appendChild(bar);
    var top = $("#toTop", root);
    if (top) top.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    });
    var links = $$(".topic-nav ol a", root), blocks = links.map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); });
    function onScroll() {
      var h = document.documentElement, p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      bar.style.width = (Math.max(0, Math.min(1, p)) * 100) + "%";
      var y = h.scrollTop + 240, act = 0;
      blocks.forEach(function (b, i) { if (b && b.getBoundingClientRect().top + h.scrollTop <= y) act = i; });
      links.forEach(function (l, i) { l.classList.toggle("active", i === act); });
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }
  }

  function showPremium(title, html) {
    var m = document.createElement("div");
    m.className = "modal open";
    m.innerHTML = '<div class="modal-box"><div class="modal-head"><span class="plus-tag">★ PLUS</span><h3>' + esc(title) + '</h3><button class="modal-close" aria-label="Cerrar">✕</button></div><div class="modal-body prose">' + html + "</div></div>";
    document.body.appendChild(m);
    var x = function () { m.remove(); };
    $(".modal-close", m).addEventListener("click", x);
    m.addEventListener("click", function (e) { if (e.target === m) x(); });
  }

  /* ---------- Ranking ---------- */
  function ranking(root) {
    var state = { period: "week", scope: "global" };
    function load() {
      $("#board", root).innerHTML = '<li><span></span><span></span><span class="muted">Cargando…</span><span></span></li>';
      AM.api("ranking", "list", state).then(function (r) {
        var key = state.period === "all" ? "xp" : "weekly_xp";
        var rows = r.rows || [];
        $("#board", root).innerHTML = rows.length ? rows.slice(0, 50).map(function (x, i) {
          return '<li class="' + (x.me ? "me" : "") + '"><span class="pos">' + (i + 1) + "</span>" + AM.avatar(x) + '<span class="who"><b>' + esc(x.nick) + (x.me ? " (tú)" : "") + " " + AM.leagueBadge(x.weekly_xp) + "</b><small>" + AM.titlePill(x.title) + " · " + esc((AM.course(x.course) || {}).name || "") + '</small></span><span class="pts">' + AM.fmt(x[key]) + " XP</span></li>";
        }).join("") : '<li style="grid-template-columns:1fr"><span class="muted">' + (state.scope === "friends" ? "Aún no tienes amigos. Añade a alguien con su código." : "Todavía no hay nadie aquí. ¡Sé el primero!") + "</span></li>";
        $("#demoNote", root).classList.toggle("hidden", !r.demo);
      }).catch(function (e) { $("#board", root).innerHTML = '<li style="grid-template-columns:1fr"><span class="muted">' + esc((e && e.error) || "No se pudo cargar el ranking.") + "</span></li>"; });
    }
    $$("[data-period]", root).forEach(function (b) { b.addEventListener("click", function () { state.period = b.dataset.period; $$("[data-period]", root).forEach(function (x) { x.classList.toggle("active", x === b); }); load(); }); });
    $$("[data-scope]", root).forEach(function (b) { b.addEventListener("click", function () { state.scope = b.dataset.scope; $$("[data-scope]", root).forEach(function (x) { x.classList.toggle("active", x === b); }); load(); }); });
    function me() {
      var u = AM.user, box = $("#myLeague", root);
      if (!u) { box.innerHTML = '<h3>Únete a la competición</h3><p class="muted">Crea tu perfil gratis para aparecer en el ranking, subir de liga y retar a tus amigos.</p><a class="btn btn-primary" href="cuenta.html?r=1">Crear mi perfil</a>'; return; }
      var L = AM.league(u.weekly_xp), nextL = D.leagues.filter(function (l) { return l.min > u.weekly_xp; })[0];
      box.innerHTML = '<div style="display:flex;gap:14px;align-items:center">' + AM.leagueBadge(u.weekly_xp, true) + '<div><span class="eyebrow" style="margin:0">Tu liga esta semana</span><h3 style="margin:0">Liga ' + L.name + "</h3></div></div>" +
        '<p class="muted" style="margin-top:12px">' + AM.fmt(u.weekly_xp) + " XP esta semana" + (nextL ? " · te faltan <b>" + (nextL.min - u.weekly_xp) + " XP</b> para la Liga " + nextL.name : " · ¡estás en la liga más alta!") + "</p>" +
        '<p style="margin:16px 0 8px;font-weight:650">Tu código de amigo</p><span class="code-box">' + esc(u.friend_code) + ' <button class="btn btn-ghost btn-sm" id="copyCode">Copiar</button></span>';
      var cb = $("#copyCode", root); if (cb) cb.addEventListener("click", function () { try { navigator.clipboard.writeText(u.friend_code); AM.toast("Código copiado", "Pásaselo a tus amigos", "📋"); } catch (e) { /* sin portapapeles */ } });
    }
    document.addEventListener("am:user", function () { me(); load(); });
    me();
    var f = $("#friendForm", root);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = f.code.value.trim().toUpperCase(); if (!code) return;
      AM.api("friends", "add", { code: code }).then(function (r) {
        AM.toast("¡Amigo añadido!", r.friend, "🤝"); f.reset();
        (r.new_achievements || []).forEach(function () { AM.toast("¡Logro desbloqueado! En equipo", "Has añadido a un amigo", "🤝", "achv"); });
        state.scope = "friends"; $$("[data-scope]", root).forEach(function (x) { x.classList.toggle("active", x.dataset.scope === "friends"); }); load();
      }).catch(function (er) { AM.toast("No se pudo añadir", (er && er.error) || "Revisa el código.", "⚠️"); });
    });
    $("#ranLeagues", root).innerHTML = D.leagues.map(function (l) { return '<div class="league"><span class="shield" style="--c:' + l.color + '"></span>' + l.name + '<small class="muted">' + l.min + "+ XP</small></div>"; }).join("");
    load();
  }

  /* ---------- Cuenta ---------- */
  function cuenta(root) {
    var guest = $("#guestView", root), prof = $("#profileView", root), AV = AM.AV;

    /* ---------- Panel personal: avatar, título, liga máxima, cofres, colección y fondos ---------- */
    function paintGame(u) {
      var theme = AV.THEMES.filter(function (t) { return t.id === u.panel_theme; })[0] || AV.THEMES[0];
      $("#pHero", root).style.background = theme.css;
      $("#pAvatarBox", root).innerHTML = AM.avatar(u, { cls: "av-xl" });
      $("#pTitle", root).textContent = AM.titleName(u.title);
      var ML = D.leagues[u.max_league || 0];
      $("#pMaxLeague", root).innerHTML = AM.leagueBadge(ML.min, true) + '<div><span>Liga máxima alcanzada</span><b>' + ML.name + "</b><small>Conseguida el " + esc(u.max_league_at || "") + "</small></div>";

      // Cofres
      var n = u.chests || 0, nextL = D.leagues[(u.max_league || 0) + 1];
      $("#pChests", root).innerHTML =
        '<div class="chest-row"><div class="chest-ico' + (n ? " ready" : "") + '" aria-hidden="true">' + CHEST_SVG + (n ? '<span class="chest-n">' + n + "</span>" : "") + "</div><div>" +
        (n ? "<p><b>¡Tienes " + n + (n === 1 ? " cofre" : " cofres") + " por abrir!</b> Cada cofre contiene " + (u.plus ? "<b>2 criaturas</b> (ventaja Plus)." : "una criatura al azar.") + "</p>" +
             '<button class="btn btn-primary" id="openChest">Abrir cofre</button>'
           : '<p class="muted">Consigues un cofre la primera vez que llegas a cada liga y cada semana que superas tu liga de la semana anterior.</p>' +
             (nextL ? '<p style="margin:0"><b>Próximo cofre seguro:</b> llega a la Liga ' + nextL.name + " (" + nextL.min + " XP en una semana).</p>" : "")) +
        "</div></div>" +
        '<p class="muted" style="font-size:.82rem;margin:12px 0 0">Probabilidades: común 60 %, rara 30 %, épica 10 %. Nunca te toca una criatura repetida.' + (u.plus ? "" : ' Con <a href="plus.html" style="text-decoration:underline">Mayoral Plus</a>, 2 criaturas por cofre.') + "</p>" +
        (AM.demo ? '<div class="demo-note" style="margin:12px 0 0">Modo demo: <button class="btn btn-ghost btn-sm" id="demoChest">+1 cofre de prueba</button> <button class="btn btn-ghost btn-sm" id="demoPlus">' + (u.plus ? "Quitar" : "Probar") + " ventajas Plus</button></div>" : "");

      // Evolución
      var ph = u.phase || 0, demoId = u.avatar_id || "dragon";
      $("#pEvo", root).innerHTML = AV.PHASES.map(function (p, i) {
        var liga = ["Bronce o Plata", "Oro", "Zafiro", "Diamante"][i];
        return '<div class="evo' + (i === ph ? " now" : "") + (i > ph ? " next" : "") + '"><span class="evo-av">' + AV.svg(demoId, i) + "</span><b>" + p + "</b><small>" + liga + "</small></div>";
      }).join("");

      // Colección
      var own = u.avatars || [];
      $("#pCollCount", root).textContent = own.length + " de " + AV.list.length + " criaturas";
      $("#pCollection", root).innerHTML = AV.list.map(function (c) {
        var has = own.indexOf(c.id) !== -1, R = AV.RARITY[c.rarity];
        return '<button class="coll-item' + (has ? "" : " locked") + (u.avatar_id === c.id ? " active" : "") + '" data-av="' + c.id + '"' + (has ? "" : " disabled") + ' style="--rar:' + R.color + '">' +
          '<span class="coll-av">' + AV.svg(c.id, has ? ph : 2) + "</span><b>" + (has ? c.name : "???") + '</b><small>' + R.name + (u.avatar_id === c.id ? " · en uso" : "") + "</small></button>";
      }).join("");

      // Títulos
      $("#pTitles", root).innerHTML = AV.TITLES.map(function (t) {
        var ok = t.ok(u.achievements || []);
        return '<button class="title-opt' + (u.title === t.id ? " active" : "") + '" data-title="' + t.id + '"' + (ok ? "" : " disabled") + '><span class="title-pill">' + t.name + "</span><small>" + (ok ? (u.title === t.id ? "✓ En uso" : "Disponible") : "🔒 " + esc(t.req)) + "</small></button>";
      }).join("");

      // Fondos
      $("#pThemes", root).innerHTML = AV.THEMES.map(function (t) {
        var ok = AV.themeUnlocked(t, u);
        return '<button class="theme-sw' + (u.panel_theme === t.id ? " active" : "") + '" data-theme="' + t.id + '"' + (ok ? "" : " disabled") + ' title="' + esc(t.req) + '"><span class="sw" style="background:' + t.css + '">' + (ok ? "" : "🔒") + "</span><b>" + t.name + "</b><small>" + (ok ? (u.panel_theme === t.id ? "✓ En uso" : "Disponible") : esc(t.req)) + "</small></button>";
      }).join("");
    }

    var CHEST_SVG = '<svg viewBox="0 0 100 100"><rect x="14" y="44" width="72" height="44" rx="6" fill="#B7791F" stroke="#7A4E0E" stroke-width="3"/><rect x="14" y="44" width="72" height="10" fill="#8B5A12"/>' +
      '<g class="lid"><path d="M14 46 Q14 22 50 22 Q86 22 86 46 Z" fill="#D69E2E" stroke="#7A4E0E" stroke-width="3"/><rect x="44" y="22" width="12" height="24" fill="#F6E05E" stroke="#7A4E0E" stroke-width="2"/></g>' +
      '<rect x="44" y="44" width="12" height="44" fill="#F6E05E" stroke="#7A4E0E" stroke-width="2"/><rect x="42" y="52" width="16" height="14" rx="3" fill="#ECC94B" stroke="#7A4E0E" stroke-width="2"/><circle cx="50" cy="59" r="2.5" fill="#7A4E0E"/></svg>';

    function act(action, data, okMsg) {
      return AM.api("profile", action, data || {}).then(function (r) { AM.setUser(r.user); if (okMsg) AM.toast(okMsg, "", "✅"); return r; })
        .catch(function (e) { AM.toast("No se pudo completar", (e && e.error) || "", "⚠️"); throw e; });
    }

    /* Animación de apertura del cofre */
    function openChest() {
      var m = document.createElement("div");
      m.className = "modal open chest-modal";
      m.innerHTML = '<div class="modal-box"><div class="modal-body"><div class="chest-stage"><div class="chest-big shaking">' + CHEST_SVG + '</div><p class="muted">Abriendo cofre…</p></div></div></div>';
      document.body.appendChild(m);
      var close = function () { m.remove(); };
      AM.api("profile", "open_chest").then(function (r) {
        setTimeout(function () {
          var big = $(".chest-big", m); big.classList.remove("shaking"); big.classList.add("open");
          setTimeout(function () {
            AM.confetti();
            $(".modal-body", m).innerHTML = '<h3 class="center" style="margin:0 0 6px">¡Cofre abierto!</h3><p class="muted center" style="margin:0 0 18px">' + (r.rewards.length > 1 ? "Ventaja Plus: ¡dos recompensas!" : "Esta es tu nueva criatura:") + '</p><div class="reveal-row">' +
              r.rewards.map(function (w, i) {
                if (!w.avatar_id) return '<div class="reveal-card" style="--rar:#E8B04B;animation-delay:' + i * .25 + 's"><span class="coll-av" style="display:grid;place-items:center;font-size:2.4rem">⭐</span><b>+' + w.xp + " XP</b><small>¡Ya tienes todas las criaturas!</small></div>";
                var c = AV.byId[w.avatar_id], R = AV.RARITY[w.rarity];
                var ph = r.user.phase || 0;
                return '<div class="reveal-card" style="--rar:' + R.color + ";animation-delay:" + i * .25 + 's"><span class="coll-av">' + AV.svg(c.id, Math.max(2, ph)) + "</span><b>" + c.name + '</b><small style="color:' + R.color + '">' + R.name + '</small><span class="reveal-phase"><span class="mini-av">' + AV.svg(c.id, ph) + "</span>Este mes: " + AV.PHASES[ph] + "</span></div>";
              }).join("") + '</div><div class="center" style="margin-top:20px"><button class="btn btn-primary" id="chestOk">¡Genial!</button></div>';
            $("#chestOk", m).addEventListener("click", close);
            AM.setUser(r.user);
          }, 650);
        }, 1300);
      }).catch(function (e) { close(); AM.toast("No se pudo abrir", (e && e.error) || "", "⚠️"); });
      m.addEventListener("click", function (e) { if (e.target === m) close(); });
    }

    prof.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t || t.disabled) return;
      if (t.id === "openChest") return openChest();
      if (t.id === "demoChest") return act("demo_chest", {}, "Cofre de prueba añadido");
      if (t.id === "demoPlus") return act("demo_plus", {});
      if (t.dataset.av) return act("set_avatar", { avatar_id: t.dataset.av }, "Avatar actualizado");
      if (t.dataset.title) return act("set_title", { title: t.dataset.title }, "Título actualizado");
      if (t.dataset.theme) return act("set_theme", { theme: t.dataset.theme }, "Fondo actualizado");
    });
    function paint() {
      var u = AM.user;
      guest.classList.toggle("hidden", !!u); prof.classList.toggle("hidden", !u);
      $("#demoNote", root).classList.toggle("hidden", !AM.demo);
      if (!u) return;
      var L = AM.league(u.weekly_xp);
      paintGame(u);
      $("#pNick", root).textContent = u.nick;
      $("#pMeta", root).innerHTML = esc((AM.course(u.course) || {}).name || "") + " · " + AM.leagueBadge(u.weekly_xp) + " Liga " + L.name + " esta semana" + (u.plus ? ' · <span class="plus-tag">★ PLUS</span>' : "");
      $("#pKpis", root).innerHTML = [["⭐ " + AM.fmt(u.xp), "XP totales"], [AM.fmt(u.weekly_xp), "XP esta semana"], ["🔥 " + (u.streak || 0), "días de racha"], [(u.achievements || []).length + "/" + D.achievements.length, "logros"]]
        .map(function (k) { return '<div class="kpi"><b>' + k[0] + "</b><span>" + k[1] + "</span></div>"; }).join("");
      $("#pBadges", root).innerHTML = D.achievements.map(function (a) {
        var has = (u.achievements || []).indexOf(a.id) !== -1;
        return '<div class="badge' + (has ? "" : " locked") + '" title="' + esc(a.desc) + '"><span class="b-ico">' + a.ico + "</span><b>" + esc(a.name) + "</b>" + esc(a.desc) + "</div>";
      }).join("");
      $("#pCode", root).textContent = u.friend_code;
      var sel = $("#pCourse", root);
      sel.innerHTML = D.courses.map(function (c) { return '<option value="' + c.id + '"' + (c.id === u.course ? " selected" : "") + ">" + c.name + "</option>"; }).join("");
      $("#pPlus", root).innerHTML = u.plus
        ? '<p>Tienes <b>Mayoral Plus</b> activo' + (u.plus_until ? " hasta el " + esc(u.plus_until) : "") + '.</p><button class="btn btn-ghost" id="portalBtn">Gestionar suscripción</button>'
        : '<p class="muted">Desbloquea ejercicios avanzados, repasos generales, guías y apuntes completos.</p><a class="btn btn-primary" href="plus.html" style="--b:var(--gold);color:var(--on-gold)">Ver Mayoral Plus</a>';
      var pb = $("#portalBtn", root); if (pb) pb.addEventListener("click", function () { AM.api("checkout", "portal").then(function (r) { location.href = r.url; }).catch(function (e) { AM.toast("No disponible", e && e.error, "⚠️"); }); });
    }
    document.addEventListener("am:user", paint);
    paint();

    // Pestañas
    function tab(w) {
      $$(".tabs button", root).forEach(function (b) { b.classList.toggle("active", b.dataset.tab === w); });
      $("#loginForm", root).classList.toggle("hidden", w !== "login"); $("#registerForm", root).classList.toggle("hidden", w !== "register");
    }
    $$(".tabs button", root).forEach(function (b) { b.addEventListener("click", function () { tab(b.dataset.tab); }); });
    if (AM.param("r")) tab("register");

    // Menores de 14: email del tutor
    var reg = $("#registerForm", root), bd = reg.birthdate;
    function age(v) { if (!v) return null; var b = new Date(v), n = new Date(), a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a; }
    bd.addEventListener("change", function () { var a = age(bd.value), minor = a != null && a < 14; $("#parentField", root).classList.toggle("hidden", !minor); reg.parent_email.required = minor; });
    reg.course.innerHTML = D.courses.map(function (c) { return '<option value="' + c.id + '"' + (c.id === (AM.currentCourse() || "3eso") ? " selected" : "") + ">" + c.name + "</option>"; }).join("");

    function msg(form, text, ok) { var m = $(".form-msg", form); m.className = "form-msg show " + (ok ? "ok" : "err"); m.textContent = text; }
    reg.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = { nick: reg.nick.value.trim(), email: reg.email.value.trim(), password: reg.password.value, birthdate: bd.value, course: reg.course.value, parent_email: reg.parent_email.value.trim(), privacy: reg.privacy.checked };
      var a = age(d.birthdate);
      if (a == null || a < 10 || a > 99) return msg(reg, "Revisa tu fecha de nacimiento.");
      if (a < 14 && !d.parent_email) return msg(reg, "Al tener menos de 14 años, necesitamos el email de tu padre, madre o tutor.");
      if (d.password.length < 8) return msg(reg, "La contraseña debe tener al menos 8 caracteres.");
      AM.api("auth", "register", d).then(function (r) {
        if (r.pending_parent && !AM.demo) { msg(reg, "¡Casi listo! Hemos enviado un email a tu padre, madre o tutor para que confirme tu cuenta. Cuando lo haga, podrás entrar.", true); reg.reset(); return; }
        AM.setUser(r.user); AM.toast("¡Bienvenido/a, " + r.user.nick + "!", "Tu perfil está listo. ¡A por los primeros XP!", "🎉"); AM.confetti();
      }).catch(function (er) { msg(reg, (er && er.error) || "No se pudo crear la cuenta."); });
    });
    var log = $("#loginForm", root);
    log.addEventListener("submit", function (e) {
      e.preventDefault();
      AM.api("auth", "login", { login: log.login.value.trim(), password: log.password.value }).then(function (r) { AM.setUser(r.user); AM.toast("¡Hola de nuevo, " + r.user.nick + "!", "", "👋"); })
        .catch(function (er) { msg(log, (er && er.error) || "Datos incorrectos."); });
    });
    $("#pCourse", root).addEventListener("change", function () { AM.api("auth", "update", { course: this.value }).then(function (r) { AM.setUser(r.user); AM.toast("Curso actualizado", "", "✅"); }); });
    $("#logoutBtn", root).addEventListener("click", function () { AM.api("auth", "logout").then(function () { AM.setUser(null); }); });
    $("#copyCode2", root).addEventListener("click", function () { try { navigator.clipboard.writeText(AM.user.friend_code); AM.toast("Código copiado", "", "📋"); } catch (e) { /* */ } });
  }

  /* ---------- Plus ---------- */
  function plus(root) {
    var st = AM.param("estado");
    if (st === "ok") AM.toast("¡Gracias! Ya tienes Mayoral Plus", "Puede tardar unos segundos en activarse.", "★", "achv");
    if (st === "cancelado") AM.toast("Pago cancelado", "No se ha realizado ningún cargo.", "↩️");
    $$("[data-plan]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        if (!AM.user) { location.href = "cuenta.html?r=1"; return; }
        var adult = $("#adultCheck", root);
        if (!adult.checked) { AM.toast("Falta un paso", "El pago debe hacerlo una persona adulta: marca la casilla.", "👨‍👩‍👧"); adult.focus(); return; }
        b.disabled = true;
        AM.api("checkout", "create", { plan: b.dataset.plan }).then(function (r) { location.href = r.url; })
          .catch(function (e) { b.disabled = false; AM.toast("No se pudo iniciar el pago", (e && e.error) || "", "⚠️"); });
      });
    });
  }

  /* ---------- Formulario de contacto ---------- */
  function contact() {
    var f = $("#contactForm"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var m = $(".form-msg", f), d = {};
      ["name", "email", "course", "topic", "message", "website"].forEach(function (k) { if (f[k]) d[k] = f[k].value.trim(); });
      d.privacy = f.privacy.checked;
      var b = $("button[type=submit]", f); b.disabled = true;
      AM.api("contact", "send", d).then(function () {
        m.className = "form-msg show ok"; m.textContent = "¡Mensaje enviado! Te responderemos en un máximo de 48 horas."; f.reset();
      }).catch(function (er) { m.className = "form-msg show err"; m.textContent = (er && er.error) || "No se pudo enviar. Inténtalo de nuevo."; })
        .then(function () { b.disabled = false; });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var p = document.body.dataset.page, root = $("#app") || document.body;
    var map = { home: home, curso: curso, asignatura: asignatura, tema: tema, ranking: ranking, cuenta: cuenta, plus: plus };
    if (map[p]) AM.safe(function () { map[p](root); }, "page:" + p);
    AM.safe(contact, "contact");
  });
})();
