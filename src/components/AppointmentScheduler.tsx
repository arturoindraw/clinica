import { useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  MessageCircle,
  Video,
} from 'lucide-react';
import {
  COVERAGE_OPTIONS,
  MODALITIES,
  WOUND_CONDITIONS,
  type CoverageId,
  type ModalityId,
  type WoundConditionId,
} from '../lib/clinicData';
import {
  buildWhatsAppUrl,
  getAvailableSlots,
  validateBookingInput,
} from '../lib/clinicLogic';

export interface ConfirmedBooking {
  code: string;
  patientName: string;
  phone: string;
  date: string;
  timeSlot: string;
  modality: ModalityId;
  coverage: CoverageId;
  conditionLabel: string;
  serviceLabel: string;
}

interface AppointmentSchedulerProps {
  selectedModality: ModalityId;
  onModalityChange: (modality: ModalityId) => void;
  prefilledCondition: WoundConditionId;
  prefilledCoverage: CoverageId;
  prefilledServiceLabel: string;
  onConfirmBooking: (booking: ConfirmedBooking) => void;
}

interface CalendarDay {
  iso: string;
  dayShort: string;
  dayNum: string;
  monthShort: string;
  isSunday: boolean;
  isSaturday: boolean;
}

function buildUpcomingDays(count: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const base = new Date();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];

  for (let i = 0; i < count; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dow = d.getDay();
    days.push({
      iso: `${yyyy}-${mm}-${dd}`,
      dayShort: dayNames[dow],
      dayNum: dd,
      monthShort: monthNames[d.getMonth()],
      isSunday: dow === 0,
      isSaturday: dow === 6,
    });
  }
  return days;
}

const MODALITY_ICONS: Record<ModalityId, typeof Building2> = {
  presencial: Building2,
  domicilio: Home,
  videollamada: Video,
};

export function AppointmentScheduler({
  selectedModality,
  onModalityChange,
  prefilledCondition,
  prefilledCoverage,
  prefilledServiceLabel,
  onConfirmBooking,
}: AppointmentSchedulerProps) {
  const calendarDays = useMemo(() => buildUpcomingDays(12), []);
  const firstOpenDay = useMemo(
    () => calendarDays.find((d) => !d.isSunday)?.iso ?? calendarDays[0].iso,
    [calendarDays]
  );

  const [selectedDate, setSelectedDate] = useState<string>(firstOpenDay);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [coverage, setCoverage] = useState<CoverageId>(prefilledCoverage);
  const [conditionId, setConditionId] = useState<WoundConditionId>(prefilledCondition);
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  // Sync external prefill updates when user clicks Triage or Hero/Services CTAs
  const [lastPrefillKey, setLastPrefillKey] = useState<string>('');
  const currentPrefillKey = `${prefilledCondition}|${prefilledCoverage}|${prefilledServiceLabel}`;
  if (currentPrefillKey !== lastPrefillKey) {
    setLastPrefillKey(currentPrefillKey);
    setCoverage(prefilledCoverage);
    setConditionId(prefilledCondition);
    setConfirmed(null);
  }

  const availableSlots = useMemo(
    () => getAvailableSlots(selectedDate, selectedModality),
    [selectedDate, selectedModality]
  );

  const activeSlot = availableSlots.includes(selectedSlot)
    ? selectedSlot
    : availableSlots[0] ?? '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateBookingInput({
      patientName,
      phone,
      date: selectedDate,
      timeSlot: activeSlot,
      modality: selectedModality,
      coverage,
      notes,
    });

    if (!validation.valid) {
      setErrors(validation.errors as Record<string, string>);
      return;
    }

    setErrors({});
    const condLabel =
      WOUND_CONDITIONS.find((c) => c.id === conditionId)?.label ?? 'Valoración general';
    const booking: ConfirmedBooking = {
      code: `CAATH-${Math.floor(4100 + Math.random() * 5800)}`,
      patientName: patientName.trim(),
      phone: phone.trim(),
      date: selectedDate,
      timeSlot: activeSlot,
      modality: selectedModality,
      coverage,
      conditionLabel: condLabel,
      serviceLabel: prefilledServiceLabel || condLabel,
    };

    setConfirmed(booking);
    onConfirmBooking(booking);
    setPatientName('');
    setPhone('');
    setNotes('');
  }

  const modalityTitle =
    MODALITIES.find((m) => m.id === selectedModality)?.title ?? 'Consulta Presencial';
  const coverageLabel =
    COVERAGE_OPTIONS.find((c) => c.id === coverage)?.label ?? 'Particular';

  return (
    <section id="agendar" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
            Agendamiento Multicanal
          </p>
          <h2
            className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Reserva tu cita en sede, domicilio o videollamada
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Consulta horarios reales de nuestra clínica en Montería y registra tu solicitud
            directamente en nuestro sistema de seguimiento clínico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: Modality & Calendar with tactile layered surface */}
          <div className="lg:col-span-7 bg-slate-100/80 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] space-y-8">
            <div>
              <h3 className="font-display text-base font-semibold text-[#0B2545] mb-3">
                1. Modalidad de atención
              </h3>
              <div
                role="tablist"
                aria-label="Modalidad de cita"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {MODALITIES.map((mod) => {
                  const Icon = MODALITY_ICONS[mod.id];
                  const active = selectedModality === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onModalityChange(mod.id)}
                      className={`text-left p-4 rounded-2xl border transition-[background-color,border-color,box-shadow,transform] duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                        active
                          ? 'bg-gradient-to-br from-[#0B2545] to-[#13355F] text-white border-[#0B2545] shadow-[0_14px_28px_-10px_rgba(11,37,69,0.45)]'
                          : 'bg-white text-slate-800 border-slate-200/90 shadow-[0_6px_16px_-6px_rgba(11,37,69,0.08)] hover:border-cyan-500 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Icon
                          className={`w-5 h-5 ${active ? 'text-cyan-300' : 'text-cyan-700'}`}
                        />
                        <span
                          className={`text-xs font-mono tabular-nums ${
                            active ? 'text-cyan-200' : 'text-slate-500'
                          }`}
                        >
                          {mod.duration}
                        </span>
                      </div>
                      <p className="mt-3 font-display font-semibold text-sm">{mod.title}</p>
                      <p
                        className={`mt-1 text-xs ${
                          active ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {mod.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Calendar */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="font-display text-base font-semibold text-[#0B2545] inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-700" />
                  <span>2. Selecciona fecha disponible</span>
                </h3>
                <span className="text-xs text-slate-500">Domingos cerrado</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {calendarDays.map((day) => {
                  const isSelected = selectedDate === day.iso;
                  return (
                    <button
                      key={day.iso}
                      type="button"
                      disabled={day.isSunday}
                      aria-pressed={isSelected}
                      aria-label={`${day.dayShort} ${day.dayNum} de ${day.monthShort}${
                        day.isSunday ? ' Cerrado' : ''
                      }`}
                      onClick={() => {
                        setSelectedDate(day.iso);
                        setSelectedSlot('');
                      }}
                      className={`p-3 rounded-2xl border text-center transition-[background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                        day.isSunday
                          ? 'bg-slate-200/60 border-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                          : isSelected
                          ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-[0_10px_22px_-8px_rgba(11,37,69,0.45)] cursor-pointer'
                          : 'bg-white border-slate-200/90 text-slate-800 shadow-[0_4px_12px_-6px_rgba(11,37,69,0.08)] hover:border-cyan-500 cursor-pointer'
                      }`}
                    >
                      <span className="block text-[11px] font-medium uppercase">
                        {day.dayShort}
                      </span>
                      <span className="mt-1 block font-mono text-lg font-bold tabular-nums">
                        {day.dayNum}
                      </span>
                      <span className="block text-[11px] opacity-80">
                        {day.isSunday ? 'Cerrado' : day.monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="font-display text-base font-semibold text-[#0B2545] inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-700" />
                  <span>3. Horarios disponibles</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {availableSlots.length} cupos
                </span>
              </div>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map((slot) => {
                    const active = activeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl border font-mono text-xs sm:text-sm tabular-nums transition-[background-color,border-color,box-shadow] duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                          active
                            ? 'bg-cyan-600 border-cyan-600 text-white font-semibold shadow-[0_10px_20px_-8px_rgba(8,145,178,0.5)]'
                            : 'bg-white border-slate-200/90 text-slate-700 shadow-[0_4px_10px_-6px_rgba(11,37,69,0.08)] hover:border-cyan-500'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-xl p-4">
                  No hay atención los domingos. Selecciona un día entre lunes y sábado.
                </p>
              )}
            </div>
          </div>

          {/* Right column: Elevated Clinical Booking Sheet */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_24px_55px_-16px_rgba(11,37,69,0.14),inset_0_1px_0_rgba(255,255,255,0.95)]">
            {confirmed ? (
              <div data-testid="booking-confirmation" className="space-y-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-emerald-700 font-semibold">
                      SOLICITUD REGISTRADA · {confirmed.code}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#0B2545]">
                      Cita agendada con éxito
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Tu caso ya ingresó al panel clínico de seguimiento CAATH en etapa{' '}
                  <strong className="text-[#0B2545]">Cita Agendada</strong>. Nuestro equipo en
                  Montería confirmará los detalles por WhatsApp.
                </p>

                <dl className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Paciente</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {confirmed.patientName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Modalidad</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {MODALITIES.find((m) => m.id === confirmed.modality)?.title}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Fecha y hora</dt>
                    <dd className="font-mono font-medium text-[#0B2545] tabular-nums text-right">
                      {confirmed.date} · {confirmed.timeSlot}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Convenio</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {COVERAGE_OPTIONS.find((c) => c.id === confirmed.coverage)?.label}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Condición</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {confirmed.conditionLabel}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      `Hola CAATH Montería, acabo de agendar la cita ${confirmed.code} para ${confirmed.patientName} (${confirmed.conditionLabel}) el ${confirmed.date} a las ${confirmed.timeSlot} en modalidad ${
                        MODALITIES.find((m) => m.id === confirmed.modality)?.title
                      }.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar por WhatsApp (+57 324 440 0883)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setConfirmed(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    Agendar otra cita
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="pb-3 border-b border-slate-200">
                  <p className="text-xs font-mono text-cyan-700 font-semibold">
                    RESUMEN DE RESERVA
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0B2545]">
                    {modalityTitle} · {selectedDate} · {activeSlot || 'Selecciona hora'}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-sm font-medium text-slate-800 mb-1.5"
                  >
                    Nombre completo del paciente
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ej. María Fernanda Ortiz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  />
                  {errors.patientName && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-sm font-medium text-slate-800 mb-1.5"
                  >
                    Celular o WhatsApp de contacto
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 324 440 0883"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="booking-condition"
                      className="block text-sm font-medium text-slate-800 mb-1.5"
                    >
                      Tipo de herida o servicio
                    </label>
                    <select
                      id="booking-condition"
                      value={conditionId}
                      onChange={(e) => setConditionId(e.target.value as WoundConditionId)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                      {WOUND_CONDITIONS.map((cond) => (
                        <option key={cond.id} value={cond.id}>
                          {cond.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-coverage"
                      className="block text-sm font-medium text-slate-800 mb-1.5"
                    >
                      Cobertura / Convenio
                    </label>
                    <select
                      id="booking-coverage"
                      value={coverage}
                      onChange={(e) => setCoverage(e.target.value as CoverageId)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                      {COVERAGE_OPTIONS.map((cov) => (
                        <option key={cov.id} value={cov.id}>
                          {cov.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-sm font-medium text-slate-800 mb-1.5"
                  >
                    Dirección o notas clínicas (opcional)
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      selectedModality === 'domicilio'
                        ? 'Indica barrio y dirección en Montería para la visita domiciliaria...'
                        : 'Cuéntanos brevemente desde cuándo presentas la lesión...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                {(errors.date || errors.timeSlot) && (
                  <p role="alert" className="text-xs text-red-600">
                    {errors.date || errors.timeSlot}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#06172D] font-bold text-sm sm:text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2545]"
                >
                  Confirmar cita ({coverageLabel})
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
