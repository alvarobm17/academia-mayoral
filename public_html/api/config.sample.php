<?php
/* =========================================================================
   Academia Mayoral — PLANTILLA DE CONFIGURACIÓN
   Copia este archivo como config.php (en esta misma carpeta) y rellena tus datos.
   config.php NO se sube a GitHub (está en .gitignore): ahí van las claves reales.
   Este archivo está protegido por api/.htaccess: no se puede abrir desde el navegador.
   ========================================================================= */
return [
    // Base de datos (hPanel → Bases de datos → MySQL)
    'db' => [
        'host' => 'localhost',
        'name' => 'u000000000_academia',   // nombre de la base de datos
        'user' => 'u000000000_academia',   // usuario
        'pass' => 'CAMBIA_ESTA_CONTRASEÑA',
    ],

    // URL pública de la web, sin barra final
    'site_url' => 'https://academiamayoral.es',

    // Correo (crea estos buzones en hPanel → Correos)
    'mail_from'   => 'no-reply@academiamayoral.es',
    'admin_email' => 'hola@academiamayoral.es',

    // Stripe (dashboard.stripe.com → Desarrolladores → Claves API / Webhooks)
    // Empieza con las claves de PRUEBA (sk_test_..., whsec_...) y cámbialas a las reales al lanzar.
    'stripe' => [
        'secret_key'     => 'sk_test_CAMBIAR',
        'webhook_secret' => 'whsec_CAMBIAR',
        'price_monthly'  => 'price_CAMBIAR_MENSUAL',   // precio recurrente 4,99 €/mes
        'price_yearly'   => 'price_CAMBIAR_ANUAL',     // precio recurrente 39 €/año
    ],

    // Límite de XP por alumno y día (evita trampas)
    'daily_xp_cap' => 600,
];
