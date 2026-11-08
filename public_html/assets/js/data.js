/* =========================================================================
   Academia Mayoral — temario (cursos, asignaturas e índices de temas)
   Para añadir un tema: añádelo a la lista. Si tiene contenido desarrollado,
   crea su archivo en assets/js/content/ con la misma clave (curso/asignatura/id).
   ========================================================================= */
(function () {
  "use strict";
  var AM = (window.AM = window.AM || {});

  function slug(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  }

  var courses = [
    { id: "1eso", name: "1º ESO", short: "1º", stage: "ESO", age: "12–13 años" },
    { id: "2eso", name: "2º ESO", short: "2º", stage: "ESO", age: "13–14 años" },
    { id: "3eso", name: "3º ESO", short: "3º", stage: "ESO", age: "14–15 años" },
    { id: "4eso", name: "4º ESO", short: "4º", stage: "ESO", age: "15–16 años" },
    { id: "1bach", name: "1º Bachillerato", short: "1º", stage: "Bach", age: "16–17 años" },
    { id: "2bach", name: "2º Bachillerato", short: "2º", stage: "Bach", age: "17–18 años · PAU" }
  ];

  var subjects = {
    lengua: { name: "Lengua", full: "Lengua Castellana y Literatura", ico: "📖", glyph: "Aa", desc: "Gramática, sintaxis, ortografía, textos y literatura." },
    matematicas: { name: "Matemáticas", full: "Matemáticas", ico: "📐", glyph: "π", desc: "Números, álgebra, funciones, geometría y estadística." },
    "matematicas-ccss": { name: "Matemáticas CCSS", full: "Matemáticas Aplicadas a las Ciencias Sociales", ico: "📊", glyph: "Σ", desc: "Álgebra, funciones, estadística y probabilidad aplicadas a la economía y la sociedad." },
    historia: { name: "Historia", full: "Geografía e Historia", ico: "🏛️", glyph: "∞", desc: "Geografía, de la Prehistoria al mundo actual, y arte." },
    fisica: { name: "Física", full: "Física", ico: "⚛️", glyph: "F", desc: "Movimiento, fuerzas, energía, electricidad y ondas." },
    quimica: { name: "Química", full: "Química", ico: "🧪", glyph: "H₂O", desc: "Materia, átomos, tabla periódica, enlaces y reacciones." }
  };
  /* Orden de las tarjetas. Cada curso muestra solo las asignaturas que tienen temario en T
     (Matemáticas CCSS solo existe en Bachillerato). */
  var subjectOrder = ["lengua", "matematicas", "matematicas-ccss", "historia", "fisica", "quimica"];

  /* Nombre corto en las tarjetas y descripción cuando cambian según el curso */
  var cardNames = {
    matematicas: { "1bach": "Matemáticas I", "2bach": "Matemáticas II" },
    "matematicas-ccss": { "1bach": "Matemáticas CCSS I", "2bach": "Matemáticas CCSS II" }
  };
  var cardDescs = {
    matematicas: { "1bach": "Ciencias y Tecnología: trigonometría, vectores, funciones, límites y derivadas.", "2bach": "Ciencias y Tecnología: matrices, geometría en el espacio, análisis y probabilidad." },
    "matematicas-ccss": { "1bach": "Humanidades y CCSS: matemática financiera, funciones, estadística y probabilidad.", "2bach": "Humanidades y CCSS: matrices, programación lineal, análisis e inferencia estadística." }
  };

  /* Nombre oficial por curso cuando cambia */
  var officialNames = {
    historia: { "1bach": "Historia del Mundo Contemporáneo", "2bach": "Historia de España" },
    fisica: { "2eso": "Física y Química (bloque de Física)", "3eso": "Física y Química (bloque de Física)", "4eso": "Física y Química (bloque de Física)", "1bach": "Física y Química (bloque de Física)" },
    quimica: { "2eso": "Física y Química (bloque de Química)", "3eso": "Física y Química (bloque de Química)", "4eso": "Física y Química (bloque de Química)", "1bach": "Física y Química (bloque de Química)" },
    matematicas: { "1bach": "Matemáticas I", "2bach": "Matemáticas II" },
    "matematicas-ccss": { "1bach": "Matemáticas Aplicadas a las Ciencias Sociales I", "2bach": "Matemáticas Aplicadas a las Ciencias Sociales II" }
  };

  var notes = {
    "1eso/fisica": "En 1º ESO la Física y Química no se cursa como asignatura (se estudia Biología y Geología). Puedes adelantar contenidos con el temario de 2º ESO.",
    "1eso/quimica": "En 1º ESO la Física y Química no se cursa como asignatura (se estudia Biología y Geología). Puedes adelantar contenidos con el temario de 2º ESO."
  };

  /* Presentaciones de asignatura por defecto (se pueden personalizar por curso) */
  var intros = {
    lengua: "Aprender a usar bien la lengua es aprender a pensar con claridad. Aquí encontrarás la gramática explicada con esquemas, trucos de ortografía y la literatura contada como una historia, con sus autores y obras clave.",
    matematicas: "Las matemáticas no se memorizan: se entienden. Cada tema empieza por la idea intuitiva, sigue con el método paso a paso y termina con ejercicios-juego para que el procedimiento se te quede.",
    "matematicas-ccss": "Las matemáticas que usan la economía, la sociología o la empresa: interés compuesto, funciones que modelan datos reales, estadística para interpretar encuestas y probabilidad para tomar decisiones. Orientadas al itinerario de Humanidades y Ciencias Sociales y a la PAU.",
    historia: "La historia explica por qué el mundo es como es. Te lo contamos con líneas del tiempo, mapas mentales y causas–consecuencias, para que lo entiendas en vez de memorizar fechas sueltas.",
    fisica: "La física describe cómo se mueve y funciona todo lo que te rodea. Aquí verás cada fórmula con su significado, sus unidades y problemas resueltos paso a paso.",
    quimica: "La química estudia de qué está hecha la materia y cómo se transforma. Tabla periódica, enlaces, formulación y reacciones, con juegos para fijar símbolos y reglas."
  };

  /* Índices de temas. Formato: "Título" o ["id", "Título", "descripción breve"] */
  var T = {
    "1eso": {
      lengua: ["La comunicación y sus elementos", "Clases de palabras: sustantivo, adjetivo y determinantes", "El verbo y su conjugación", "Ortografía: acentuación, b/v, g/j y h", "La narración y la descripción", "Formación de palabras", "La literatura y los géneros literarios", "Recursos literarios básicos"],
      matematicas: ["Números naturales", "Divisibilidad: múltiplos y divisores", "Números enteros", "Fracciones", "Números decimales", "Proporcionalidad y porcentajes", "Iniciación al álgebra", "Rectas y ángulos", "Polígonos y circunferencia", "Perímetros y áreas", "Estadística básica"],
      historia: ["La Tierra y su representación", "El relieve terrestre", "Las aguas: ríos, mares y océanos", "Climas y paisajes", "La Prehistoria", "Mesopotamia y Egipto", "La antigua Grecia", "Roma", "La Hispania romana"],
      fisica: [],
      quimica: []
    },
    "2eso": {
      lengua: ["Pronombres, adverbios, preposiciones y conjunciones", "El sintagma y sus clases", "La oración simple: sujeto y predicado", "Los complementos del verbo", "Textos expositivos e instructivos", "Sinonimia, antonimia y polisemia", "Métrica: verso, rima y estrofa", "Lírica, narrativa y teatro"],
      matematicas: ["Números enteros y divisibilidad", "Fracciones y decimales", "Potencias y raíces", "Proporcionalidad", "Expresiones algebraicas", "Ecuaciones de primer grado", "Iniciación a los sistemas de ecuaciones", "Funciones", "Teorema de Pitágoras", "Semejanza", "Cuerpos geométricos", "Estadística y probabilidad"],
      historia: ["Los reinos germánicos", "Bizancio y el islam", "El feudalismo", "Al-Ándalus", "Los reinos cristianos peninsulares", "La Baja Edad Media", "Población y ciudades", "Arte románico y gótico"],
      fisica: ["La actividad científica", "Magnitudes y unidades", "El movimiento", "Las fuerzas y sus efectos", "La energía", "Calor y temperatura", "Luz y sonido"],
      quimica: ["La materia y sus propiedades", "Estados de agregación", "Sustancias puras y mezclas", "Separación de mezclas", "El átomo", "Cambios físicos y químicos"]
    },
    "3eso": {
      lengua: ["Análisis de la oración simple", "Clasificación de la oración simple", "Propiedades del texto: adecuación, coherencia y cohesión", "Textos argumentativos", "Las variedades de la lengua", "Literatura medieval", "El Renacimiento", "El Barroco"],
      matematicas: [
        ["numeros-racionales", "Números racionales y fracciones", "Fracciones equivalentes, operaciones y decimales"],
        ["potencias-y-raices", "Potencias y raíces", "Propiedades, notación científica y radicales"],
        ["sucesiones-y-progresiones", "Sucesiones y progresiones", "Aritméticas y geométricas"],
        ["polinomios", "Polinomios y expresiones algebraicas", "Operaciones e identidades notables"],
        ["ecuaciones", "Ecuaciones de primer y segundo grado", "Métodos de resolución y problemas"],
        ["sistemas-de-ecuaciones", "Sistemas de ecuaciones", "Sustitución, igualación y reducción"],
        ["funciones-y-graficas", "Funciones y gráficas", "Dominio, crecimiento y extremos"],
        ["funciones-lineales-y-cuadraticas", "Funciones lineales y cuadráticas", "Rectas y parábolas"],
        ["pitagoras-y-tales", "Geometría plana: Pitágoras y Tales", "Triángulos rectángulos y semejanza"],
        ["movimientos-en-el-plano", "Movimientos en el plano", "Traslaciones, giros y simetrías"],
        ["cuerpos-geometricos", "Cuerpos geométricos", "Áreas y volúmenes"],
        ["estadistica", "Estadística", "Tablas, gráficos y parámetros"],
        ["probabilidad", "Probabilidad", "Experimentos aleatorios y regla de Laplace"]
      ],
      historia: ["La Edad Moderna y el Renacimiento", "Los grandes descubrimientos geográficos", "Los Reyes Católicos", "El Imperio de los Austrias", "El Barroco", "Los sectores económicos", "Globalización y desarrollo sostenible"],
      fisica: ["El método científico y la medida", "El movimiento rectilíneo uniforme", "Las fuerzas y las leyes de Newton", "La gravedad", "Electricidad y circuitos", "Energía y fuentes de energía"],
      quimica: ["Teoría cinética y leyes de los gases", "Disoluciones y concentración", "Modelos atómicos", "La tabla periódica", "El enlace químico", "Formulación inorgánica", "Reacciones químicas y el mol"]
    },
    "4eso": {
      lengua: ["Coordinación y yuxtaposición", "Subordinadas sustantivas", "Subordinadas de relativo", "Subordinadas adverbiales", "Textos periodísticos y digitales", "Siglo XVIII y Romanticismo", "Realismo y Naturalismo", "Modernismo, 98 y 27", "Literatura desde 1939"],
      matematicas: ["Números reales", "Potencias, radicales y logaritmos", "Polinomios y fracciones algebraicas", "Ecuaciones e inecuaciones", "Sistemas de ecuaciones", "Funciones elementales", "Funciones exponenciales y logarítmicas", "Trigonometría", "Geometría analítica", "Combinatoria", "Probabilidad", "Estadística bidimensional"],
      historia: ["El Antiguo Régimen y la Ilustración", "Las revoluciones liberales", "La Revolución Industrial", "España en el siglo XIX", "Imperialismo y Primera Guerra Mundial", "El periodo de entreguerras", "La Segunda República y la Guerra Civil", "La Segunda Guerra Mundial", "La Guerra Fría", "Franquismo y Transición", "El mundo actual"],
      fisica: ["Cinemática: MRU, MRUA y circular", "Dinámica: las leyes de Newton", "Gravitación universal", "Presión y fuerzas en fluidos", "Trabajo, energía y potencia", "Calor y termodinámica", "Ondas: luz y sonido"],
      quimica: ["Configuración electrónica", "El sistema periódico", "Enlace químico y fuerzas intermoleculares", "Formulación inorgánica", "Química del carbono", "Estequiometría", "Velocidad de reacción", "Ácidos y bases"]
    },
    "1bach": {
      lengua: ["Las categorías gramaticales en profundidad", "Sintaxis de la oración compuesta", "El comentario de texto", "Textos humanísticos y periodísticos", "Literatura medieval y prerrenacentista", "Los Siglos de Oro", "Ilustración y Romanticismo", "Realismo y Naturalismo"],
      matematicas: ["Números reales", "Trigonometría", "Números complejos", "Vectores", "Geometría analítica del plano", "Funciones", "Límites y continuidad", "Derivadas", "Aplicaciones de la derivada", "Estadística bidimensional", "Probabilidad"],
      "matematicas-ccss": [["numeros-reales", "Números reales", "Racionales, irracionales, intervalos, errores, radicales y logaritmos"], "Matemática financiera: interés simple y compuesto", "Polinomios y fracciones algebraicas", "Ecuaciones, inecuaciones y sistemas", "Funciones elementales", "Funciones exponenciales y logarítmicas", "Límites y continuidad", "Derivadas", "Estadística unidimensional", "Estadística bidimensional: correlación y regresión", "Probabilidad", "Distribuciones binomial y normal"],
      historia: ["El Antiguo Régimen", "Las revoluciones industriales", "Revoluciones liberales y nacionalismos", "El movimiento obrero", "El imperialismo", "Primera Guerra Mundial y Revolución rusa", "Entreguerras y crisis del 29", "Los totalitarismos", "La Segunda Guerra Mundial", "Guerra Fría y descolonización", "El mundo actual"],
      fisica: ["Cinemática vectorial", "Dinámica", "Trabajo y energía", "Movimiento armónico simple", "Gravitación", "Electrostática"],
      quimica: ["Teoría atómico-molecular", "Gases y disoluciones", "Estequiometría", "Termoquímica", "Química del carbono", "Formulación orgánica"]
    },
    "2bach": {
      lengua: ["El comentario crítico (PAU)", "Sintaxis completa", "Mecanismos de cohesión", "Modernismo y Generación del 98", "La Generación del 27", "Novela y teatro de posguerra", "Poesía desde 1939", "Literatura actual", "Lecturas obligatorias"],
      matematicas: ["Matrices", "Determinantes", "Sistemas de ecuaciones lineales", "Vectores en el espacio", "Rectas y planos", "Límites y continuidad", "Derivadas y aplicaciones", "Integrales indefinidas", "Integral definida y áreas", "Probabilidad", "Distribuciones binomial y normal"],
      "matematicas-ccss": ["Matrices", "Determinantes", "Sistemas de ecuaciones lineales", "Programación lineal", "Límites y continuidad", "Derivadas", "Aplicaciones de la derivada: optimización", "Integrales y cálculo de áreas", "Probabilidad", "Muestreo e inferencia estadística", "Intervalos de confianza"],
      historia: ["De la Prehistoria a la Monarquía Hispánica", "Crisis del Antiguo Régimen (1788–1833)", "El Estado liberal (1833–1874)", "La Restauración (1874–1902)", "Crisis de la Restauración (1902–1931)", "La Segunda República", "La Guerra Civil", "El franquismo", "Transición y democracia", "Comentario de fuentes (PAU)"],
      fisica: ["Campo gravitatorio", "Campo eléctrico", "Campo magnético e inducción", "Ondas", "Óptica geométrica", "Física relativista", "Física cuántica", "Física nuclear"],
      quimica: ["Estructura atómica", "El sistema periódico", "El enlace químico", "Cinética química", "Equilibrio químico", "Reacciones ácido-base", "Reacciones redox y electroquímica", "Química orgánica y polímeros"]
    }
  };

  // Normaliza a objetos {id, title, desc}
  var topics = {};
  Object.keys(T).forEach(function (c) {
    topics[c] = {};
    Object.keys(T[c]).forEach(function (s) {
      topics[c][s] = T[c][s].map(function (t) {
        return Array.isArray(t) ? { id: t[0], title: t[1], desc: t[2] || "" } : { id: slug(t), title: t, desc: "" };
      });
    });
  });

  var achievements = [
    { id: "primer_paso", ico: "🎯", name: "Primer paso", desc: "Completa tu primer ejercicio" },
    { id: "perfecto", ico: "💯", name: "Perfeccionista", desc: "Saca un 100 % en un ejercicio" },
    { id: "racha_3", ico: "🔥", name: "En racha", desc: "Practica 3 días seguidos" },
    { id: "racha_7", ico: "🌋", name: "Imparable", desc: "Practica 7 días seguidos" },
    { id: "xp_100", ico: "⭐", name: "100 XP", desc: "Consigue 100 puntos" },
    { id: "xp_500", ico: "🌟", name: "500 XP", desc: "Consigue 500 puntos" },
    { id: "xp_2000", ico: "🏆", name: "Leyenda", desc: "Consigue 2000 puntos" },
    { id: "contrarreloj", ico: "⏱️", name: "Contrarreloj", desc: "Gana un quiz sin perder vidas" },
    { id: "memoria", ico: "🧠", name: "Memoria de elefante", desc: "Completa un memory" },
    { id: "explorador", ico: "🧭", name: "Explorador", desc: "Prueba los 6 tipos de juego" },
    { id: "social", ico: "🤝", name: "En equipo", desc: "Añade a un amigo" },
    { id: "tema_completo", ico: "📚", name: "Tema dominado", desc: "Completa todos los ejercicios de un tema" }
  ];

  var leagues = [
    { id: "bronce", name: "Bronce", min: 0, color: "#C2814D" },
    { id: "plata", name: "Plata", min: 150, color: "#B8C2D3" },
    { id: "oro", name: "Oro", min: 400, color: "#E8B04B" },
    { id: "zafiro", name: "Zafiro", min: 800, color: "#3B82F6" },
    { id: "diamante", name: "Diamante", min: 1500, color: "#67E8F9" }
  ];

  var gameTypes = {
    quiz: { ico: "⏱️", name: "Quiz contrarreloj" },
    match: { ico: "🔗", name: "Arrastra y empareja" },
    memory: { ico: "🃏", name: "Memory" },
    fill: { ico: "✍️", name: "Completa los huecos" },
    hangman: { ico: "🪢", name: "Ahorcado" },
    order: { ico: "↕️", name: "Ordena los pasos" }
  };

  AM.DATA = {
    courses: courses, subjects: subjects, subjectOrder: subjectOrder, officialNames: officialNames, cardNames: cardNames, cardDescs: cardDescs,
    /* Archivos de contenido desarrollado disponibles en assets/js/content/ */
    contentFiles: ["3eso-matematicas", "1bach-matematicas-ccss"],
    notes: notes, intros: intros, topics: topics, achievements: achievements, leagues: leagues, gameTypes: gameTypes,
    plans: { monthly: { price: "4,99 €", per: "/mes" }, yearly: { price: "39 €", per: "/año", note: "Equivale a 3,25 €/mes" } }
  };
  AM.CONTENT = AM.CONTENT || {};
  AM.slug = slug;
})();
