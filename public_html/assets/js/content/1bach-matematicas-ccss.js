/* =========================================================================
   Contenido desarrollado — Matemáticas Aplicadas a las Ciencias Sociales I (1º Bach)
   Normas de fórmulas: ver CLAUDE.md (fracciones con \frac, raíces con \sqrt,
   en exponentes usar \tfrac para que la fracción quede apilada y pequeña).
   ========================================================================= */
(function () {
  "use strict";
  var C = (window.AM = window.AM || {}).CONTENT = window.AM.CONTENT || {};
  var m = function (s) { return "\\(" + String.raw.apply(String, arguments) + "\\)"; };
  var D = function (s) { return "\\[" + String.raw.apply(String, arguments) + "\\]"; };

  /* Raíz cuadrada dibujada en SVG (el símbolo cubre todo el radicando) */
  function svgRad(x, y, n, color) {
    var w = String(n).length * 9 + 4;
    return '<g transform="translate(' + x + "," + y + ')"><path d="M0 -7 L4 -8 L8 2 L13 -15 L' + (15 + w) + ' -15" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<text x="15" y="0" fill="' + color + '" font-size="15" font-weight="700" font-style="italic">' + n + "</text></g>";
  }

  /* Figura: representación de raíz de 2 y raíz de 5 con Pitágoras */
  var figRaices =
    "<svg viewBox='0 0 420 205' role='img' aria-label='Representación de la raíz de 2 y la raíz de 5 en la recta real usando triángulos rectángulos y arcos de compás' style='max-width:520px;width:100%;margin:10px auto;display:block'>" +
    "<line x1='20' y1='150' x2='400' y2='150' stroke='var(--text)' stroke-width='2'/>" +
    [0, 1, 2, 3].map(function (k) { var x = 60 + k * 100; return "<line x1='" + x + "' y1='144' x2='" + x + "' y2='156' stroke='var(--text)' stroke-width='2'/><text x='" + x + "' y='176' text-anchor='middle' fill='var(--text)' font-size='14'>" + k + "</text>"; }).join("") +
    // raíz de 2: triángulo de catetos 1 y 1
    "<polygon points='60,150 160,150 160,50' fill='color-mix(in srgb, var(--accent) 14%, transparent)' stroke='var(--accent)' stroke-width='2'/>" +
    "<path d='M160 50 A141.4 141.4 0 0 1 201.4 150' fill='none' stroke='var(--accent)' stroke-width='2' stroke-dasharray='5 4'/>" +
    "<circle cx='201.4' cy='150' r='5' fill='var(--accent)'/>" + svgRad(186, 196, 2, "var(--accent)") +
    // raíz de 5: triángulo de catetos 2 y 1
    "<polygon points='60,150 260,150 260,50' fill='none' stroke='var(--gold)' stroke-width='2'/>" +
    "<path d='M260 50 A223.6 223.6 0 0 1 283.6 150' fill='none' stroke='var(--gold)' stroke-width='2' stroke-dasharray='5 4'/>" +
    "<circle cx='283.6' cy='150' r='5' fill='var(--gold)'/>" + svgRad(278, 196, 5, "var(--gold)") +
    "<text x='147' y='92' fill='var(--accent)' font-size='13'>1</text><text x='266' y='105' fill='var(--gold)' font-size='13'>1</text>" +
    "</svg>";

  /* Figura: dos intervalos sobre la misma recta */
  function px(v) { return 40 + (v + 3) * 50; }
  var figIntervalos =
    "<svg viewBox='0 0 530 125' role='img' aria-label='Intervalo A de menos 2 cerrado a 3 abierto e intervalo B de 1 abierto a 5 cerrado sobre la recta real' style='max-width:560px;width:100%;margin:10px auto;display:block'>" +
    "<line x1='25' y1='100' x2='505' y2='100' stroke='var(--text)' stroke-width='2'/>" +
    [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(function (k) { return "<line x1='" + px(k) + "' y1='95' x2='" + px(k) + "' y2='105' stroke='var(--text)' stroke-width='1.5'/><text x='" + px(k) + "' y='121' text-anchor='middle' fill='var(--muted)' font-size='12'>" + k + "</text>"; }).join("") +
    "<line x1='" + px(-2) + "' y1='35' x2='" + px(3) + "' y2='35' stroke='var(--accent)' stroke-width='6' stroke-linecap='round'/>" +
    "<circle cx='" + px(-2) + "' cy='35' r='7' fill='var(--accent)'/><circle cx='" + px(3) + "' cy='35' r='7' fill='var(--surface)' stroke='var(--accent)' stroke-width='3'/>" +
    "<text x='" + px(-2.6) + "' y='40' fill='var(--accent)' font-size='15' font-weight='700'>A</text>" +
    "<line x1='" + px(1) + "' y1='65' x2='" + px(5) + "' y2='65' stroke='var(--gold)' stroke-width='6' stroke-linecap='round'/>" +
    "<circle cx='" + px(1) + "' cy='65' r='7' fill='var(--surface)' stroke='var(--gold)' stroke-width='3'/><circle cx='" + px(5) + "' cy='65' r='7' fill='var(--gold)'/>" +
    "<text x='" + px(5.35) + "' y='70' fill='var(--gold)' font-size='15' font-weight='700'>B</text>" +
    "</svg>";

  /* Ejemplos de números como fichas sueltas (sin "·", que se confundiría con multiplicar) */
  function chips(list) { return "<div class='set-ex'>" + list.map(function (x) { return "<span class='num-chip'>" + x + "</span>"; }).join("") + "</div>"; }

  var ok = "<span style='color:var(--ok)'>✓</span>", no = "<span style='color:var(--faint)'>—</span>";
  function fila(n, a, b, c, d, e) { return "<tr><td>" + n + "</td>" + [a, b, c, d, e].map(function (v) { return "<td>" + (v ? ok : no) + "</td>"; }).join("") + "</tr>"; }

  /* =====================================================================
     TEMA 1 · NÚMEROS REALES
     ===================================================================== */
  C["1bach/matematicas-ccss/numeros-reales"] = {
    minutes: 60,
    intro: "Los números reales son la herramienta básica de la economía y las ciencias sociales: precios, porcentajes, tasas de crecimiento o estadísticas. En este tema repasamos los tipos de números, cómo describir conjuntos con intervalos, cómo trabajar con cantidades muy grandes o muy pequeñas, cuánto nos equivocamos al redondear y cómo operar con radicales y logaritmos.",
    video: { youtube: "", title: "Números reales en 10 minutos" },
    sections: [
      /* ---------- 1 ---------- */
      {
        id: "racionales", title: "Números racionales",
        html: "<p>Un número es <strong>racional</strong> si se puede escribir como una fracción " + m`\frac{a}{b}` + " con " + m`a, b \in \mathbb{Z}` + " y " + m`b \neq 0` + ". Su conjunto se llama " + m`\mathbb{Q}` + ".</p>" +
          "<p>Al dividir numerador entre denominador, un número racional da siempre:</p>" +
          "<ul><li>Un <strong>decimal exacto</strong>: " + m`\frac{7}{4} = 1{,}75` + ".</li><li>Un <strong>decimal periódico puro</strong>: " + m`\frac{5}{11} = 0{,}454545\ldots = 0{,}\overline{45}` + ".</li><li>Un <strong>decimal periódico mixto</strong>: " + m`\frac{7}{6} = 1{,}1666\ldots = 1{,}1\overline{6}` + ".</li></ul>" +
          "<h3>Fracción generatriz</h3><p>Todo decimal exacto o periódico tiene una fracción que lo genera. El método más seguro es multiplicar por potencias de 10 y restar para eliminar el periodo:</p>" +
          "<details class='example'><summary>Ejemplo: fracción generatriz de " + m`N = 1{,}2\overline{5}` + "</summary><div class='steps'><ol>" +
          "<li>" + m`100N = 125{,}555\ldots` + " y " + m`10N = 12{,}555\ldots` + "</li>" +
          "<li>Restamos: " + m`100N - 10N = 125{,}555\ldots - 12{,}555\ldots \Rightarrow 90N = 113` + "</li>" +
          "<li>" + m`N = \frac{113}{90}` + "</li></ol></div></details>" +
          "<div class='callout tip'><span class='ctitle'>Regla rápida</span>Numerador: el número escrito sin coma hasta el final del primer periodo, menos el número formado por las cifras anteriores al periodo. Denominador: un 9 por cada cifra del periodo seguido de un 0 por cada cifra del anteperiodo (las cifras decimales que no se repiten)." + D`2{,}\overline{36} = \frac{236 - 2}{99} = \frac{234}{99} = \frac{26}{11} \qquad 1{,}2\overline{5} = \frac{125 - 12}{90} = \frac{113}{90}` + "</div>" +
          "<h3>Operar con decimales periódicos</h3><p>Para operar con decimales periódicos, <strong>primero se pasan a fracción</strong>, se opera con las fracciones y, si se pide, se vuelve a escribir el resultado como decimal.</p>" +
          "<details class='example'><summary>Ejemplo: " + m`0{,}\overline{3} + 0{,}1\overline{6}` + "</summary><div class='steps'><ol>" +
          "<li>" + m`0{,}\overline{3} = \frac{3}{9} = \frac{1}{3}` + " y " + m`0{,}1\overline{6} = \frac{16 - 1}{90} = \frac{15}{90} = \frac{1}{6}` + "</li>" +
          "<li>" + m`\frac{1}{3} + \frac{1}{6} = \frac{2}{6} + \frac{1}{6} = \frac{3}{6} = \frac{1}{2} = 0{,}5` + "</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo: " + m`1{,}\overline{2} \cdot 0{,}\overline{18}` + "</summary><div class='steps'><ol>" +
          "<li>" + m`1{,}\overline{2} = \frac{12 - 1}{9} = \frac{11}{9}` + " y " + m`0{,}\overline{18} = \frac{18}{99} = \frac{2}{11}` + "</li>" +
          "<li>" + m`\frac{11}{9} \cdot \frac{2}{11} = \frac{22}{99} = \frac{2}{9} = 0{,}\overline{2}` + "</li></ol></div></details>" +
          "<div class='callout warn'><span class='ctitle'>Curiosidad que cae en exámenes</span>" + m`0{,}\overline{9} = \frac{9}{9} = 1` + ". No es «casi 1»: es exactamente 1.</div>"
      },
      /* ---------- 2 ---------- */
      {
        id: "irracionales", title: "Números irracionales",
        html: "<p>Un número es <strong>irracional</strong> si su expresión decimal tiene <strong>infinitas cifras que no se repiten periódicamente</strong>. Por eso no se puede escribir como fracción. Su conjunto se representa con " + m`\mathbb{I}` + ".</p>" +
          "<ul><li>Las raíces no exactas: " + m`\sqrt{2} = 1{,}41421\ldots` + ", " + m`\sqrt{3}` + ", " + m`\sqrt[3]{5}` + "…</li><li>El número " + m`\pi = 3{,}14159\ldots` + " (relación entre la longitud de la circunferencia y su diámetro).</li><li>El número " + m`e = 2{,}71828\ldots` + ", clave en economía para el interés continuo y el crecimiento de poblaciones.</li><li>El número de oro " + m`\varphi = \frac{1 + \sqrt{5}}{2} = 1{,}61803\ldots` + "</li></ul>" +
          "<h3>Cómo escribir números irracionales</h3>" +
          "<ul><li><strong>Inventando un decimal sin periodo</strong>: " + m`0{,}1010010001\ldots` + " (cada vez un 0 más) o " + m`0{,}123456789101112\ldots` + " (los naturales seguidos).</li><li><strong>Con raíces no exactas</strong>: " + m`\sqrt{n}` + " (con " + m`n` + " natural) es irracional siempre que " + m`n` + " no sea un cuadrado perfecto (" + m`\sqrt{7}` + ", " + m`\sqrt{10}` + ", " + m`\sqrt{20}` + "…).</li><li><strong>Operando un racional (distinto de 0) con un irracional</strong>: " + m`3 + \sqrt{2}` + ", " + m`5\pi` + ", " + m`\frac{\sqrt{3}}{2}` + "…</li></ul>" +
          "<div class='callout warn'><span class='ctitle'>Cuidado</span>Al operar dos irracionales el resultado puede ser racional: " + m`\sqrt{2} \cdot \sqrt{2} = 2` + " y " + m`(3 + \sqrt{5}) + (-\sqrt{5}) = 3` + ".</div>" +
          "<h3>Representar " + m`\sqrt{n}` + " en la recta real</h3>" +
          "<p>Los irracionales de la forma " + m`\sqrt{n}` + " se pueden situar <strong>exactamente</strong> en la recta con regla y compás gracias al teorema de Pitágoras:</p>" +
          "<ol><li>Busca dos números cuyos cuadrados sumen " + m`n` + ": " + m`n = a^2 + b^2` + ".</li><li>Dibuja un triángulo rectángulo con un cateto de longitud " + m`a` + " sobre la recta (desde el 0) y otro de longitud " + m`b` + " perpendicular.</li><li>La hipotenusa mide " + m`\sqrt{a^2 + b^2} = \sqrt{n}` + ".</li><li>Con el compás pinchado en 0, lleva la hipotenusa hasta la recta: ese punto es " + m`\sqrt{n}` + ".</li></ol>" +
          figRaices +
          "<p class='muted' style='text-align:center;font-size:.9rem'>" + m`\sqrt{2} = \sqrt{1^2 + 1^2}` + " (triángulo sombreado) y " + m`\sqrt{5} = \sqrt{2^2 + 1^2}` + " (triángulo sin sombrear).</p>" +
          "<div class='callout tip'><span class='ctitle'>Otros casos</span>" + m`\sqrt{10} = \sqrt{3^2 + 1^2}` + ", " + m`\sqrt{13} = \sqrt{3^2 + 2^2}` + ", " + m`\sqrt{8} = \sqrt{2^2 + 2^2}` + ". Si " + m`n` + " no es suma de dos cuadrados, como " + m`\sqrt{3}` + ", se encadenan triángulos: " + m`\sqrt{3} = \sqrt{(\sqrt{2})^2 + 1^2}` + ".</div>"
      },
      /* ---------- 3 ---------- */
      {
        id: "reales", title: "Números reales",
        html: "<p>Los racionales y los irracionales juntos forman los <strong>números reales</strong>. Cada número real ocupa un punto de la recta y cada punto de la recta es un número real: por eso se llama <strong>recta real</strong>.</p>" +
          "<h3>Diagrama de los conjuntos numéricos</h3>" +
          "<p>Cada conjunto está <strong>dentro</strong> del siguiente: todo natural es entero, todo entero es racional y todo racional es real. Los irracionales están <strong>aparte</strong> de los racionales (no comparten ningún número) y, juntos, completan los reales.</p>" +
          "<div class='set-diagram' role='img' aria-label='Diagrama: los naturales están dentro de los enteros, que están dentro de los racionales; racionales e irracionales forman juntos los reales'>" +
            "<div class='set set-r'><span class='set-label'>" + m`\mathbb{R}` + " Reales</span>" +
              "<div class='set-row'>" +
                "<div class='set set-q'><span class='set-label'>" + m`\mathbb{Q}` + " Racionales</span>" +
                  "<div class='set set-z'><span class='set-label'>" + m`\mathbb{Z}` + " Enteros</span>" +
                    "<div class='set set-n'><span class='set-label'>" + m`\mathbb{N}` + " Naturales</span>" + chips([m`1`, m`2`, m`15`, m`\sqrt{16}`, m`\frac{8}{4}`]) + "</div>" +
                    chips([m`-1`, m`-7`, m`-\sqrt{9}`]) +
                  "</div>" +
                  chips([m`\frac{1}{2}`, m`-\frac{3}{5}`, m`0{,}75`, m`0{,}\overline{7}`]) +
                "</div>" +
                "<div class='set set-i'><span class='set-label'>" + m`\mathbb{I}` + " Irracionales</span>" + chips([m`\sqrt{2}`, m`\sqrt{7}`, m`\pi`, m`e`, m`\frac{1 + \sqrt{5}}{2}`, m`0{,}1010010001\ldots`]) + "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
          "<div class='callout tip'><span class='ctitle'>Cómo se lee el diagrama</span>Para clasificar un número, busca la <strong>caja más pequeña</strong> en la que entra: pertenece a ella y a todas las que la rodean. Por ejemplo, " + m`-\sqrt{9} = -3` + " está en la caja de los enteros, así que es entero, racional y real, pero no natural.</div>" +
          "<h3>Clasificar números</h3><p>Antes de clasificar, <strong>simplifica</strong>: " + m`\frac{8}{4}` + " es 2 y " + m`\sqrt{16}` + " es 4, así que son naturales. La tabla resume en qué conjuntos está cada número:</p>" +
          "<div style='overflow-x:auto'><table class='num-table'><thead><tr><th>Número</th><th>" + m`\mathbb{N}` + "</th><th>" + m`\mathbb{Z}` + "</th><th>" + m`\mathbb{Q}` + "</th><th>" + m`\mathbb{I}` + "</th><th>" + m`\mathbb{R}` + "</th></tr></thead><tbody>" +
          fila(m`\sqrt{16} = 4`, 1, 1, 1, 0, 1) +
          fila(m`-\sqrt{9} = -3`, 0, 1, 1, 0, 1) +
          fila(m`\frac{8}{4} = 2`, 1, 1, 1, 0, 1) +
          fila(m`-\frac{3}{5}`, 0, 0, 1, 0, 1) +
          fila(m`0{,}\overline{7}`, 0, 0, 1, 0, 1) +
          fila(m`\sqrt{7}`, 0, 0, 0, 1, 1) +
          fila(m`\pi`, 0, 0, 0, 1, 1) +
          "</tbody></table></div>" +
          "<div class='callout warn'><span class='ctitle'>Ojo</span>" + m`\sqrt{-4}` + " <strong>no es un número real</strong>: ningún número real al cuadrado da negativo.</div>" +
          "<h3>Reconocer números en la recta real</h3><p>Para situar un irracional, busca entre qué números conocidos está comparando cuadrados:</p>" +
          "<details class='example'><summary>Ejemplo: ¿entre qué enteros está " + m`\sqrt{20}` + "?</summary><div class='steps'><ol>" +
          "<li>" + m`4^2 = 16 < 20 < 25 = 5^2` + ", así que " + m`4 < \sqrt{20} < 5` + ".</li>" +
          "<li>Afinando: " + m`4{,}4^2 = 19{,}36` + " y " + m`4{,}5^2 = 20{,}25` + ", luego " + m`4{,}4 < \sqrt{20} < 4{,}5` + ".</li></ol></div></details>" +
          "<p>El <strong>valor absoluto</strong> " + m`|a|` + " es la distancia de " + m`a` + " al 0: " + m`|-5| = 5` + ", " + m`|3| = 3` + ". La distancia entre dos números es " + m`|a - b|` + ".</p>"
      },
      /* ---------- 4 ---------- */
      {
        id: "intervalos", title: "Intervalos",
        html: "<p>Un <strong>intervalo</strong> es el conjunto de todos los números reales comprendidos entre dos extremos. El corchete " + m`[\;]` + " indica que el extremo <strong>se incluye</strong> (punto relleno) y el paréntesis " + m`(\;)` + " que <strong>no se incluye</strong> (punto hueco).</p>" +
          "<div style='overflow-x:auto'><table class='num-table'><thead><tr><th>Nombre</th><th>Intervalo</th><th>Desigualdad</th></tr></thead><tbody>" +
          "<tr><td>Abierto</td><td>" + m`(a, b)` + "</td><td>" + m`a < x < b` + "</td></tr>" +
          "<tr><td>Cerrado</td><td>" + m`[a, b]` + "</td><td>" + m`a \le x \le b` + "</td></tr>" +
          "<tr><td>Semiabierto</td><td>" + m`[a, b)` + " · " + m`(a, b]` + "</td><td>" + m`a \le x < b` + " · " + m`a < x \le b` + "</td></tr>" +
          "<tr><td>Semirrectas</td><td>" + m`(a, +\infty)` + " · " + m`[a, +\infty)` + "</td><td>" + m`x > a` + " · " + m`x \ge a` + "</td></tr>" +
          "<tr><td></td><td>" + m`(-\infty, b)` + " · " + m`(-\infty, b]` + "</td><td>" + m`x < b` + " · " + m`x \le b` + "</td></tr>" +
          "<tr><td>Toda la recta</td><td>" + m`(-\infty, +\infty) = \mathbb{R}` + "</td><td>Cualquier " + m`x` + "</td></tr>" +
          "</tbody></table></div>" +
          "<div class='callout tip'><span class='ctitle'>Infinito</span>En " + m`+\infty` + " y " + m`-\infty` + " siempre va paréntesis: el infinito no es un número y no se puede «incluir».</div>" +
          "<h3>Unión e intersección de intervalos</h3>" +
          "<ul><li><strong>Unión</strong> " + m`A \cup B` + ": números que están en " + m`A` + " <em>o</em> en " + m`B` + " (en alguno de los dos).</li><li><strong>Intersección</strong> " + m`A \cap B` + ": números que están en " + m`A` + " <em>y</em> en " + m`B` + " a la vez.</li></ul>" +
          "<p>El truco es <strong>dibujar los dos intervalos sobre la misma recta</strong>:</p>" + figIntervalos +
          "<details class='example' open><summary>Ejemplo: " + m`A = [-2, 3)` + " y " + m`B = (1, 5]` + "</summary><div class='steps'><ol>" +
          "<li>Unión: desde el extremo más a la izquierda hasta el más a la derecha → " + m`A \cup B = [-2, 5]` + ".</li>" +
          "<li>Intersección: solo la zona donde se solapan → " + m`A \cap B = (1, 3)` + ". El 1 no está en " + m`B` + " y el 3 no está en " + m`A` + ".</li></ol></div></details>" +
          "<p>Si dos intervalos no se tocan, su intersección es el conjunto vacío: " + m`[0, 1] \cap (2, 4) = \varnothing` + ".</p>" +
          "<h3>Intervalos encajados que contienen un irracional</h3><p>Un irracional no se puede escribir entero, pero sí <strong>atrapar</strong> en intervalos cada vez más pequeños, cada uno dentro del anterior. Así se calcula " + m`\sqrt{2}` + " con la precisión que queramos:</p>" +
          "<div style='overflow-x:auto'><table class='num-table'><thead><tr><th>Intervalo</th><th>Comprobación</th><th>Longitud</th></tr></thead><tbody>" +
          "<tr><td>" + m`[1, 2]` + "</td><td>" + m`1^2 = 1 < 2 < 4 = 2^2` + "</td><td>1</td></tr>" +
          "<tr><td>" + m`[1{,}4;\ 1{,}5]` + "</td><td>" + m`1{,}96 < 2 < 2{,}25` + "</td><td>0,1</td></tr>" +
          "<tr><td>" + m`[1{,}41;\ 1{,}42]` + "</td><td>" + m`1{,}9881 < 2 < 2{,}0164` + "</td><td>0,01</td></tr>" +
          "<tr><td>" + m`[1{,}414;\ 1{,}415]` + "</td><td>" + m`1{,}999396 < 2 < 2{,}002225` + "</td><td>0,001</td></tr>" +
          "</tbody></table></div>" +
          "<p class='muted' style='font-size:.9rem'>Cuando los extremos llevan decimales con coma, se separan con punto y coma para no confundirse: " + m`[1{,}4;\ 1{,}5]` + ".</p>"
      },
      /* ---------- 5 ---------- */
      {
        id: "notacion-cientifica", title: "Notación científica",
        html: "<p>Un número está en <strong>notación científica</strong> si se escribe como " + m`a \cdot 10^{n}` + " con " + m`1 \le |a| < 10` + " y " + m`n \in \mathbb{Z}` + ". Sirve para manejar cantidades enormes o diminutas, muy habituales en economía y demografía.</p>" +
          "<ul><li>" + m`3\,400\,000 = 3{,}4 \cdot 10^{6}` + " (la coma se mueve 6 lugares a la izquierda → exponente positivo).</li><li>" + m`0{,}000\,045 = 4{,}5 \cdot 10^{-5}` + " (la coma se mueve 5 lugares a la derecha → exponente negativo).</li><li>El PIB de España ronda 1,5 billones de euros: " + m`1{,}5 \cdot 10^{12}` + " €.</li></ul>" +
          "<div class='callout warn'><span class='ctitle'>Billón español ≠ billion inglés</span>En España un billón es un millón de millones (" + m`10^{12}` + "). El <em>billion</em> de las noticias en inglés son mil millones (" + m`10^{9}` + ").</div>" +
          "<h3>Operaciones</h3>" +
          "<details class='example'><summary>Producto y cociente: se operan las mantisas y se suman o restan los exponentes</summary><div class='steps'><ol>" +
          "<li>" + m`(3 \cdot 10^{5}) \cdot (4 \cdot 10^{-2}) = 12 \cdot 10^{3} = 1{,}2 \cdot 10^{4}` + "</li>" +
          "<li>" + m`\frac{8 \cdot 10^{7}}{2 \cdot 10^{-3}} = 4 \cdot 10^{10}` + "</li></ol></div></details>" +
          "<details class='example'><summary>Suma y resta: primero se igualan los exponentes y <mark class='hl'>se saca factor común</mark></summary><div class='steps'><ol>" +
          "<li>" + m`3{,}2 \cdot 10^{5} + 4 \cdot 10^{4} = 32 \cdot 10^{4} + 4 \cdot 10^{4}` + "</li>" +
          "<li><mark class='hl'>Factor común</mark> " + m`10^{4}` + ": " + m`(32 + 4) \cdot 10^{4} = 36 \cdot 10^{4} = 3{,}6 \cdot 10^{5}` + "</li></ol></div></details>" +
          "<div class='callout tip'><span class='ctitle'>Último paso</span>Comprueba siempre que la mantisa queda entre 1 y 10: " + m`12 \cdot 10^{3}` + " no está en notación científica; " + m`1{,}2 \cdot 10^{4}` + " sí.</div>"
      },
      /* ---------- 6 ---------- */
      {
        id: "aproximaciones", title: "Aproximaciones y errores",
        html: "<p>En la práctica trabajamos con <strong>aproximaciones</strong>: nadie paga " + m`\frac{10}{3}` + " € exactos. Hay dos formas de aproximar a un orden (décimas, centésimas…):</p>" +
          "<ul><li><strong>Truncamiento</strong>: se cortan las cifras a partir de ese orden.</li><li><strong>Redondeo</strong>: se mira la primera cifra que se elimina; si es 5 o más, se suma 1 a la última cifra que se conserva.</li></ul>" +
          "<div style='overflow-x:auto'><table class='num-table'><thead><tr><th>Número</th><th>Truncar a milésimas</th><th>Redondear a milésimas</th></tr></thead><tbody>" +
          "<tr><td>" + m`\pi = 3{,}14159\ldots` + "</td><td>3,141</td><td>3,142</td></tr>" +
          "<tr><td>" + m`\sqrt{2} = 1{,}41421\ldots` + "</td><td>1,414</td><td>1,414</td></tr>" +
          "<tr><td>" + m`\frac{2}{3} = 0{,}6666\ldots` + "</td><td>0,666</td><td>0,667</td></tr>" +
          "</tbody></table></div>" +
          "<p>Las <strong>cifras significativas</strong> son las que aportan información: en 0,00450 hay tres (4, 5 y el 0 final); los ceros de la izquierda no cuentan.</p>" +
          "<h3>Error absoluto y error relativo</h3>" +
          "<div class='callout formula'><span class='ctitle'>Definiciones</span>" + D`E_a = |\,\text{valor real} - \text{aproximación}\,| \qquad E_r = \frac{E_a}{|\,\text{valor real}\,|}` + "</div>" +
          "<p>El error relativo suele darse en <strong>porcentaje</strong> (" + m`E_r \cdot 100` + "). Es el que de verdad indica la calidad de una aproximación: equivocarse en 1 € es grave al comprar un café y despreciable al comprar un piso.</p>" +
          "<details class='example'><summary>Ejemplo: aproximamos " + m`\frac{2}{3}` + " por 0,67</summary><div class='steps'><ol>" +
          "<li>" + m`E_a = \left|\frac{2}{3} - 0{,}67\right| = \left|\frac{2}{3} - \frac{67}{100}\right| = \frac{1}{300} \approx 0{,}0033` + "</li>" +
          "<li>" + m`E_r = \frac{\frac{1}{300}}{\frac{2}{3}} = \frac{3}{600} = \frac{1}{200} = 0{,}005` + ", es decir, un <strong>0,5 %</strong>.</li></ol></div></details>"
      },
      /* ---------- 7 ---------- */
      {
        id: "acotacion", title: "Acotación de errores",
        html: "<p>Casi nunca conocemos el valor real (si lo conociéramos, no aproximaríamos). Lo que sí podemos dar es una <strong>cota del error</strong>: un número que el error seguro no supera.</p>" +
          "<ul><li>Si <strong>redondeamos</strong>, el error absoluto es como mucho <strong>media unidad</strong> del último orden que conservamos: al redondear a centésimas, " + m`E_a \le 0{,}005` + ".</li><li>Si <strong>truncamos</strong>, el error puede llegar a <strong>una unidad</strong> de ese orden: al truncar a centésimas, " + m`E_a < 0{,}01` + ".</li></ul>" +
          "<p>Como no conocemos el valor real, para acotar el error relativo dividimos la cota del error absoluto entre la aproximación (el resultado es una cota aproximada, suficiente en la práctica):</p>" +
          "<div class='callout formula'><span class='ctitle'>Cota del error relativo</span>" + D`E_r \le \frac{\text{cota de } E_a}{|\,\text{aproximación}\,|}` + "</div>" +
          "<details class='example'><summary>Ejemplo: un estudio dice que una ciudad tiene 2,4 millones de habitantes</summary><div class='steps'><ol>" +
          "<li>El dato está redondeado a las centenas de millar (décimas de millón), así que " + m`E_a \le 0{,}05` + " millones = 50 000 habitantes.</li>" +
          "<li>" + m`E_r \le \frac{0{,}05}{2{,}4} \approx 0{,}021` + " → el error es como mucho del <strong>2,1 %</strong>.</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo: " + m`\pi \approx 3{,}14` + "</summary><div class='steps'><ol>" +
          "<li>Redondeado a centésimas: cota de " + m`E_a = 0{,}005` + " (el error real es 0,0016, menor que la cota).</li>" +
          "<li>" + m`E_r \le \frac{0{,}005}{3{,}14} \approx 0{,}0016` + " → menos del <strong>0,16 %</strong>.</li></ol></div></details>"
      },
      /* ---------- 8 ---------- */
      {
        id: "radicales", title: "Potencias y radicales",
        html: "<h3>Potencias de exponente entero</h3>" +
          "<div class='summary-grid'><div class='summary-card'><b>Producto y cociente</b><p>" + m`a^{m} \cdot a^{n} = a^{m+n}` + "<br>" + m`\frac{a^{m}}{a^{n}} = a^{m-n}` + "</p></div><div class='summary-card'><b>Potencia de potencia</b><p>" + m`(a^{m})^{n} = a^{m \cdot n}` + "<br>" + m`(a \cdot b)^{n} = a^{n} \cdot b^{n}` + "</p></div><div class='summary-card'><b>Exponente 0 y negativo</b><p>" + m`a^{0} = 1 \;\; (a \neq 0)` + "<br>" + m`a^{-n} = \frac{1}{a^{n}}` + "</p></div><div class='summary-card'><b>Fracción con exponente negativo</b><p>" + m`\left(\frac{a}{b}\right)^{-n} = \left(\frac{b}{a}\right)^{n}` + "</p></div></div>" +
          "<p><strong>Operaciones combinadas con potencias:</strong> escribe todas las bases como potencias de números primos y aplica las propiedades.</p>" +
          "<details class='example'><summary>Ejemplo: " + m`\frac{2^{5} \cdot 4^{-1}}{8^{2}}` + "</summary><div class='steps'><ol>" +
          "<li>" + m`4 = 2^{2}` + " y " + m`8 = 2^{3}` + ": " + m`\frac{2^{5} \cdot 2^{-2}}{2^{6}}` + "</li>" +
          "<li>" + m`= 2^{5 - 2 - 6} = 2^{-3} = \frac{1}{8}` + "</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo: " + m`\frac{9^{2} \cdot 27^{-1}}{3^{-2}} \cdot \left(\frac{1}{3}\right)^{3}` + "</summary><div class='steps'><ol>" +
          "<li>Todo en base 3: " + m`\frac{3^{4} \cdot 3^{-3}}{3^{-2}} \cdot 3^{-3}` + "</li>" +
          "<li>" + m`= 3^{4 - 3 + 2 - 3} = 3^{0} = 1` + "</li></ol></div></details>" +
          "<div class='callout key'><span class='ctitle'>¡No lo olvides! Sacar factor común (propiedad distributiva)</span>" +
          D`a \cdot b + a \cdot c = a\,(b + c)` +
          "<p>Si un mismo factor aparece en <strong>todos</strong> los sumandos, se escribe <mark class='hl'>una sola vez fuera de un paréntesis</mark> y dentro queda lo que sobra de cada sumando. Es la herramienta para <strong>sumar potencias, radicales y números en notación científica</strong>, y la usarás en todos los temas de álgebra.</p>" +
          "<ul><li>" + m`2^{7} + 2^{5} = 2^{5}\,(2^{2} + 1) = 5 \cdot 2^{5} = 160` + "</li><li>" + m`3^{n+2} - 3^{n} = 3^{n}\,(3^{2} - 1) = 8 \cdot 3^{n}` + "</li><li>" + m`5\sqrt{2} + 3\sqrt{2} = (5 + 3)\sqrt{2} = 8\sqrt{2}` + "</li></ul>" +
          "<p style='margin:0'>Comprueba siempre: si vuelves a multiplicar (" + m`a\,(b + c) = ab + ac` + "), debes recuperar la expresión de partida.</p></div>" +
          "<h3>Radicales y potencias de exponente fraccionario</h3>" +
          "<div class='callout formula'><span class='ctitle'>Definición</span>" + D`\sqrt[n]{a^{m}} = a^{\tfrac{m}{n}}` + "<span style='font-family:var(--ff-body);font-size:.9rem'>" + m`n` + " es el <strong>índice</strong> y " + m`a^{m}` + " el <strong>radicando</strong>. Si " + m`n` + " es par, el radicando debe ser " + m`\ge 0` + ".</span></div>" +
          "<div class='summary-grid'><div class='summary-card'><b>Producto y cociente</b><p>" + m`\sqrt[n]{a \cdot b} = \sqrt[n]{a} \cdot \sqrt[n]{b}` + "<br>" + m`\sqrt[n]{\frac{a}{b}} = \frac{\sqrt[n]{a}}{\sqrt[n]{b}}` + "</p></div><div class='summary-card'><b>Potencia y raíz de raíz</b><p>" + m`\left(\sqrt[n]{a}\right)^{m} = \sqrt[n]{a^{m}}` + "<br>" + m`\sqrt[m]{\sqrt[n]{a}} = \sqrt[m \cdot n]{a}` + "</p></div></div>" +
          "<h3>Simplificar radicales</h3><p>Se dividen el índice y el exponente del radicando por el mismo número (como al simplificar fracciones):</p>" +
          D`\sqrt[6]{8} = \sqrt[6]{2^{3}} = \sqrt{2} \qquad \sqrt[12]{a^{8}} = \sqrt[3]{a^{2}}` +
          "<p><strong>Extraer factores:</strong> se descompone el radicando y cada grupo de " + m`n` + " factores iguales sale fuera:</p>" +
          D`\sqrt{72} = \sqrt{2^{3} \cdot 3^{2}} = 2 \cdot 3\,\sqrt{2} = 6\sqrt{2} \qquad \sqrt[3]{54} = \sqrt[3]{2 \cdot 3^{3}} = 3\sqrt[3]{2}` +
          "<p><strong>Sumar radicales:</strong> solo se pueden sumar los radicales <strong>semejantes</strong> (mismo índice y mismo radicando). Muchas veces lo son después de extraer factores:</p>" +
          "<details class='example'><summary>Sumar radicales <mark class='hl'>sacando factor común</mark>: " + m`\sqrt{50} + \sqrt{18} - \sqrt{8}` + "</summary><div class='steps'><ol>" +
          "<li>Extraemos factores: " + m`5\sqrt{2} + 3\sqrt{2} - 2\sqrt{2}` + "</li>" +
          "<li><mark class='hl'>Factor común</mark> " + m`\sqrt{2}` + ": " + m`(5 + 3 - 2)\sqrt{2} = 6\sqrt{2}` + "</li></ol></div></details>" +
          "<div class='callout warn'><span class='ctitle'>Error típico</span>" + m`\sqrt{9 + 16} \neq \sqrt{9} + \sqrt{16}` + ": la raíz no se reparte en las sumas (" + m`\sqrt{25} = 5` + ", pero " + m`3 + 4 = 7` + ").</div>" +
          "<h3>Escribir expresiones con un solo radical</h3><p>Se pasa todo a potencias de exponente fraccionario o se reducen los radicales a <strong>índice común</strong> (el m.c.m. de los índices):</p>" +
          "<details class='example'><summary>Ejemplo: " + m`\sqrt{2} \cdot \sqrt[3]{3}` + "</summary><div class='steps'><ol>" +
          "<li>m.c.m.(2, 3) = 6: " + m`\sqrt{2} = \sqrt[6]{2^{3}}` + " y " + m`\sqrt[3]{3} = \sqrt[6]{3^{2}}` + "</li>" +
          "<li>" + m`\sqrt[6]{2^{3} \cdot 3^{2}} = \sqrt[6]{72}` + "</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo: " + m`\sqrt{2\sqrt{2}}` + "</summary><div class='steps'><ol>" +
          "<li>Metemos el 2 dentro de la raíz interior: " + m`2\sqrt{2} = \sqrt{2^{2} \cdot 2} = \sqrt{8}` + "</li>" +
          "<li>Raíz de raíz: " + m`\sqrt{\sqrt{8}} = \sqrt[4]{8}` + "</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo: " + m`\frac{\sqrt[3]{a^{2}} \cdot \sqrt{a}}{\sqrt[6]{a}}` + "</summary><div class='steps'><ol>" +
          "<li>En potencias: " + m`\frac{a^{\tfrac{2}{3}} \cdot a^{\tfrac{1}{2}}}{a^{\tfrac{1}{6}}}` + "</li>" +
          "<li>Exponente: " + m`\frac{2}{3} + \frac{1}{2} - \frac{1}{6} = \frac{4 + 3 - 1}{6} = 1` + " → resultado " + m`a` + "</li></ol></div></details>" +
          "<h3>Racionalizar</h3><p>Racionalizar es quitar las raíces del denominador multiplicando arriba y abajo por el mismo número:</p>" +
          D`\frac{6}{\sqrt{3}} = \frac{6\sqrt{3}}{\sqrt{3}\,\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}` +
          "<p>Si el denominador es una suma o resta con raíces, se multiplica por el <strong>conjugado</strong> (" + m`(a + b)(a - b) = a^{2} - b^{2}` + "):</p>" +
          D`\frac{2}{\sqrt{5} - 1} = \frac{2(\sqrt{5} + 1)}{(\sqrt{5} - 1)(\sqrt{5} + 1)} = \frac{2(\sqrt{5} + 1)}{5 - 1} = \frac{\sqrt{5} + 1}{2}`
      },
      /* ---------- 9 ---------- */
      {
        id: "logaritmos", title: "Logaritmos",
        html: "<p>El <strong>logaritmo</strong> en base " + m`a` + " de un número " + m`b` + " es el exponente al que hay que elevar " + m`a` + " para obtener " + m`b` + ":</p>" +
          "<div class='callout formula'><span class='ctitle'>Definición</span>" + D`\log_{a} b = c \iff a^{c} = b \qquad (a > 0,\ a \neq 1,\ b > 0)` + "</div>" +
          "<ul><li>" + m`\log_{2} 8 = 3` + " porque " + m`2^{3} = 8` + ".</li><li>" + m`\log_{3} \frac{1}{9} = -2` + " porque " + m`3^{-2} = \frac{1}{9}` + ".</li><li>" + m`\log_{5} \sqrt{5} = \frac{1}{2}` + " porque " + m`5^{\tfrac{1}{2}} = \sqrt{5}` + ".</li></ul>" +
          "<p>El <strong>logaritmo decimal</strong> (base 10) se escribe " + m`\log` + " sin base: " + m`\log 1000 = 3` + ", " + m`\log 0{,}01 = -2` + ". El <strong>logaritmo neperiano</strong> (base " + m`e` + ") se escribe " + m`\ln` + ". Ambos están en la calculadora.</p>" +
          "<h3>Propiedades</h3>" +
          "<div class='summary-grid'><div class='summary-card'><b>Producto</b><p>" + m`\log_{a}(x \cdot y) = \log_{a} x + \log_{a} y` + "</p></div><div class='summary-card'><b>Cociente</b><p>" + m`\log_{a} \frac{x}{y} = \log_{a} x - \log_{a} y` + "</p></div><div class='summary-card'><b>Potencia</b><p>" + m`\log_{a} x^{n} = n \log_{a} x` + "</p></div><div class='summary-card'><b>Valores fijos</b><p>" + m`\log_{a} 1 = 0` + " · " + m`\log_{a} a = 1` + "</p></div><div class='summary-card'><b>Raíz</b><p>" + m`\log_{a} \sqrt[n]{x} = \frac{1}{n} \log_{a} x` + "</p></div><div class='summary-card'><b>Cambio de base</b><p>" + m`\log_{a} b = \frac{\log b}{\log a}` + "</p></div></div>" +
          "<h3>Calcular logaritmos conociendo otros</h3><p>Sabiendo que " + m`\log 2 \approx 0{,}3010` + " y " + m`\log 3 \approx 0{,}4771` + ", descompón el número en factores 2, 3 y 10:</p>" +
          "<div style='overflow-x:auto'><table class='num-table'><thead><tr><th>Logaritmo</th><th>Descomposición</th><th>Resultado</th></tr></thead><tbody>" +
          "<tr><td>" + m`\log 6` + "</td><td>" + m`\log 2 + \log 3` + "</td><td>0,7781</td></tr>" +
          "<tr><td>" + m`\log 5` + "</td><td>" + m`\log \frac{10}{2} = 1 - \log 2` + "</td><td>0,6990</td></tr>" +
          "<tr><td>" + m`\log 12` + "</td><td>" + m`2\log 2 + \log 3` + "</td><td>1,0791</td></tr>" +
          "<tr><td>" + m`\log 1{,}5` + "</td><td>" + m`\log \frac{3}{2} = \log 3 - \log 2` + "</td><td>0,1761</td></tr>" +
          "<tr><td>" + m`\log 0{,}08` + "</td><td>" + m`\log \frac{2^{3}}{10^{2}} = 3\log 2 - 2` + "</td><td>−1,0970</td></tr>" +
          "<tr><td>" + m`\log \sqrt{18}` + "</td><td>" + m`\frac{1}{2}(\log 2 + 2\log 3)` + "</td><td>0,6276</td></tr>" +
          "</tbody></table></div>" +
          "<details class='example'><summary>Aplicación: ¿cuántos años tarda en duplicarse un capital al 5 % anual compuesto?</summary><div class='steps'><ol>" +
          "<li>Cada año el capital se multiplica por 1,05: buscamos " + m`t` + " con " + m`1{,}05^{t} = 2` + ".</li>" +
          "<li>Tomamos logaritmos (con la calculadora, " + m`\log 1{,}05 \approx 0{,}0212` + "): " + m`t \cdot \log 1{,}05 = \log 2 \Rightarrow t = \frac{\log 2}{\log 1{,}05} = \frac{0{,}3010}{0{,}0212} \approx 14{,}2` + " años.</li>" +
          "<li>Lo usarás a fondo en el tema de matemática financiera.</li></ol></div></details>"
      }
    ],
    summary: [
      { t: "Racionales", d: "Se escriben como " + m`\frac{a}{b}` + ": decimales exactos o periódicos." },
      { t: "Generatriz", d: "Nueves por el periodo, ceros por el anteperiodo: " + m`1{,}2\overline{5} = \frac{113}{90}` + "." },
      { t: "Irracionales", d: "Infinitas cifras sin periodo: " + m`\sqrt{2}` + ", " + m`\pi` + ", " + m`e` + "." },
      { t: "Raíz de n en la recta", d: "Hipotenusa de catetos " + m`a` + " y " + m`b` + " con " + m`a^2 + b^2 = n` + "." },
      { t: "Reales", d: m`\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}` + " y " + m`\mathbb{R} = \mathbb{Q} \cup \mathbb{I}` + "." },
      { t: "Intervalos", d: "Corchete incluye, paréntesis no. En el infinito, siempre paréntesis." },
      { t: "Unión e intersección", d: m`A \cup B` + ": en alguno · " + m`A \cap B` + ": en los dos a la vez." },
      { t: "Notación científica", d: m`a \cdot 10^{n}` + " con " + m`1 \le |a| < 10` + "." },
      { t: "Errores", d: m`E_a = |\text{real} - \text{aprox.}|` + " · " + m`E_r = \frac{E_a}{|\text{real}|}` + "." },
      { t: "Cotas", d: "Redondeo: media unidad del último orden. Truncamiento: una unidad." },
      { t: "★ Factor común", d: m`a \cdot b + a \cdot c = a\,(b + c)` + ": para sumar potencias, radicales y notación científica.", key: true },
      { t: "Radicales", d: m`\sqrt[n]{a^{m}} = a^{\tfrac{m}{n}}` + "; simplifica, extrae factores y racionaliza." },
      { t: "Logaritmos", d: m`\log_{a} b = c \iff a^{c} = b` + "; producto → suma, potencia → multiplica." }
    ],
    mindmap: {
      root: "Números reales",
      branches: [
        { t: "Conjuntos", leaves: ["Naturales y enteros", "Racionales", "Irracionales", "Recta real"] },
        { t: "Intervalos", leaves: ["Abiertos y cerrados", "Semirrectas", "Unión e intersección"] },
        { t: "Aproximaciones", leaves: ["Redondeo", "Truncamiento", "Error absoluto", "Error relativo", "Cotas de error"] },
        { t: "Notación científica", leaves: ["Mantisa de 1 a 10", "Potencias de 10"] },
        { t: "Radicales", leaves: ["Exponente racional", "Simplificar", "Extraer factores", "Racionalizar"] },
        { t: "Logaritmos", leaves: ["Definición", "Propiedades", "Cambio de base"] }
      ]
    },
    games: [
      {
        id: "quiz-numeros", type: "quiz", title: "Contrarreloj: números e intervalos", desc: "12 preguntas · 120 s · 3 vidas", base: 35, time: 120, lives: 3,
        questions: [
          { q: "¿A qué conjunto pertenece " + m`\sqrt{7}` + "?", options: ["Irracionales", "Racionales", "Enteros", "Naturales"], answer: 0, explain: "7 no es un cuadrado perfecto: " + m`\sqrt{7}` + " tiene infinitas cifras sin periodo." },
          { q: "¿Cuál de estos números es racional?", options: [m`0{,}\overline{25}`, m`\sqrt{3}`, m`\pi`, m`0{,}1010010001\ldots`], answer: 0, explain: "Es periódico: " + m`0{,}\overline{25} = \frac{25}{99}` + "." },
          { q: m`\sqrt{16}` + " es un número…", options: ["Natural", "Irracional", "Racional no entero", "No real"], answer: 0, explain: m`\sqrt{16} = 4` + ", que es natural." },
          { q: "Fracción generatriz de " + m`0{,}\overline{6}`, options: [m`\frac{2}{3}`, m`\frac{6}{10}`, m`\frac{3}{5}`, m`\frac{1}{6}`], answer: 0, explain: m`\frac{6}{9} = \frac{2}{3}` + "." },
          { q: m`\sqrt{20}` + " está entre…", options: ["4 y 5", "3 y 4", "5 y 6", "10 y 11"], answer: 0, explain: m`16 < 20 < 25` + ", luego " + m`4 < \sqrt{20} < 5` + "." },
          { q: m`x \in [-1, 4)` + " significa…", options: [m`-1 \le x < 4`, m`-1 < x \le 4`, m`-1 < x < 4`, m`-1 \le x \le 4`], answer: 0, explain: "Corchete en −1 (se incluye) y paréntesis en 4 (no se incluye)." },
          { q: m`[-2, 3) \cap (1, 5] =`, options: [m`(1, 3)`, m`[-2, 5]`, m`(1, 5]`, m`[-2, 1)`], answer: 0, explain: "Solo se solapan entre 1 y 3, sin incluir ninguno de los dos." },
          { q: m`[-2, 3) \cup (1, 5] =`, options: [m`[-2, 5]`, m`(1, 3)`, m`[-2, 5)`, m`(-2, 5]`], answer: 0, explain: "Desde el −2 (incluido) hasta el 5 (incluido)." },
          { q: m`0{,}000\,72` + " en notación científica es…", options: [m`7{,}2 \cdot 10^{-4}`, m`72 \cdot 10^{-5}`, m`7{,}2 \cdot 10^{-3}`, m`0{,}72 \cdot 10^{-3}`], answer: 0, explain: "La coma se mueve 4 lugares a la derecha y la mantisa queda entre 1 y 10." },
          { q: "Redondea " + m`\pi = 3{,}14159\ldots` + " a centésimas", options: ["3,14", "3,15", "3,141", "3,1"], answer: 0, explain: "La primera cifra eliminada es 1 (menor que 5): se queda 3,14." },
          { q: "Cota del error absoluto al redondear a décimas", options: ["0,05", "0,1", "0,5", "0,01"], answer: 0, explain: "Media unidad de las décimas: 0,05." },
          { q: m`\sqrt{-9}` + " es…", options: ["No es un número real", "−3", "3", "Irracional"], answer: 0, explain: "Ningún número real al cuadrado da −9." }
        ]
      },
      {
        id: "quiz-radicales-logaritmos", type: "quiz", title: "Contrarreloj: potencias, radicales y logaritmos", desc: "12 preguntas · 150 s · 3 vidas", base: 40, time: 150, lives: 3,
        questions: [
          { q: "Simplifica " + m`\sqrt[6]{8}`, options: [m`\sqrt{2}`, m`\sqrt[3]{2}`, "2", m`\sqrt[6]{2}`], answer: 0, explain: m`\sqrt[6]{2^{3}} = \sqrt{2}` + " (dividimos índice y exponente entre 3)." },
          { q: "Simplifica " + m`\sqrt{72}`, options: [m`6\sqrt{2}`, m`2\sqrt{6}`, m`4\sqrt{3}`, m`36\sqrt{2}`], answer: 0, explain: m`\sqrt{36 \cdot 2} = 6\sqrt{2}` + "." },
          { q: m`\sqrt{50} + \sqrt{18} =`, options: [m`8\sqrt{2}`, m`\sqrt{68}`, m`15\sqrt{2}`, m`8\sqrt{4}`], answer: 0, explain: m`5\sqrt{2} + 3\sqrt{2} = 8\sqrt{2}` + "." },
          { q: m`\sqrt{2} \cdot \sqrt[3]{2}` + " con un solo radical", options: [m`\sqrt[6]{32}`, m`\sqrt[5]{2}`, m`\sqrt[6]{4}`, m`\sqrt[3]{4}`], answer: 0, explain: m`2^{\tfrac{1}{2} + \tfrac{1}{3}} = 2^{\tfrac{5}{6}} = \sqrt[6]{2^{5}}` + "." },
          { q: m`x^{\tfrac{3}{4}}` + " es igual a…", options: [m`\sqrt[4]{x^{3}}`, m`\sqrt[3]{x^{4}}`, m`\frac{x^{3}}{4}`, m`\frac{3x}{4}`], answer: 0, explain: "El denominador del exponente es el índice." },
          { q: "Racionaliza " + m`\frac{6}{\sqrt{3}}`, options: [m`2\sqrt{3}`, m`6\sqrt{3}`, m`\frac{\sqrt{3}}{2}`, m`3\sqrt{2}`], answer: 0, explain: m`\frac{6\sqrt{3}}{3} = 2\sqrt{3}` + "." },
          { q: m`\left(\frac{2}{3}\right)^{-2} =`, options: [m`\frac{9}{4}`, m`\frac{4}{9}`, m`-\frac{4}{9}`, m`\frac{3}{2}`], answer: 0, explain: "Se invierte la fracción y el exponente pasa a positivo." },
          { q: m`\frac{2^{5} \cdot 2^{-2}}{2^{6}} =`, options: [m`\frac{1}{8}`, "8", m`2^{13}`, m`\frac{1}{2}`], answer: 0, explain: m`2^{5 - 2 - 6} = 2^{-3}` + "." },
          { q: m`\log_{3} 81 =`, options: ["4", "3", "27", "9"], answer: 0, explain: m`3^{4} = 81` + "." },
          { q: m`\log_{2} \frac{1}{8} =`, options: ["−3", "3", m`\frac{1}{3}`, "−8"], answer: 0, explain: m`2^{-3} = \frac{1}{8}` + "." },
          { q: "Si " + m`\log 2 \approx 0{,}301` + ", ¿cuánto vale " + m`\log 8` + "?", options: ["0,903", "0,602", "2,408", "0,0903"], answer: 0, explain: m`\log 2^{3} = 3 \log 2` + "." },
          { q: "Si " + m`\log 2 \approx 0{,}301` + ", ¿cuánto vale " + m`\log 5` + "?", options: ["0,699", "0,602", "1,505", "0,151"], answer: 0, explain: m`\log \frac{10}{2} = 1 - 0{,}301` + "." }
        ]
      },
      {
        id: "match-intervalos", type: "match", title: "Empareja desigualdad e intervalo", desc: "Arrastra cada intervalo a su desigualdad", base: 25,
        pairs: [[m`-2 \le x < 3`, m`[-2, 3)`], [m`x > 5`, m`(5, +\infty)`], [m`x \le 1`, m`(-\infty, 1]`], [m`0 < x < 4`, m`(0, 4)`], [m`-1 < x \le 7`, m`(-1, 7]`], [m`x \ge -3`, m`[-3, +\infty)`]]
      },
      {
        id: "memory-radicales", type: "memory", title: "Memory: radicales y potencias", desc: "Une cada radical con su potencia de exponente fraccionario", base: 25, count: 6,
        pairs: [[m`\sqrt{5}`, m`5^{\tfrac{1}{2}}`], [m`\sqrt[3]{a^{2}}`, m`a^{\tfrac{2}{3}}`], [m`\sqrt[4]{x^{3}}`, m`x^{\tfrac{3}{4}}`], [m`\sqrt[5]{2}`, m`2^{\tfrac{1}{5}}`], [m`\frac{1}{\sqrt{x}}`, m`x^{-\tfrac{1}{2}}`], [m`\sqrt[3]{7^{5}}`, m`7^{\tfrac{5}{3}}`], [m`\sqrt{a^{3}}`, m`a^{\tfrac{3}{2}}`]]
      },
      {
        id: "order-reales", type: "order", title: "Ordena los números reales", desc: "De menor a mayor", base: 25,
        help: "Ordena de <strong>menor a mayor</strong>. Arrastra o usa las flechas.",
        items: [m`-\sqrt{5}`, m`-2`, m`-\frac{3}{2}`, m`0{,}\overline{3}`, m`\frac{1}{2}`, m`\sqrt{2}`, m`\pi`]
      },
      {
        id: "fill-cientifica-errores", type: "fill", title: "Notación científica y errores", desc: "Completa los exponentes y calcula errores", base: 35,
        help: "Escribe números enteros o decimales (con coma o punto). Para negativos usa el signo −.",
        items: [
          { t: m`45\,000\,000 = 4{,}5 \cdot 10^{n}` + " → n = ___", a: ["7"] },
          { t: m`0{,}000\,32 = 3{,}2 \cdot 10^{n}` + " → n = ___", a: ["-4", "−4"] },
          { t: m`(3 \cdot 10^{5}) \cdot (2 \cdot 10^{-2}) = 6 \cdot 10^{n}` + " → n = ___", a: ["3"], why: m`10^{5 + (-2)} = 10^{3}` },
          { t: "Error absoluto al aproximar 2,47 por 2,5 = ___", a: ["0,03", "0.03"], why: m`|2{,}47 - 2{,}5| = 0{,}03` },
          { t: "Cota del error absoluto al redondear a milésimas = ___", a: ["0,0005", "0.0005"], why: "Media unidad de las milésimas" },
          { t: "Error relativo (en %) al aproximar 50 por 49 = ___ %", a: ["2"], why: m`\frac{|50 - 49|}{50} = 0{,}02` }
        ]
      },
      {
        id: "fill-logaritmos", type: "fill", title: "Calcula logaritmos", desc: "Con " + m`\log 2 \approx 0{,}3010` + " y " + m`\log 3 \approx 0{,}4771`, base: 35,
        help: "Usa " + m`\log 2 \approx 0{,}3010` + " y " + m`\log 3 \approx 0{,}4771` + ". Escribe 4 decimales.",
        items: [
          { t: m`\log 6 \approx` + " ___", a: ["0,7781", "0.7781"], why: m`\log 2 + \log 3` },
          { t: m`\log 5 \approx` + " ___", a: ["0,6990", "0.6990", "0,699", "0.699"], why: m`1 - \log 2` },
          { t: m`\log 12 \approx` + " ___", a: ["1,0791", "1.0791"], why: m`2\log 2 + \log 3` },
          { t: m`\log 1{,}5 \approx` + " ___", a: ["0,1761", "0.1761"], why: m`\log 3 - \log 2` },
          { t: m`\log_{2} 64 =` + " ___", a: ["6"], why: m`2^{6} = 64` },
          { t: m`\log 0{,}001 =` + " ___", a: ["-3", "−3"], why: m`10^{-3} = 0{,}001` }
        ]
      },
      {
        id: "hangman-reales", type: "hangman", title: "Ahorcado de los números reales", desc: "Adivina el vocabulario del tema", base: 15, count: 3,
        words: [
          { w: "IRRACIONAL", h: "Número con infinitas cifras decimales que no se repiten" },
          { w: "INTERVALO", h: "Conjunto de reales entre dos extremos" },
          { w: "RADICANDO", h: "Lo que está dentro de la raíz" },
          { w: "LOGARITMO", h: "El exponente al que hay que elevar la base" },
          { w: "TRUNCAMIENTO", h: "Aproximar cortando las cifras sobrantes" },
          { w: "GENERATRIZ", h: "La fracción que da lugar a un decimal periódico" }
        ]
      }
    ],
    premium: [
      { ico: "🎯", title: "Simulacro de examen del tema 1", desc: "10 ejercicios tipo examen con la solución paso a paso" },
      { ico: "📊", title: "Errores y notación científica en datos reales", desc: "Problemas con datos del INE, presupuestos y encuestas" },
      { ico: "📝", title: "Apuntes completos en PDF", desc: "Teoría, tablas de propiedades y ejemplos para imprimir" }
    ]
  };
})();
