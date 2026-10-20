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
// columnas de «Encuestas»: [nombre, descripción]. Son las mismas que envía PrimerModelo.html (flatCols)
const ENC_DEF = [
  ["id_encuesta", "Identificador único de la encuesta (código_marca de tiempo). Une esta tabla con «Multimedia»."],
  ["registrado", "Fecha y hora en que llegó a Google Sheets"],
  ["codigo", "Código del participante (E = egresado, I = interno)"],
  ["estrato", "Estrato: Egresado o Interno"],
  ["estado", "Estado: completa, rechazó o no elegible"],
  ["motivos", "Motivos de no elegibilidad"],
  ["fecha", "Fecha de aplicación"],
  ["establecimiento", "Establecimiento o sede"],
  ["dispositivo", "Dispositivo desde el que se envió"],
  ["enviado", "Fecha y hora de envío (ISO, UTC)"],
  ["cons_acepta", "Consentimiento informado"],
  ["cons_foto", "Autoriza fotografías"],
  ["ficha_edad", "Ficha: Edad (años)"],
  ["ficha_sexo", "Ficha: Sexo"],
  ["ficha_peso", "Ficha: Peso (kg)"],
  ["ficha_talla", "Ficha: Talla (m)"],
  ["ficha_mano", "Ficha: Mano dominante"],
  ["ficha_condicion", "Ficha: Condición"],
  ["ficha_meses", "Ficha: Tiempo en actividad asistencial (meses)"],
  ["ficha_pacientes", "Ficha: Número promedio de pacientes atendidos por día (pacientes)"],
  ["ficha_moviliza", "Ficha: ¿Realiza movilización o transferencia de pacientes en su actividad habitual?"],
  ["ficha_otroEmpleo", "Ficha: ¿Tiene otro empleo o actividad laboral adicional?"],
  ["ficha_anosEgreso", "Ficha: Años desde el egreso (años)"],
  ["ficha_vinculo", "Ficha: Tipo de vínculo laboral"],
  ["ficha_centros", "Ficha: Número de centros donde trabaja (centros)"],
  ["ficha_sede", "Ficha: Sede de internado"],
  ["ficha_mesInternado", "Ficha: Mes de internado en curso (mes)"],
  ["ficha_horas", "Ficha: ¿Cuántas horas trabaja durante el día? (horas)"],
  ["ficha_pausas", "Ficha: ¿Cuántas pausas activas realiza durante su turno de trabajo? (pausas)"],
  ["ficha_minPausa", "Ficha: ¿Cuántos minutos en promedio dura su pausa activa? (min)"],
  ["ficha_deporte", "Ficha: ¿Realiza actividad física o deporte de forma regular?"],
  ["ficha_deporteCual", "Ficha: ¿Realiza actividad física o deporte de forma regular? → ¿Cuál?"],
  ["ficha_lesionPrevia", "Ficha: ¿Ha tenido alguna lesión musculoesquelética previa (traumatismo, lesión deportiva, fractura) o cirugía musculoesquelética?"],
  ["ficha_lesionCual", "Ficha: ¿Ha tenido alguna lesión musculoesquelética previa (traumatismo, lesión deportiva, fractura) o cirugía musculoesquelética? → Especifique"],
  ["ficha_reuma", "Ficha: ¿Tiene diagnóstico de alguna enfermedad reumatológica sistémica (artritis reumatoide, lupus u otra)?"],
  ["ficha_embarazo", "Ficha: ¿Está embarazada actualmente?"],
  ["ficha_licencia", "Ficha: ¿Se encuentra actualmente con descanso médico o licencia?"],
  ["imc", "Índice de masa corporal (kg/m²)"],
  ["nasa_mental", "NASA-TLX: Exigencia mental (0–100)"],
  ["nasa_fisica", "NASA-TLX: Exigencia física (0–100)"],
  ["nasa_temporal", "NASA-TLX: Exigencia temporal (0–100)"],
  ["nasa_rendimiento", "NASA-TLX: Rendimiento (0–100)"],
  ["nasa_esfuerzo", "NASA-TLX: Esfuerzo (0–100)"],
  ["nasa_frustracion", "NASA-TLX: Frustración (0–100)"],
  ["nasa_raw", "NASA-TLX Raw: promedio de las 6 dimensiones (0–100)"],
  ["suseso_1", "SUSESO/ISTAS21 ítem 1: ¿Puede hacer su trabajo con tranquilidad y tenerlo al día? (0 Siempre … 4 Nunca)"],
  ["suseso_2", "SUSESO/ISTAS21 ítem 2: En su trabajo, ¿tiene usted que tomar decisiones difíciles? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_3", "SUSESO/ISTAS21 ítem 3: En general, ¿considera usted que su trabajo le provoca desgaste emocional? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_4", "SUSESO/ISTAS21 ítem 4: En su trabajo, ¿tiene usted que guardar sus emociones y no expresarlas? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_5", "SUSESO/ISTAS21 ítem 5: ¿Su trabajo requiere atención constante? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_6", "SUSESO/ISTAS21 ítem 6: ¿Tiene influencia sobre la cantidad de trabajo que se le asigna? (0 Siempre … 4 Nunca)"],
  ["suseso_7", "SUSESO/ISTAS21 ítem 7: ¿Puede dejar su trabajo un momento para conversar con un compañero o compañera? (0 Siempre … 4 Nunca)"],
  ["suseso_8", "SUSESO/ISTAS21 ítem 8: Su trabajo, ¿permite que aprenda cosas nuevas? (0 Siempre … 4 Nunca)"],
  ["suseso_9", "SUSESO/ISTAS21 ítem 9: Las tareas que hace, ¿le parecen importantes? (0 Siempre … 4 Nunca)"],
  ["suseso_10", "SUSESO/ISTAS21 ítem 10: ¿Siente que su empresa o institución tiene gran importancia para usted? (0 Siempre … 4 Nunca)"],
  ["suseso_11", "SUSESO/ISTAS21 ítem 11: ¿Sabe exactamente qué tareas son de su responsabilidad? (0 Siempre … 4 Nunca)"],
  ["suseso_12", "SUSESO/ISTAS21 ítem 12: ¿Tiene que hacer tareas que usted cree que deberían hacerse de otra manera? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_13", "SUSESO/ISTAS21 ítem 13: ¿Recibe ayuda y apoyo de su jefe(a) o superior(a) inmediato(a)? (0 Siempre … 4 Nunca)"],
  ["suseso_14", "SUSESO/ISTAS21 ítem 14: Entre compañeros y compañeras, ¿se ayudan en el trabajo? (0 Siempre … 4 Nunca)"],
  ["suseso_15", "SUSESO/ISTAS21 ítem 15: Sus jefes inmediatos, ¿resuelven bien los conflictos? (0 Siempre … 4 Nunca)"],
  ["suseso_16", "SUSESO/ISTAS21 ítem 16: ¿Está preocupado(a) por si lo(la) despiden o no le renuevan el contrato? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_17", "SUSESO/ISTAS21 ítem 17: ¿Está preocupado(a) por si le cambian las tareas contra su voluntad? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_18", "SUSESO/ISTAS21 ítem 18: Mis superiores me dan el reconocimiento que merezco. (0 Siempre … 4 Nunca)"],
  ["suseso_19", "SUSESO/ISTAS21 ítem 19: Si está ausente un día de casa, las tareas domésticas que realiza, ¿se quedan sin hacer? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_20", "SUSESO/ISTAS21 ítem 20: Cuando está en el trabajo, ¿piensa en las exigencias domésticas y familiares? (0 Siempre … 4 Nunca; ítem inverso)"],
  ["suseso_ex", "SUSESO/ISTAS21 puntaje: Exigencias psicológicas"],
  ["suseso_ta", "SUSESO/ISTAS21 puntaje: Trabajo activo y desarrollo de habilidades"],
  ["suseso_as", "SUSESO/ISTAS21 puntaje: Apoyo social en la empresa y calidad de liderazgo"],
  ["suseso_co", "SUSESO/ISTAS21 puntaje: Compensaciones"],
  ["suseso_dp", "SUSESO/ISTAS21 puntaje: Doble presencia"],
  ["warr_1", "Warr-Cook-Wall ítem 1: Condiciones físicas del trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_2", "Warr-Cook-Wall ítem 2: Libertad para elegir tu propio método de trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_3", "Warr-Cook-Wall ítem 3: Tus compañeros de trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_4", "Warr-Cook-Wall ítem 4: Reconocimiento que obtienes por el trabajo bien hecho (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_5", "Warr-Cook-Wall ítem 5: Tu superior inmediato (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_6", "Warr-Cook-Wall ítem 6: Responsabilidad que se te ha asignado (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_7", "Warr-Cook-Wall ítem 7: Tu salario (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_8", "Warr-Cook-Wall ítem 8: La posibilidad de utilizar tus capacidades (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_9", "Warr-Cook-Wall ítem 9: Relaciones entre dirección y trabajadores en tu institución (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_10", "Warr-Cook-Wall ítem 10: Tus posibilidades de promocionar (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_11", "Warr-Cook-Wall ítem 11: El modo en que tu institución está gestionada (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_12", "Warr-Cook-Wall ítem 12: La atención que se presta a las sugerencias que haces (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_13", "Warr-Cook-Wall ítem 13: Tu horario de trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_14", "Warr-Cook-Wall ítem 14: La variedad de tareas que realizas en tu trabajo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_15", "Warr-Cook-Wall ítem 15: Tu estabilidad en el empleo (1 Muy insatisfecho … 7 Muy satisfecho)"],
  ["warr_total", "Satisfacción laboral Warr-Cook-Wall: total (15–105)"],
  ["nord_cuello_12m", "Nórdico Cuello: molestias en los últimos 12 meses"],
  ["nord_cuello_7d", "Nórdico Cuello: molestias en los últimos 7 días"],
  ["nord_cuello_imp", "Nórdico Cuello: le impidió trabajar (12 meses)"],
  ["nord_hombros_12m", "Nórdico Hombros: molestias en los últimos 12 meses"],
  ["nord_hombros_12m_lado", "Nórdico Hombros: lado (12 meses)"],
  ["nord_hombros_7d", "Nórdico Hombros: molestias en los últimos 7 días"],
  ["nord_hombros_7d_lado", "Nórdico Hombros: lado (7 días)"],
  ["nord_hombros_imp", "Nórdico Hombros: le impidió trabajar (12 meses)"],
  ["nord_codos_12m", "Nórdico Codos: molestias en los últimos 12 meses"],
  ["nord_codos_12m_lado", "Nórdico Codos: lado (12 meses)"],
  ["nord_codos_7d", "Nórdico Codos: molestias en los últimos 7 días"],
  ["nord_codos_7d_lado", "Nórdico Codos: lado (7 días)"],
  ["nord_codos_imp", "Nórdico Codos: le impidió trabajar (12 meses)"],
  ["nord_munecas_12m", "Nórdico Muñecas / manos: molestias en los últimos 12 meses"],
  ["nord_munecas_12m_lado", "Nórdico Muñecas / manos: lado (12 meses)"],
  ["nord_munecas_7d", "Nórdico Muñecas / manos: molestias en los últimos 7 días"],
  ["nord_munecas_7d_lado", "Nórdico Muñecas / manos: lado (7 días)"],
  ["nord_munecas_imp", "Nórdico Muñecas / manos: le impidió trabajar (12 meses)"],
  ["nord_dorsal_12m", "Nórdico Columna dorsal: molestias en los últimos 12 meses"],
  ["nord_dorsal_7d", "Nórdico Columna dorsal: molestias en los últimos 7 días"],
  ["nord_dorsal_imp", "Nórdico Columna dorsal: le impidió trabajar (12 meses)"],
  ["nord_lumbar_12m", "Nórdico Columna lumbar: molestias en los últimos 12 meses"],
  ["nord_lumbar_7d", "Nórdico Columna lumbar: molestias en los últimos 7 días"],
  ["nord_lumbar_imp", "Nórdico Columna lumbar: le impidió trabajar (12 meses)"],
  ["nord_caderas_12m", "Nórdico Caderas / muslos: molestias en los últimos 12 meses"],
  ["nord_caderas_7d", "Nórdico Caderas / muslos: molestias en los últimos 7 días"],
  ["nord_caderas_imp", "Nórdico Caderas / muslos: le impidió trabajar (12 meses)"],
  ["nord_rodillas_12m", "Nórdico Rodillas: molestias en los últimos 12 meses"],
  ["nord_rodillas_7d", "Nórdico Rodillas: molestias en los últimos 7 días"],
  ["nord_rodillas_imp", "Nórdico Rodillas: le impidió trabajar (12 meses)"],
  ["nord_tobillos_12m", "Nórdico Tobillos / pies: molestias en los últimos 12 meses"],
  ["nord_tobillos_7d", "Nórdico Tobillos / pies: molestias en los últimos 7 días"],
  ["nord_tobillos_imp", "Nórdico Tobillos / pies: le impidió trabajar (12 meses)"],
  ["sintomas_12m", "Síntomas en al menos una región en 12 meses (1 = sí, 0 = no)"],
  ["reba_tarea", "REBA: tarea observada"],
  ["reba_lado", "REBA: lado evaluado"],
  ["reba_o1_neck", "REBA observación 1: Cuello (puntaje)"],
  ["reba_o1_neckAdj", "REBA observación 1: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["reba_o1_trunk", "REBA observación 1: Tronco (puntaje)"],
  ["reba_o1_trunkAdj", "REBA observación 1: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["reba_o1_legs", "REBA observación 1: Piernas (puntaje)"],
  ["reba_o1_knee", "REBA observación 1: Flexión de rodillas (puntaje)"],
  ["reba_o1_load", "REBA observación 1: Carga/fuerza (puntaje)"],
  ["reba_o1_shock", "REBA observación 1: Fuerza aplicada bruscamente (+1) (1 = sí)"],
  ["reba_o1_upper", "REBA observación 1: Brazo (puntaje)"],
  ["reba_o1_abd", "REBA observación 1: Brazo abducido o rotado (+1) (1 = sí)"],
  ["reba_o1_raised", "REBA observación 1: Hombro elevado (+1) (1 = sí)"],
  ["reba_o1_supported", "REBA observación 1: Brazo apoyado o a favor de la gravedad (−1) (1 = sí)"],
  ["reba_o1_lower", "REBA observación 1: Antebrazo (puntaje)"],
  ["reba_o1_wrist", "REBA observación 1: Muñeca (puntaje)"],
  ["reba_o1_wristAdj", "REBA observación 1: Desviación o torsión (+1) (1 = sí)"],
  ["reba_o1_coupling", "REBA observación 1: Agarre (puntaje)"],
  ["reba_o1_act1", "REBA observación 1: Una o más partes del cuerpo estáticas >1 min (+1) (1 = sí)"],
  ["reba_o1_act2", "REBA observación 1: Movimientos repetitivos >4 veces/min (+1) (1 = sí)"],
  ["reba_o1_act3", "REBA observación 1: Cambios posturales importantes o base inestable (+1) (1 = sí)"],
  ["reba_o1_puntaje_a", "REBA observación 1: puntaje A (tabla A + carga)"],
  ["reba_o1_puntaje_b", "REBA observación 1: puntaje B (tabla B + agarre)"],
  ["reba_o1_puntaje_c", "REBA observación 1: puntaje tabla C"],
  ["reba_o1_actividad", "REBA observación 1: puntaje de actividad"],
  ["reba_o2_neck", "REBA observación 2: Cuello (puntaje)"],
  ["reba_o2_neckAdj", "REBA observación 2: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["reba_o2_trunk", "REBA observación 2: Tronco (puntaje)"],
  ["reba_o2_trunkAdj", "REBA observación 2: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["reba_o2_legs", "REBA observación 2: Piernas (puntaje)"],
  ["reba_o2_knee", "REBA observación 2: Flexión de rodillas (puntaje)"],
  ["reba_o2_load", "REBA observación 2: Carga/fuerza (puntaje)"],
  ["reba_o2_shock", "REBA observación 2: Fuerza aplicada bruscamente (+1) (1 = sí)"],
  ["reba_o2_upper", "REBA observación 2: Brazo (puntaje)"],
  ["reba_o2_abd", "REBA observación 2: Brazo abducido o rotado (+1) (1 = sí)"],
  ["reba_o2_raised", "REBA observación 2: Hombro elevado (+1) (1 = sí)"],
  ["reba_o2_supported", "REBA observación 2: Brazo apoyado o a favor de la gravedad (−1) (1 = sí)"],
  ["reba_o2_lower", "REBA observación 2: Antebrazo (puntaje)"],
  ["reba_o2_wrist", "REBA observación 2: Muñeca (puntaje)"],
  ["reba_o2_wristAdj", "REBA observación 2: Desviación o torsión (+1) (1 = sí)"],
  ["reba_o2_coupling", "REBA observación 2: Agarre (puntaje)"],
  ["reba_o2_act1", "REBA observación 2: Una o más partes del cuerpo estáticas >1 min (+1) (1 = sí)"],
  ["reba_o2_act2", "REBA observación 2: Movimientos repetitivos >4 veces/min (+1) (1 = sí)"],
  ["reba_o2_act3", "REBA observación 2: Cambios posturales importantes o base inestable (+1) (1 = sí)"],
  ["reba_o2_puntaje_a", "REBA observación 2: puntaje A (tabla A + carga)"],
  ["reba_o2_puntaje_b", "REBA observación 2: puntaje B (tabla B + agarre)"],
  ["reba_o2_puntaje_c", "REBA observación 2: puntaje tabla C"],
  ["reba_o2_actividad", "REBA observación 2: puntaje de actividad"],
  ["reba_o3_neck", "REBA observación 3: Cuello (puntaje)"],
  ["reba_o3_neckAdj", "REBA observación 3: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["reba_o3_trunk", "REBA observación 3: Tronco (puntaje)"],
  ["reba_o3_trunkAdj", "REBA observación 3: Torsión o inclinación lateral (+1) (1 = sí)"],
  ["reba_o3_legs", "REBA observación 3: Piernas (puntaje)"],
  ["reba_o3_knee", "REBA observación 3: Flexión de rodillas (puntaje)"],
  ["reba_o3_load", "REBA observación 3: Carga/fuerza (puntaje)"],
  ["reba_o3_shock", "REBA observación 3: Fuerza aplicada bruscamente (+1) (1 = sí)"],
  ["reba_o3_upper", "REBA observación 3: Brazo (puntaje)"],
  ["reba_o3_abd", "REBA observación 3: Brazo abducido o rotado (+1) (1 = sí)"],
  ["reba_o3_raised", "REBA observación 3: Hombro elevado (+1) (1 = sí)"],
  ["reba_o3_supported", "REBA observación 3: Brazo apoyado o a favor de la gravedad (−1) (1 = sí)"],
  ["reba_o3_lower", "REBA observación 3: Antebrazo (puntaje)"],
  ["reba_o3_wrist", "REBA observación 3: Muñeca (puntaje)"],
  ["reba_o3_wristAdj", "REBA observación 3: Desviación o torsión (+1) (1 = sí)"],
  ["reba_o3_coupling", "REBA observación 3: Agarre (puntaje)"],
  ["reba_o3_act1", "REBA observación 3: Una o más partes del cuerpo estáticas >1 min (+1) (1 = sí)"],
  ["reba_o3_act2", "REBA observación 3: Movimientos repetitivos >4 veces/min (+1) (1 = sí)"],
  ["reba_o3_act3", "REBA observación 3: Cambios posturales importantes o base inestable (+1) (1 = sí)"],
  ["reba_o3_puntaje_a", "REBA observación 3: puntaje A (tabla A + carga)"],
  ["reba_o3_puntaje_b", "REBA observación 3: puntaje B (tabla B + agarre)"],
  ["reba_o3_puntaje_c", "REBA observación 3: puntaje tabla C"],
  ["reba_o3_actividad", "REBA observación 3: puntaje de actividad"],
  ["reba_obs1", "REBA: puntaje final observación 1"],
  ["reba_obs2", "REBA: puntaje final observación 2"],
  ["reba_obs3", "REBA: puntaje final observación 3"],
  ["reba_final", "REBA final (máximo de las 3 observaciones)"],
  ["reba_nivel", "Nivel de riesgo REBA"],
  ["n_fotos", "Número de fotos (detalle en «Multimedia»)"],
  ["fotos_ids_drive", "Ids de Drive de las fotos"],
  ["fotos_urls", "Enlaces de Drive de las fotos"],
  ["datos_json", "Registro completo en JSON (lo usa el panel; no editar)"]
];
// columnas de «Multimedia»: [nombre, descripción]
const MM_DEF = [
  ["id_archivo", "Identificador único de la foto"],
  ["id_encuesta", "Encuesta a la que pertenece (une con «Encuestas»)"],
  ["codigo", "Código del participante"],
  ["estrato", "Estrato: Egresado o Interno"],
  ["fecha", "Fecha de aplicación"],
  ["observacion", "Observación REBA (1, 2 o 3)"],
  ["tipo", "Tipo de archivo"],
  ["nombre_archivo", "Nombre del archivo en Drive"],
  ["tamano_kb", "Tamaño (KB)"],
  ["id_drive", "Id del archivo en Drive"],
  ["url_drive", "Enlace del archivo en Drive"],
  ["capturada", "Fecha y hora en que se tomó la foto"],
  ["registrada", "Fecha y hora en que llegó a Drive"]
];
const ENC_COLS = ENC_DEF.map(c => c[0]);
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
    if (buscar(sh, "id_encuesta", rec.id)) return { ok: true, id: rec.id, repetida: true };
    const vals = { id_encuesta: rec.id, registrado: new Date(), datos_json: JSON.stringify(rec) };
    fila.cols.forEach((c, i) => { if (c !== "id_encuesta") vals[c] = fila.vals[i]; });
    escribir(sh, ENC_COLS.concat(fila.cols.filter(c => ENC_COLS.indexOf(c) < 0)), vals);
    return { ok: true, id: rec.id };
  } finally { lock.releaseLock(); }
}

function listar() {
  const sh = tabla(HOJA_ENC), n = sh.getLastRow(), head = encabezado(sh), j = head.indexOf("datos_json");
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
    const prev = buscar(sh, "id_archivo", f.id);
    if (prev) return { ok: true, id: f.id, archivo: String(prev.id_drive), url: String(prev.url_drive), repetida: true };
    const ext = m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg";
    const nombre = f.codigo + "_obs" + f.obs + "_" + f.id.split("_").pop() + "." + ext;
    const bytes = Utilities.base64Decode(m[2]);
    const carpeta = subcarpeta(DriveApp.getFolderById(PROPS.getProperty("FOTOS")), f.estrato === "Interno" ? "Interno" : "Egresado");
    const file = carpeta.createFile(Utilities.newBlob(bytes, m[1], nombre));
    escribir(sh, MM_COLS, {
      id_archivo: f.id, id_encuesta: f.encuesta, codigo: f.codigo, estrato: f.estrato, fecha: f.fecha, observacion: f.obs,
      tipo: m[1], nombre_archivo: nombre, tamano_kb: Math.round(bytes.length / 102.4) / 10, id_drive: file.getId(), url_drive: file.getUrl(),
      capturada: f.ts || "", registrada: new Date()
    });
    return { ok: true, id: f.id, archivo: file.getId(), url: file.getUrl() };
  } finally { lock.releaseLock(); }
}

// solo entrega archivos registrados en la tabla «Multimedia»
function foto(req) {
  const id = String(req.archivo || "");
  if (!id || !buscar(tabla(HOJA_MM), "id_drive", id)) throw falla("Foto no encontrada", "datos");
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
