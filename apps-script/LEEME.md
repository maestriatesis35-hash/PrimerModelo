# Instalar la base de datos en Google Sheets y Drive

Todo se instala con la cuenta **maestriatesis35@gmail.com**. La carpeta, la hoja de cálculo y las fotos quedan en el Drive de esa cuenta, y solo esa cuenta las puede abrir (salvo que usted comparta la carpeta).

## Qué se crea

```
Mi unidad / Estudio TME – UCSS 2026/
├── TME – Base de datos            (hoja de cálculo de Google)
│   ├── Encuestas    una fila por participante: ficha, NASA-TLX, SUSESO/ISTAS21,
│   │                Warr-Cook-Wall, Nórdico, REBA, puntajes y textos (cuantitativos y cualitativos)
│   └── Multimedia   una fila por foto: id_encuesta, código, estrato, observación, enlace de Drive
└── Multimedia/
    ├── Egresado/    fotos REBA (E-0042_obs1_….jpg)
    └── Interno/
```

Las dos tablas se relacionan por la columna **id_encuesta**.

## Pasos (una sola vez, unos 10 minutos)

1. Inicie sesión en Google con **maestriatesis35@gmail.com** y abra <https://script.google.com>. Elija **Nuevo proyecto** y póngale de nombre «Estudio TME».
2. En **Código.gs**, borre lo que haya y pegue todo el contenido de `apps-script/Code.gs`.
3. Junto a **Archivos**, pulse **+** y elija **HTML**. Llame al archivo exactamente `Index`. Borre su contenido y pegue todo el contenido de `PrimerModelo.html`. Guarde (Ctrl+S).
4. En la lista de funciones de arriba, elija **configurar** y pulse **Ejecutar**. Acepte los permisos:
   - Pulse **Revisar permisos**, elija la cuenta maestriatesis35@gmail.com y luego **Configuración avanzada → Ir a Estudio TME**.
   - Por último, pulse **Permitir**.
5. Abra el **Registro de ejecución**. Ahí aparecen el enlace de la carpeta, el de la hoja y el **CÓDIGO DE ACCESO AL PANEL** (TME-XXXX-XXXX). Anote el código: no se volverá a mostrar.
6. Pulse **Implementar → Nueva implementación**. En el engranaje, elija **Aplicación web** y configure:
   - **Ejecutar como:** Yo (maestriatesis35@gmail.com)
   - **Quién tiene acceso:** Cualquier usuario
   Pulse **Implementar** y copie la **URL de la aplicación web**, que termina en `/exec`.
7. Esa URL es el enlace de la encuesta. Compártala con los encuestadores; funciona en el celular. El panel se abre desde la misma página, en «Admin», con el código del paso 5.

## Cuando cambie el HTML

Pegue la nueva versión en `Index` y luego vaya a **Implementar → Gestionar implementaciones**. Pulse el lápiz, elija **Versión: Nueva versión** y luego **Implementar**. La URL no cambia.

## Usar la página fuera de Apps Script (opcional)

Si abre `PrimerModelo.html` como archivo local o desde otro sitio, escriba la URL `/exec` en la constante `GS_URL` del HTML. Así esa copia también enviará los datos a la misma hoja. Sin esa URL, la página funciona en modo de práctica y no envía nada.

## Código de acceso

- Para cambiarlo, use **Nuevo código** en el panel.
- Si lo pierde, ejecute la función `nuevoCodigoAcceso` en el editor y léalo en el registro de ejecución.

Al cambiar el código, se cierran todas las sesiones abiertas del panel.

## Notas

- Cada encuesta tiene un identificador fijo. Si se corta la conexión, **Reintentar** no duplica filas ni fotos.
- No edite ni borre la columna `datos_json` de «Encuestas»: el panel la usa para los gráficos. Las demás columnas sirven para el análisis (SPSS, R, Excel).
- Las fotos quedan privadas en el Drive de la cuenta. El panel las muestra mediante Apps Script, solo después de ingresar el código.
