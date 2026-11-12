export type WoundConditionId =
  | 'pie-diabetico'
  | 'ulcera-vascular'
  | 'lesion-presion'
  | 'herida-quirurgica'
  | 'quemadura'
  | 'ostomias-fistulas'
  | 'otro';

export type CoverageId = 'fomag' | 'eps' | 'particular';

export type ModalityId = 'presencial' | 'domicilio' | 'videollamada';

export type CrmStage =
  | 'Lead'
  | 'Calificado'
  | 'Cita Agendada'
  | 'Atendido'
  | 'Seguimiento domiciliario';

export const CRM_STAGES: CrmStage[] = [
  'Lead',
  'Calificado',
  'Cita Agendada',
  'Atendido',
  'Seguimiento domiciliario',
];

export const CLINIC_INFO = {
  name: 'CAATH',
  fullName: 'CAATH - Centro Avanzado en Atención y Tratamiento de Heridas',
  directorNote: 'Sede Clínica Dr. Máximo Mercado V.',
  tagline: 'Más que profesionales de la salud, somos personas comprometidas con tu recuperación.',
  address: 'Cra 14 #37-7, Montería - Córdoba, Colombia',
  phoneDisplay: '+57 324 440 0883',
  phoneRaw: '573244400883',
  hours: [
    { days: 'Lunes', morning: '8:00 a. m. – 12:00 p. m.', afternoon: '2:00 p. m. – 6:00 p. m.' },
    { days: 'Martes a Viernes', morning: '8:00 a. m. – 12:00 p. m.', afternoon: '2:00 p. m. – 5:30 p. m.' },
    { days: 'Sábados', morning: '8:00 a. m. – 12:00 p. m.', afternoon: 'Cerrado en la tarde' },
  ],
};

export interface WoundConditionOption {
  id: WoundConditionId;
  label: string;
  shortDesc: string;
}

export const WOUND_CONDITIONS: WoundConditionOption[] = [
  {
    id: 'pie-diabetico',
    label: 'Pie diabético',
    shortDesc: 'Úlceras neuropáticas, isquémicas o infección en extremidad inferior.',
  },
  {
    id: 'ulcera-vascular',
    label: 'Úlcera vascular / venosa',
    shortDesc: 'Lesiones crónicas por insuficiencia venosa o arterial.',
  },
  {
    id: 'lesion-presion',
    label: 'Lesión por presión',
    shortDesc: 'Escaras o úlceras por reposo prolongado en pacientes de cuidado.',
  },
  {
    id: 'herida-quirurgica',
    label: 'Herida quirúrgica / traumática',
    shortDesc: 'Dehiscencias, postoperatorios complejos o trauma tisular.',
  },
  {
    id: 'quemadura',
    label: 'Quemadura',
    shortDesc: 'Manejo especializado de quemaduras de segundo o tercer grado.',
  },
  {
    id: 'ostomias-fistulas',
    label: 'Ostomías / fístulas',
    shortDesc: 'Cuidado periestomal, adaptación de dispositivos y control de drenaje.',
  },
  {
    id: 'otro',
    label: 'Otro tipo de lesión',
    shortDesc: 'Valoración clínica integral para heridas de difícil cicatrización.',
  },
];

export interface CoverageOption {
  id: CoverageId;
  label: string;
  detail: string;
}

export const COVERAGE_OPTIONS: CoverageOption[] = [
  {
    id: 'fomag',
    label: 'FOMAG',
    detail: 'Convenio activo para docentes y beneficiarios del magisterio en Córdoba.',
  },
  {
    id: 'eps',
    label: 'EPS particulares',
    detail: 'Atención mediante autorización vigente de tu EPS con convenio.',
  },
  {
    id: 'particular',
    label: 'Particular / Privado',
    detail: 'Acceso directo sin orden previa, presencial en sede o a domicilio.',
  },
];

export interface ClinicService {
  id: string;
  index: string;
  title: string;
  summary: string;
  highlights: string[];
  recommendedModality: ModalityId;
  categoryLabel: string;
}

export const CLINIC_SERVICES: ClinicService[] = [
  {
    id: 'manejo-heridas',
    index: '01',
    title: 'Manejo de Heridas',
    categoryLabel: 'Clínica de Heridas Complejas',
    summary:
      'Protocolos clínicos basados en evidencia para lesiones agudas, crónicas y de difícil cicatrización con seguimiento continuo.',
    highlights: [
      'Pie diabético y salvamento de extremidad',
      'Úlceras vasculares, venosas y arteriales',
      'Lesiones por presión, heridas quirúrgicas y traumáticas',
    ],
    recommendedModality: 'presencial',
  },
  {
    id: 'tecnologia-avanzada',
    index: '02',
    title: 'Tecnología Avanzada',
    categoryLabel: 'Oxigenoterapia Hiperbárica',
    summary:
      'Cámara hiperbárica de grado clínico para incrementar la oxigenación tisular, modular la inflamación y acelerar la regeneración celular.',
    highlights: [
      'Sesiones supervisadas en cámara hiperbárica',
      'Estimulación de angiogénesis y cierre tisular',
      'Coadyuvante clave en pie diabético e infecciones complejas',
    ],
    recommendedModality: 'presencial',
  },
  {
    id: 'especialidades-apoyo',
    index: '03',
    title: 'Especialidades y Apoyo Médico',
    categoryLabel: 'Equipo Interdisciplinario',
    summary:
      'Abordaje médico integral para controlar la causa sistémica de la herida junto con procedimientos especializados de curación.',
    highlights: [
      'Medicina interna e infectología clínica',
      'Desbridamiento avanzado y apósitos bioactivos especiales',
      'Manejo integral de ostomías y fístulas',
    ],
    recommendedModality: 'presencial',
  },
  {
    id: 'atencion-en-casa',
    index: '04',
    title: 'Atención en Casa',
    categoryLabel: 'Cobertura en Montería',
    summary:
      'Llevamos el estándar clínico de CAATH hasta el hogar del paciente con movilidad reducida o requerimiento de cuidado continuo.',
    highlights: [
      'Curaciones especializadas a domicilio en Montería',
      'Programa de hospitalización en casa',
      'Educación personalizada para cuidadores y familia',
    ],
    recommendedModality: 'domicilio',
  },
  {
    id: 'otros-servicios',
    index: '05',
    title: 'Otros Servicios de Salud',
    categoryLabel: 'Prevención & Convenios',
    summary:
      'Servicios preventivos y diagnóstico ambulatorio respaldados por convenios institucionales con EPS y FOMAG.',
    highlights: [
      'Vacunación (esquemas generales, influenza y dengue)',
      'Aplicación y lectura de pruebas PPD (tuberculina)',
      'Gestión ágil para usuarios FOMAG, EPS y particulares',
    ],
    recommendedModality: 'presencial',
  },
];

export interface ModalityOption {
  id: ModalityId;
  title: string;
  subtitle: string;
  duration: string;
}

export const MODALITIES: ModalityOption[] = [
  {
    id: 'presencial',
    title: 'Consulta Presencial',
    subtitle: 'Sede Montería · Cra 14 #37-7',
    duration: '40 min',
  },
  {
    id: 'domicilio',
    title: 'Visita Domiciliaria',
    subtitle: 'Cobertura urbana en Montería',
    duration: '45 min',
  },
  {
    id: 'videollamada',
    title: 'Videollamada / Consulta Online',
    subtitle: 'Orientación médica inmediata',
    duration: '25 min',
  },
];

export interface CrmPatientCase {
  id: string;
  patientName: string;
  condition: string;
  coverage: string;
  modality: ModalityId;
  stage: CrmStage;
  scheduledLabel: string;
  assignedUnit: string;
}

export const INITIAL_CRM_CASES: CrmPatientCase[] = [
  {
    id: 'CAATH-4081',
    patientName: 'Carlos Méndez R.',
    condition: 'Pie diabético Wagner II',
    coverage: 'FOMAG',
    modality: 'presencial',
    stage: 'Cita Agendada',
    scheduledLabel: 'Hoy · 10:00 a. m.',
    assignedUnit: 'Clínica de Heridas + Hiperbárica',
  },
  {
    id: 'CAATH-4082',
    patientName: 'Lucía Vergara P.',
    condition: 'Úlcera venosa crónica',
    coverage: 'EPS',
    modality: 'domicilio',
    stage: 'Seguimiento domiciliario',
    scheduledLabel: 'Mañana · 9:00 a. m.',
    assignedUnit: 'Equipo Atención en Casa',
  },
  {
    id: 'CAATH-4083',
    patientName: 'Hernán Salgado T.',
    condition: 'Dehiscencia postquirúrgica',
    coverage: 'Particular',
    modality: 'presencial',
    stage: 'Atendido',
    scheduledLabel: 'Ayer · 3:30 p. m.',
    assignedUnit: 'Desbridamiento & Apósitos',
  },
  {
    id: 'CAATH-4084',
    patientName: 'María José Lora D.',
    condition: 'Manejo de ostomía',
    coverage: 'FOMAG',
    modality: 'videollamada',
    stage: 'Calificado',
    scheduledLabel: 'Por confirmar horario',
    assignedUnit: 'Enfermería Enterostomal',
  },
  {
    id: 'CAATH-4085',
    patientName: 'Jorge Luis Cabrales',
    condition: 'Lesión por presión sacra',
    coverage: 'EPS',
    modality: 'domicilio',
    stage: 'Lead',
    scheduledLabel: 'Ingreso web',
    assignedUnit: 'Triage Inicial Montería',
  },
];

export interface FaqQuickTopic {
  id: string;
  label: string;
  question: string;
}

export const CHATBOT_QUICK_TOPICS: FaqQuickTopic[] = [
  { id: 'horarios', label: 'Horarios y dirección', question: '¿Cuáles son los horarios y la dirección en Montería?' },
  { id: 'convenios', label: 'Convenios EPS / FOMAG', question: '¿Qué requisitos piden para convenios EPS o FOMAG?' },
  { id: 'heridas', label: 'Tipos de heridas', question: '¿Qué tipos de heridas y tratamientos atienden?' },
  { id: 'domicilio', label: 'Atención a domicilio', question: '¿Cómo funciona la atención en casa y sus costos?' },
];
