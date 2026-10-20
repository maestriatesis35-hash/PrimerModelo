# Instalar la base de datos en Google Sheets y Drive

Todo se instala con la cuenta **maestriatesis35@gmail.com**. La carpeta, la hoja de cálculo y las fotos quedan en el Drive de esa cuenta, y solo esa cuenta las puede abrir (salvo que usted comparta la carpeta).

## Dónde quedan los datos

Ya están configuradas en `Code.gs` la carpeta y la hoja de cálculo del estudio:

- Carpeta de Drive: <https://drive.google.com/drive/folders/104ioQqrelRRKzH_nqlgFNW9ogwc6LVlh>
- Hoja de cálculo: <https://docs.google.com/spreadsheets/d/1pnERp1QQR7jOMNxwrgq1H6Jwo9YwOt4kAfD9YtRBpe0>

```
Hoja de cálculo
├── Encuestas    una fila por participante: ficha, NASA-TLX, SUSESO/ISTAS21,
│                Warr-Cook-Wall, Nórdico, REBA, puntajes y textos (cuantitativos y cualitativos)
└── Multimedia   una fila por foto: id_encuesta, código, estrato, observación, enlace de Drive

Carpeta de Drive / Multimedia/
├── Egresado/    fotos REBA (E-0042_obs1_….jpg)
└── Interno/
```

Las dos tablas se relacionan por la columna **id_encuesta**. Las pestañas «Encuestas» y «Multimedia» se crean solas al ejecutar `configurar`. Si la hoja tiene una pestaña vacía (por ejemplo «Hoja 1»), se elimina; si tiene datos, no se toca.

## Cómo funciona

- En Apps Script **solo va `Code.gs`**. La encuesta (`PrimerModelo.html`) **no** se pega en Apps Script.
- Apps Script entrega un enlace que termina en `/exec`. Ese enlace se escribe en la constante `GS_URL` de `PrimerModelo.html`.
- La encuesta envía cada respuesta a ese enlace, y `Code.gs` la escribe en la hoja y guarda las fotos en Drive.

## Pasos (una sola vez)

1. Inicie sesión con **maestriatesis35@gmail.com** y abra la hoja de cálculo. Entre a **Extensiones → Apps Script** y póngale de nombre «Estudio TME» al proyecto.
2. En **Código.gs**, borre todo y pegue el contenido de `apps-script/Code.gs`. En GitHub, abra el archivo y use el botón «Copy raw file». Guarde con Ctrl+S.
3. En la lista de funciones, elija **configurar** y pulse **Ejecutar**. Acepte los permisos: **Revisar permisos** → su cuenta → **Configuración avanzada** → **Ir a Estudio TME** → **Permitir**.
   - En la pestaña **Encuestas** se crean las 200 columnas de todas las respuestas, con el nombre completo de cada dato. La nota de cada encabezado indica la escala o los valores posibles.
   - En la pestaña **Multimedia** se crean las 13 columnas de las fotos.
4. En el **Registro de ejecución**, anote el **CÓDIGO DE ACCESO AL PANEL** (TME-XXXX-XXXX).
5. Pulse **Implementar → Nueva implementación → ⚙️ Aplicación web** y configure:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier usuario
   Pulse **Implementar** y copie la URL que termina en `/exec`.
6. Escriba esa URL en `PrimerModelo.html`, en la línea `const GS_URL = "";`. Si lo prefiere, envíela al asistente para que lo haga y suba el cambio a GitHub.

## Columnas de «Encuestas»

Hay una fila por participante. Cada encabezado es el **nombre completo** del dato, tal como se pregunta. Por ejemplo:

- `Código del participante`, `Fecha de aplicación`, `Consentimiento informado`
- `Ficha: Edad (años)`, `Ficha: ¿Cuántas horas trabaja durante el día?`
- `NASA-TLX: Exigencia mental (0–100)`
- `SUSESO P3. En general, ¿considera usted que su trabajo le provoca desgaste emocional?`
- `Warr P7. Satisfacción con: Tu salario (1–7)`
- `Nórdico – Cuello: ¿Molestias en los últimos 12 meses?`
- `REBA Obs. 1 – Tronco (puntaje 1–4)`, `REBA: Nivel de riesgo`
- `Enlaces de las fotos en Drive`

La última columna, `Datos completos (JSON, no editar)`, la usa el panel: no la edite.

## Cuando cambie Code.gs

Pegue la versión nueva y vaya a **Implementar → Gestionar implementaciones**. Pulse el lápiz, elija **Nueva versión** y luego **Implementar**. La URL `/exec` no cambia.

Si el cambio agrega columnas, ejecute otra vez **configurar**: agrega las que falten y no borra datos.

## Código de acceso

- Para cambiarlo, use **Nuevo código** en el panel.
- Si lo pierde, ejecute `nuevoCodigoAcceso` y léalo en el registro.

## Notas

- Si se corta la conexión, **Reintentar** no duplica filas ni fotos.
- Las fotos quedan privadas en el Drive de la cuenta. El panel las muestra solo después de ingresar el código.
