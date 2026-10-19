# Estudio TME · Fisioterapia (UCSS 2026)

Aplicación de campo del anteproyecto **«Factores ocupacionales asociados a síntomas musculoesqueléticos en fisioterapeutas egresados e internos en actividad asistencial de la Universidad Católica Sedes Sapientiae, 2026»** (Maestría en Salud Pública, Escuela de Posgrado – Universidad Nacional de Piura).

## Contenido

`PrimerModelo.html` es una página única con:

- **Inicio**: elección entre aplicar la encuesta o entrar al panel.
- **Encuesta paso a paso**: presentación, consentimiento informado anónimo (sin nombre, DNI ni firma), ficha sociodemográfica y ocupacional, NASA-TLX (versión Raw), SUSESO/ISTAS21 (versión breve), Escala General de Satisfacción Laboral de Warr, Cook y Wall, Cuestionario Nórdico con mapa corporal y observación REBA con diagramas de postura y cálculo automático (tablas A, B y C).
- **Panel de administración** protegido con contraseña: avance por estrato (meta 121: 68 egresados y 53 internos), prevalencia de síntomas por región, niveles REBA, fotografías y exportación CSV/JSON.

## Modo de funcionamiento

- **Publicado como Artifact de Claude** (con base de datos y almacenamiento): guarda las encuestas, las fotos y la contraseña del panel.
- **Abierto como archivo local** (`PrimerModelo.html`): funciona en **modo de práctica**. Permite recorrer y ensayar todos los instrumentos, pero **no envía ni guarda respuestas** en un servidor (el borrador solo se conserva en el navegador). Para el trabajo de campo real use la versión publicada como Artifact.

## Uso local

Abra `PrimerModelo.html` con un navegador (doble clic). Funciona sin instalación, también en el celular si se copia el archivo al dispositivo.

## Privacidad

El código no contiene datos de participantes. No suba al repositorio respuestas, fotografías ni archivos exportados (Ley N.° 29733, Ley de Protección de Datos Personales).
