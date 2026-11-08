# Academia Mayoral — normas del proyecto

Web estática (HTML/CSS/JS sin frameworks) + backend PHP/MySQL para Hostinger. Todo lo publicable está en `public_html/`. Guía de instalación en `LEEME.md`.

## Normas de contenido (obligatorias al crear o editar temas)

### Fórmulas matemáticas
- **Fracciones SIEMPRE con numerador, barra horizontal y denominador** (`\frac{a}{b}`; se dibuja a tamaño completo). Nunca escribir fracciones con barra inclinada (`3/4`, `x/2`, `(5 ± 1)/2`) en el texto, enunciados, opciones, pistas ni soluciones.
- En **exponentes** usar `\tfrac` (p. ej. `a^{\tfrac{2}{3}}`): la fracción queda apilada y de tamaño adecuado (`\frac` se dibuja siempre grande).
- **Raíces SIEMPRE cubriendo todo el radicando** (`\sqrt{b^2-4ac}`). Nunca `√(…)` ni `√` delante de un número.
- Las fórmulas se escriben en LaTeX y las dibuja KaTeX (`public_html/assets/lib/katex/`):
  - En los archivos de contenido JS usar las etiquetas `m\`...\`` (en línea) y `D\`...\`` (centrada), ya definidas en `assets/js/content/3eso-matematicas.js`.
  - En HTML (p. ej. recursos Plus en `api/private/premium/`) usar `\( ... \)` y `\[ ... \]`.
- Excepciones:
  - Lo que el alumno **teclea** en un hueco (juego `fill`) se escribe con `/` (respuestas como `"3/4"`).
  - Los **mapas mentales** son SVG y no admiten fórmulas: redactar sus hojas sin fracciones ni raíces.
- Toda página que muestre fórmulas debe cargar `katex.min.css`, `katex.min.js` y `auto-render.min.js` (como `tema.html`).

### Estructura de un tema
Ver la plantilla en `assets/js/content/3eso-matematicas.js`: `intro`, `minutes`, `video`, `sections[]`, `summary[]`, `mindmap{}`, `games[]` (quiz, match, memory, fill, hangman, order) y `premium[]`. Registrar el archivo nuevo en `contentFiles` de `assets/js/data.js`.

### Ideas clave
- Las propiedades que los alumnos suelen olvidar (p. ej. **sacar factor común / propiedad distributiva**) se destacan con el color de la asignatura: recuadro `<div class='callout key'>`, palabras clave con `<mark class='hl'>…</mark>` cada vez que se usan en ejemplos, y tarjeta de resumen con `key: true`.
- Las clasificaciones de conjuntos numéricos se muestran con el **diagrama de cajas anidadas** (`.set-diagram`, ver tema 1 de Matemáticas CCSS I), no solo con fórmulas de inclusión.

### Gamificación (avatares, cofres, títulos, fondos)
- Criaturas, títulos y fondos se definen en **dos sitios que deben coincidir**: `assets/js/avatars.js` (dibujo y textos) y `api/lib.php` (`AM_AVATARS`, `AM_TITLES`, `AM_THEMES`, validación en el servidor). Las ligas, en `data.js` y en `AM_LEAGUES`.
- Fase del avatar = liga más alta del mes en curso (Bronce/Plata huevo, Oro cría, Zafiro adulto, Diamante legendario). Cofres: primera vez en cada liga + uno por semana al superar la liga de la semana anterior. Plus: 2 criaturas por cofre, aureola animada y fondos exclusivos.

### Estilo
- Español de España, tono cercano para alumnos de 12 a 18 años, ajustado al currículo LOMLOE.
- Comprobar la corrección matemática de enunciados, opciones y soluciones; en memory y match, que no haya dos parejas equivalentes entre sí.
- Colores: usar siempre variables CSS de tema (`--text`, `--gold`, `--accent`…), nunca colores fijos, para que funcionen las paletas clara, oscura y cálida.
