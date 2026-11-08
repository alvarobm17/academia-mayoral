/* =========================================================================
   Contenido desarrollado — Matemáticas 3º ESO
   Plantilla de tema: intro, minutes, video, sections[], summary[], mindmap{},
   games[], premium[]. Copia este archivo para crear otras asignaturas.

   NORMA DE FÓRMULAS (obligatoria en todo el contenido):
   · Fracciones SIEMPRE con barra horizontal:  m`\frac{3}{4}`   (nunca "3/4")
   · Raíces SIEMPRE cubriendo todo el radicando: m`\sqrt{b^2-4ac}` (nunca "√(…)")
   · m`...`  → fórmula en línea      D`...` → fórmula centrada y grande
   · Excepción: lo que el alumno ESCRIBE en un hueco (fill) se teclea con "/".
   · Los mapas mentales son SVG y no admiten fórmulas: usa texto sin fracciones.
   ========================================================================= */
(function () {
  "use strict";
  var C = (window.AM = window.AM || {}).CONTENT = window.AM.CONTENT || {};
  var m = function (s) { return "\\(" + String.raw.apply(String, arguments) + "\\)"; };
  var D = function (s) { return "\\[" + String.raw.apply(String, arguments) + "\\]"; };

  /* =====================================================================
     TEMA 1 · NÚMEROS RACIONALES
     ===================================================================== */
  C["3eso/matematicas/numeros-racionales"] = {
    minutes: 30,
    intro: "Una fracción es una forma de repartir: " + m`\frac{3}{4}` + " de pizza son 3 trozos de una pizza cortada en 4. En este tema aprenderás a comparar, simplificar y operar fracciones, y a pasar de fracción a decimal y al revés.",
    video: { youtube: "", title: "Operaciones con fracciones en 8 minutos" },
    sections: [
      {
        id: "que-es", title: "¿Qué es un número racional?",
        html: "<p>Un <strong>número racional</strong> es cualquier número que se puede escribir como una fracción " + m`\frac{a}{b}` + " con " + m`a` + " y " + m`b` + " enteros y " + m`b \neq 0` + ". El conjunto se llama " + m`\mathbb{Q}` + ".</p>" +
          "<ul><li>El <strong>numerador</strong> (arriba) indica las partes que tomamos.</li><li>El <strong>denominador</strong> (abajo) indica en cuántas partes iguales dividimos la unidad.</li></ul>" +
          "<p>Todos los enteros son racionales: " + m`5 = \frac{5}{1}` + ", " + m`-2 = \frac{-2}{1}` + ". También lo son los decimales exactos y los periódicos.</p>" +
          "<div class='callout tip'><span class='ctitle'>Truco</span>Si el numerador es mayor que el denominador, la fracción es mayor que 1 (fracción <strong>impropia</strong>). Por ejemplo, " + m`\frac{7}{4} = 1 + \frac{3}{4}` + ".</div>"
      },
      {
        id: "equivalentes", title: "Fracciones equivalentes y simplificación",
        html: "<p>Dos fracciones son <strong>equivalentes</strong> si representan la misma cantidad. Se comprueba con los <strong>productos cruzados</strong>:</p>" +
          "<div class='callout formula'><span class='ctitle'>Regla</span>" + D`\frac{a}{b} = \frac{c}{d} \iff a \cdot d = b \cdot c` + "</div>" +
          "<p>Para <strong>simplificar</strong> dividimos numerador y denominador entre el mismo número. Si dividimos entre el <strong>máximo común divisor (m.c.d.)</strong>, obtenemos la <strong>fracción irreducible</strong> en un solo paso.</p>" +
          "<details class='example'><summary>Ejemplo: simplifica " + m`\frac{36}{48}` + "</summary><div class='steps'><ol><li>m.c.d.(36, 48): " + m`36 = 2^2\cdot 3^2` + ", " + m`48 = 2^4\cdot 3` + " → m.c.d. = " + m`2^2\cdot 3 = 12` + ".</li><li>Dividimos: 36 : 12 = 3 y 48 : 12 = 4.</li><li>Resultado: " + m`\frac{36}{48} = \frac{3}{4}` + " (irreducible).</li></ol></div></details>"
      },
      {
        id: "operaciones", title: "Operaciones con fracciones",
        html: "<h3>Suma y resta</h3><p>Con el <strong>mismo denominador</strong>, se suman los numeradores. Con <strong>distinto denominador</strong>, primero se reduce a común denominador usando el <strong>m.c.m.</strong>:</p>" +
          "<details class='example'><summary>Ejemplo: " + m`\frac{2}{3} + \frac{5}{4}` + "</summary><div class='steps'><ol><li>m.c.m.(3, 4) = 12.</li><li>" + m`\frac{2}{3} = \frac{8}{12}` + " y " + m`\frac{5}{4} = \frac{15}{12}` + ".</li><li>" + m`\frac{8}{12} + \frac{15}{12} = \frac{23}{12}` + ".</li></ol></div></details>" +
          "<h3>Multiplicación y división</h3><div class='callout formula'><span class='ctitle'>Fórmulas</span>" + D`\frac{a}{b}\cdot\frac{c}{d} = \frac{a\cdot c}{b\cdot d} \qquad \frac{a}{b} : \frac{c}{d} = \frac{a\cdot d}{b\cdot c}` + "</div>" +
          "<p>Para dividir, multiplicamos <strong>en cruz</strong> (o, lo que es igual, multiplicamos por la fracción inversa).</p>" +
          "<h3>Jerarquía de operaciones</h3><p>El orden es siempre: <strong>paréntesis → potencias → multiplicaciones y divisiones → sumas y restas</strong> (de izquierda a derecha si tienen la misma prioridad).</p>" +
          "<div class='callout warn'><span class='ctitle'>Error típico</span>" + m`\frac{2}{3} + \frac{1}{3}\cdot 3` + " no es 3: primero se multiplica (" + m`\frac{1}{3}\cdot 3 = 1` + ") y luego se suma → " + m`\frac{2}{3} + 1 = \frac{5}{3}` + ".</div>"
      },
      {
        id: "decimales", title: "Fracciones y números decimales",
        html: "<p>Para pasar de fracción a decimal se <strong>divide</strong> el numerador entre el denominador. Puede salir:</p>" +
          "<ul><li><strong>Decimal exacto</strong>: " + m`\frac{3}{8} = 0{,}375` + " (el denominador irreducible solo tiene los factores 2 y 5).</li><li><strong>Periódico puro</strong>: " + m`\frac{1}{3} = 0{,}333\ldots = 0{,}\overline{3}` + ".</li><li><strong>Periódico mixto</strong>: " + m`\frac{1}{6} = 0{,}1666\ldots = 0{,}1\overline{6}` + ".</li></ul>" +
          "<h3>De decimal a fracción (fracción generatriz)</h3>" +
          "<div class='summary-grid'><div class='summary-card'><b>Exacto</b><p>" + m`0{,}75 = \frac{75}{100} = \frac{3}{4}` + "</p></div><div class='summary-card'><b>Periódico puro</b><p>" + m`0{,}\overline{45} = \frac{45}{99} = \frac{5}{11}` + "</p></div><div class='summary-card'><b>Periódico mixto</b><p>" + m`0{,}1\overline{6} = \frac{16-1}{90} = \frac{15}{90} = \frac{1}{6}` + "</p></div><div class='summary-card'><b>Regla rápida</b><p>Un 9 por cada cifra del periodo y un 0 por cada cifra del anteperiodo.</p></div></div>"
      }
    ],
    summary: [
      { t: "Racional", d: "Número que se puede escribir como " + m`\frac{a}{b}` + " con " + m`b\neq 0` + "." },
      { t: "Equivalencia", d: m`\frac{a}{b} = \frac{c}{d}` + " si " + m`a\cdot d = b\cdot c` + "." },
      { t: "Simplificar", d: "Dividir arriba y abajo entre el m.c.d." },
      { t: "Sumar/restar", d: "Común denominador con el m.c.m." },
      { t: "Multiplicar", d: "En línea: " + m`\frac{a}{b}\cdot\frac{c}{d} = \frac{a\cdot c}{b\cdot d}` + "." },
      { t: "Dividir", d: "En cruz: " + m`\frac{a}{b} : \frac{c}{d} = \frac{a\cdot d}{b\cdot c}` + "." },
      { t: "Jerarquía", d: "( ) → potencias → · y : → + y −." },
      { t: "Generatriz", d: "Nueves por el periodo, ceros por el anteperiodo." }
    ],
    mindmap: {
      root: "Números racionales",
      branches: [
        { t: "Concepto", leaves: ["Cociente de enteros", "Denominador ≠ 0", "Propias e impropias"] },
        { t: "Equivalencia", leaves: ["Productos cruzados", "Irreducible (m.c.d.)"] },
        { t: "Operaciones", leaves: ["Suma: m.c.m.", "Producto en línea", "División en cruz"] },
        { t: "Decimales", leaves: ["Exactos", "Periódicos puros", "Periódicos mixtos"] }
      ]
    },
    games: [
      {
        id: "quiz-fracciones", type: "quiz", title: "Contrarreloj de fracciones", desc: "12 preguntas · 90 s · 3 vidas", base: 30, time: 90, lives: 3,
        questions: [
          { q: "¿Cuánto es " + m`\frac{1}{2} + \frac{1}{3}` + "?", options: [m`\frac{5}{6}`, m`\frac{2}{5}`, m`\frac{1}{6}`, m`\frac{2}{6}`], answer: 0, explain: "m.c.m. = 6 → " + m`\frac{3}{6} + \frac{2}{6} = \frac{5}{6}` + "." },
          { q: "Simplifica " + m`\frac{18}{24}`, options: [m`\frac{3}{4}`, m`\frac{2}{3}`, m`\frac{9}{12}`, m`\frac{6}{8}`], answer: 0, explain: "m.c.d.(18, 24) = 6 → " + m`\frac{3}{4}` + "." },
          { q: "¿Cuánto es " + m`\frac{2}{5}\cdot\frac{10}{3}` + "?", options: [m`\frac{4}{3}`, m`\frac{20}{8}`, m`\frac{12}{15}`, m`\frac{2}{3}`], answer: 0, explain: m`\frac{20}{15} = \frac{4}{3}` + "." },
          { q: "¿Cuánto es " + m`\frac{3}{4} : \frac{1}{2}` + "?", options: [m`\frac{3}{2}`, m`\frac{3}{8}`, m`\frac{1}{4}`, m`\frac{2}{3}`], answer: 0, explain: "En cruz: " + m`\frac{3\cdot 2}{4\cdot 1} = \frac{6}{4} = \frac{3}{2}` + "." },
          { q: "¿Qué fracción es equivalente a " + m`\frac{4}{6}` + "?", options: [m`\frac{10}{15}`, m`\frac{8}{10}`, m`\frac{6}{8}`, m`\frac{12}{20}`], answer: 0, explain: m`4\cdot 15 = 60 = 6\cdot 10` + "." },
          { q: "¿Qué tipo de decimal es " + m`\frac{1}{3}` + "?", options: ["Periódico puro", "Exacto", "Periódico mixto", "Irracional"], answer: 0, explain: m`0{,}333\ldots` + " El periodo empieza justo tras la coma." },
          { q: "Fracción generatriz de " + m`0{,}25`, options: [m`\frac{1}{4}`, m`\frac{25}{10}`, m`\frac{1}{25}`, m`\frac{2}{5}`], answer: 0, explain: m`\frac{25}{100} = \frac{1}{4}` + "." },
          { q: "¿Cuál es mayor?", options: [m`\frac{5}{7}`, m`\frac{2}{3}`, m`\frac{7}{11}`, m`\frac{3}{5}`], answer: 0, explain: m`\frac{5}{7}\approx 0{,}714` + "; " + m`\frac{2}{3}\approx 0{,}667` + "; " + m`\frac{7}{11}\approx 0{,}636` + "; " + m`\frac{3}{5} = 0{,}6` + "." },
          { q: "Calcula " + m`2 - \frac{3}{4}`, options: [m`\frac{5}{4}`, m`\frac{1}{4}`, m`-\frac{1}{4}`, m`\frac{1}{2}`], answer: 0, explain: m`\frac{8}{4} - \frac{3}{4} = \frac{5}{4}` + "." },
          { q: "Calcula " + m`\frac{1}{2} + \frac{1}{2}\cdot 4`, options: [m`\frac{5}{2}`, "2", "4", m`\frac{3}{2}`], answer: 0, explain: "Primero el producto: " + m`\frac{1}{2}\cdot 4 = 2` + " → " + m`\frac{1}{2} + 2 = \frac{5}{2}` + "." },
          { q: "Fracción generatriz de " + m`0{,}\overline{3}`, options: [m`\frac{1}{3}`, m`\frac{3}{10}`, m`\frac{33}{100}`, m`\frac{1}{30}`], answer: 0, explain: "Periodo de una cifra → " + m`\frac{3}{9} = \frac{1}{3}` + "." },
          { q: "¿Cuál de estos NO es racional?", options: [m`\sqrt{2}`, m`0{,}5`, m`-7`, m`0{,}\overline{12}`], answer: 0, explain: m`\sqrt{2}` + " tiene infinitas cifras sin periodo: es irracional." }
        ]
      },
      {
        id: "match-decimales", type: "match", title: "Empareja fracción y decimal", desc: "Arrastra cada decimal a su fracción", base: 25,
        pairs: [[m`\frac{1}{4}`, "0,25"], [m`\frac{3}{5}`, "0,6"], [m`\frac{1}{3}`, "0,333…"], [m`\frac{7}{8}`, "0,875"], [m`\frac{1}{6}`, "0,1666…"], [m`\frac{5}{2}`, "2,5"]]
      },
      {
        id: "memory-fracciones", type: "memory", title: "Memory de equivalentes", desc: "Encuentra las parejas de fracciones equivalentes", base: 20, count: 6,
        pairs: [[m`\frac{2}{4}`, m`\frac{1}{2}`], [m`\frac{6}{9}`, m`\frac{2}{3}`], [m`\frac{12}{16}`, m`\frac{3}{4}`], [m`\frac{15}{25}`, m`\frac{3}{5}`], [m`\frac{8}{20}`, m`\frac{2}{5}`], [m`\frac{10}{12}`, m`\frac{5}{6}`], [m`\frac{8}{14}`, m`\frac{4}{7}`], [m`\frac{14}{20}`, m`\frac{7}{10}`]]
      },
      {
        id: "fill-operaciones", type: "fill", title: "Opera y completa", desc: "Escribe el resultado simplificado", base: 30,
        help: "Escribe la fracción irreducible con barra, por ejemplo 3/4. Si es entero, escribe solo el número.",
        items: [
          { t: m`\frac{3}{5} + \frac{1}{5} =` + " ___", a: ["4/5"] },
          { t: m`\frac{5}{6} - \frac{1}{3} =` + " ___", a: ["1/2", "3/6"], why: m`\frac{5}{6} - \frac{2}{6} = \frac{3}{6} = \frac{1}{2}` },
          { t: m`\frac{4}{9}\cdot\frac{3}{2} =` + " ___", a: ["2/3"], why: m`\frac{12}{18} = \frac{2}{3}` },
          { t: m`\frac{2}{7} : \frac{4}{21} =` + " ___", a: ["3/2"], why: m`\frac{2\cdot 21}{7\cdot 4} = \frac{42}{28} = \frac{3}{2}` },
          { t: m`\left(\frac{1}{2} + \frac{1}{4}\right)\cdot 8 =` + " ___", a: ["6"], why: m`\frac{3}{4}\cdot 8 = 6` }
        ]
      }
    ],
    premium: [
      { ico: "🚀", title: "Reto avanzado: operaciones combinadas", desc: "20 ejercicios con paréntesis y potencias, con solución paso a paso" },
      { ico: "📝", title: "Apuntes completos en PDF", desc: "Teoría ampliada lista para imprimir" },
      { ico: "🎯", title: "Simulacro de examen", desc: "Examen tipo con corrección automática" }
    ]
  };

  /* =====================================================================
     TEMA 5 · ECUACIONES DE PRIMER Y SEGUNDO GRADO
     ===================================================================== */
  C["3eso/matematicas/ecuaciones"] = {
    minutes: 40,
    intro: "Una ecuación es una balanza en equilibrio con un valor escondido, la incógnita. Resolverla es averiguar ese valor sin desequilibrar la balanza: todo lo que hagas a un lado, házselo también al otro.",
    video: { youtube: "", title: "Ecuaciones de 2º grado: la fórmula explicada" },
    sections: [
      {
        id: "conceptos", title: "Conceptos básicos",
        html: "<p>Una <strong>ecuación</strong> es una igualdad entre dos expresiones algebraicas que solo se cumple para ciertos valores de la incógnita.</p>" +
          "<ul><li><strong>Miembros</strong>: lo que hay a la izquierda y a la derecha del signo =.</li><li><strong>Grado</strong>: el mayor exponente de la incógnita (una vez simplificada).</li><li><strong>Solución</strong>: valor que hace cierta la igualdad.</li></ul>" +
          "<div class='callout tip'><span class='ctitle'>Comprueba siempre</span>Sustituye tu solución en la ecuación original. Si ambos miembros dan lo mismo, está bien. Esto te salva puntos en los exámenes.</div>"
      },
      {
        id: "primer-grado", title: "Ecuaciones de primer grado",
        html: "<p>Son de la forma " + m`ax + b = 0` + ". Se resuelven siguiendo siempre el mismo orden:</p>" +
          "<ol><li><strong>Quitar paréntesis</strong> (propiedad distributiva).</li><li><strong>Quitar denominadores</strong> multiplicando todo por el m.c.m.</li><li><strong>Transponer</strong>: términos con x a un lado, números al otro (lo que suma pasa restando y viceversa).</li><li><strong>Reducir</strong> términos semejantes.</li><li><strong>Despejar</strong> x (lo que multiplica pasa dividiendo).</li></ol>" +
          "<details class='example'><summary>Ejemplo: " + m`3(x - 2) + 4 = x + 6` + "</summary><div class='steps'><ol><li>Paréntesis: " + m`3x - 6 + 4 = x + 6` + ".</li><li>Transponer: " + m`3x - x = 6 + 6 - 4` + ".</li><li>Reducir: " + m`2x = 8` + ".</li><li>Despejar: " + m`x = \frac{8}{2} = 4` + ".</li><li>Comprobación: " + m`3(4 - 2) + 4 = 10` + " y " + m`4 + 6 = 10` + " ✓</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo con denominadores: " + m`\frac{x}{2} + \frac{x}{3} = 10` + "</summary><div class='steps'><ol><li>m.c.m.(2, 3) = 6. Multiplicamos todo por 6: " + m`3x + 2x = 60` + ".</li><li>Reducir: " + m`5x = 60` + ".</li><li>Despejar: " + m`x = \frac{60}{5} = 12` + ".</li></ol></div></details>" +
          "<div class='callout warn'><span class='ctitle'>Cuidado con el signo menos</span>Un signo − delante de una fracción afecta a <strong>todo</strong> el numerador: " + m`-\frac{x - 3}{2}` + " → al quitar denominadores queda " + m`-x + 3` + ".</div>"
      },
      {
        id: "segundo-grado", title: "Ecuaciones de segundo grado",
        html: "<p>Son de la forma " + m`ax^2 + bx + c = 0` + " con " + m`a \neq 0` + ". La solución general es:</p>" +
          "<div class='callout formula'><span class='ctitle'>Fórmula general</span>" + D`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` + "</div>" +
          "<p>El número " + m`\Delta = b^2 - 4ac` + " (discriminante) te dice cuántas soluciones hay <em>antes</em> de calcularlas:</p>" +
          "<div class='summary-grid'><div class='summary-card'><b>" + m`\Delta > 0` + "</b><p>Dos soluciones reales distintas.</p></div><div class='summary-card'><b>" + m`\Delta = 0` + "</b><p>Una solución doble: " + m`x = \frac{-b}{2a}` + ".</p></div><div class='summary-card'><b>" + m`\Delta < 0` + "</b><p>No tiene solución real.</p></div><div class='summary-card'><b>Consejo</b><p>Calcula " + m`\Delta` + " primero y escríbelo aparte: menos errores.</p></div></div>" +
          "<details class='example'><summary>Ejemplo: " + m`x^2 - 5x + 6 = 0` + "</summary><div class='steps'><ol><li>" + m`a = 1,\; b = -5,\; c = 6` + ".</li><li>" + m`\Delta = (-5)^2 - 4\cdot 1\cdot 6 = 25 - 24 = 1` + " → dos soluciones.</li><li>" + m`x = \frac{5 \pm \sqrt{1}}{2} = \frac{5 \pm 1}{2}` + " → " + m`x_1 = 3` + ", " + m`x_2 = 2` + ".</li></ol></div></details>"
      },
      {
        id: "incompletas", title: "Ecuaciones incompletas",
        html: "<p>Si falta " + m`b` + " o " + m`c` + ", no hace falta la fórmula:</p>" +
          "<ul><li><strong>b = 0</strong> → " + m`ax^2 + c = 0` + ": despeja " + m`x^2` + " y haz la raíz. Ejemplo: " + m`x^2 - 9 = 0 \Rightarrow x^2 = 9 \Rightarrow x = \pm\sqrt{9} = \pm 3` + ".</li><li><strong>c = 0</strong> → " + m`ax^2 + bx = 0` + ": saca factor común. Ejemplo: " + m`x^2 - 4x = 0 \Rightarrow x(x - 4) = 0` + " → " + m`x = 0` + " o " + m`x = 4` + ".</li></ul>" +
          "<div class='callout warn'><span class='ctitle'>Error típico</span>En " + m`x^2 - 4x = 0` + " no dividas entre x: perderías la solución " + m`x = 0` + ".</div>"
      },
      {
        id: "problemas", title: "Resolver problemas con ecuaciones",
        html: "<ol><li><strong>Lee</strong> el enunciado dos veces y localiza qué te piden.</li><li><strong>Llama x</strong> a esa cantidad desconocida.</li><li><strong>Traduce</strong> las frases a lenguaje algebraico.</li><li><strong>Resuelve</strong> la ecuación.</li><li><strong>Interpreta</strong>: ¿tiene sentido? (una edad negativa, por ejemplo, se descarta).</li></ol>" +
          "<details class='example'><summary>Ejemplo: la suma de tres números consecutivos es 72</summary><div class='steps'><ol><li>Números: " + m`x,\; x + 1,\; x + 2` + ".</li><li>" + m`x + (x + 1) + (x + 2) = 72 \Rightarrow 3x + 3 = 72` + ".</li><li>" + m`3x = 69 \Rightarrow x = \frac{69}{3} = 23` + ".</li><li>Los números son <strong>23, 24 y 25</strong>.</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo: un rectángulo mide 3 cm más de largo que de ancho y su área es 40 cm²</summary><div class='steps'><ol><li>Ancho " + m`x` + ", largo " + m`x + 3` + ".</li><li>" + m`x(x + 3) = 40 \Rightarrow x^2 + 3x - 40 = 0` + ".</li><li>" + m`\Delta = 9 + 160 = 169` + " → " + m`x = \frac{-3 \pm \sqrt{169}}{2} = \frac{-3 \pm 13}{2}` + " → " + m`x = 5` + " o " + m`x = -8` + ".</li><li>Una longitud no puede ser negativa: ancho <strong>5 cm</strong>, largo <strong>8 cm</strong>.</li></ol></div></details>"
      }
    ],
    summary: [
      { t: "Ecuación", d: "Igualdad con incógnitas que se cumple solo para ciertos valores." },
      { t: "1er grado", d: "Paréntesis → denominadores → transponer → reducir → despejar." },
      { t: "2º grado", d: m`x = \frac{-b \pm \sqrt{\Delta}}{2a}` + ", con " + m`\Delta = b^2 - 4ac` + "." },
      { t: "Discriminante", d: m`\Delta > 0` + ": dos soluciones · " + m`\Delta = 0` + ": una · " + m`\Delta < 0` + ": ninguna real." },
      { t: "Incompleta b = 0", d: "Despeja " + m`x^2` + " y haz la raíz: dos soluciones opuestas." },
      { t: "Incompleta c = 0", d: "Factor común: una solución siempre es " + m`x = 0` + "." },
      { t: "Problemas", d: "Elige x, traduce, resuelve e interpreta el resultado." },
      { t: "Comprobar", d: "Sustituye la solución en la ecuación original." }
    ],
    mindmap: {
      root: "Ecuaciones",
      branches: [
        { t: "Elementos", leaves: ["Miembros", "Incógnita", "Grado", "Solución"] },
        { t: "Primer grado", leaves: ["ax + b = 0", "Quitar paréntesis", "Quitar denominadores"] },
        { t: "Segundo grado", leaves: ["Fórmula general", "Discriminante Δ", "Incompletas"] },
        { t: "Problemas", leaves: ["Plantear", "Resolver", "Interpretar"] }
      ]
    },
    games: [
      {
        id: "quiz-ecuaciones", type: "quiz", title: "Contrarreloj de ecuaciones", desc: "10 preguntas · 100 s · 3 vidas", base: 35, time: 100, lives: 3,
        questions: [
          { q: "Resuelve: " + m`2x + 5 = 17`, options: [m`x = 6`, m`x = 11`, m`x = 7`, m`x = 12`], answer: 0, explain: m`2x = 12 \Rightarrow x = 6` + "." },
          { q: "Resuelve: " + m`5x - 3 = 2x + 9`, options: [m`x = 4`, m`x = 2`, m`x = 3`, m`x = 6`], answer: 0, explain: m`3x = 12 \Rightarrow x = 4` + "." },
          { q: "Resuelve: " + m`\frac{x}{4} = 3`, options: [m`x = 12`, m`x = \frac{3}{4}`, m`x = 7`, m`x = 1`], answer: 0, explain: m`x = 3\cdot 4 = 12` + "." },
          { q: "¿Cuántas soluciones tiene " + m`x^2 + 4 = 0` + "?", options: ["Ninguna real", "Dos", "Una", "Infinitas"], answer: 0, explain: m`x^2 = -4` + ": ningún número real al cuadrado da negativo." },
          { q: "Soluciones de " + m`x^2 - 16 = 0`, options: [m`x = \pm 4`, m`x = 4`, m`x = 8`, m`x = \pm 8`], answer: 0, explain: m`x^2 = 16 \Rightarrow x = \pm\sqrt{16} = \pm 4` + "." },
          { q: "Soluciones de " + m`x^2 - 7x = 0`, options: ["0 y 7", "7", "−7 y 7", "0 y −7"], answer: 0, explain: m`x(x - 7) = 0 \Rightarrow x = 0` + " o " + m`x = 7` + "." },
          { q: "Discriminante de " + m`x^2 - 6x + 9 = 0`, options: ["0", "36", "72", "−36"], answer: 0, explain: m`36 - 36 = 0` + " → solución doble " + m`x = 3` + "." },
          { q: "Soluciones de " + m`x^2 - 5x + 6 = 0`, options: ["2 y 3", "−2 y −3", "1 y 6", "5 y 6"], answer: 0, explain: m`\Delta = 1 \Rightarrow x = \frac{5 \pm 1}{2}` + "." },
          { q: "Si " + m`\Delta > 0` + ", la ecuación de 2º grado tiene…", options: ["Dos soluciones distintas", "Una solución doble", "Ninguna solución", "Tres soluciones"], answer: 0, explain: m`\pm\sqrt{\Delta}` + " da dos valores distintos." },
          { q: "El doble de un número más 4 es 20. ¿Qué número es?", options: ["8", "12", "10", "6"], answer: 0, explain: m`2x + 4 = 20 \Rightarrow x = 8` + "." }
        ]
      },
      {
        id: "order-pasos", type: "order", title: "Ordena los pasos", desc: "El método de 1er grado, en su orden", base: 20,
        help: "Ordena los pasos para resolver una ecuación de primer grado con paréntesis y denominadores.",
        items: ["Quitar paréntesis", "Quitar denominadores (m.c.m.)", "Transponer términos", "Reducir términos semejantes", "Despejar la incógnita", "Comprobar la solución"]
      },
      {
        id: "fill-ecuaciones", type: "fill", title: "Resuelve y completa", desc: "Escribe la solución de cada ecuación", base: 35,
        items: [
          { t: m`4x - 7 = 13 \;\Rightarrow\; x =` + " ___", a: ["5"] },
          { t: m`3(x + 2) = 21 \;\Rightarrow\; x =` + " ___", a: ["5"], why: m`3x + 6 = 21 \Rightarrow 3x = 15` },
          { t: m`\frac{x}{3} + \frac{x}{6} = 5 \;\Rightarrow\; x =` + " ___", a: ["10"], why: m`2x + x = 30 \Rightarrow x = 10` },
          { t: m`x^2 = 49 \;\Rightarrow\; x = \pm` + " ___", a: ["7"] },
          { t: m`x^2 - 3x - 10 = 0 \;\Rightarrow` + " soluciones ___ y ___", a: [["5", "-2", "−2"], ["-2", "−2", "5"]], why: m`\Delta = 49 \Rightarrow x = \frac{3 \pm 7}{2}` }
        ]
      },
      {
        id: "match-discriminante", type: "match", title: "¿Cuántas soluciones?", desc: "Empareja cada ecuación con su número de soluciones", base: 25,
        pairs: [[m`x^2 - 4x + 4 = 0`, "Una (doble)"], [m`x^2 + x + 5 = 0`, "Ninguna real"], [m`x^2 - 1 = 0`, "Dos: ±1"], [m`2x + 6 = 0`, "Una: x = −3"], [m`x^2 - 3x = 0`, "Dos: 0 y 3"]]
      },
      {
        id: "hangman-ecuaciones", type: "hangman", title: "Ahorcado del álgebra", desc: "Adivina el vocabulario del tema", base: 15, count: 3,
        words: [
          { w: "DISCRIMINANTE", h: "Se calcula con " + m`b^2 - 4ac` },
          { w: "INCOGNITA", h: "El valor desconocido de la ecuación" },
          { w: "MIEMBRO", h: "Cada lado del signo igual" },
          { w: "TRANSPONER", h: "Pasar un término al otro lado cambiando su operación" },
          { w: "COEFICIENTE", h: "Número que multiplica a la x" }
        ]
      }
    ],
    premium: [
      { ico: "🚀", title: "Ecuaciones bicuadradas, racionales e irracionales", desc: "Ampliación con 25 ejercicios resueltos" },
      { ico: "🧩", title: "Banco de 40 problemas de enunciado", desc: "Edades, móviles, mezclas y geometría" },
      { ico: "📝", title: "Apuntes completos en PDF", desc: "Teoría, fórmulas y ejemplos en 6 páginas" }
    ]
  };

  /* =====================================================================
     TEMA 9 · PITÁGORAS Y TALES
     ===================================================================== */
  C["3eso/matematicas/pitagoras-y-tales"] = {
    minutes: 35,
    intro: "Con dos teoremas de hace más de 2.500 años puedes medir la altura de un edificio con su sombra o saber si una tele de 55 pulgadas cabe en tu mueble. Vamos a ver cómo.",
    video: { youtube: "", title: "Pitágoras y Tales con ejemplos reales" },
    sections: [
      {
        id: "pitagoras", title: "Teorema de Pitágoras",
        html: "<p>En un <strong>triángulo rectángulo</strong> (con un ángulo de 90°), el lado más largo, opuesto al ángulo recto, se llama <strong>hipotenusa</strong> (" + m`a` + "). Los otros dos son los <strong>catetos</strong> (" + m`b` + " y " + m`c` + ").</p>" +
          "<div class='callout formula'><span class='ctitle'>Teorema</span>" + D`a^2 = b^2 + c^2` + "</div>" +
          "<div class='grid-2' style='align-items:center;margin:20px 0'><svg viewBox='0 0 240 170' role='img' aria-label='Triángulo rectángulo con catetos b y c e hipotenusa a' style='max-width:300px'><polygon points='30,140 210,140 30,30' fill='color-mix(in srgb, var(--accent) 18%, transparent)' stroke='var(--accent)' stroke-width='3'/><rect x='30' y='122' width='18' height='18' fill='none' stroke='var(--text)' stroke-width='2'/><text x='12' y='90' fill='var(--text)' font-size='18' font-weight='700' font-style='italic'>b</text><text x='115' y='162' fill='var(--text)' font-size='18' font-weight='700' font-style='italic'>c</text><text x='128' y='78' fill='var(--accent)' font-size='18' font-weight='700' font-style='italic'>a</text></svg>" +
          "<div><p><strong>Para calcular la hipotenusa</strong>: " + m`a = \sqrt{b^2 + c^2}` + ".</p><p><strong>Para calcular un cateto</strong>: " + m`b = \sqrt{a^2 - c^2}` + ".</p></div></div>" +
          "<details class='example'><summary>Ejemplo: catetos de 6 cm y 8 cm</summary><div class='steps'><ol><li>" + m`a^2 = 6^2 + 8^2 = 36 + 64 = 100` + ".</li><li>" + m`a = \sqrt{100} = 10` + " cm.</li></ol></div></details>" +
          "<details class='example'><summary>Ejemplo real: ¿cabe la tele?</summary><div class='steps'><p>Una tele de 55\" (≈ 140 cm de diagonal) en formato 16:9 mide unos 122 cm de ancho. ¿Cuánto mide de alto?</p><ol><li>" + m`\text{alto} = \sqrt{140^2 - 122^2} = \sqrt{19600 - 14884} = \sqrt{4716}` + ".</li><li>" + m`\text{alto} \approx 68{,}7` + " cm.</li></ol></div></details>" +
          "<div class='callout tip'><span class='ctitle'>Ternas pitagóricas</span>Memoriza 3-4-5, 5-12-13 y 8-15-17 (y sus múltiplos, como 6-8-10): aparecen muchísimo en los exámenes.</div>"
      },
      {
        id: "clasificar", title: "¿Es rectángulo? Clasificar triángulos",
        html: "<p>Con los tres lados de un triángulo, siendo " + m`a` + " el mayor, comparamos " + m`a^2` + " con " + m`b^2 + c^2` + ":</p>" +
          "<div class='summary-grid'><div class='summary-card'><b>" + m`a^2 = b^2 + c^2` + "</b><p>Rectángulo</p></div><div class='summary-card'><b>" + m`a^2 < b^2 + c^2` + "</b><p>Acutángulo</p></div><div class='summary-card'><b>" + m`a^2 > b^2 + c^2` + "</b><p>Obtusángulo</p></div><div class='summary-card'><b>Ejemplo</b><p>Lados 7, 8, 12: " + m`144 > 49 + 64 = 113` + " → obtusángulo.</p></div></div>"
      },
      {
        id: "tales", title: "Teorema de Tales y semejanza",
        html: "<p>Si dos rectas secantes se cortan por varias <strong>rectas paralelas</strong>, los segmentos que se forman son <strong>proporcionales</strong>.</p>" +
          "<div class='callout formula'><span class='ctitle'>Teorema de Tales</span>" + D`\frac{AB}{A'B'} = \frac{BC}{B'C'} = \frac{AC}{A'C'}` + "</div>" +
          "<p>Dos figuras son <strong>semejantes</strong> si tienen la misma forma: ángulos iguales y lados proporcionales. El cociente entre lados correspondientes es la <strong>razón de semejanza</strong> " + m`k` + ".</p>" +
          "<ul><li>Perímetros: razón " + m`k` + ".</li><li>Áreas: razón " + m`k^2` + ".</li><li>Volúmenes: razón " + m`k^3` + ".</li></ul>" +
          "<details class='example'><summary>Ejemplo: la altura de un árbol con su sombra</summary><div class='steps'><p>Un palo de 1,5 m da una sombra de 2 m. A la misma hora, un árbol da una sombra de 12 m.</p><ol><li>Los triángulos son semejantes (los rayos del sol llegan paralelos).</li><li>" + m`\frac{h}{12} = \frac{1{,}5}{2} \Rightarrow h = 12\cdot 0{,}75` + ".</li><li>" + m`h = 9` + " m.</li></ol></div></details>"
      }
    ],
    summary: [
      { t: "Pitágoras", d: m`a^2 = b^2 + c^2` + " (a = hipotenusa)." },
      { t: "Hipotenusa", d: m`a = \sqrt{b^2 + c^2}` + "." },
      { t: "Cateto", d: m`b = \sqrt{a^2 - c^2}` + "." },
      { t: "Ternas", d: "3-4-5 · 5-12-13 · 8-15-17 y sus múltiplos." },
      { t: "Clasificar", d: "Compara " + m`a^2` + " con " + m`b^2 + c^2` + ": =, < o >." },
      { t: "Tales", d: "Paralelas que cortan secantes → segmentos proporcionales." },
      { t: "Semejanza", d: "Lados × " + m`k` + ", áreas × " + m`k^2` + ", volúmenes × " + m`k^3` + "." },
      { t: "Sombras", d: m`\frac{\text{objeto}}{\text{sombra}} = \frac{\text{objeto}'}{\text{sombra}'}` }
    ],
    mindmap: {
      root: "Pitágoras y Tales",
      branches: [
        { t: "Pitágoras", leaves: ["a² = b² + c²", "Hipotenusa y catetos", "Ternas"] },
        { t: "Clasificación", leaves: ["Rectángulo", "Acutángulo", "Obtusángulo"] },
        { t: "Tales", leaves: ["Rectas paralelas", "Proporcionalidad"] },
        { t: "Semejanza", leaves: ["Razón k", "Áreas k²", "Volúmenes k³"] }
      ]
    },
    games: [
      {
        id: "quiz-pitagoras", type: "quiz", title: "Contrarreloj geométrico", desc: "8 preguntas · 80 s · 3 vidas", base: 30, time: 80, lives: 3,
        questions: [
          { q: "Catetos de 3 y 4. ¿Hipotenusa?", options: ["5", "7", "6", "12"], answer: 0, explain: m`\sqrt{9 + 16} = \sqrt{25} = 5` + "." },
          { q: "Hipotenusa 13 y un cateto 5. ¿El otro cateto?", options: ["12", "8", "18", m`\sqrt{194}`], answer: 0, explain: m`\sqrt{169 - 25} = \sqrt{144} = 12` + "." },
          { q: "¿Los lados 6, 8 y 10 forman un triángulo rectángulo?", options: ["Sí", "No"], answer: 0, keepOrder: true, explain: m`100 = 36 + 64` + " ✓ (es 3-4-5 por 2)." },
          { q: "Triángulo de lados 4, 5 y 7. ¿Cómo es?", options: ["Obtusángulo", "Rectángulo", "Acutángulo"], answer: 0, explain: m`49 > 16 + 25 = 41` + "." },
          { q: "Razón de semejanza " + m`k = 3` + ". ¿Cuántas veces mayor es el área?", options: ["9", "3", "6", "27"], answer: 0, explain: "Áreas: " + m`k^2 = 9` + "." },
          { q: "Razón " + m`k = 2` + ". ¿Y el volumen?", options: ["8", "4", "2", "6"], answer: 0, explain: "Volúmenes: " + m`k^3 = 8` + "." },
          { q: "Diagonal de un cuadrado de lado 1", options: [m`\sqrt{2}`, "2", "1", m`\sqrt{3}`], answer: 0, explain: m`\sqrt{1 + 1} = \sqrt{2} \approx 1{,}41` + "." },
          { q: "Un palo de 2 m da 3 m de sombra. Un edificio da 30 m. ¿Altura?", options: ["20 m", "45 m", "15 m", "25 m"], answer: 0, explain: m`\frac{h}{30} = \frac{2}{3} \Rightarrow h = 20` + " m." }
        ]
      },
      {
        id: "memory-ternas", type: "memory", title: "Memory de ternas pitagóricas", desc: "Une los catetos con su hipotenusa", base: 20, count: 6,
        pairs: [["3 y 4", "5"], ["5 y 12", "13"], ["8 y 15", "17"], ["6 y 8", "10"], ["9 y 12", "15"], ["7 y 24", "25"], ["20 y 21", "29"]]
      },
      {
        id: "fill-pitagoras", type: "fill", title: "Calcula el lado", desc: "Aplica Pitágoras y Tales", base: 30,
        items: [
          { t: "Catetos 9 y 12 → hipotenusa = ___", a: ["15"], why: m`\sqrt{81 + 144} = \sqrt{225}` },
          { t: "Hipotenusa 25 y cateto 7 → otro cateto = ___", a: ["24"], why: m`\sqrt{625 - 49} = \sqrt{576}` },
          { t: "Rectángulo de 5 × 12: diagonal = ___", a: ["13"], why: m`\sqrt{25 + 144} = \sqrt{169}` },
          { t: "Escalera de 5 m apoyada a 3 m de la pared: llega a ___ m de altura", a: ["4"], why: m`\sqrt{25 - 9} = \sqrt{16}` },
          { t: "Un palo de 1 m da 0,5 m de sombra; un árbol da 4 m → altura del árbol = ___ m", a: ["8"], why: m`\frac{h}{4} = \frac{1}{0{,}5}` }
        ]
      },
      {
        id: "match-semejanza", type: "match", title: "Conceptos de geometría", desc: "Empareja cada concepto con su definición", base: 20,
        pairs: [["Hipotenusa", "Lado opuesto al ángulo recto"], ["Catetos", "Lados que forman el ángulo recto"], ["Razón de semejanza", "Cociente entre lados correspondientes"], ["Teorema de Tales", "Paralelas cortan segmentos proporcionales"], ["Terna pitagórica", "Tres enteros que cumplen " + m`a^2 = b^2 + c^2`]]
      }
    ],
    premium: [
      { ico: "🚀", title: "Pitágoras en 3D", desc: "Diagonales de ortoedros, conos y pirámides" },
      { ico: "📝", title: "Apuntes completos en PDF", desc: "Con figuras listas para imprimir" },
      { ico: "🎯", title: "Simulacro de examen", desc: "10 problemas tipo examen corregidos" }
    ]
  };
})();
