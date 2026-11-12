import { useState } from 'react';
import { Lock } from 'lucide-react';
import { AppointmentScheduler, type ConfirmedBooking } from './components/AppointmentScheduler';
import { CaathLogo } from './components/CaathLogo';
import { ContactLocationSection } from './components/ContactLocationSection';
import { CrmAccessModal } from './components/CrmFunnelPreview';
import { FloatingWidgets } from './components/FloatingWidgets';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ServicesSection } from './components/ServicesSection';
import { TriageWidget } from './components/TriageWidget';
import {
  CLINIC_INFO,
  COVERAGE_OPTIONS,
  INITIAL_CRM_CASES,
  type CoverageId,
  type CrmPatientCase,
  type ModalityId,
  type WoundConditionId,
} from './lib/clinicData';
import { advanceCrmStage } from './lib/clinicLogic';

export default function App() {
  const [selectedModality, setSelectedModality] = useState<ModalityId>('presencial');
  const [prefilledCondition, setPrefilledCondition] =
    useState<WoundConditionId>('pie-diabetico');
  const [prefilledCoverage, setPrefilledCoverage] = useState<CoverageId>('particular');
  const [prefilledServiceLabel, setPrefilledServiceLabel] = useState<string>(
    'Valoración Clínica Integral'
  );
  const [crmCases, setCrmCases] = useState<CrmPatientCase[]>(INITIAL_CRM_CASES);
  const [crmModalOpen, setCrmModalOpen] = useState(false);

  function scrollToBooking() {
    const el = document.getElementById('agendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleHeroModality(modality: ModalityId) {
    setSelectedModality(modality);
    scrollToBooking();
  }

  function handleApplyTriage(params: {
    condition: WoundConditionId;
    coverage: CoverageId;
    modality: ModalityId;
    serviceTitle: string;
  }) {
    setPrefilledCondition(params.condition);
    setPrefilledCoverage(params.coverage);
    setSelectedModality(params.modality);
    setPrefilledServiceLabel(params.serviceTitle);
    scrollToBooking();
  }

  function handleSelectService(serviceTitle: string, modality: ModalityId) {
    setPrefilledServiceLabel(serviceTitle);
    setSelectedModality(modality);
    scrollToBooking();
  }

  function handleConfirmBooking(booking: ConfirmedBooking) {
    const covLabel =
      COVERAGE_OPTIONS.find((c) => c.id === booking.coverage)?.label ?? 'Particular';

    const newCase: CrmPatientCase = {
      id: booking.code,
      patientName: booking.patientName,
      condition: booking.conditionLabel,
      coverage: covLabel === 'EPS particulares' ? 'EPS' : covLabel.split(' ')[0],
      modality: booking.modality,
      stage: 'Cita Agendada',
      scheduledLabel: `${booking.date} · ${booking.timeSlot}`,
      assignedUnit: booking.serviceLabel,
    };

    setCrmCases((prev) => [newCase, ...prev]);
  }

  function handleAdvanceCase(caseId: string) {
    setCrmCases((prev) => advanceCrmStage(prev, caseId));
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onQuickSchedule={() => handleHeroModality('presencial')} />

      <main className="flex-1">
        <HeroSection onSelectModality={handleHeroModality} />

        <TriageWidget onApplyRecommendation={handleApplyTriage} />

        <ServicesSection onSelectService={handleSelectService} />

        <AppointmentScheduler
          selectedModality={selectedModality}
          onModalityChange={setSelectedModality}
          prefilledCondition={prefilledCondition}
          prefilledCoverage={prefilledCoverage}
          prefilledServiceLabel={prefilledServiceLabel}
          onConfirmBooking={handleConfirmBooking}
        />

        <ContactLocationSection />
      </main>

      <footer className="bg-[#06172D] text-slate-300 border-t border-white/10 py-12 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <CaathLogo size="md" showSubtitle={true} />
              <p className="mt-4 text-sm text-slate-300 max-w-sm leading-relaxed">
                {CLINIC_INFO.tagline}
              </p>
            </div>

            <div className="md:col-span-4 text-sm space-y-2">
              <p className="font-display font-semibold text-white">Sede Montería</p>
              <p>{CLINIC_INFO.address}</p>
              <p>{CLINIC_INFO.directorNote}</p>
              <p className="font-mono text-cyan-300 tabular-nums">
                {CLINIC_INFO.phoneDisplay}
              </p>
            </div>

            <div className="md:col-span-3 text-sm space-y-2">
              <p className="font-display font-semibold text-white">Navegación</p>
              <ul className="space-y-1.5">
                <li>
                  <a href="#triage" className="hover:text-white transition-colors">
                    Triage Inicial
                  </a>
                </li>
                <li>
                  <a href="#servicios" className="hover:text-white transition-colors">
                    Servicios Clínicos
                  </a>
                </li>
                <li>
                  <a href="#agendar" className="hover:text-white transition-colors">
                    Agendar Cita
                  </a>
                </li>
                <li>
                  <a href="#ubicacion" className="hover:text-white transition-colors">
                    Ubicación y Horarios
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom CRM Access Bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 space-y-1">
              <p>
                © {new Date().getFullYear()} CAATH - Centro Avanzado en Atención y Tratamiento
                de Heridas. Montería, Córdoba.
              </p>
              <p>Atención en sede, domicilio y asesoría virtual.</p>
            </div>

            <button
              type="button"
              onClick={() => setCrmModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-cyan-400 hover:text-[#06172D] border border-white/15 text-xs font-semibold text-cyan-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Integración CRM Médico & Trazabilidad</span>
            </button>
          </div>
        </div>
      </footer>

      <CrmAccessModal
        isOpen={crmModalOpen}
        onClose={() => setCrmModalOpen(false)}
        cases={crmCases}
        onAdvanceCase={handleAdvanceCase}
      />

      <FloatingWidgets onGoToBooking={scrollToBooking} />
    </div>
  );
}
