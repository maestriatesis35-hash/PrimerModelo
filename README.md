# Estudio TME · Fisioterapia (UCSS 2026)

Aplicación de campo del anteproyecto **«Factores ocupacionales asociados a síntomas musculoesqueléticos en fisioterapeutas egresados e internos en actividad asistencial de la Universidad Católica Sedes Sapientiae, 2026»** (Maestría en Salud Pública, Escuela de Posgrado – Universidad Nacional de Piura).

## Contenido

`PrimerModelo.html` es una página única con:

- **Inicio**: elección entre aplicar la encuesta o entrar al panel.
- **Encuesta paso a paso**: presentación, consentimiento informado anónimo (sin nombre, DNI ni firma), ficha sociodemográfica y ocupacional, NASA-TLX (versión Raw), SUSESO/ISTAS21 (versión breve), Escala General de Satisfacción Laboral de Warr, Cook y Wall, Cuestionario Nórdico con mapa corporal y observación REBA con diagramas de postura y cálculo automático (tablas A, B y C).
- **Panel de administración** protegido con código de acceso: avance por estrato (meta 121: 68 egresados y 53 internos), prevalencia de síntomas por región, niveles REBA, fotografías y exportación CSV/JSON y enlaces a la hoja de cálculo y a la carpeta de Drive.

## Base de datos (Google Sheets y Drive)

Los datos se guardan en la cuenta **maestriatesis35@gmail.com**, en dos tablas de la hoja de cálculo «TME – Base de datos»:

- **Encuestas**: una fila por participante, con los valores cuantitativos y cualitativos.
- **Multimedia**: una fila por foto. El archivo se guarda en la carpeta de Drive del estudio.

El servidor es `apps-script/Code.gs`. Para la instalación paso a paso, vea [`apps-script/LEEME.md`](apps-script/LEEME.md).

## Modo de práctica

Si abre `PrimerModelo.html` como archivo local, sin `GS_URL`, la página funciona en **modo de práctica**: permite recorrer los instrumentos, pero no envía respuestas. Para el trabajo de campo, use la URL de la aplicación web de Apps Script.

## Privacidad

El código no contiene datos de participantes. No suba al repositorio respuestas, fotografías ni archivos exportados (Ley N.° 29733, Ley de Protección de Datos Personales).
