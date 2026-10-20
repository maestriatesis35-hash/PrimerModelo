/**
 * Estudio TME – UCSS 2026 · Base de datos en Google Sheets y Google Drive
 *
 * Tabla «Encuestas»:  una fila por participante con los valores cuantitativos y cualitativos
 *                     (ficha, NASA-TLX, SUSESO/ISTAS21, Warr-Cook-Wall, Nórdico, REBA y puntajes).
 * Tabla «Multimedia»: una fila por foto; el archivo se guarda en la carpeta Drive del estudio
 *                     (Multimedia/Egresado y Multimedia/Interno) y se enlaza con id_encuesta.
 *
 * Instalación: ver apps-script/LEEME.md. Primero ejecute configurar() una vez.
 */
const NOMBRE_CARPETA = "Estudio TME – UCSS 2026";
// carpeta y hoja del estudio en el Drive de maestriatesis35@gmail.com
const ID_CARPETA = "104ioQqrelRRKzH_nqlgFNW9ogwc6LVlh"; // lo que sigue a /folders/ en el enlace de la carpeta
const ID_HOJA = "1pnERp1QQR7jOMNxwrgq1H6Jwo9YwOt4kAfD9YtRBpe0"; // lo que sigue a /d/ en el enlace de la hoja
const HOJA_ENC = "Encuestas";
const HOJA_MM = "Multimedia";
// columnas de «Encuestas»: [encabezado completo, nota]. Son las mismas que envía PrimerModelo.html (flatCols)
const ENC_DEF = [
  ["ID de la encuesta", "Identificador único de la encuesta (código_marca de tiempo). Une esta tabla con «Multimedia»."],
  ["Fecha y hora de registro en Google Sheets", "Momento en que la encuesta llegó a la hoja"],
  ["Código del participante", "Código del participante (E = egresado, I = interno)"],
  ["Estrato", "Estrato: Egresado o Interno"],
  ["Estado de la encuesta", "Estado: completa, rechazó o no elegible"],
  ["Motivos de no elegibilidad", "Motivos de no elegibilidad"],
  ["Fecha de aplicación", "Fecha de aplicación"],
  ["Establecimiento o sede", "Establecimiento o sede"],
  ["Dispositivo", "Dispositivo desde el que se envió"],
  ["Fecha y hora de envío", "Fecha y hora de envío (ISO, UTC)"],
  ["Consentimiento informado", "Consentimiento informado"],
  ["Autoriza fotografías", "Autoriza fotografías"],
  ["Ficha: Edad (años)", "Ficha: Edad (años)"],
  ["Ficha: Sexo", "Ficha: Sexo"],
  ["Ficha: Peso (kg)", "Ficha: Peso (kg)"],
  ["Ficha: Talla (m)", "Ficha: Talla (m)"],
  ["Ficha: Mano dominante", "Ficha: Mano dominante"],
  ["Ficha: Condición", "Ficha: Condición"],
  ["Ficha: Tiempo en actividad asistencial (meses)", "Ficha: Tiempo en actividad asistencial (meses)"],
  ["Ficha: Número promedio de pacientes atendidos por día", "Ficha: Número promedio de pacientes atendidos por día (pacientes)"],
  ["Ficha: ¿Realiza movilización o transferencia de pacientes en su actividad habitual?", "Ficha: ¿Realiza movilización o transferencia de pacientes en su actividad habitual?"],
  ["Ficha: ¿Tiene otro empleo o actividad laboral adicional?", "Ficha: ¿Tiene otro empleo o actividad laboral adicional?"],
  ["Ficha: Años desde el egreso", "Ficha: Años desde el egreso (años)"],
  ["Ficha: Tipo de vínculo laboral", "Ficha: Tipo de vínculo laboral"],
  ["Ficha: Número de centros donde trabaja", "Ficha: Número de centros donde trabaja (centros)"],
  ["Ficha: Sede de internado", "Ficha: Sede de internado"],
  ["Ficha: Mes de internado en curso", "Ficha: Mes de internado en curso (mes)"],
  ["Ficha: ¿Cuántas horas trabaja durante el día?", "Ficha: ¿Cuántas horas trabaja durante el día? (horas)"],
  ["Ficha: ¿Cuántas pausas activas realiza durante su turno de trabajo?", "Ficha: ¿Cuántas pausas activas realiza durante su turno de trabajo? (pausas)"],
  ["Ficha: ¿Cuántos minutos en promedio dura su pausa activa?", "Ficha: ¿Cuántos minutos en promedio dura su pausa activa? (min)"],
  ["Ficha: ¿Realiza actividad física o deporte de forma regular?", "Ficha: ¿Realiza actividad física o deporte de forma regular?"],
  ["Ficha: ¿Realiza actividad física o deporte de forma regular? – ¿Cuál?", "Ficha: ¿Realiza actividad física o deporte de forma regular? → ¿Cuál?"],
  ["Ficha: ¿Ha tenido alguna lesión musculoesquelética previa (traumatismo, lesión deportiva, fractura) o cirugía musculoesquelética?", "Ficha: ¿Ha tenido alguna lesión musculoesquelética previa (traumatismo, lesión deportiva, fractura) o cirugía musculoesquelética?"],
  ["Ficha: ¿Ha tenido alguna lesión musculoesquelética previa (traumatismo, lesión deportiva, fractura) o cirugía musculoesquelética? – Especifique", "Ficha: ¿Ha tenido alguna lesión musculoesquelética previa (traumatismo, lesión deportiva, fractura) o cirugía musculoesquelética? → Especifique"],
  ["Ficha: ¿Tiene diagnóstico de alguna enfermedad reumatológica sistémica (artritis reumatoide, lupus u otra)?", "Ficha: ¿Tiene diagnóstico de alguna enfermedad reumatológica sistémica (artritis reumatoide, lupus u otra)?"],
  ["Ficha: ¿Está embarazada actualmente?", "Ficha: ¿Está embarazada actualmente?"],
  ["Ficha: ¿Se encuentra actualmente con descanso médico o licencia?", "Ficha: ¿Se encuentra actualmente con descanso médico o licencia?"],
  ["Ficha: Índice de masa corporal (kg/m²)", "Índice de masa corporal (kg/m²)"],
  ["NASA-TLX: Exigencia mental (0–100)", "NASA-TLX: Exigencia mental (0–100)"],
  ["NASA-TLX: Exigencia física (0–100)", "NASA-TLX: Exigencia física (0–100)"],
  ["NASA-TLX: Exigencia temporal (0–100)", "NASA-TLX: Exigencia temporal (0–100)"],
  ["NASA-TLX: Rendimiento (0–100)", "NASA-TLX: Rendimiento (0–100)"],
  ["NASA-TLX: Esfuerzo (0–100)", "NASA-TLX: Esfuerzo (0–100)"],
  ["NASA-TLX: Frustración (0–100)", "NASA-TLX: Frustración (0–100)"],
  ["NASA-TLX: Puntaje global Raw (0–100)", "NASA-TLX Raw: promedio de las 6 dimensiones (0–100)"],
  ["SUSESO P1. ¿Puede hacer su trabajo con tranquilidad y tenerlo al día?", "SUSESO/ISTAS21 ítem 1: ¿Puede hacer su trabajo con tranquilidad y tenerlo al día? (0 Siempre … 4 Nunca)"],
  ["SUSESO P2. En su trabajo, ¿tiene usted que tomar decisiones difíciles?", "SUSESO/ISTAS21 ítem 2: En su trabajo, ¿tiene usted que tomar decisiones difíciles? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P3. En general, ¿considera usted que su trabajo le provoca desgaste emocional?", "SUSESO/ISTAS21 ítem 3: En general, ¿considera usted que su trabajo le provoca desgaste emocional? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P4. En su trabajo, ¿tiene usted que guardar sus emociones y no expresarlas?", "SUSESO/ISTAS21 ítem 4: En su trabajo, ¿tiene usted que guardar sus emociones y no expresarlas? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P5. ¿Su trabajo requiere atención constante?", "SUSESO/ISTAS21 ítem 5: ¿Su trabajo requiere atención constante? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P6. ¿Tiene influencia sobre la cantidad de trabajo que se le asigna?", "SUSESO/ISTAS21 ítem 6: ¿Tiene influencia sobre la cantidad de trabajo que se le asigna? (0 Siempre … 4 Nunca)"],
  ["SUSESO P7. ¿Puede dejar su trabajo un momento para conversar con un compañero o compañera?", "SUSESO/ISTAS21 ítem 7: ¿Puede dejar su trabajo un momento para conversar con un compañero o compañera? (0 Siempre … 4 Nunca)"],
  ["SUSESO P8. Su trabajo, ¿permite que aprenda cosas nuevas?", "SUSESO/ISTAS21 ítem 8: Su trabajo, ¿permite que aprenda cosas nuevas? (0 Siempre … 4 Nunca)"],
  ["SUSESO P9. Las tareas que hace, ¿le parecen importantes?", "SUSESO/ISTAS21 ítem 9: Las tareas que hace, ¿le parecen importantes? (0 Siempre … 4 Nunca)"],
  ["SUSESO P10. ¿Siente que su empresa o institución tiene gran importancia para usted?", "SUSESO/ISTAS21 ítem 10: ¿Siente que su empresa o institución tiene gran importancia para usted? (0 Siempre … 4 Nunca)"],
  ["SUSESO P11. ¿Sabe exactamente qué tareas son de su responsabilidad?", "SUSESO/ISTAS21 ítem 11: ¿Sabe exactamente qué tareas son de su responsabilidad? (0 Siempre … 4 Nunca)"],
  ["SUSESO P12. ¿Tiene que hacer tareas que usted cree que deberían hacerse de otra manera?", "SUSESO/ISTAS21 ítem 12: ¿Tiene que hacer tareas que usted cree que deberían hacerse de otra manera? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P13. ¿Recibe ayuda y apoyo de su jefe(a) o superior(a) inmediato(a)?", "SUSESO/ISTAS21 ítem 13: ¿Recibe ayuda y apoyo de su jefe(a) o superior(a) inmediato(a)? (0 Siempre … 4 Nunca)"],
  ["SUSESO P14. Entre compañeros y compañeras, ¿se ayudan en el trabajo?", "SUSESO/ISTAS21 ítem 14: Entre compañeros y compañeras, ¿se ayudan en el trabajo? (0 Siempre … 4 Nunca)"],
  ["SUSESO P15. Sus jefes inmediatos, ¿resuelven bien los conflictos?", "SUSESO/ISTAS21 ítem 15: Sus jefes inmediatos, ¿resuelven bien los conflictos? (0 Siempre … 4 Nunca)"],
  ["SUSESO P16. ¿Está preocupado(a) por si lo(la) despiden o no le renuevan el contrato?", "SUSESO/ISTAS21 ítem 16: ¿Está preocupado(a) por si lo(la) despiden o no le renuevan el contrato? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P17. ¿Está preocupado(a) por si le cambian las tareas contra su voluntad?", "SUSESO/ISTAS21 ítem 17: ¿Está preocupado(a) por si le cambian las tareas contra su voluntad? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P18. Mis superiores me dan el reconocimiento que merezco.", "SUSESO/ISTAS21 ítem 18: Mis superiores me dan el reconocimiento que merezco. (0 Siempre … 4 Nunca)"],
  ["SUSESO P19. Si está ausente un día de casa, las tareas domésticas que realiza, ¿se quedan sin hacer?", "SUSESO/ISTAS21 ítem 19: Si está ausente un día de casa, las tareas domésticas que realiza, ¿se quedan sin hacer? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO P20. Cuando está en el trabajo, ¿piensa en las exigencias domésticas y familiares?", "SUSESO/ISTAS21 ítem 20: Cuando está en el trabajo, ¿piensa en las exigencias domésticas y familiares? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["SUSESO: Puntaje de exigencias psicológicas", "SUSESO/ISTAS21 puntaje: Exigencias psicológicas"],
  ["SUSESO: Puntaje de trabajo activo y desarrollo de habilidades", "SUSESO/ISTAS21 puntaje: Trabajo activo y desarrollo de habilidades"],
  ["SUSESO: Puntaje de apoyo social en la empresa y calidad de liderazgo", "SUSESO/ISTAS21 puntaje: Apoyo social en la empresa y calidad de liderazgo"],
  ["SUSESO: Puntaje de compensaciones", "SUSESO/ISTAS21 puntaje: Compensaciones"],
  ["SUSESO: Puntaje de doble presencia", "SUSESO/ISTAS21 puntaje: Doble presencia"],
  ["Warr P1. Satisfacción con: Condiciones físicas del trabajo (1–7)", "Warr-Cook-Wall ítem 1: Condiciones físicas del trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P2. Satisfacción con: Libertad para elegir tu propio método de trabajo (1–7)", "Warr-Cook-Wall ítem 2: Libertad para elegir tu propio método de trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P3. Satisfacción con: Tus compañeros de trabajo (1–7)", "Warr-Cook-Wall ítem 3: Tus compañeros de trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P4. Satisfacción con: Reconocimiento que obtienes por el trabajo bien hecho (1–7)", "Warr-Cook-Wall ítem 4: Reconocimiento que obtienes por el trabajo bien hecho (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P5. Satisfacción con: Tu superior inmediato (1–7)", "Warr-Cook-Wall ítem 5: Tu superior inmediato (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P6. Satisfacción con: Responsabilidad que se te ha asignado (1–7)", "Warr-Cook-Wall ítem 6: Responsabilidad que se te ha asignado (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P7. Satisfacción con: Tu salario (1–7)", "Warr-Cook-Wall ítem 7: Tu salario (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P8. Satisfacción con: La posibilidad de utilizar tus capacidades (1–7)", "Warr-Cook-Wall ítem 8: La posibilidad de utilizar tus capacidades (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P9. Satisfacción con: Relaciones entre dirección y trabajadores en tu institución (1–7)", "Warr-Cook-Wall ítem 9: Relaciones entre dirección y trabajadores en tu institución (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P10. Satisfacción con: Tus posibilidades de promocionar (1–7)", "Warr-Cook-Wall ítem 10: Tus posibilidades de promocionar (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P11. Satisfacción con: El modo en que tu institución está gestionada (1–7)", "Warr-Cook-Wall ítem 11: El modo en que tu institución está gestionada (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P12. Satisfacción con: La atención que se presta a las sugerencias que haces (1–7)", "Warr-Cook-Wall ítem 12: La atención que se presta a las sugerencias que haces (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P13. Satisfacción con: Tu horario de trabajo (1–7)", "Warr-Cook-Wall ítem 13: Tu horario de trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P14. Satisfacción con: La variedad de tareas que realizas en tu trabajo (1–7)", "Warr-Cook-Wall ítem 14: La variedad de tareas que realizas en tu trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr P15. Satisfacción con: Tu estabilidad en el empleo (1–7)", "Warr-Cook-Wall ítem 15: Tu estabilidad en el empleo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["Warr: Satisfacción laboral total (15–105)", "Satisfacción laboral Warr-Cook-Wall: total (15–105)"],
  ["Nórdico – Cuello: ¿Molestias en los últimos 12 meses?", "Nórdico Cuello: molestias en los últimos 12 meses"],
  ["Nórdico – Cuello: ¿Molestias en los últimos 7 días?", "Nórdico Cuello: molestias en los últimos 7 días"],
  ["Nórdico – Cuello: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Cuello: le impidió trabajar (12 meses)"],
  ["Nórdico – Hombros: ¿Molestias en los últimos 12 meses?", "Nórdico Hombros: molestias en los últimos 12 meses"],
  ["Nórdico – Hombros: Lado de las molestias (12 meses)", "Nórdico Hombros: lado (12 meses)"],
  ["Nórdico – Hombros: ¿Molestias en los últimos 7 días?", "Nórdico Hombros: molestias en los últimos 7 días"],
  ["Nórdico – Hombros: Lado de las molestias (7 días)", "Nórdico Hombros: lado (7 días)"],
  ["Nórdico – Hombros: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Hombros: le impidió trabajar (12 meses)"],
  ["Nórdico – Codos: ¿Molestias en los últimos 12 meses?", "Nórdico Codos: molestias en los últimos 12 meses"],
  ["Nórdico – Codos: Lado de las molestias (12 meses)", "Nórdico Codos: lado (12 meses)"],
  ["Nórdico – Codos: ¿Molestias en los últimos 7 días?", "Nórdico Codos: molestias en los últimos 7 días"],
  ["Nórdico – Codos: Lado de las molestias (7 días)", "Nórdico Codos: lado (7 días)"],
  ["Nórdico – Codos: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Codos: le impidió trabajar (12 meses)"],
  ["Nórdico – Muñecas / manos: ¿Molestias en los últimos 12 meses?", "Nórdico Muñecas / manos: molestias en los últimos 12 meses"],
  ["Nórdico – Muñecas / manos: Lado de las molestias (12 meses)", "Nórdico Muñecas / manos: lado (12 meses)"],
  ["Nórdico – Muñecas / manos: ¿Molestias en los últimos 7 días?", "Nórdico Muñecas / manos: molestias en los últimos 7 días"],
  ["Nórdico – Muñecas / manos: Lado de las molestias (7 días)", "Nórdico Muñecas / manos: lado (7 días)"],
  ["Nórdico – Muñecas / manos: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Muñecas / manos: le impidió trabajar (12 meses)"],
  ["Nórdico – Columna dorsal: ¿Molestias en los últimos 12 meses?", "Nórdico Columna dorsal: molestias en los últimos 12 meses"],
  ["Nórdico – Columna dorsal: ¿Molestias en los últimos 7 días?", "Nórdico Columna dorsal: molestias en los últimos 7 días"],
  ["Nórdico – Columna dorsal: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Columna dorsal: le impidió trabajar (12 meses)"],
  ["Nórdico – Columna lumbar: ¿Molestias en los últimos 12 meses?", "Nórdico Columna lumbar: molestias en los últimos 12 meses"],
  ["Nórdico – Columna lumbar: ¿Molestias en los últimos 7 días?", "Nórdico Columna lumbar: molestias en los últimos 7 días"],
  ["Nórdico – Columna lumbar: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Columna lumbar: le impidió trabajar (12 meses)"],
  ["Nórdico – Caderas / muslos: ¿Molestias en los últimos 12 meses?", "Nórdico Caderas / muslos: molestias en los últimos 12 meses"],
  ["Nórdico – Caderas / muslos: ¿Molestias en los últimos 7 días?", "Nórdico Caderas / muslos: molestias en los últimos 7 días"],
  ["Nórdico – Caderas / muslos: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Caderas / muslos: le impidió trabajar (12 meses)"],
  ["Nórdico – Rodillas: ¿Molestias en los últimos 12 meses?", "Nórdico Rodillas: molestias en los últimos 12 meses"],
  ["Nórdico – Rodillas: ¿Molestias en los últimos 7 días?", "Nórdico Rodillas: molestias en los últimos 7 días"],
  ["Nórdico – Rodillas: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Rodillas: le impidió trabajar (12 meses)"],
  ["Nórdico – Tobillos / pies: ¿Molestias en los últimos 12 meses?", "Nórdico Tobillos / pies: molestias en los últimos 12 meses"],
  ["Nórdico – Tobillos / pies: ¿Molestias en los últimos 7 días?", "Nórdico Tobillos / pies: molestias en los últimos 7 días"],
  ["Nórdico – Tobillos / pies: ¿Le impidió trabajar en los últimos 12 meses?", "Nórdico Tobillos / pies: le impidió trabajar (12 meses)"],
  ["Nórdico: Síntomas en alguna región en los últimos 12 meses (1 = sí)", "Síntomas en al menos una región en 12 meses (1 = sí, 0 = no)"],
  ["REBA: Tarea observada", "REBA: tarea observada"],
  ["REBA: Lado evaluado", "REBA: lado evaluado"],
  ["REBA Obs. 1 – Cuello (puntaje 1–2)", "REBA observación 1: Cuello (puntaje)"],
  ["REBA Obs. 1 – Cuello con torsión o inclinación lateral (1 = sí)", "REBA observación 1: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["REBA Obs. 1 – Tronco (puntaje 1–4)", "REBA observación 1: Tronco (puntaje)"],
  ["REBA Obs. 1 – Tronco con torsión o inclinación lateral (1 = sí)", "REBA observación 1: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["REBA Obs. 1 – Piernas (puntaje 1–2)", "REBA observación 1: Piernas (puntaje)"],
  ["REBA Obs. 1 – Flexión de rodillas (puntaje 0–2)", "REBA observación 1: Flexión de rodillas (puntaje)"],
  ["REBA Obs. 1 – Carga o fuerza (puntaje 0–2)", "REBA observación 1: Carga/fuerza (puntaje)"],
  ["REBA Obs. 1 – Fuerza aplicada bruscamente (1 = sí)", "REBA observación 1: Fuerza aplicada bruscamente (+1) (1 = sí)"],
  ["REBA Obs. 1 – Brazo (puntaje 1–4)", "REBA observación 1: Brazo (puntaje)"],
  ["REBA Obs. 1 – Brazo abducido o rotado (1 = sí)", "REBA observación 1: Brazo abducido o rotado (+1) (1 = sí)"],
  ["REBA Obs. 1 – Hombro elevado (1 = sí)", "REBA observación 1: Hombro elevado (+1) (1 = sí)"],
  ["REBA Obs. 1 – Brazo apoyado o a favor de la gravedad (1 = sí)", "REBA observación 1: Brazo apoyado o a favor de la gravedad (−1) (1 = sí)"],
  ["REBA Obs. 1 – Antebrazo (puntaje 1–2)", "REBA observación 1: Antebrazo (puntaje)"],
  ["REBA Obs. 1 – Muñeca (puntaje 1–2)", "REBA observación 1: Muñeca (puntaje)"],
  ["REBA Obs. 1 – Muñeca con desviación o torsión (1 = sí)", "REBA observación 1: Desviación o torsión (+1) (1 = sí)"],
  ["REBA Obs. 1 – Agarre (puntaje 0–3)", "REBA observación 1: Agarre (puntaje)"],
  ["REBA Obs. 1 – Partes del cuerpo estáticas más de 1 minuto (1 = sí)", "REBA observación 1: Una o más partes del cuerpo estáticas >1 min (+1) (1 = sí)"],
  ["REBA Obs. 1 – Movimientos repetitivos más de 4 veces por minuto (1 = sí)", "REBA observación 1: Movimientos repetitivos >4 veces/min (+1) (1 = sí)"],
  ["REBA Obs. 1 – Cambios posturales importantes o base inestable (1 = sí)", "REBA observación 1: Cambios posturales importantes o base inestable (+1) (1 = sí)"],
  ["REBA Obs. 1 – Puntaje A (tabla A + carga)", "REBA observación 1: puntaje A (tabla A + carga)"],
  ["REBA Obs. 1 – Puntaje B (tabla B + agarre)", "REBA observación 1: puntaje B (tabla B + agarre)"],
  ["REBA Obs. 1 – Puntaje C (tabla C)", "REBA observación 1: puntaje tabla C"],
  ["REBA Obs. 1 – Puntaje de actividad", "REBA observación 1: puntaje de actividad"],
  ["REBA Obs. 1 – Puntaje total", "REBA observación 1: puntaje total"],
  ["REBA Obs. 2 – Cuello (puntaje 1–2)", "REBA observación 2: Cuello (puntaje)"],
  ["REBA Obs. 2 – Cuello con torsión o inclinación lateral (1 = sí)", "REBA observación 2: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["REBA Obs. 2 – Tronco (puntaje 1–4)", "REBA observación 2: Tronco (puntaje)"],
  ["REBA Obs. 2 – Tronco con torsión o inclinación lateral (1 = sí)", "REBA observación 2: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["REBA Obs. 2 – Piernas (puntaje 1–2)", "REBA observación 2: Piernas (puntaje)"],
  ["REBA Obs. 2 – Flexión de rodillas (puntaje 0–2)", "REBA observación 2: Flexión de rodillas (puntaje)"],
  ["REBA Obs. 2 – Carga o fuerza (puntaje 0–2)", "REBA observación 2: Carga/fuerza (puntaje)"],
  ["REBA Obs. 2 – Fuerza aplicada bruscamente (1 = sí)", "REBA observación 2: Fuerza aplicada bruscamente (+1) (1 = sí)"],
  ["REBA Obs. 2 – Brazo (puntaje 1–4)", "REBA observación 2: Brazo (puntaje)"],
  ["REBA Obs. 2 – Brazo abducido o rotado (1 = sí)", "REBA observación 2: Brazo abducido o rotado (+1) (1 = sí)"],
  ["REBA Obs. 2 – Hombro elevado (1 = sí)", "REBA observación 2: Hombro elevado (+1) (1 = sí)"],
  ["REBA Obs. 2 – Brazo apoyado o a favor de la gravedad (1 = sí)", "REBA observación 2: Brazo apoyado o a favor de la gravedad (−1) (1 = sí)"],
  ["REBA Obs. 2 – Antebrazo (puntaje 1–2)", "REBA observación 2: Antebrazo (puntaje)"],
  ["REBA Obs. 2 – Muñeca (puntaje 1–2)", "REBA observación 2: Muñeca (puntaje)"],
  ["REBA Obs. 2 – Muñeca con desviación o torsión (1 = sí)", "REBA observación 2: Desviación o torsión (+1) (1 = sí)"],
  ["REBA Obs. 2 – Agarre (puntaje 0–3)", "REBA observación 2: Agarre (puntaje)"],
  ["REBA Obs. 2 – Partes del cuerpo estáticas más de 1 minuto (1 = sí)", "REBA observación 2: Una o más partes del cuerpo estáticas >1 min (+1) (1 = sí)"],
  ["REBA Obs. 2 – Movimientos repetitivos más de 4 veces por minuto (1 = sí)", "REBA observación 2: Movimientos repetitivos >4 veces/min (+1) (1 = sí)"],
  ["REBA Obs. 2 – Cambios posturales importantes o base inestable (1 = sí)", "REBA observación 2: Cambios posturales importantes o base inestable (+1) (1 = sí)"],
  ["REBA Obs. 2 – Puntaje A (tabla A + carga)", "REBA observación 2: puntaje A (tabla A + carga)"],
  ["REBA Obs. 2 – Puntaje B (tabla B + agarre)", "REBA observación 2: puntaje B (tabla B + agarre)"],
  ["REBA Obs. 2 – Puntaje C (tabla C)", "REBA observación 2: puntaje tabla C"],
  ["REBA Obs. 2 – Puntaje de actividad", "REBA observación 2: puntaje de actividad"],
  ["REBA Obs. 2 – Puntaje total", "REBA observación 2: puntaje total"],
  ["REBA Obs. 3 – Cuello (puntaje 1–2)", "REBA observación 3: Cuello (puntaje)"],
  ["REBA Obs. 3 – Cuello con torsión o inclinación lateral (1 = sí)", "REBA observación 3: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["REBA Obs. 3 – Tronco (puntaje 1–4)", "REBA observación 3: Tronco (puntaje)"],
  ["REBA Obs. 3 – Tronco con torsión o inclinación lateral (1 = sí)", "REBA observación 3: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["REBA Obs. 3 – Piernas (puntaje 1–2)", "REBA observación 3: Piernas (puntaje)"],
  ["REBA Obs. 3 – Flexión de rodillas (puntaje 0–2)", "REBA observación 3: Flexión de rodillas (puntaje)"],
  ["REBA Obs. 3 – Carga o fuerza (puntaje 0–2)", "REBA observación 3: Carga/fuerza (puntaje)"],
  ["REBA Obs. 3 – Fuerza aplicada bruscamente (1 = sí)", "REBA observación 3: Fuerza aplicada bruscamente (+1) (1 = sí)"],
  ["REBA Obs. 3 – Brazo (puntaje 1–4)", "REBA observación 3: Brazo (puntaje)"],
  ["REBA Obs. 3 – Brazo abducido o rotado (1 = sí)", "REBA observación 3: Brazo abducido o rotado (+1) (1 = sí)"],
  ["REBA Obs. 3 – Hombro elevado (1 = sí)", "REBA observación 3: Hombro elevado (+1) (1 = sí)"],
  ["REBA Obs. 3 – Brazo apoyado o a favor de la gravedad (1 = sí)", "REBA observación 3: Brazo apoyado o a favor de la gravedad (−1) (1 = sí)"],
  ["REBA Obs. 3 – Antebrazo (puntaje 1–2)", "REBA observación 3: Antebrazo (puntaje)"],
  ["REBA Obs. 3 – Muñeca (puntaje 1–2)", "REBA observación 3: Muñeca (puntaje)"],
  ["REBA Obs. 3 – Muñeca con desviación o torsión (1 = sí)", "REBA observación 3: Desviación o torsión (+1) (1 = sí)"],
  ["REBA Obs. 3 – Agarre (puntaje 0–3)", "REBA observación 3: Agarre (puntaje)"],
  ["REBA Obs. 3 – Partes del cuerpo estáticas más de 1 minuto (1 = sí)", "REBA observación 3: Una o más partes del cuerpo estáticas >1 min (+1) (1 = sí)"],
  ["REBA Obs. 3 – Movimientos repetitivos más de 4 veces por minuto (1 = sí)", "REBA observación 3: Movimientos repetitivos >4 veces/min (+1) (1 = sí)"],
  ["REBA Obs. 3 – Cambios posturales importantes o base inestable (1 = sí)", "REBA observación 3: Cambios posturales importantes o base inestable (+1) (1 = sí)"],
  ["REBA Obs. 3 – Puntaje A (tabla A + carga)", "REBA observación 3: puntaje A (tabla A + carga)"],
  ["REBA Obs. 3 – Puntaje B (tabla B + agarre)", "REBA observación 3: puntaje B (tabla B + agarre)"],
  ["REBA Obs. 3 – Puntaje C (tabla C)", "REBA observación 3: puntaje tabla C"],
  ["REBA Obs. 3 – Puntaje de actividad", "REBA observación 3: puntaje de actividad"],
  ["REBA Obs. 3 – Puntaje total", "REBA observación 3: puntaje total"],
  ["REBA: Puntaje final (máximo de las 3 observaciones)", "REBA final (máximo de las 3 observaciones)"],
  ["REBA: Nivel de riesgo", "Nivel de riesgo REBA"],
  ["Número de fotos", "Número de fotos (detalle en «Multimedia»)"],
  ["IDs de las fotos en Drive", "Ids de Drive de las fotos"],
  ["Enlaces de las fotos en Drive", "Enlaces de Drive de las fotos"],
  ["Datos completos (JSON, no editar)", "Registro completo en formato JSON: lo usa el panel de administración. No lo edite ni lo borre."]
];
// columnas de «Multimedia»: [encabezado completo, nota]
const MM_DEF = [
  ["ID de la foto", "Identificador único de la foto"],
  ["ID de la encuesta", "Encuesta a la que pertenece la foto (une con la tabla «Encuestas»)"],
  ["Código del participante", "E = egresado, I = interno"],
  ["Estrato", "Egresado o Interno"],
  ["Fecha de aplicación", "Fecha en que se aplicó la encuesta"],
  ["Observación REBA (1, 2 o 3)", "Observación REBA a la que corresponde la foto"],
  ["Tipo de archivo", "Formato de la imagen (image/jpeg)"],
  ["Nombre del archivo en Drive", "Nombre con que se guardó en la carpeta Multimedia"],
  ["Tamaño (KB)", "Tamaño del archivo en kilobytes"],
  ["ID del archivo en Drive", "Identificador del archivo en Google Drive"],
  ["Enlace de la foto en Drive", "Abre la foto en Google Drive"],
  ["Fecha y hora de la foto", "Momento en que se tomó la foto"],
  ["Fecha y hora de registro en Drive", "Momento en que la foto llegó a Drive"]
];
const ENC_COLS = ENC_DEF.map(c => c[0]);
// encabezados que usa el servidor (deben coincidir con ENC_DEF y MM_DEF)
const C_ID = "ID de la encuesta", C_REG = "Fecha y hora de registro en Google Sheets", C_JSON = "Datos completos (JSON, no editar)";
const M_ID = "ID de la foto", M_DRIVE = "ID del archivo en Drive", M_URL = "Enlace de la foto en Drive";
const MM_COLS = MM_DEF.map(c => c[0]);
const ALFA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin O/0, I/1 ni L
const SESION_SEG = 6 * 60 * 60;
const PROPS = PropertiesService.getScriptProperties();

/* ---------------------------------------------------------------------------
   Configuración (se ejecuta a mano una vez desde el editor de Apps Script)
   --------------------------------------------------------------------------- */
function configurar() {
  let carpeta = null;
  if (ID_CARPETA) carpeta = DriveApp.getFolderById(ID_CARPETA);
  else if (PROPS.getProperty("CARPETA")) { try { carpeta = DriveApp.getFolderById(PROPS.getProperty("CARPETA")); } catch (e) { carpeta = null; } }
  if (!carpeta) carpeta = DriveApp.createFolder(NOMBRE_CARPETA);

  let ss = ID_HOJA ? SpreadsheetApp.openById(ID_HOJA) : null;
  if (!ss && PROPS.getProperty("HOJA")) { try { ss = SpreadsheetApp.openById(PROPS.getProperty("HOJA")); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create("TME – Base de datos"); DriveApp.getFileById(ss.getId()).moveTo(carpeta); }

  const enc = ss.getSheetByName(HOJA_ENC) || ss.insertSheet(HOJA_ENC);
  const mm = ss.getSheetByName(HOJA_MM) || ss.insertSheet(HOJA_MM);
  ss.getSheets().forEach(h => { if (h.getName() !== HOJA_ENC && h.getName() !== HOJA_MM && h.getLastRow() === 0) ss.deleteSheet(h); });
  // encabezados de todas las respuestas y de la multimedia, con la pregunta como nota de cada columna
  columnas(enc, ENC_DEF);
  columnas(mm, MM_DEF);

  const fotos = subcarpeta(carpeta, "Multimedia");
  PROPS.setProperties({ CARPETA: carpeta.getId(), HOJA: ss.getId(), FOTOS: fotos.getId() });

  let codigo = "";
  if (!PROPS.getProperty("COD_HASH")) codigo = fijarCodigo();
  Logger.log("Carpeta de Drive: " + carpeta.getUrl());
  Logger.log("Hoja de cálculo: " + ss.getUrl());
  Logger.log(codigo ? "CÓDIGO DE ACCESO AL PANEL: " + codigo + "  (anótelo; no se volverá a mostrar)" : "El código de acceso ya existía. Para cambiarlo ejecute nuevoCodigoAcceso().");
}

// por si se pierde el código: genera otro y lo muestra en el registro de ejecución
function nuevoCodigoAcceso() { Logger.log("NUEVO CÓDIGO DE ACCESO AL PANEL: " + fijarCodigo()); }

/* ---------------------------------------------------------------------------
   Puntos de entrada
   --------------------------------------------------------------------------- */
// el enlace /exec solo recibe datos: la encuesta es PrimerModelo.html (constante GS_URL)
function doGet() {
  return ContentService.createTextOutput("Servidor del Estudio TME activo. Abra la encuesta desde PrimerModelo.html.");
}

// PrimerModelo.html envía cada pedido aquí
function doPost(e) {
  let req = null;
  try { req = JSON.parse(e.postData.contents); } catch (err) { req = null; }
  return ContentService.createTextOutput(JSON.stringify(api(req))).setMimeType(ContentService.MimeType.JSON);
}

// atiende los pedidos de PrimerModelo.html (llegan por doPost)
function api(req) {
  try {
    switch (req && req.action) {
      case "estado": return { ok: true, configurado: !!PROPS.getProperty("HOJA"), codigo: !!PROPS.getProperty("COD_HASH") };
      case "guardarEncuesta": return guardarEncuesta(req);
      case "subirFoto": return subirFoto(req);
      case "login": return login(req);
      case "listar": auth(req); return listar();
      case "foto": auth(req); return foto(req);
      case "nuevoCodigo": { auth(req); const codigo = fijarCodigo(); return { ok: true, codigo: codigo, token: nuevoToken() }; }
      default: return { ok: false, error: "Acción desconocida" };
    }
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e), code: (e && e.code) || "" };
  }
}

/* ---------------------------------------------------------------------------
   Tabla «Encuestas»
   --------------------------------------------------------------------------- */
function guardarEncuesta(req) {
  const rec = req.rec, fila = req.fila;
  if (!rec || typeof rec.id !== "string" || !/^[EI]-\d{1,4}_\d+$/.test(rec.id)) throw falla("Registro inválido", "datos");
  if (!fila || !Array.isArray(fila.cols) || !Array.isArray(fila.vals) || fila.cols.length !== fila.vals.length) throw falla("Fila inválida", "datos");
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sh = tabla(HOJA_ENC);
    if (buscar(sh, C_ID, rec.id)) return { ok: true, id: rec.id, repetida: true };
    const vals = {};
    fila.cols.forEach((c, i) => { vals[c] = fila.vals[i]; });
    vals[C_ID] = rec.id; vals[C_REG] = new Date(); vals[C_JSON] = JSON.stringify(rec);
    escribir(sh, ENC_COLS.concat(fila.cols.filter(c => ENC_COLS.indexOf(c) < 0)), vals);
    return { ok: true, id: rec.id };
  } finally { lock.releaseLock(); }
}

function listar() {
  const sh = tabla(HOJA_ENC), n = sh.getLastRow(), head = encabezado(sh), j = head.indexOf(C_JSON);
  const encuestas = [];
  if (n > 1 && j >= 0) sh.getRange(2, j + 1, n - 1, 1).getValues().forEach(r => { try { if (r[0]) encuestas.push(JSON.parse(r[0])); } catch (e) { /* fila editada a mano */ } });
  return { ok: true, encuestas: encuestas, hoja: libro().getUrl(), carpeta: DriveApp.getFolderById(PROPS.getProperty("CARPETA")).getUrl() };
}

/* ---------------------------------------------------------------------------
   Tabla «Multimedia» y archivos en Drive
   --------------------------------------------------------------------------- */
function subirFoto(req) {
  const f = req.foto || {};
  const m = typeof f.data === "string" ? f.data.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m || typeof f.id !== "string" || !/^[EI]-\d{1,4}_\d+_[\w-]+$/.test(f.id)) throw falla("Foto inválida", "datos");
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sh = tabla(HOJA_MM);
    const prev = buscar(sh, M_ID, f.id);
    if (prev) return { ok: true, id: f.id, archivo: String(prev[M_DRIVE]), url: String(prev[M_URL]), repetida: true };
    const ext = m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg";
    const nombre = f.codigo + "_obs" + f.obs + "_" + f.id.split("_").pop() + "." + ext;
    const bytes = Utilities.base64Decode(m[2]);
    const carpeta = subcarpeta(DriveApp.getFolderById(PROPS.getProperty("FOTOS")), f.estrato === "Interno" ? "Interno" : "Egresado");
    const file = carpeta.createFile(Utilities.newBlob(bytes, m[1], nombre));
    // mismo orden que MM_DEF
    const v = [f.id, f.encuesta, f.codigo, f.estrato, f.fecha, f.obs, m[1], nombre, Math.round(bytes.length / 102.4) / 10, file.getId(), file.getUrl(), f.ts || "", new Date()];
    const vals = {}; MM_COLS.forEach((c, i) => { vals[c] = v[i]; });
    escribir(sh, MM_COLS, vals);
    return { ok: true, id: f.id, archivo: file.getId(), url: file.getUrl() };
  } finally { lock.releaseLock(); }
}

// solo entrega archivos registrados en la tabla «Multimedia»
function foto(req) {
  const id = String(req.archivo || "");
  if (!id || !buscar(tabla(HOJA_MM), M_DRIVE, id)) throw falla("Foto no encontrada", "datos");
  const blob = DriveApp.getFileById(id).getBlob();
  return { ok: true, data: "data:" + blob.getContentType() + ";base64," + Utilities.base64Encode(blob.getBytes()) };
}

/* ---------------------------------------------------------------------------
   Acceso al panel: el código no se guarda, solo su huella
   --------------------------------------------------------------------------- */
function login(req) {
  const cache = CacheService.getScriptCache();
  const fallos = Number(cache.get("fallos") || 0);
  if (fallos >= 10) throw falla("Demasiados intentos", "bloqueado");
  const sal = PROPS.getProperty("COD_SAL"), hash = PROPS.getProperty("COD_HASH");
  if (!sal || !hash) throw falla("Sin código asignado", "config");
  if (huella(String(req.codigo || "").trim().toUpperCase(), sal) !== hash) { cache.put("fallos", String(fallos + 1), 600); throw falla("Código incorrecto", "codigo"); }
  return { ok: true, token: nuevoToken() };
}

function auth(req) {
  const ver = req && req.token ? CacheService.getScriptCache().get("tk_" + req.token) : null;
  if (!ver || ver !== PROPS.getProperty("COD_VER")) throw falla("Sesión vencida", "auth");
}

function nuevoToken() {
  const t = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("tk_" + t, PROPS.getProperty("COD_VER"), SESION_SEG);
  return t;
}

// genera el código TME-XXXX-XXXX, guarda sal y huella, e invalida las sesiones anteriores
function fijarCodigo() {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + Utilities.getUuid() + Date.now());
  let c = "";
  for (let i = 0; i < 8; i++) c += ALFA[(bytes[i] + 256) % ALFA.length];
  const codigo = "TME-" + c.slice(0, 4) + "-" + c.slice(4);
  const sal = Utilities.getUuid();
  PROPS.setProperties({ COD_SAL: sal, COD_HASH: huella(codigo, sal), COD_VER: String(Number(PROPS.getProperty("COD_VER") || 0) + 1) });
  return codigo;
}

function huella(codigo, sal) {
  let h = sal + "|" + codigo;
  for (let i = 0; i < 300; i++) h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + sal, Utilities.Charset.UTF_8));
  return h;
}

/* ---------------------------------------------------------------------------
   Utilidades
   --------------------------------------------------------------------------- */
function libro() {
  const id = PROPS.getProperty("HOJA");
  if (!id) throw falla("La base de datos no está configurada: ejecute configurar() en Apps Script", "config");
  return SpreadsheetApp.openById(id);
}
function tabla(nombre) { const h = libro().getSheetByName(nombre); if (!h) throw falla("Falta la tabla «" + nombre + "»: ejecute configurar()", "config"); return h; }
function encabezado(sh) { const n = sh.getLastColumn(); return n ? sh.getRange(1, 1, 1, n).getValues()[0].map(String) : []; }

// busca una fila por el valor de una columna y la devuelve como objeto
function buscar(sh, col, valor) {
  const head = encabezado(sh), j = head.indexOf(col), n = sh.getLastRow();
  if (j < 0 || n < 2) return null;
  const vals = sh.getRange(2, j + 1, n - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (String(vals[i][0]) === String(valor)) { const row = sh.getRange(i + 2, 1, 1, head.length).getValues()[0]; const o = {}; head.forEach((h, k) => { o[h] = row[k]; }); return o; }
  }
  return null;
}

// escribe los encabezados que falten (en orden) y pone la descripción como nota
function columnas(sh, def) {
  if (sh.getLastRow() <= 1 && sh.getLastColumn() > 0) sh.getRange(1, 1, 1, sh.getLastColumn()).clearContent().clearNote();
  let head = encabezado(sh).filter(String);
  const faltan = def.filter(d => head.indexOf(d[0]) < 0);
  if (faltan.length) {
    const need = head.length + faltan.length - sh.getMaxColumns();
    if (need > 0) sh.insertColumnsAfter(sh.getMaxColumns(), need);
    sh.getRange(1, head.length + 1, 1, faltan.length).setValues([faltan.map(d => d[0])]);
    head = head.concat(faltan.map(d => d[0]));
  }
  const notas = head.map(h => { const d = def.find(x => x[0] === h); return d ? d[1] : ""; });
  sh.getRange(1, 1, 1, head.length).setNotes([notas]).setFontWeight("bold").setBackground("#FFE1E8");
  sh.setFrozenRows(1);
}

// agrega una fila ordenada por nombre de columna; crea las columnas que falten
function escribir(sh, cols, vals) {
  let head = encabezado(sh);
  const faltan = cols.filter(c => head.indexOf(c) < 0);
  if (faltan.length) {
    const need = head.length + faltan.length - sh.getMaxColumns();
    if (need > 0) sh.insertColumnsAfter(sh.getMaxColumns(), need);
    sh.getRange(1, head.length + 1, 1, faltan.length).setValues([faltan]).setFontWeight("bold").setBackground("#FFE8EC");
    head = head.concat(faltan);
  }
  sh.appendRow(head.map(h => celda(vals[h])));
}

// textos que empiezan con = + - @ se guardan como texto (no como fórmula)
function celda(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function subcarpeta(padre, nombre) { const it = padre.getFoldersByName(nombre); return it.hasNext() ? it.next() : padre.createFolder(nombre); }
function falla(msg, code) { const e = new Error(msg); e.code = code; return e; }
