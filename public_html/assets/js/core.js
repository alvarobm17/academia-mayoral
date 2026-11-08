/* =========================================================================
   Academia Mayoral — núcleo: API, sesión, puntos, logros, navbar y footer
   Si el servidor PHP no responde (p. ej. al abrir la web en local), la web
   pasa a "modo demo" y guarda el progreso en este navegador.
   ========================================================================= */
(function () {
  "use strict";
  var AM = (window.AM = window.AM || {});
  var D = AM.DATA;

  /* ---------- Utilidades ---------- */
  AM.safe = function (fn, name) { try { fn(); } catch (e) { console.warn("[AM] fallo en " + name, e); } };
  AM.$ = function (s, r) { return (r || document).querySelector(s); };
  AM.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  AM.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  AM.param = function (k) { return new URLSearchParams(location.search).get(k); };
  AM.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  AM.course = function (id) { return D.courses.filter(function (c) { return c.id === id; })[0]; };
  AM.subjectsFor = function (c) { return D.subjectOrder.filter(function (s) { return D.topics[c] && D.topics[c][s]; }); };
  AM.cardName = function (s, c) { return (D.cardNames[s] && D.cardNames[s][c]) || D.subjects[s].name; };
  AM.cardDesc = function (s, c) { return (D.cardDescs[s] && D.cardDescs[s][c]) || D.subjects[s].desc; };
  AM.subjectName = function (s, c) { return (D.officialNames[s] && D.officialNames[s][c]) || D.subjects[s].full; };
  AM.league = function (weekly) {
    var l = D.leagues[0];
    D.leagues.forEach(function (x) { if (weekly >= x.min) l = x; });
    return l;
  };
  AM.initials = function (n) { return String(n || "?").trim().slice(0, 2).toUpperCase(); };
  /* Escudo de liga (bronce, plata, oro, zafiro, diamante) en lugar del texto «Liga X» */
  AM.leagueBadge = function (weekly, big) {
    var L = AM.league(weekly || 0);
    return '<span class="lg-badge' + (big ? " big" : "") + '" style="--c:' + L.color + '" role="img" aria-label="Liga ' + L.name + '" title="Liga ' + L.name + '"><span class="lg-star" aria-hidden="true">★</span></span>';
  };
  /* Avatar con aro del color de la liga de la semana.
     row: {nick, weekly_xp, avatar_id, phase, plus}. Si tiene criatura se dibuja; si no, sus iniciales.
     Los alumnos Plus llevan una aureola dorada animada alrededor del aro. */
  AM.avatar = function (row, opts) {
    row = row || {}; opts = opts || {};
    var L = AM.league(row.weekly_xp || 0), crit = row.avatar_id && AM.AV && AM.AV.byId[row.avatar_id];
    var inner = crit ? AM.AV.svg(row.avatar_id, row.phase || 0) : AM.esc(opts.label || AM.initials(row.nick));
    var tip = (crit ? crit.name + " (" + AM.AV.PHASES[row.phase || 0] + ") · " : "") + "Liga " + L.name + (row.plus ? " · ★ Plus" : "");
    var tag = opts.href ? "a" : "span";
    return "<" + tag + (opts.href ? ' href="' + opts.href + '"' : "") + (opts.id ? ' id="' + opts.id + '"' : "") + ' class="avatar ring' + (crit ? " has-crit" : "") + (row.plus ? " halo" : "") + (opts.cls ? " " + opts.cls : "") +
      '" style="--ring:' + L.color + '" title="' + AM.esc(tip) + '"><span class="av-in">' + inner + "</span></" + tag + ">";
  };
  AM.titleName = function (id) { var t = AM.AV && AM.AV.TITLES.filter(function (x) { return x.id === id; })[0]; return t ? t.name : "Iniciado"; };
  AM.titlePill = function (id) { return '<span class="title-pill">' + AM.esc(AM.titleName(id)) + "</span>"; };
  AM.fmt = function (n) { return Number(n || 0).toLocaleString("es-ES"); };
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function weekKey() {
    var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    var w1 = new Date(d.getFullYear(), 0, 4);
    return d.getFullYear() + "-" + (1 + Math.round(((d - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7));
  }

  /* ---------- API con modo demo ---------- */
  var ss = function () { try { return sessionStorage.getItem("am_demo_mode") === "1"; } catch (e) { return false; } };
  AM.demo = AM.store.get("am_force_demo", false) || location.protocol === "file:" || /\.github\.io$/.test(location.hostname) || ss();

  AM.api = function (file, action, data) {
    if (AM.demo) return Promise.resolve(Demo.handle(file, action, data || {}));
    return fetch("api/" + file + ".php?action=" + encodeURIComponent(action), {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-AM": "1" },
      body: JSON.stringify(data || {})
    }).then(function (r) {
      var ct = r.headers.get("content-type") || "";
      if (ct.indexOf("application/json") === -1) throw { offline: true };
      return r.json().then(function (j) { if (!r.ok || j.ok === false) throw j; return j; });
    }).catch(function (e) {
      // Sin PHP (vista previa local o la demo de GitHub Pages) la web funciona en modo demo
      var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || /\.github\.io$/.test(location.hostname);
      if (e && e.offline && !local) throw { ok: false, error: "El servidor no responde correctamente. Inténtalo en unos minutos." };
      if (e && e.offline) { // vista previa local sin PHP → modo demo
        AM.demo = true;
        try { sessionStorage.setItem("am_demo_mode", "1"); } catch (x) { /* */ }
        console.info("[AM] Servidor PHP no disponible: modo demo (progreso guardado en este navegador).");
        return Demo.handle(file, action, data || {});
      }
      throw e;
    });
  };

  /* ---------- Backend simulado (modo demo) ---------- */
  var Demo = {
    load: function () { return AM.store.get("am_demo", { user: null, completions: {}, kinds: [], friends: [] }); },
    save: function (s) { AM.store.set("am_demo", s); },
    rivals: [
      ["LauraMates", "3eso", 1240, 420], ["Pitágoras_17", "4eso", 980, 365], ["Marcos.G", "3eso", 860, 310],
      ["Irene_bach", "2bach", 2310, 290], ["NoaQuímica", "1bach", 640, 240], ["Dani_tdh", "3eso", 520, 190],
      ["Sara.lee", "2eso", 410, 150], ["Hugo99", "1eso", 300, 120], ["Valeria_M", "3eso", 260, 85], ["Alex_fis", "4eso", 180, 60]
    ],
    /* Completa los campos nuevos (avatares, cofres…) en perfiles demo antiguos */
    norm: function (u) {
      if (!u) return u;
      var def = { max_league: 0, max_league_at: null, month_key: "", month_league: 0, prev_week_league: 0, week_chest: "", chests: 0, avatar_id: null, avatars: [], title: "iniciado", panel_theme: "aurora" };
      Object.keys(def).forEach(function (k) { if (u[k] === undefined) u[k] = def[k]; });
      if (!u.max_league_at) u.max_league_at = new Date().toLocaleDateString("es-ES");
      var mk = new Date().toISOString().slice(0, 7);
      if (u.month_key !== mk) { u.month_key = mk; u.month_league = 0; }
      u.phase = AM.AV ? AM.AV.phaseFor(u.month_league) : 0;
      return u;
    },
    withLooks: function (row, k) { var l = this.looks[k % this.looks.length]; row.avatar_id = l[0]; row.phase = l[1]; row.title = l[2]; row.plus = l[3]; return row; },
    leagueIdx: function (w) { var i = 0; D.leagues.forEach(function (l, k) { if (w >= l.min) i = k; }); return i; },
    looks: [["dragon", 3, "maestro", true], ["sirena", 2, "sabio", false], ["leon", 2, "explorador", false], ["fenix", 3, "maestro", true], ["kraken", 1, "aprendiz", false], ["trex", 1, "aprendiz", false], ["buho", 0, "aprendiz", false], [null, 0, "iniciado", false], ["tiburon", 0, "iniciado", false], [null, 0, "iniciado", false]],
    handle: function (file, action, d) {
      var s = this.load(), u = this.norm(s.user);
      var fail = function (msg) { return Promise.reject({ ok: false, error: msg }); };
      if (file === "auth") {
        if (action === "me") return { ok: true, user: u, demo: true };
        if (action === "register") {
          if (!d.nick || d.nick.length < 3) return fail("El apodo debe tener al menos 3 caracteres.");
          u = s.user = {
            id: 1, nick: d.nick, course: d.course || "3eso", xp: 0, weekly_xp: 0, week: weekKey(), streak: 0, last_active: null,
            plus: false, friend_code: "AM-" + Math.random().toString(36).slice(2, 7).toUpperCase(), achievements: []
          };
          this.norm(u);
          this.save(s);
          return { ok: true, user: u, demo: true, pending_parent: !!d.parent_email };
        }
        if (action === "login") { if (!u) return fail("En modo demo crea primero una cuenta."); return { ok: true, user: u, demo: true }; }
        if (action === "logout") { s.user = null; this.save(s); return { ok: true }; }
        if (action === "update") { if (u) { if (d.course) u.course = d.course; this.save(s); } return { ok: true, user: u }; }
      }
      if (file === "progress" && action === "complete") {
        if (!u) return { ok: true, guest: true, xp_gained: Demo.calc(d, s) };
        var gained = Demo.calc(d, s), before = u.achievements.slice();
        if (u.week !== weekKey()) { u.prev_week_league = this.leagueIdx(u.weekly_xp || 0); u.week = weekKey(); u.weekly_xp = 0; }
        // Cofres: primera vez en cada liga + uno por semana al superar la liga de la semana anterior
        var Lnew = this.leagueIdx((u.weekly_xp || 0) + gained), chestEvents = [];
        if (Lnew > u.max_league) {
          for (var li = u.max_league + 1; li <= Lnew; li++) chestEvents.push({ type: "first", league: D.leagues[li].name });
          u.chests += Lnew - u.max_league; u.max_league = Lnew; u.max_league_at = new Date().toLocaleDateString("es-ES"); u.week_chest = weekKey();
        } else if (Lnew >= 1 && Lnew > u.prev_week_league && u.week_chest !== weekKey()) {
          chestEvents.push({ type: "weekly", league: D.leagues[Lnew].name }); u.chests++; u.week_chest = weekKey();
        }
        u.month_league = Math.max(u.month_league, Lnew); u.phase = AM.AV ? AM.AV.phaseFor(u.month_league) : 0;
        var t = today(), y = new Date(Date.now() - 864e5);
        var yk = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
        if (u.last_active !== t) { u.streak = u.last_active === yk ? u.streak + 1 : 1; u.last_active = t; }
        u.xp += gained; u.weekly_xp += gained;
        s.completions[d.exercise] = Math.max(s.completions[d.exercise] || 0, d.score);
        // Mejor intento (más nota y, a igual nota, menos tiempo) para el ranking del tema
        s.best = s.best || {};
        var pts = Math.round(Math.min(50, Math.max(5, d.base || 20)) * d.score / 100), sec = Math.max(1, d.seconds || 1), b = s.best[d.exercise];
        if (!b || d.score > b.score || (d.score === b.score && sec < b.seconds)) s.best[d.exercise] = { score: d.score, points: pts, seconds: sec };
        if (s.kinds.indexOf(d.kind) === -1) s.kinds.push(d.kind);
        var topicDone = Object.keys(s.completions).filter(function (k) { return k.indexOf(d.topic + "/") === 0; }).length;
        var add = function (id) { if (u.achievements.indexOf(id) === -1) u.achievements.push(id); };
        add("primer_paso");
        if (d.score >= 100) add("perfecto");
        if (u.streak >= 3) add("racha_3");
        if (u.streak >= 7) add("racha_7");
        if (u.xp >= 100) add("xp_100");
        if (u.xp >= 500) add("xp_500");
        if (u.xp >= 2000) add("xp_2000");
        if (d.kind === "quiz" && d.flawless) add("contrarreloj");
        if (d.kind === "memory") add("memoria");
        if (s.kinds.length >= 6) add("explorador");
        if (d.topic_total && topicDone >= d.topic_total) add("tema_completo");
        this.save(s);
        return { ok: true, xp_gained: gained, user: u, chest_events: chestEvents, new_achievements: u.achievements.filter(function (a) { return before.indexOf(a) === -1; }) };
      }
      if (file === "progress" && action === "list") return { ok: true, completions: s.completions };
      if (file === "ranking" && action === "topic") {
        // Rivales de ejemplo con resultados estables para cada tema
        var total = d.total || 1, maxPts = d.max_points || total * 30, h = 0;
        for (var i = 0; i < d.topic.length; i++) h = (h * 31 + d.topic.charCodeAt(i)) >>> 0;
        var trows = this.rivals.slice(0, 7).map(function (r, k) {
          var rnd = function (n) { h = (h * 1103515245 + 12345) >>> 0; return h % n; };
          var done = k < 4 ? total : Math.max(1, total - 1 - rnd(total - 1 || 1));
          var pts = Math.round(maxPts * (done / total) * (0.62 + rnd(38) / 100));
          return Demo.withLooks({ nick: r[0], course: r[1], weekly_xp: r[3], points: pts, done: done, seconds: done >= total ? 240 + rnd(900) : null }, k);
        });
        if (u) {
          var mine = Object.keys(s.best || {}).filter(function (k) { return k.indexOf(d.topic + "/") === 0; }).map(function (k) { return s.best[k]; });
          if (mine.length) trows.push({
            nick: u.nick, course: u.course, weekly_xp: u.weekly_xp, me: true, done: Math.min(total, mine.length), avatar_id: u.avatar_id, phase: u.phase, title: u.title, plus: u.plus,
            points: mine.reduce(function (a, x) { return a + x.points; }, 0),
            seconds: mine.length >= total ? mine.reduce(function (a, x) { return a + x.seconds; }, 0) : null
          });
        }
        trows.sort(function (a, b) { return b.points - a.points || b.done - a.done || (a.seconds || 1e9) - (b.seconds || 1e9); });
        return { ok: true, rows: trows, total: total, demo: true };
      }
      if (file === "ranking") {
        var rows = this.rivals.map(function (r, k) { return Demo.withLooks({ nick: r[0], course: r[1], xp: r[2], weekly_xp: r[3] }, k); });
        if (d.scope === "friends") rows = rows.filter(function (r, i) { return s.friends.indexOf(i) !== -1; });
        if (d.scope === "course" && u) rows = rows.filter(function (r) { return r.course === u.course; });
        if (u) rows.push({ nick: u.nick, course: u.course, xp: u.xp, weekly_xp: u.weekly_xp, me: true, avatar_id: u.avatar_id, phase: u.phase, title: u.title, plus: u.plus });
        var key = d.period === "all" ? "xp" : "weekly_xp";
        rows.sort(function (a, b) { return b[key] - a[key]; });
        return { ok: true, rows: rows, demo: true };
      }
      if (file === "friends") {
        if (action === "add") {
          if (!u) return fail("Inicia sesión para añadir amigos.");
          var idx = Math.floor(Math.random() * Demo.rivals.length);
          if (s.friends.indexOf(idx) === -1) s.friends.push(idx);
          if (u.achievements.indexOf("social") === -1) u.achievements.push("social");
          this.save(s);
          return { ok: true, friend: Demo.rivals[idx][0], new_achievements: ["social"] };
        }
        return { ok: true, friends: s.friends.map(function (i) { return Demo.rivals[i][0]; }) };
      }
      if (file === "profile") {
        if (!u) return fail("Inicia sesión para continuar.");
        if (action === "open_chest") {
          if (u.chests < 1) return fail("No tienes cofres por abrir. ¡Sube de liga para conseguir uno!");
          var W = { comun: 60, rara: 30, epica: 10 }, rewards = [], n = u.plus ? 2 : 1;
          for (var j = 0; j < n; j++) {
            var pool = AM.AV.list.filter(function (c) { return u.avatars.indexOf(c.id) === -1; });
            if (!pool.length) { u.xp += 50; rewards.push({ xp: 50 }); continue; }
            var rars = Object.keys(W).filter(function (r) { return pool.some(function (c) { return c.rarity === r; }); });
            var tot = rars.reduce(function (a, r) { return a + W[r]; }, 0), roll = Math.random() * tot, rar = rars[0];
            for (var q = 0; q < rars.length; q++) { roll -= W[rars[q]]; if (roll <= 0) { rar = rars[q]; break; } }
            var cand = pool.filter(function (c) { return c.rarity === rar; }), pick = cand[Math.floor(Math.random() * cand.length)].id;
            u.avatars.push(pick); rewards.push({ avatar_id: pick, rarity: rar });
          }
          u.chests--; if (!u.avatar_id && rewards[0].avatar_id) u.avatar_id = rewards[0].avatar_id;
          this.save(s); return { ok: true, rewards: rewards, user: u };
        }
        if (action === "set_avatar") { if (u.avatars.indexOf(d.avatar_id) === -1) return fail("Aún no tienes esa criatura."); u.avatar_id = d.avatar_id; }
        if (action === "set_title") { var tt = AM.AV.TITLES.filter(function (t) { return t.id === d.title; })[0]; if (!tt || !tt.ok(u.achievements)) return fail("Aún no has desbloqueado ese título."); u.title = d.title; }
        if (action === "set_theme") { var th = AM.AV.THEMES.filter(function (t) { return t.id === d.theme; })[0]; if (!th || !AM.AV.themeUnlocked(th, u)) return fail("Ese fondo aún está bloqueado."); u.panel_theme = d.theme; }
        if (action === "demo_chest") { u.chests++; }
        if (action === "demo_plus") { u.plus = !u.plus; }
        this.save(s); return { ok: true, user: u };
      }
      if (file === "contact") return { ok: true, demo: true };
      if (file === "checkout") return fail("Los pagos solo funcionan con la web publicada en Hostinger y Stripe configurado.");
      if (file === "premium") return fail("Contenido Plus: disponible con la suscripción activa.");
      return fail("Acción no disponible en modo demo.");
    },
    calc: function (d, s) {
      var base = Math.min(50, Math.max(5, d.base || 20));
      var g = Math.round(base * Math.max(0, Math.min(100, d.score)) / 100);
      if (s.completions[d.exercise] != null) g = Math.round(g * 0.3);
      return g;
    }
  };

  /* ---------- Sesión ---------- */
  AM.user = null;
  AM.setUser = function (u) {
    AM.user = u || null;
    if (u && u.course) AM.store.set("am_course", u.course);
    document.dispatchEvent(new CustomEvent("am:user", { detail: AM.user }));
    renderNavUser();
  };
  AM.loadUser = function () {
    return AM.api("auth", "me").then(function (r) { AM.setUser(r.user); return r.user; }).catch(function () { AM.setUser(null); return null; });
  };
  AM.currentCourse = function () {
    return AM.param("c") || (AM.user && AM.user.course) || AM.store.get("am_course", null);
  };

  /* ---------- Puntos ---------- */
  AM.award = function (info) {
    // info: {exercise, topic, topic_total, kind, score (0-100), base, flawless}
    return AM.api("progress", "complete", info).then(function (r) {
      if (r.user) AM.setUser(r.user);
      (r.chest_events || []).forEach(function (ev, i) {
        setTimeout(function () {
          AM.toast(ev.type === "first" ? "¡Nueva liga: " + ev.league + "! 🎁 Cofre conseguido" : "¡Has superado tu liga de la semana pasada! 🎁 Cofre conseguido",
            "Ábrelo en tu perfil para conseguir una criatura.", "🎁", "achv");
        }, 400 + i * 900);
      });
      (r.new_achievements || []).forEach(function (id, i) {
        var a = D.achievements.filter(function (x) { return x.id === id; })[0];
        if (a) setTimeout(function () { AM.toast("¡Logro desbloqueado! " + a.name, a.desc, a.ico, "achv"); }, 700 + i * 900);
      });
      return r;
    }).catch(function (e) { console.warn(e); return { xp_gained: 0 }; });
  };

  /* ---------- Toasts ---------- */
  AM.toast = function (title, text, ico, kind) {
    var box = AM.$(".toasts");
    if (!box) { box = document.createElement("div"); box.className = "toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    var t = document.createElement("div");
    t.className = "toast " + (kind || "");
    t.innerHTML = '<span class="t-ico">' + (ico || "✨") + "</span><div><b>" + AM.esc(title) + "</b>" + (text ? '<span class="muted">' + AM.esc(text) + "</span>" : "") + "</div>";
    box.appendChild(t);
    setTimeout(function () { t.style.transition = "opacity .4s, transform .4s"; t.style.opacity = "0"; t.style.transform = "translateY(10px)"; }, 4200);
    setTimeout(function () { t.remove(); }, 4700);
  };

  /* ---------- Confeti ---------- */
  AM.confetti = function () {
    var c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
    var x = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight;
    var cols = ["#E8B04B", "#F6D58A", "#3B82F6", "#EF4444", "#14B8A6", "#F97316", "#A855F7"];
    var p = []; for (var i = 0; i < 140; i++) p.push({ x: W / 2 + (Math.random() - .5) * 200, y: H * .35, vx: (Math.random() - .5) * 14, vy: Math.random() * -14 - 4, s: 4 + Math.random() * 6, c: cols[i % cols.length], r: Math.random() * 6 });
    var t0 = performance.now();
    (function f(t) {
      x.clearRect(0, 0, W, H);
      p.forEach(function (q) { q.vy += .35; q.x += q.vx; q.y += q.vy; q.r += .1; x.save(); x.translate(q.x, q.y); x.rotate(q.r); x.fillStyle = q.c; x.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); x.restore(); });
      if (t - t0 < 2600) requestAnimationFrame(f); else c.remove();
    })(t0);
  };

  /* ---------- Navbar, barra de cursos y footer ---------- */
  var page = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";

  function navHTML() {
    var links = [["index.html#sobre", "Sobre nosotros", "index"], ["index.html#cursos", "Cursos", "curso"], ["ranking.html", "Ranking", "ranking"], ["plus.html", "★ Plus", "plus"], ["index.html#contacto", "Contacto", "contacto"]];
    return '<nav class="nav" aria-label="Principal"><div class="container">' +
      '<a class="brand" href="index.html" aria-label="Academia Mayoral, inicio"><img src="assets/img/logo.svg" alt="" width="38" height="38"><span>Academia Mayoral<small>ESO · Bachillerato</small></span></a>' +
      '<ul class="nav-links" id="navLinks">' + links.map(function (l) {
        var act = (page === l[2] || (l[2] === "curso" && (page === "asignatura" || page === "tema"))) ? " active" : "";
        return '<li><a class="' + (l[2] === "plus" ? "plus" : "") + act + '" href="' + l[0] + '">' + l[1] + "</a></li>";
      }).join("") + "</ul>" +
      '<div class="nav-user" id="navUser"><a class="btn btn-primary btn-sm" href="cuenta.html">Entrar</a></div>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>' +
      "</div></nav>";
  }
  function barHTML() {
    var cur = AM.currentCourse();
    var html = '<div class="course-bar" aria-label="Elige tu curso"><div class="container"><span class="label">Tu curso</span>';
    D.courses.forEach(function (c, i) {
      if (i === 4) html += '<span class="sep" aria-hidden="true"></span>';
      html += '<a class="course-pill' + (c.id === cur ? " active" : "") + '" href="curso.html?c=' + c.id + '" data-course="' + c.id + '">' + c.name + "</a>";
    });
    return html + "</div></div>";
  }
  function renderNavUser() {
    var box = AM.$("#navUser"); if (!box) return;
    var u = AM.user;
    if (!u) { box.innerHTML = '<a class="btn btn-primary btn-sm" href="cuenta.html">Entrar</a>'; return; }
    box.innerHTML = '<span class="xp-chip" title="Puntos y racha"><span>⭐ ' + AM.fmt(u.xp) + ' XP</span><span class="streak">🔥 ' + (u.streak || 0) + "</span></span>" +
      AM.avatar(u, { href: "cuenta.html", cls: "nav-av" }) + (u.chests > 0 ? '<a class="chest-dot" href="cuenta.html#cofres" title="Tienes ' + u.chests + (u.chests === 1 ? " cofre" : " cofres") + ' por abrir">🎁<b>' + u.chests + "</b></a>" : "");
  }
  function footerHTML() {
    var y = new Date().getFullYear();
    var cs = D.courses.map(function (c) { return '<li><a href="curso.html?c=' + c.id + '">' + c.name + "</a></li>"; }).join("");
    return '<footer class="footer"><div class="container"><div class="footer-grid">' +
      '<div><a class="brand" href="index.html"><img src="assets/img/logo.svg" alt="" width="38" height="38"><span>Academia Mayoral<small>ESO · Bachillerato</small></span></a>' +
      '<p class="about">Explicaciones claras y ejercicios que se juegan, para que entiendas lo que se te atraganta en clase. Gratis para siempre; con Plus si quieres ir más allá.</p>' +
      '<div class="socials"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="TikTok">TT</a><a href="#" aria-label="YouTube">YT</a></div></div>' +
      "<div><h4>Cursos</h4><ul>" + cs + "</ul></div>" +
      '<div><h4>Academia</h4><ul><li><a href="index.html#sobre">Sobre nosotros</a></li><li><a href="ranking.html">Ranking</a></li><li><a href="plus.html">Mayoral Plus</a></li><li><a href="cuenta.html">Mi cuenta</a></li><li><a href="index.html#contacto">Contacto</a></li></ul></div>' +
      '<div><h4>Legal</h4><ul><li><a href="legal.html#aviso">Aviso legal</a></li><li><a href="legal.html#privacidad">Privacidad</a></li><li><a href="legal.html#cookies">Cookies</a></li><li><a href="legal.html#condiciones">Condiciones de Plus</a></li></ul></div>' +
      '</div><div class="footer-bottom"><span>© ' + y + " Academia Mayoral. Todos los derechos reservados.</span><span>Hecho para estudiantes de ESO y Bachillerato · España</span></div></div></footer>";
  }

  function initChrome() {
    document.documentElement.classList.remove("no-js");
    var top = AM.$("#am-top"), foot = AM.$("#am-footer");
    if (top && !top.children.length) top.innerHTML = navHTML() + (top.hasAttribute("data-nobar") ? "" : barHTML());
    if (foot && !foot.children.length) foot.innerHTML = footerHTML();
    var t = AM.$("#navToggle");
    if (t) t.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
    AM.$$(".nav-links a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("nav-open"); }); });
    AM.$$(".course-pill").forEach(function (a) { a.addEventListener("click", function () { AM.store.set("am_course", a.dataset.course); }); });
    var act = AM.$(".course-pill.active"); if (act) act.scrollIntoView({ block: "nearest", inline: "center" });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  AM.reveal = function (root) {
    var els = AM.$$(".reveal:not(.is-visible)", root);
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { AM.$$(".reveal").forEach(function (e) { e.classList.add("is-visible"); }); }, 6000);
  };

  /* ---------- Paletas de color ---------- */
  var THEMES = [
    { id: "claro", name: "Claro", desc: "Blanco, turquesa y salvia", sw: ["#FFFFFF", "#0E9F9A", "#6E9F7B"], meta: "#F6FAF8", logo: "logo-claro.svg" },
    { id: "oscuro", name: "Oscuro", desc: "Académico nocturno", sw: ["#0D1324", "#1B2647", "#E8B04B"], meta: "#0A0F1E", logo: "logo.svg" },
    { id: "calido", name: "Cálido", desc: "Beige, crema y terracota", sw: ["#F4ECE0", "#C0623B", "#7A5236"], meta: "#F4ECE0", logo: "logo-calido.svg" }
  ];
  AM.theme = function () { return document.documentElement.getAttribute("data-theme") || "claro"; };
  AM.setTheme = function (id, save) {
    var T = THEMES.filter(function (t) { return t.id === id; })[0] || THEMES[0];
    if (T.id === "claro") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", T.id);
    if (save) AM.store.set("am_theme", T.id);
    var meta = AM.$('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", T.meta);
    AM.$$('img[src*="assets/img/logo"]').forEach(function (img) { img.src = "assets/img/" + T.logo; });
    AM.$$(".theme-opt").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.theme === T.id ? "true" : "false"); });
  };
  function initTheme() {
    if (AM.$(".theme-switch")) return;
    var box = document.createElement("div");
    box.className = "theme-switch";
    box.innerHTML = '<div class="theme-panel" role="radiogroup" aria-label="Paleta de colores"><p>Paleta de colores</p>' +
      THEMES.map(function (t) {
        return '<button class="theme-opt" role="radio" data-theme="' + t.id + '" aria-checked="false"><span class="swatch" aria-hidden="true">' +
          t.sw.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + "</span><span>" + t.name + "<small>" + t.desc + "</small></span></button>";
      }).join("") + "</div>" +
      '<button class="theme-btn" aria-label="Cambiar paleta de colores" aria-expanded="false" title="Cambiar colores">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/></svg></button>';
    document.body.appendChild(box);
    var btn = AM.$(".theme-btn", box);
    function toggle(open) { box.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(!box.classList.contains("open")); });
    AM.$$(".theme-opt", box).forEach(function (b) { b.addEventListener("click", function () { AM.setTheme(b.dataset.theme, true); toggle(false); }); });
    document.addEventListener("click", function (e) { if (!box.contains(e.target)) toggle(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
    AM.setTheme(AM.store.get("am_theme", AM.theme()), false);
  }

  /* ---------- Fórmulas matemáticas (KaTeX) ----------
     En el contenido se escriben en LaTeX entre \( ... \) (en línea) o \[ ... \] (centradas).
     Se dibujan solas, también en los juegos, gracias al observador de cambios. */
  var MATH_OPTS = {
    delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
    throwOnError: false,
    // Fracciones siempre a tamaño completo (numerador, barra horizontal y denominador legibles)
    macros: { "\\frac": "\\dfrac" },
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "input", "option"]
  };
  AM.math = function (root) {
    if (!window.renderMathInElement || !root) return;
    try { window.renderMathInElement(root, MATH_OPTS); } catch (e) { console.warn("[AM] KaTeX", e); }
  };
  function initMath() {
    if (!window.renderMathInElement || !("MutationObserver" in window)) return;
    var pending = [], queued = false;
    function flush() {
      queued = false;
      var list = pending; pending = [];
      list.forEach(function (n) { if (n.isConnected) AM.math(n); });
    }
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          var el = n.nodeType === 1 ? n : n.parentElement;
          if (!el || el.closest(".katex")) return;
          var t = n.textContent || "";
          if (t.indexOf("\\(") !== -1 || t.indexOf("\\[") !== -1) pending.push(el);
        });
      });
      // setTimeout y no requestAnimationFrame: este último se congela en pestañas abiertas en segundo plano
      if (pending.length && !queued) { queued = true; setTimeout(flush, 16); }
    }).observe(document.body, { childList: true, subtree: true });
    AM.math(document.body);
  }

  document.addEventListener("DOMContentLoaded", function () {
    AM.safe(initChrome, "chrome");
    AM.safe(initTheme, "theme");
    AM.safe(initMath, "math");
    AM.safe(function () { AM.reveal(); }, "reveal");
    AM.ready = Promise.resolve();
    AM.safe(function () { AM.ready = AM.loadUser(); }, "user");
  });
})();
