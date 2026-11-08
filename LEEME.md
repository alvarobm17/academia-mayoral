# Academia Mayoral: guía de instalación y mantenimiento

## Qué hay en esta carpeta

```
Academiamayoral/
├── public_html/          ← ESTO es lo que se sube a Hostinger (su contenido)
│   ├── index.html        Portada: sobre nosotros, servicios, cursos, logros, Plus y contacto
│   ├── curso.html        Asignaturas de un curso        (curso.html?c=3eso)
│   ├── asignatura.html   Presentación + índice de temas (asignatura.html?c=3eso&a=matematicas)
│   ├── tema.html         Teoría, resumen, mapa mental, vídeo, ejercicios y Plus
│   ├── ranking.html      Ranking semanal/total, ligas y amigos
│   ├── cuenta.html       Registro, inicio de sesión y perfil con logros
│   ├── plus.html         Planes de pago (Stripe)
│   ├── legal.html        Aviso legal, privacidad, cookies y condiciones
│   ├── assets/           CSS, JS, logo y contenidos
│   └── api/              Backend PHP (cuentas, puntos, ranking, pagos)
└── base-de-datos/
    └── schema.sql        Estructura de la base de datos (se importa una vez)
```

## Publicar en Hostinger (unos 20 minutos)

**Requisitos:** un plan de hosting web de Hostinger (Premium o superior) con PHP 8.0 o más reciente. Es lo que traen por defecto.

1. **Sube los archivos.** En hPanel ve a *Archivos → Administrador de archivos → public_html* y sube **todo el contenido** de la carpeta `public_html/`, incluidos los archivos ocultos `.htaccess`. Si no ves esos archivos, activa la opción de mostrar archivos ocultos.
2. **Crea la base de datos.** Ve a *Bases de datos → Bases de datos MySQL* y crea una base de datos y un usuario. Anota el nombre, el usuario y la contraseña.
3. **Importa la estructura.** Entra en *phpMyAdmin*, selecciona la base de datos que has creado, ve a *Importar* y sube `base-de-datos/schema.sql`. Si ya lo habías importado antes de noviembre de 2026, importa también `base-de-datos/actualizacion-2026-11-ranking-tema.sql`, que añade el tiempo y los puntos por ejercicio para el ranking de cada tema, y `base-de-datos/actualizacion-2026-11-avatares.sql`, que añade los avatares, los cofres, los títulos, los fondos y la liga máxima.
4. **Configura.** En el Administrador de archivos, copia `public_html/api/config.sample.php` con el nombre `config.php`, en la misma carpeta, y rellena:
   - los datos de la base de datos del paso 2;
   - `site_url`, que es tu dominio con `https://` y sin barra al final;
   - `mail_from` y `admin_email`. Crea esos buzones en *Correos* para que los emails no acaben en spam.
5. **Activa el SSL** (gratis) en *Seguridad → SSL*. El `.htaccess` ya redirige todo a `https`.
6. **Pruébalo.** Crea un perfil, haz un ejercicio y comprueba que tus puntos salen en el ranking.

### Pagos con Stripe (Mayoral Plus)

1. Crea una cuenta en [stripe.com](https://stripe.com) y quédate en **modo de prueba** mientras haces las pruebas.
2. Ve a *Catálogo de productos* y crea el producto **Mayoral Plus** con dos precios **recurrentes**: 4,99 € al mes y 39 € al año. Copia los dos identificadores `price_...` en `config.php`.
3. En *Desarrolladores → Claves API*, copia la clave secreta (`sk_test_...`) en `secret_key`.
4. En *Desarrolladores → Webhooks*, añade un endpoint:
   - URL: `https://TU-DOMINIO/api/webhook.php`
   - Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` y `customer.subscription.deleted`
   - Copia el *Signing secret* (`whsec_...`) en `webhook_secret`.
5. En *Configuración → Portal de clientes*, actívalo para que las familias puedan cancelar la suscripción ellas mismas.
6. Haz una compra de prueba con la tarjeta `4242 4242 4242 4242`. Cuando todo funcione, repite los pasos 2 a 4 en **modo real** y cambia las claves.

Stripe acepta tarjeta, Apple Pay y Google Pay. Actívalos en *Configuración → Métodos de pago*. Stripe no admite Bizum en suscripciones.

## Personalizar antes de publicar

| Qué | Dónde |
|---|---|
| Historia y objetivos («Sobre nosotros») | `index.html`, sección `#sobre` |
| Email de contacto | `index.html` (sección contacto) y `api/config.php` |
| Redes sociales (IG, TikTok, YouTube) | `assets/js/core.js`, función `footerHTML` |
| Datos del titular (NIF, dirección) | `legal.html` (texto entre [corchetes]) |
| Precios | `index.html`, `plus.html`, `legal.html` y los precios de Stripe |
| Colores de las 3 paletas (clara, oscura y cálida) | `assets/css/styles.css`, bloques `:root` del principio |
| Muestras de color del botón de paletas | `assets/js/core.js`, lista `THEMES` |

## Añadir contenido

**Índice de temas.** Está en `assets/js/data.js`, dentro de la lista `T`, por curso y asignatura.

**Tema desarrollado.** Usa `assets/js/content/3eso-matematicas.js` como plantilla:

1. Crea `assets/js/content/CURSO-ASIGNATURA.js`, por ejemplo `4eso-historia.js`.
2. Añade su nombre a `contentFiles` en `data.js`, por ejemplo `"4eso-historia"`.
3. Cada tema usa la clave `"curso/asignatura/id-del-tema"`. El id debe coincidir con el del índice: para un título sin id explícito es el título en minúsculas, sin tildes y con guiones (por ejemplo, «La Guerra Fría» → `la-guerra-fria`).

**Tipos de ejercicio disponibles:**

- `quiz`: contrarreloj con vidas
- `match`: arrastrar y emparejar
- `memory`: tarjetas de memoria
- `fill`: completar huecos
- `hangman`: ahorcado
- `order`: ordenar; sirve también para líneas del tiempo en Historia

**Fórmulas matemáticas.** Se escriben en LaTeX y se dibujan con KaTeX, una librería incluida en `assets/lib/katex/`:

- Las **fracciones** siempre van con barra horizontal: `\frac{3}{4}`. Nunca escribas `3/4` en el texto.
- Las **raíces** siempre cubren todo el número: `\sqrt{b^2-4ac}`.
- En los archivos de contenido usa `` m`...` `` para una fórmula en línea y `` D`...` `` para una fórmula centrada.
- En los recursos Plus (HTML) usa `\( ... \)` y `\[ ... \]`.

Las normas completas para crear contenido están en `CLAUDE.md`.

**Vídeos.** En cada tema, pon el id de YouTube en `video: { youtube: "ID" }`. El id es lo que va detrás de `v=` en la URL del vídeo.

**Recursos Plus.** Crea archivos HTML en `api/private/premium/` con el nombre `curso-asignatura-tema-N.html`, donde N es la posición del recurso en la lista `premium` del tema, empezando en 0. Ya hay un ejemplo: `3eso-matematicas-ecuaciones-0.html`. Esa carpeta está bloqueada desde el navegador, así que solo la ve quien tiene Plus.

**Después de cada cambio,** sube los archivos y cambia `?v=20261106` por la fecha del día en los `<link>` y `<script>` de los HTML. Así los alumnos verán la versión nueva y no una antigua guardada en caché.

## Vista previa en tu ordenador

Si abres la web en local, sin PHP, funciona en **modo demo**: la cuenta y los puntos se guardan solo en tu navegador y el ranking es de ejemplo. En Hostinger se usa el servidor real automáticamente.

## Seguridad y privacidad: lo que ya está hecho

- Las contraseñas se guardan cifradas (`password_hash`) y el inicio de sesión se bloquea tras 10 intentos fallidos.
- Los menores de 14 años necesitan la autorización de su tutor por email (art. 7 LOPDGDD). El tutor también puede borrar la cuenta.
- En el ranking solo aparecen el apodo y el curso.
- Hay un límite diario de XP y una pausa mínima entre ejercicios para evitar trampas.
- `config.php` y la carpeta `private/` no se pueden abrir desde el navegador.
- El webhook de Stripe comprueba la firma de cada aviso y no procesa dos veces el mismo evento.

### Medida temporal: vulnerabilidad php2shell (noviembre de 2026)

El archivo `public_html/.user.ini` desactiva `session.upload_progress`, la vía de ataque de **CVE-2026-109619** y **CVE-2026-115560**. Son fallos del propio PHP, no del código de la web. Esta web no usa esa función, así que desactivarla no afecta a nada. El `.htaccess` impide que `.user.ini` se lea desde el navegador.

- **Al subir la web:** asegúrate de subir también `.user.ini`, que es un archivo oculto. En hPanel, en la configuración de PHP, comprueba que la versión es **8.2.35, 8.3.36, 8.4.27, 8.5.12 o posterior**.
- **Cuándo quitarlo:** cuando PHP publique la corrección de CVE-2026-115560 en su versión normal y Hostinger la instale. Entonces se puede borrar `.user.ini` y su bloque del `.htaccess`. Mantenerlo tampoco hace daño.
