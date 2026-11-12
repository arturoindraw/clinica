import { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Check,
  Cpu,
  Home,
  ShieldCheck,
  Stethoscope,
  Syringe,
  UserCheck,
} from 'lucide-react';
import teamImage from '../assets/images/caath_medical_care_1794518704230.jpg';
import hyperbaricImage from '../assets/images/caath_hyperbaric_tech_1794518705213.jpg';
import { CLINIC_SERVICES, type ModalityId } from '../lib/clinicData';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string, modality: ModalityId) => void;
}

const SERVICE_ICONS: Record<string, typeof Activity> = {
  'manejo-heridas': Activity,
  'tecnologia-avanzada': Cpu,
  'especialidades-apoyo': Stethoscope,
  'atencion-en-casa': Home,
  'otros-servicios': Syringe,
};

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [teamImgFailed, setTeamImgFailed] = useState(false);
  const [hyperbaricImgFailed, setHyperbaricImgFailed] = useState(false);

  return (
    <>
      {/* Services Grid with Tactile Layered Cards */}
      <section
        id="servicios"
        className="relative py-16 sm:py-20 bg-gradient-to-b from-slate-100/80 to-white border-b border-slate-200 overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                Portafolio Clínico Especializado
              </p>
              <h2
                className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Servicios principales del CAATH en Montería
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-md">
              Desde curación avanzada y cámara hiperbárica hasta hospitalización en casa y
              programas de vacunación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLINIC_SERVICES.map((service, idx) => {
              const Icon = SERVICE_ICONS[service.id] ?? Activity;
              const isFeatured = idx === 0;
              return (
                <article
                  key={service.id}
                  className={`group flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 ${
                    isFeatured
                      ? 'lg:col-span-2 bg-gradient-to-br from-[#0B2545] via-[#0F2F56] to-[#133A68] text-white border border-white/15 shadow-[0_22px_48px_-16px_rgba(11,37,69,0.45),inset_0_1px_0_rgba(255,255,255,0.16)]'
                      : 'bg-white text-slate-900 border border-slate-200/85 shadow-[0_14px_34px_-14px_rgba(11,37,69,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-cyan-500/70 hover:shadow-[0_22px_44px_-16px_rgba(11,37,69,0.18)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`text-xs font-mono tracking-wide ${
                          isFeatured ? 'text-cyan-300' : 'text-cyan-700 font-medium'
                        }`}
                      >
                        {service.index}. {service.categoryLabel}
                      </span>

                      {/* Subtle neumorphic icon well */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          isFeatured
                            ? 'bg-white/10 backdrop-blur-sm border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                            : 'bg-slate-50 border border-slate-200/70 shadow-[inset_2px_2px_5px_rgba(15,23,42,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.95)]'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isFeatured ? 'text-cyan-300' : 'text-[#0B2545]'
                          }`}
                        />
                      </div>
                    </div>

                    <h3
                      className={`mt-4 font-display text-xl sm:text-2xl font-bold ${
                        isFeatured ? 'text-white' : 'text-[#0B2545]'
                      }`}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
                        isFeatured ? 'text-slate-200 max-w-2xl' : 'text-slate-600'
                      }`}
                    >
                      {service.summary}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {service.highlights.map((item) => (
                        <li
                          key={item}
                          className={`flex items-start gap-2.5 text-sm ${
                            isFeatured ? 'text-slate-100' : 'text-slate-700'
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isFeatured ? 'text-cyan-300' : 'text-cyan-700'
                            }`}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`mt-6 pt-5 border-t flex items-center justify-between gap-4 ${
                      isFeatured ? 'border-white/15' : 'border-slate-100'
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        isFeatured ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {service.recommendedModality === 'domicilio'
                        ? 'Disponible en casa en Montería'
                        : 'Disponible en sede Montería'}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectService(service.title, service.recommendedModality)
                      }
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        isFeatured
                          ? 'bg-cyan-400 text-[#06172D] hover:bg-cyan-300'
                          : 'bg-slate-100 hover:bg-[#0B2545] text-[#0B2545] hover:text-white'
                      }`}
                    >
                      <span>Agendar servicio</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology & Human Commitment + Convenios (Clean text-free images) */}
      <section id="tecnologia" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Layered Clean Dual Imagery (Zero text overlays) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-2 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(11,37,69,0.12)]">
                <div className="group aspect-[4/3] rounded-[18px] overflow-hidden bg-[#0B2545]">
                  {!teamImgFailed ? (
                    <img
                      src={teamImage}
                      alt="Equipo médico CAATH brindando atención humana y especializada al paciente"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => setTeamImgFailed(true)}
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                      <UserCheck className="w-12 h-12 text-cyan-300 mb-3" />
                      <p className="font-display font-semibold text-lg">Equipo Humano CAATH</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2 rounded-3xl bg-white border border-slate-200/90 shadow-[0_18px_40px_-15px_rgba(11,37,69,0.1)]">
                <div className="group aspect-[4/3] rounded-[18px] overflow-hidden bg-[#06172D]">
                  {!hyperbaricImgFailed ? (
                    <img
                      src={hyperbaricImage}
                      alt="Cámara hiperbárica clínica de última generación en CAATH Montería"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => setHyperbaricImgFailed(true)}
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                      <Cpu className="w-12 h-12 text-cyan-300 mb-3" />
                      <p className="font-display font-semibold text-lg">Cámara Hiperbárica</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hyperbaric Technology & Medical Specialties Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                Compromiso Humano & Tecnología Médica
              </p>
              <h2
                className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Cámara Hiperbárica y enfoque multidisciplinario para acelerar tu recuperación
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Más que profesionales de la salud, somos personas comprometidas con tu
                recuperación. En CAATH combinamos oxigenoterapia hiperbárica con desbridamiento
                avanzado, apósitos bioactivos especiales y valoración por Medicina Interna e
                Infectología.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_10px_25px_-12px_rgba(11,37,69,0.1)]">
                  <p className="font-mono text-2xl font-bold text-[#0B2545] tabular-nums">
                    100% O2
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Oxigenoterapia Hiperbárica
                  </p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Aumenta el oxígeno disuelto en plasma para nutrir tejidos comprometidos.
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_10px_25px_-12px_rgba(11,37,69,0.1)]">
                  <p className="font-mono text-2xl font-bold text-[#0B2545] tabular-nums">
                    4 Frentes
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Apoyo Especializado
                  </p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Medicina interna, infectología, enfermería enterostomal y curación avanzada.
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_10px_25px_-12px_rgba(11,37,69,0.1)]">
                  <p className="font-mono text-2xl font-bold text-[#0B2545] tabular-nums">
                    Montería
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Sede y Domicilios
                  </p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Continuidad clínica en Cra 14 #37-7 o en la comodidad de tu hogar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Convenios EPS / FOMAG */}
          <div
            id="convenios"
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(11,37,69,0.09)]"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
              <div className="max-w-2xl">
                <p className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                  Cobertura y Convenios Institucionales
                </p>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B2545]">
                  Atención por Convenios EPS, FOMAG y Particular
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  Facilitamos el acceso oportuno a curación de heridas, cámara hiperbárica y
                  atención en casa sin trabas administrativas innecesarias.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onSelectService('Valoración por Convenio EPS / FOMAG', 'presencial')
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B2545] hover:bg-[#13355F] text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>Validar mi cita por convenio</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-slate-50/70 border border-slate-200/70 p-5">
                <h4 className="font-display font-bold text-lg text-[#0B2545]">
                  Convenio FOMAG
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Atención integral para docentes activos, pensionados y beneficiarios del
                  magisterio en Córdoba.
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Requisitos: Cédula, orden o remisión vigente e historia clínica reciente.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/70 border border-slate-200/70 p-5">
                <h4 className="font-display font-bold text-lg text-[#0B2545]">
                  Convenios con EPS
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Articulación directa para pacientes remitidos a clínica de heridas, cámara
                  hiperbárica o atención domiciliaria.
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Requisitos: Autorización de servicios vigente a nombre de CAATH y documento.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50/70 border border-slate-200/70 p-5">
                <h4 className="font-display font-bold text-lg text-[#0B2545]">
                  Particular / Privado
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Agenda inmediata sin esperas ni orden médica previa, tanto en sede Montería como
                  a domicilio o videollamada.
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Requisitos: Documento de identidad y disponibilidad para valoración inicial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
