/* =========================================================================
   Academia Mayoral — motor de ejercicios-juego
   Tipos: quiz (contrarreloj con vidas), match (arrastrar y emparejar),
          memory, fill (completar huecos), hangman (ahorcado), order (ordenar)
   Uso: AM.Games.open(juego, { topic, topicTotal, onDone })
   ========================================================================= */
(function () {
  "use strict";
  var AM = (window.AM = window.AM || {});
  var esc = function (s) { return AM.esc(s); };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "").replace(/,/g, ".").replace(/^\+/, ""); }

  var modal, body, titleEl, timers = [];
  function clearTimers() { timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = []; }
  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
    modal.innerHTML = '<div class="modal-box"><div class="modal-head"><span class="g-ico" id="gIco"></span><h3 id="gTitle"></h3><button class="modal-close" aria-label="Cerrar">✕</button></div><div class="modal-body" id="gBody"></div></div>';
    document.body.appendChild(modal);
    body = AM.$("#gBody", modal); titleEl = AM.$("#gTitle", modal);
    AM.$(".modal-close", modal).addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
  }
  function close() { clearTimers(); modal.classList.remove("open"); document.body.style.overflow = ""; }

  var current, ctx, startedAt = 0;
  function fmtTime(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  AM.fmtTime = fmtTime;
  function open(game, context) {
    ensureModal(); clearTimers();
    current = game; ctx = context || {};
    var gt = AM.DATA.gameTypes[game.type] || {};
    AM.$("#gIco", modal).textContent = gt.ico || "🎮";
    titleEl.textContent = game.title;
    body.innerHTML = "";
    modal.classList.add("open"); document.body.style.overflow = "hidden";
    var fn = engines[game.type];
    if (!fn) { body.innerHTML = "<p>Tipo de ejercicio no disponible.</p>"; return; }
    if (game.intro) {
      body.innerHTML = '<p class="lead" style="margin-bottom:20px">' + game.intro + '</p><button class="btn btn-primary on-accent" id="gStart">Empezar ▸</button>';
      AM.$("#gStart", body).addEventListener("click", function () { body.innerHTML = ""; startedAt = Date.now(); fn(game, finish); });
    } else { startedAt = Date.now(); fn(game, finish); }
  }

  /* ---------- Resultado ---------- */
  function finish(score, extra) {
    clearTimers();
    score = Math.round(Math.max(0, Math.min(100, score)));
    extra = extra || {};
    var seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    extra.detail = (extra.detail ? extra.detail + " · " : "") + "⏱ " + fmtTime(seconds);
    var msg = score === 100 ? "¡Perfecto!" : score >= 80 ? "¡Muy bien!" : score >= 50 ? "¡Buen trabajo!" : "¡Sigue practicando!";
    body.innerHTML = '<div class="result"><div class="big">' + score + '%</div><h3 style="margin-top:12px">' + msg + "</h3>" +
      (extra.detail ? '<p class="muted">' + extra.detail + "</p>" : "") +
      '<div class="xp-gain" id="xpGain">Calculando puntos…</div><p class="muted" id="xpNote" style="font-size:.88rem"></p>' +
      '<div class="actions"><button class="btn btn-ghost" id="gRetry">↻ Repetir</button><button class="btn btn-primary on-accent" id="gClose">Continuar</button></div></div>';
    AM.$("#gRetry", body).addEventListener("click", function () { open(current, ctx); });
    AM.$("#gClose", body).addEventListener("click", close);
    if (score >= 80) AM.confetti();
    AM.award({ exercise: current.id, topic: ctx.topic, topic_total: ctx.topicTotal, kind: current.type, score: score, base: current.base || 20, flawless: !!extra.flawless, seconds: seconds })
      .then(function (r) {
        var g = r.xp_gained || 0;
        AM.$("#xpGain", body).textContent = "+" + g + " XP";
        if (!AM.user) AM.$("#xpNote", body).innerHTML = '<a href="cuenta.html" style="text-decoration:underline">Crea tu perfil</a> para guardar tus puntos y entrar en el ranking.';
        else if (r.capped) AM.$("#xpNote", body).textContent = "Has alcanzado el límite diario de puntos. ¡Mañana más!";
        if (ctx.onDone) ctx.onDone(current, score);
      });
  }

  /* ---------- Quiz contrarreloj con vidas ---------- */
  function quiz(g, done) {
    var qs = shuffle(g.questions).slice(0, g.count || g.questions.length);
    var time = g.time || 90, left = time, lives = g.lives || 3, i = 0, ok = 0, streak = 0, best = 0, lostLife = false, locked = false;
    body.innerHTML = '<div class="hud"><span class="pill lives" id="qLives"></span><span class="pill" id="qNum"></span><span class="pill" id="qStreak">🔥 0</span><div class="timer" aria-hidden="true"><i id="qBar"></i></div><span class="pill" id="qTime"></span></div><div id="qArea"></div>';
    function hud() {
      AM.$("#qLives", body).textContent = "❤️".repeat(lives) + "🖤".repeat(Math.max(0, (g.lives || 3) - lives));
      AM.$("#qNum", body).textContent = Math.min(i + 1, qs.length) + "/" + qs.length;
      AM.$("#qStreak", body).textContent = "🔥 " + streak;
      AM.$("#qTime", body).textContent = left + "s";
      AM.$("#qBar", body).style.width = (left / time * 100) + "%";
    }
    function end(reason) {
      var detail = ok + " de " + qs.length + " correctas · mejor racha: " + best + (reason ? " · " + reason : "");
      done(ok / qs.length * 100, { flawless: !lostLife && i >= qs.length, detail: detail });
    }
    function show() {
      if (i >= qs.length) return end();
      locked = false;
      var q = qs[i];
      var opts = q.options.map(function (o, k) { return { t: o, k: k }; });
      if (!q.keepOrder) opts = shuffle(opts);
      AM.$("#qArea", body).innerHTML = '<div class="q-text">' + q.q + '</div><div class="options">' +
        opts.map(function (o) { return '<button class="opt" data-k="' + o.k + '">' + o.t + "</button>"; }).join("") + '</div><div class="feedback" id="qFb"></div>';
      AM.$$(".opt", body).forEach(function (b) {
        b.addEventListener("click", function () {
          if (locked) return; locked = true;
          var right = +b.dataset.k === q.answer;
          if (right) { ok++; streak++; best = Math.max(best, streak); b.classList.add("right"); }
          else {
            streak = 0; lives--; lostLife = true; b.classList.add("wrong");
            var rb = AM.$('.opt[data-k="' + q.answer + '"]', body); if (rb) rb.classList.add("right");
          }
          AM.$("#qFb", body).innerHTML = (right ? "✅ " : "❌ ") + (q.explain || "");
          i++; hud();
          timers.push(setTimeout(function () { if (lives <= 0) end("sin vidas"); else show(); }, right ? 900 : 2200));
        });
      });
      hud();
    }
    timers.push(setInterval(function () { left--; hud(); if (left <= 0) end("¡se acabó el tiempo!"); }, 1000));
    show();
  }

  /* ---------- Drag genérico con pointer events (ratón y táctil) ---------- */
  function draggable(el, onDrop, onTap) {
    var sx, sy, drag = false, clone;
    el.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      sx = e.clientX; sy = e.clientY; drag = false;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (sx == null) return;
      if (!drag && Math.hypot(e.clientX - sx, e.clientY - sy) > 6) {
        drag = true; var r = el.getBoundingClientRect();
        clone = el.cloneNode(true); clone.classList.add("dragging"); clone.style.width = r.width + "px";
        document.body.appendChild(clone); el.style.opacity = ".35";
      }
      if (drag) { clone.style.left = (e.clientX - clone.offsetWidth / 2) + "px"; clone.style.top = (e.clientY - 20) + "px"; onDrop(e, true); }
    });
    el.addEventListener("pointerup", function (e) {
      if (sx == null) return; sx = null;
      if (drag) { clone.remove(); el.style.opacity = ""; onDrop(e, false); } else if (onTap) onTap();
    });
    el.addEventListener("pointercancel", function () { sx = null; if (clone) clone.remove(); el.style.opacity = ""; });
  }

  /* ---------- Arrastrar y emparejar ---------- */
  function match(g, done) {
    var pairs = shuffle(g.pairs).slice(0, g.count || g.pairs.length);
    body.innerHTML = '<p class="muted">' + (g.help || "Arrastra cada tarjeta a su pareja (o tócala y luego toca el hueco).") + '</p><div class="match-wrap"><div class="match-col" id="mSlots">' +
      pairs.map(function (p, i) { return '<div class="slot" data-i="' + i + '"><span class="lbl">' + p[0] + '</span><div class="drop"></div></div>'; }).join("") +
      '</div><div><div class="pool" id="mPool">' + shuffle(pairs.map(function (p, i) { return '<span class="chip" data-i="' + i + '">' + p[1] + "</span>"; })).join("") +
      '</div></div></div><div style="margin-top:18px;display:flex;gap:10px"><button class="btn btn-primary on-accent" id="mCheck">Comprobar</button></div>';
    var pool = AM.$("#mPool", body), sel = null;
    function place(chip, target) {
      if (!target) return;
      var drop = target.classList.contains("slot") ? AM.$(".drop", target) : target;
      if (drop !== pool && drop.firstElementChild && drop.firstElementChild !== chip) pool.appendChild(drop.firstElementChild);
      drop.appendChild(chip);
      AM.$$(".slot", body).forEach(function (s) { s.classList.remove("right", "wrong"); });
    }
    function targetAt(e) { var el = document.elementFromPoint(e.clientX, e.clientY); return el && (el.closest(".slot") || el.closest(".pool")); }
    AM.$$(".chip", body).forEach(function (chip) {
      draggable(chip, function (e, moving) {
        AM.$$(".slot", body).forEach(function (s) { s.classList.remove("over"); });
        var t = targetAt(e);
        if (moving) { if (t && t.classList.contains("slot")) t.classList.add("over"); }
        else place(chip, t);
      }, function () {
        if (sel) sel.classList.remove("sel");
        sel = sel === chip ? null : chip;
        if (sel) sel.classList.add("sel");
        AM.$$(".slot", body).forEach(function (s) { s.classList.toggle("tap-target", !!sel); });
      });
    });
    AM.$$(".slot", body).forEach(function (s) {
      s.addEventListener("click", function () {
        if (!sel) return;
        place(sel, s); sel.classList.remove("sel"); sel = null;
        AM.$$(".slot", body).forEach(function (x) { x.classList.remove("tap-target"); });
      });
    });
    var tries = 0;
    AM.$("#mCheck", body).addEventListener("click", function () {
      tries++;
      var ok = 0;
      AM.$$(".slot", body).forEach(function (s) {
        var c = AM.$(".chip", s), good = c && c.dataset.i === s.dataset.i;
        s.classList.remove("right", "wrong"); void s.offsetWidth;
        s.classList.add(good ? "right" : "wrong"); if (good) ok++;
      });
      if (ok === pairs.length || tries >= 3) {
        var score = (ok / pairs.length) * 100 - (tries - 1) * 10;
        timers.push(setTimeout(function () { done(score, { detail: ok + " de " + pairs.length + " parejas · " + tries + (tries === 1 ? " intento" : " intentos") }); }, 900));
      } else AM.toast(ok + " de " + pairs.length + " correctas", "Corrige las rojas. Te quedan " + (3 - tries) + " intentos.", "🔎");
    });
  }

  /* ---------- Memory ---------- */
  function memory(g, done) {
    var pairs = shuffle(g.pairs).slice(0, g.count || 6);
    var cards = shuffle([].concat.apply([], pairs.map(function (p, i) { return [{ t: p[0], i: i }, { t: p[1], i: i }]; })));
    var moves = 0, found = 0, open1 = null, lock = false, t0 = Date.now();
    body.innerHTML = '<div class="hud"><span class="pill" id="memMoves">Movimientos: 0</span><span class="pill" id="memFound">Parejas: 0/' + pairs.length + '</span></div><div class="memory">' +
      cards.map(function (c, k) { return '<button class="mcard" data-i="' + c.i + '" data-k="' + k + '" aria-label="Carta"><span class="face back">?</span><span class="face front">' + c.t + "</span></button>"; }).join("") + "</div>";
    AM.$$(".mcard", body).forEach(function (b) {
      b.addEventListener("click", function () {
        if (lock || b.classList.contains("flip")) return;
        b.classList.add("flip");
        if (!open1) { open1 = b; return; }
        moves++; AM.$("#memMoves", body).textContent = "Movimientos: " + moves;
        if (open1.dataset.i === b.dataset.i) {
          open1.classList.add("found"); b.classList.add("found"); open1 = null; found++;
          AM.$("#memFound", body).textContent = "Parejas: " + found + "/" + pairs.length;
          if (found === pairs.length) {
            var secs = Math.round((Date.now() - t0) / 1000);
            timers.push(setTimeout(function () { done(100 - Math.max(0, moves - pairs.length) * 6, { detail: moves + " movimientos · " + secs + " s" }); }, 700));
          }
        } else {
          lock = true; var a = open1; open1 = null;
          timers.push(setTimeout(function () { a.classList.remove("flip"); b.classList.remove("flip"); lock = false; }, 950));
        }
      });
    });
  }

  /* ---------- Completar huecos ---------- */
  function fill(g, done) {
    var items = g.items;
    body.innerHTML = '<p class="muted">' + (g.help || "Escribe la respuesta en cada hueco. Usa punto o coma para decimales.") + "</p>" +
      items.map(function (it, n) {
        var k = 0;
        return '<div class="fill-item" data-n="' + n + '">' + it.t.replace(/___/g, function () { return '<input type="text" inputmode="' + (it.text ? "text" : "decimal") + '" autocomplete="off" aria-label="Hueco" data-b="' + (k++) + '">'; }) + '<span class="sol hidden"></span></div>';
      }).join("") + '<button class="btn btn-primary on-accent" id="fCheck" style="margin-top:8px">Comprobar</button>';
    var checked = false, total = 0, ok = 0;
    AM.$("#fCheck", body).addEventListener("click", function () {
      if (checked) return done(ok / total * 100, { detail: ok + " de " + total + " huecos correctos" });
      checked = true;
      AM.$$(".fill-item", body).forEach(function (row) {
        var it = items[+row.dataset.n];
        var answers = Array.isArray(it.a[0]) ? it.a : [it.a];
        AM.$$("input", row).forEach(function (inp) {
          total++;
          var good = answers[+inp.dataset.b].some(function (a) { return norm(a) === norm(inp.value); });
          inp.classList.add(good ? "right" : "wrong"); inp.disabled = true; if (good) ok++;
        });
        var sol = AM.$(".sol", row);
        sol.innerHTML = "Solución: " + answers.map(function (a) { return "<b>" + esc(a[0]) + "</b>"; }).join(", ") + (it.why ? " — " + it.why : "");
        sol.classList.remove("hidden");
      });
      AM.$("#fCheck", body).textContent = "Ver resultado ▸";
    });
  }

  /* ---------- Ahorcado ---------- */
  function hangman(g, done) {
    var words = shuffle(g.words).slice(0, g.count || 3), w = 0, solved = 0, errorsTotal = 0;
    var parts = ['<line x1="20" y1="190" x2="140" y2="190"/>', '<line x1="50" y1="190" x2="50" y2="20"/>', '<line x1="50" y1="20" x2="120" y2="20"/>', '<line x1="120" y1="20" x2="120" y2="45"/>',
      '<circle cx="120" cy="60" r="15"/>', '<line x1="120" y1="75" x2="120" y2="125"/>', '<line x1="120" y1="90" x2="100" y2="110"/><line x1="120" y1="90" x2="140" y2="110"/>', '<line x1="120" y1="125" x2="102" y2="155"/><line x1="120" y1="125" x2="138" y2="155"/>'];
    var maxErr = 6;
    function play() {
      if (w >= words.length) return done(solved / words.length * 100 - Math.min(20, errorsTotal * 2), { detail: solved + " de " + words.length + " palabras" });
      var item = words[w], word = norm(item.w).toUpperCase().replace(/\./g, ""), raw = item.w.toUpperCase(), guessed = {}, errors = 0;
      body.innerHTML = '<div class="hud"><span class="pill">Palabra ' + (w + 1) + "/" + words.length + '</span><span class="pill" id="hErr">Fallos: 0/' + maxErr + '</span></div><div class="hangman"><svg viewBox="0 0 160 200" aria-hidden="true">' +
        parts.map(function (p, k) { return '<g class="part ' + (k < 2 ? "on" : "") + '" data-p="' + k + '">' + p + "</g>"; }).join("") +
        '</svg><div><p class="muted" style="margin-bottom:10px">Pista: ' + item.h + '</p><div class="word" id="hWord"></div><div class="keys" id="hKeys"></div></div></div>';
      var letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
      AM.$("#hKeys", body).innerHTML = letters.map(function (l) { return "<button data-l=\"" + l + "\">" + l + "</button>"; }).join("");
      function draw() {
        var html = "", complete = true;
        for (var i = 0; i < raw.length; i++) {
          var ch = raw[i], base = norm(ch).toUpperCase();
          if (ch === " ") { html += '<span class="sp"></span>'; continue; }
          if (!/[A-ZÑ]/.test(base)) { html += "<span>" + ch + "</span>"; continue; }
          if (guessed[base]) html += "<span>" + ch + "</span>"; else { html += "<span>&nbsp;</span>"; complete = false; }
        }
        AM.$("#hWord", body).innerHTML = html;
        return complete;
      }
      draw();
      AM.$$("#hKeys button", body).forEach(function (b) {
        b.addEventListener("click", function () {
          var l = b.dataset.l; if (guessed[l] || b.disabled) return;
          guessed[l] = true; b.disabled = true;
          var key = norm(l).toUpperCase();
          if (word.indexOf(key) !== -1 || (l === "Ñ" && raw.indexOf("Ñ") !== -1)) { b.classList.add("used-ok"); guessed[key] = true; }
          else { b.classList.add("used-bad"); errors++; errorsTotal++; var p = AM.$('.part[data-p="' + (errors + 1) + '"]', body); if (p) p.classList.add("on"); AM.$("#hErr", body).textContent = "Fallos: " + errors + "/" + maxErr; }
          if (draw()) { solved++; w++; AM.toast("¡Correcto!", item.w, "✅"); timers.push(setTimeout(play, 1100)); }
          else if (errors >= maxErr) { AM.toast("Era: " + item.w, item.h, "🪢"); w++; timers.push(setTimeout(play, 1600)); }
        });
      });
    }
    play();
  }

  /* ---------- Ordenar ---------- */
  function order(g, done) {
    var items = g.items.map(function (t, i) { return { t: t, i: i }; }), list;
    var sh = shuffle(items); while (items.length > 2 && sh.every(function (x, k) { return x.i === k; })) sh = shuffle(items);
    body.innerHTML = '<p class="muted">' + (g.help || "Arrastra para ordenar (o usa las flechas).") + '</p><ol class="order-list" id="oList">' +
      sh.map(function (x) { return '<li data-i="' + x.i + '"><span class="grip">⋮⋮</span><span class="n"></span><span class="t">' + x.t + '</span><span class="mv"><button data-d="-1" aria-label="Subir">↑</button><button data-d="1" aria-label="Bajar">↓</button></span></li>'; }).join("") +
      '</ol><button class="btn btn-primary on-accent" id="oCheck">Comprobar</button>';
    list = AM.$("#oList", body);
    function renum() { AM.$$("li", list).forEach(function (li, k) { AM.$(".n", li).textContent = k + 1; li.classList.remove("right", "wrong"); }); }
    renum();
    AM.$$("li", list).forEach(function (li) {
      AM.$$(".mv button", li).forEach(function (b) {
        b.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
        b.addEventListener("click", function () {
          if (+b.dataset.d < 0 && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
          if (+b.dataset.d > 0 && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
          renum();
        });
      });
      var dragging = false;
      li.addEventListener("pointerdown", function (e) { if (e.target.closest("button")) return; dragging = true; li.classList.add("ghost"); li.setPointerCapture(e.pointerId); });
      li.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        var sibs = AM.$$("li", list).filter(function (x) { return x !== li; });
        var after = null;
        for (var k = 0; k < sibs.length; k++) { var r = sibs[k].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { after = sibs[k]; break; } }
        if (after) list.insertBefore(li, after); else list.appendChild(li);
      });
      var stop = function () { if (!dragging) return; dragging = false; li.classList.remove("ghost"); renum(); };
      li.addEventListener("pointerup", stop); li.addEventListener("pointercancel", stop);
    });
    var tries = 0;
    AM.$("#oCheck", body).addEventListener("click", function () {
      tries++; var ok = 0;
      AM.$$("li", list).forEach(function (li, k) { var good = +li.dataset.i === k; li.classList.add(good ? "right" : "wrong"); if (good) ok++; });
      if (ok === items.length || tries >= 3) timers.push(setTimeout(function () { done(ok / items.length * 100 - (tries - 1) * 10, { detail: ok + " de " + items.length + " en su sitio" }); }, 900));
      else AM.toast(ok + " de " + items.length + " en su sitio", "Te quedan " + (3 - tries) + " intentos.", "↕️");
    });
  }

  var engines = { quiz: quiz, match: match, memory: memory, fill: fill, hangman: hangman, order: order };
  AM.Games = { open: open, close: close };
})();
