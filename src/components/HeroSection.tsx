import { useState } from 'react';
import { ArrowRight, Building2, CalendarCheck, Video } from 'lucide-react';
import type { ModalityId } from '../lib/clinicData';

interface HeroSectionProps {
  onSelectModality: (modality: ModalityId) => void;
}

export function HeroSection({ onSelectModality }: HeroSectionProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section
      id="inicio"
      className="relative bg-gradient-to-b from-[#06172D] via-[#0B2545] to-[#0E2F57] text-white overflow-hidden border-b border-white/10"
    >
      {/* Layered atmospheric depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-[640px] h-[640px] rounded-full bg-cyan-500/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 w-[480px] h-[360px] rounded-full bg-sky-400/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left column: Value proposition + dual interactive CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-cyan-300 tracking-wide mb-4">
              CAATH Montería · Cra 14 #37-7 · Clínica de Heridas Dr. Máximo Mercado V.
            </p>

            <h1
              className="font-display font-bold text-white tracking-tight leading-[1.08] max-w-2xl mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                textWrap: 'balance',
              }}
            >
              La mejor decisión siempre será consultar a tiempo.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl mb-8">
              Atención integral avanzada para el cuidado de heridas complejas, pie
              diabético y salud integral en Montería. Tecnología hiperbárica y
              cuidado humano especializado para tu recuperación.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 mb-8">
              <button
                type="button"
                onClick={() => onSelectModality('presencial')}
                className="inline-flex w-full min-w-0 sm:w-auto items-center justify-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06172D] font-semibold text-sm text-center leading-snug shadow-[0_12px_28px_-8px_rgba(34,211,238,0.45)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4 shrink-0" />
                <span className="text-center">Agendar Consulta Presencial o Domiciliaria</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectModality('videollamada')}
                className="inline-flex w-full min-w-0 sm:w-auto items-center justify-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-md hover:bg-white/[0.14] text-white font-medium text-sm text-center leading-snug shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:whitespace-nowrap"
              >
                <Video className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="text-center">Iniciar Asesoría Virtual por Video llamada</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
              <span>Convenios EPS y FOMAG</span>
              <span aria-hidden="true" className="text-cyan-400">·</span>
              <span>Cámara Hiperbárica</span>
              <span aria-hidden="true" className="text-cyan-400">·</span>
              <a
                href="#triage"
                className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 font-medium underline underline-offset-4"
              >
                <span>Evaluar mi tipo de herida en 2 pasos</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right column: Layered glassmorphic frame with exact CAATH clinic photo */}
          <div className="lg:col-span-5 flex items-center">
            <div className="relative w-full p-2.5 rounded-3xl bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-[0_28px_60px_-15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]">
              <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-[#06172D]">
                {!imageFailed ? (
                  <img
                    src="/assets/aistudio/Clinica_CAATH_4acafd40.jpg"
                    alt="Fachada de la Clínica de Heridas CAATH Dr. Máximo Mercado V. en Montería"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0B2545] to-[#13355F]">
                    <Building2 className="w-12 h-12 text-cyan-300 mb-3" />
                    <p className="font-display font-semibold text-white text-lg">
                      Sede Clínica CAATH Montería
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Layered Glassmorphic 4-column institutional strip */}
        <div className="mt-12 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-white/10">
          <div className="lg:pr-4">
            <p className="text-xs font-mono text-cyan-300 tracking-wide">01 / ESPECIALIDAD</p>
            <p className="mt-1 font-display font-semibold text-white">Manejo de Heridas Complejas</p>
            <p className="mt-1 text-sm text-slate-300">
              Pie diabético, úlceras vasculares, lesiones por presión y heridas quirúrgicas.
            </p>
          </div>
          <div className="lg:px-4">
            <p className="text-xs font-mono text-cyan-300 tracking-wide">02 / TECNOLOGÍA</p>
            <p className="mt-1 font-display font-semibold text-white">Cámara Hiperbárica Clínica</p>
            <p className="mt-1 text-sm text-slate-300">
              Oxigenoterapia para estimular la cicatrización y reducir inflamación.
            </p>
          </div>
          <div className="lg:px-4">
            <p className="text-xs font-mono text-cyan-300 tracking-wide">03 / COBERTURA EN CASA</p>
            <p className="mt-1 font-display font-semibold text-white">Atención Domiciliaria</p>
            <p className="mt-1 text-sm text-slate-300">
              Curaciones especializadas y hospitalización en casa en Montería.
            </p>
          </div>
          <div className="lg:pl-4">
            <p className="text-xs font-mono text-cyan-300 tracking-wide">04 / CONVENIOS</p>
            <p className="mt-1 font-display font-semibold text-white">EPS, FOMAG y Particular</p>
            <p className="mt-1 text-sm text-slate-300">
              Gestión ágil con autorización o acceso directo sin orden previa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
