import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  Flame,
  Footprints,
  HeartPulse,
  Scissors,
  ShieldPlus,
  Stethoscope,
} from 'lucide-react';
import {
  COVERAGE_OPTIONS,
  WOUND_CONDITIONS,
  type CoverageId,
  type ModalityId,
  type WoundConditionId,
} from '../lib/clinicData';
import { getTriageRecommendation } from '../lib/clinicLogic';

interface TriageWidgetProps {
  onApplyRecommendation: (params: {
    condition: WoundConditionId;
    coverage: CoverageId;
    modality: ModalityId;
    serviceTitle: string;
  }) => void;
}

const CONDITION_ICONS: Record<WoundConditionId, typeof Activity> = {
  'pie-diabetico': Footprints,
  'ulcera-vascular': HeartPulse,
  'lesion-presion': BedDouble,
  'herida-quirurgica': Scissors,
  quemadura: Flame,
  'ostomias-fistulas': ShieldPlus,
  otro: Stethoscope,
};

export function TriageWidget({ onApplyRecommendation }: TriageWidgetProps) {
  const [selectedCondition, setSelectedCondition] = useState<WoundConditionId | null>(
    'pie-diabetico'
  );
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageId | null>(null);

  const recommendation =
    selectedCondition && selectedCoverage
      ? getTriageRecommendation(selectedCondition, selectedCoverage)
      : null;

  const selectedConditionLabel =
    WOUND_CONDITIONS.find((c) => c.id === selectedCondition)?.label ?? '';

  return (
    <section id="triage" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
            Orientación Clínica en 2 Pasos
          </p>
          <h2
            className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Triage inicial y ruta de atención recomendada
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Indícanos qué tipo de lesión presentas y tu cobertura actual para asignarte el
            protocolo médico y la modalidad de cita más adecuada en Montería.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Step 1 */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="font-display text-lg font-semibold text-[#0B2545]">
                Paso 1. ¿Qué tipo de herida o condición necesitas tratar?
              </h3>
              <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                7 opciones clínicas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {WOUND_CONDITIONS.map((condition) => {
                const Icon = CONDITION_ICONS[condition.id];
                const isSelected = selectedCondition === condition.id;
                return (
                  <button
                    key={condition.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${condition.label}: ${condition.shortDesc}`}
                    onClick={() => setSelectedCondition(condition.id)}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                      isSelected
                        ? 'bg-[#0B2545] border-[#0B2545] text-white'
                        : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-cyan-500 hover:bg-white'
                    }`}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isSelected ? 'text-cyan-300' : 'text-cyan-700'
                        }`}
                      />
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                      )}
                    </span>
                    <span className="mt-3 block font-display font-semibold text-sm leading-snug">
                      {condition.label}
                    </span>
                    <span
                      className={`mt-1 block text-xs leading-relaxed ${
                        isSelected ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {condition.shortDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Step 2 */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="font-display text-lg font-semibold text-[#0B2545]">
                Paso 2. ¿Cuentas con cobertura por alguna EPS o convenio en particular?
              </h3>
              <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
                Selecciona 1 opción
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COVERAGE_OPTIONS.map((cov) => {
                const isSelected = selectedCoverage === cov.id;
                return (
                  <button
                    key={cov.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCoverage(cov.id)}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-600 text-[#0B2545] ring-1 ring-cyan-600'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-cyan-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-semibold text-base">
                        {cov.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-cyan-700 shrink-0" />
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {cov.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Outcome */}
          <div className="mt-8">
            {recommendation ? (
              <div
                data-testid="triage-recommendation"
                className="rounded-xl bg-[#0B2545] text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-300 font-medium">
                    <span>{recommendation.urgencyLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedConditionLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{recommendation.specialistTeam}</span>
                  </div>
                  <h4 className="mt-2 font-display text-xl sm:text-2xl font-bold text-white">
                    {recommendation.serviceTitle}
                  </h4>
                  <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed">
                    {recommendation.protocolSummary}
                  </p>
                  <p className="mt-3 text-sm text-cyan-200 leading-relaxed">
                    {recommendation.coverageGuidance}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onApplyRecommendation({
                        condition: selectedCondition!,
                        coverage: selectedCoverage!,
                        modality: recommendation.suggestedModality,
                        serviceTitle: recommendation.serviceTitle,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06172D] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>Agendar con este especialista</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCondition('pie-diabetico');
                      setSelectedCoverage(null);
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Reiniciar evaluación
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border border-dashed border-slate-300 p-5 text-center">
                <p className="text-sm text-slate-600">
                  Selecciona tu cobertura en el <strong className="text-[#0B2545]">Paso 2</strong>{' '}
                  para visualizar el servicio clínico recomendado y habilitar el agendamiento directo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
