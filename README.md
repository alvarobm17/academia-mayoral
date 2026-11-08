# Academia Mayoral

Academia virtual y gratuita para alumnos de **ESO y Bachillerato** (España): explicaciones esquemáticas de Lengua, Matemáticas, Historia, Física y Química, con ejercicios que se juegan como un videojuego, puntos, ligas, logros, avatares coleccionables y rankings.

**🔗 Demo:** https://alvarobm17.github.io/academia-mayoral/

> En la demo de GitHub Pages no hay PHP, así que la web funciona en **modo demo**: puedes crear un perfil, hacer ejercicios, abrir cofres y ver el ranking, pero todo se guarda solo en tu navegador, y los rivales del ranking son de ejemplo. En el hosting real (Hostinger) usa el backend PHP + MySQL.

## Qué hay para ver

| Página | Qué probar |
|---|---|
| Portada | Selector de curso y asignatura, y botón de paletas (abajo a la izquierda): clara, oscura y cálida |
| Matemáticas 3º ESO | Tres temas completos con teoría, fórmulas, mapa mental y 6 tipos de juego |
| Matemáticas CCSS I (1º Bach) → Números reales | El tema más completo: diagrama de conjuntos, figuras SVG, ranking del tema |
| Mi cuenta | Crea un perfil y usa «+1 cofre de prueba» para abrir cofres y conseguir criaturas |
| Ranking | Ligas con escudos, avatares que evolucionan, títulos y aureola Plus |

## Stack

- **Frontend:** HTML, CSS y JavaScript puros (sin frameworks ni compilación). Fórmulas con [KaTeX](https://katex.org), incluido en `public_html/assets/lib/katex`.
- **Backend:** PHP 8 sin frameworks, MySQL/MariaDB con PDO, sesiones PHP y `password_hash`.
- **Pagos:** Stripe Checkout, con webhooks de firma verificada, llamado vía REST con cURL.
- **Despliegue:** Hostinger (Apache/LiteSpeed). La demo se publica en GitHub Pages con GitHub Actions.

## Estructura

```
public_html/            ← la web (lo que se sube al hosting)
  *.html                  páginas: portada, curso, asignatura, tema, ranking, cuenta, plus, legal
  assets/js/              core (API, sesión, modo demo), pages, games, avatars, data (temario)
  assets/js/content/      contenido de cada asignatura (teoría, resúmenes, ejercicios)
  assets/css/             styles.css (temas de color) y coleccion.css (gamificación)
  api/                    endpoints PHP (auth, progress, ranking, friends, profile, checkout, webhook…)
  api/config.sample.php   plantilla de configuración (la real, config.php, no está en el repo)
base-de-datos/          schema.sql y scripts de actualización
LEEME.md                guía de instalación en Hostinger y de mantenimiento
CLAUDE.md               normas para crear contenido (fórmulas, estilo, gamificación)
```

## Probar en local

No necesita instalación: basta con un servidor estático. Sin PHP, la web entra en modo demo.

```bash
python -m http.server 8765 --directory public_html
```

Después abre http://localhost:8765.

Para instalarla en un hosting con PHP y MySQL, sigue [LEEME.md](LEEME.md).
