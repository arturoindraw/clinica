import {
  CLINIC_INFO,
  CRM_STAGES,
  type CoverageId,
  type CrmPatientCase,
  type CrmStage,
  type ModalityId,
  type WoundConditionId,
} from './clinicData';

export interface TriageRecommendation {
  serviceTitle: string;
  serviceId: string;
  specialistTeam: string;
  protocolSummary: string;
  coverageGuidance: string;
  suggestedModality: ModalityId;
  urgencyLabel: string;
}

export function getTriageRecommendation(
  conditionId: WoundConditionId,
  coverageId: CoverageId
): TriageRecommendation {
  const coverageGuidanceMap: Record<CoverageId, string> = {
    fomag:
      'Convenio FOMAG activo: ten a la mano tu documento de identidad, orden médica o historia clínica reciente para gestionar tu ingreso prioritario.',
    eps:
      'Convenio EPS: presenta tu autorización vigente dirigida a CAATH junto con documento de identidad y resumen de historia clínica.',
    particular:
      'Modalidad Particular / Privado: no requieres orden previa. Puedes iniciar valoración directa en sede, en casa o por videollamada.',
  };

  switch (conditionId) {
    case 'pie-diabetico':
      return {
        serviceTitle: 'Clínica de Pie Diabético & Oxigenoterapia Hiperbárica',
        serviceId: 'manejo-heridas',
        specialistTeam: 'Medicina Interna + Infectología + Clínica de Heridas',
        protocolSummary:
          'Evaluación vascular y neuropática inmediata, descarga plantar, desbridamiento selectivo y valoración para sesiones en cámara hiperbárica.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'presencial',
        urgencyLabel: 'Valoración prioritaria recomendada',
      };
    case 'ulcera-vascular':
      return {
        serviceTitle: 'Unidad de Úlceras Vasculares y Terapia Compresiva',
        serviceId: 'manejo-heridas',
        specialistTeam: 'Enfermería Especializada + Medicina Interna',
        protocolSummary:
          'Control de exudado con apósitos bioactivos avanzados, manejo compresivo médico y apoyo hiperbárico según perfusión tisular.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'presencial',
        urgencyLabel: 'Valoración especializada',
      };
    case 'lesion-presion':
      return {
        serviceTitle: 'Atención en Casa y Manejo de Lesiones por Presión',
        serviceId: 'atencion-en-casa',
        specialistTeam: 'Equipo Domiciliario CAATH + Clínica de Heridas',
        protocolSummary:
          'Curación avanzada en el hogar para evitar traslados riesgosos, manejo de superficies de alivio de presión y guía práctica para cuidadores.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'domicilio',
        urgencyLabel: 'Ideal para atención domiciliaria',
      };
    case 'herida-quirurgica':
      return {
        serviceTitle: 'Manejo Postquirúrgico y Desbridamiento Avanzado',
        serviceId: 'especialidades-apoyo',
        specialistTeam: 'Infectología + Clínica de Heridas',
        protocolSummary:
          'Control temprano de carga bacteriana, desbridamiento seguro y cierre asistido con apósitos de última generación.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'presencial',
        urgencyLabel: 'Valoración prioritaria recomendada',
      };
    case 'quemadura':
      return {
        serviceTitle: 'Cuidado Avanzado de Quemaduras y Regeneración Tisular',
        serviceId: 'tecnologia-avanzada',
        specialistTeam: 'Clínica de Heridas + Oxigenoterapia Hiperbárica',
        protocolSummary:
          'Apósitos antimicrobianos atraumáticos para reducir dolor, prevenir cicatrización patológica y acelerar la epitelización.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'presencial',
        urgencyLabel: 'Atención especializada oportuna',
      };
    case 'ostomias-fistulas':
      return {
        serviceTitle: 'Clínica de Ostomías, Fístulas y Cuidado Periestomal',
        serviceId: 'especialidades-apoyo',
        specialistTeam: 'Enfermería Enterostomal + Medicina Interna',
        protocolSummary:
          'Selección de barreras protectoras, control de efluentes, protección de piel periestomal y entrenamiento integral al paciente.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'videollamada',
        urgencyLabel: 'Orientación inicial disponible hoy',
      };
    case 'otro':
    default:
      return {
        serviceTitle: 'Valoración Clínica Integral CAATH',
        serviceId: 'manejo-heridas',
        specialistTeam: 'Equipo Multidisciplinario CAATH Montería',
        protocolSummary:
          'Diagnóstico etiológico de la lesión para definir el plan entre curación avanzada, cámara hiperbárica o atención domiciliaria.',
        coverageGuidance: coverageGuidanceMap[coverageId],
        suggestedModality: 'presencial',
        urgencyLabel: 'Consulta de valoración',
      };
  }
}

export function getAvailableSlots(dateIso: string, modality: ModalityId): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
    return [];
  }
  const [year, month, day] = dateIso.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  if (dayOfWeek === 0) {
    return [];
  }

  const morningPresencial = ['08:00 a. m.', '09:00 a. m.', '10:00 a. m.', '11:00 a. m.'];
  const morningDomicilio = ['08:30 a. m.', '10:30 a. m.'];
  const morningVideo = ['08:30 a. m.', '09:30 a. m.', '10:30 a. m.', '11:30 a. m.'];

  const morning =
    modality === 'domicilio'
      ? morningDomicilio
      : modality === 'videollamada'
      ? morningVideo
      : morningPresencial;

  if (dayOfWeek === 6) {
    // Saturday: 8:00 a.m. - 12:00 p.m. only
    return morning;
  }

  if (dayOfWeek === 1) {
    // Monday afternoon: 2:00 p.m. - 6:00 p.m.
    const mondayAfternoon =
      modality === 'domicilio'
        ? ['02:30 p. m.', '04:30 p. m.']
        : ['02:00 p. m.', '03:00 p. m.', '04:00 p. m.', '05:15 p. m.'];
    return [...morning, ...mondayAfternoon];
  }

  // Tuesday to Friday afternoon: 2:00 p.m. - 5:30 p.m.
  const tueFriAfternoon =
    modality === 'domicilio'
      ? ['02:30 p. m.', '04:00 p. m.']
      : ['02:00 p. m.', '03:00 p. m.', '04:00 p. m.', '04:45 p. m.'];

  return [...morning, ...tueFriAfternoon];
}

export interface BookingInput {
  patientName: string;
  phone: string;
  date: string;
  timeSlot: string;
  modality: ModalityId;
  coverage: CoverageId;
  notes?: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingInput, string>>;
}

export function validateBookingInput(input: BookingInput): BookingValidationResult {
  const errors: Partial<Record<keyof BookingInput, string>> = {};

  if (!input.patientName || input.patientName.trim().length < 3) {
    errors.patientName = 'Ingresa el nombre completo del paciente (mínimo 3 caracteres).';
  }

  const cleanDigits = (input.phone || '').replace(/\D/g, '');
  if (cleanDigits.length < 7 || cleanDigits.length > 13) {
    errors.phone = 'Ingresa un número de celular o WhatsApp válido en Colombia.';
  }

  if (!input.date) {
    errors.date = 'Selecciona una fecha disponible.';
  } else if (getAvailableSlots(input.date, input.modality).length === 0) {
    errors.date = 'Los domingos nuestra sede permanece cerrada. Elige de lunes a sábado.';
  }

  if (!input.timeSlot) {
    errors.timeSlot = 'Selecciona una hora disponible en la agenda.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export const CRM_ACCESS_KEY = 'CAATH2026';

export function verifyCrmAccessKey(rawKey: string): boolean {
  return rawKey.trim().toUpperCase() === CRM_ACCESS_KEY;
}

export function getNextCrmStage(stage: CrmStage): CrmStage {
  const idx = CRM_STAGES.indexOf(stage);
  if (idx === -1 || idx === CRM_STAGES.length - 1) {
    return stage;
  }
  return CRM_STAGES[idx + 1];
}

export function advanceCrmStage(
  cases: CrmPatientCase[],
  caseId: string
): CrmPatientCase[] {
  return cases.map((item) =>
    item.id === caseId ? { ...item, stage: getNextCrmStage(item.stage) } : item
  );
}

export function getFunnelMetrics(cases: CrmPatientCase[]): Record<CrmStage, number> {
  const counts: Record<CrmStage, number> = {
    Lead: 0,
    Calificado: 0,
    'Cita Agendada': 0,
    Atendido: 0,
    'Seguimiento domiciliario': 0,
  };

  for (const item of cases) {
    counts[item.stage] = (counts[item.stage] ?? 0) + 1;
  }

  return counts;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${CLINIC_INFO.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export function matchClinicFaq(rawQuery: string): string {
  const q = rawQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (q.includes('horario') || q.includes('hora') || q.includes('abierto') || q.includes('sabado')) {
    return `Nuestros horarios en Montería (${CLINIC_INFO.address}) son: Lunes de 8:00 a. m. a 12:00 p. m. y de 2:00 p. m. a 6:00 p. m.; Martes a Viernes de 8:00 a. m. a 12:00 p. m. y de 2:00 p. m. a 5:30 p. m.; Sábados de 8:00 a. m. a 12:00 p. m.`;
  }

  if (q.includes('ubicacion') || q.includes('direccion') || q.includes('donde') || q.includes('monteria')) {
    return `Estamos ubicados en ${CLINIC_INFO.address}. Puedes agendar consulta presencial, visita domiciliaria o escribirnos directamente al WhatsApp ${CLINIC_INFO.phoneDisplay}.`;
  }

  if (q.includes('fomag') || q.includes('eps') || q.includes('convenio') || q.includes('requisito') || q.includes('autorizacion')) {
    return `Contamos con convenios vigentes con EPS y FOMAG. Para agendar bajo convenio necesitas: documento de identidad, orden o autorización médica vigente y resumen de historia clínica. Si prefieres atención particular, puedes ingresar sin orden previa.`;
  }

  if (q.includes('domicilio') || q.includes('casa') || q.includes('costo') || q.includes('precio') || q.includes('valor')) {
    return `Ofrecemos atención domiciliaria y hospitalización en casa en toda la ciudad de Montería. La tarifa particular depende del tipo de herida, insumos especiales requeridos y zona; para pacientes con convenio EPS o FOMAG puede aplicar cobertura según autorización. Contáctanos al ${CLINIC_INFO.phoneDisplay} para cotizar o verificar tu orden.`;
  }

  if (q.includes('hiperbarica') || q.includes('camara') || q.includes('tecnologia') || q.includes('oxigeno')) {
    return `Contamos con Cámara Hiperbárica para oxigenoterapia clínica, ideal para acelerar la cicatrización, reducir inflamación y apoyar el tratamiento de pie diabético, úlceras crónicas y lesiones complejas.`;
  }

  if (q.includes('vacuna') || q.includes('dengue') || q.includes('influenza') || q.includes('ppd')) {
    return `Además de clínica de heridas, ofrecemos vacunación (esquemas generales, influenza y dengue) y pruebas PPD en nuestra sede de Montería.`;
  }

  if (
    q.includes('herida') ||
    q.includes('pie') ||
    q.includes('ulcera') ||
    q.includes('quemadura') ||
    q.includes('ostomia') ||
    q.includes('tratamiento')
  ) {
    return `Tratamos pie diabético, úlceras vasculares y venosas, lesiones por presión, heridas quirúrgicas o traumáticas, quemaduras, ostomías y fístulas con apoyo de Medicina Interna, Infectología, desbridamiento avanzado y cámara hiperbárica.`;
  }

  if (q.includes('video') || q.includes('virtual') || q.includes('online')) {
    return `Puedes iniciar una asesoría virtual por videollamada desde nuestro módulo de agendamiento para recibir orientación clínica temprana antes de tu consulta presencial o domiciliaria.`;
  }

  return `Soy tu enfermera asesora virtual de CAATH Montería. Puedo orientarte sobre horarios, dirección (Cra 14 #37-7), tipos de heridas, cámara hiperbárica, convenios EPS/FOMAG y atención en casa. También puedes comunicarte al WhatsApp ${CLINIC_INFO.phoneDisplay}.`;
}
