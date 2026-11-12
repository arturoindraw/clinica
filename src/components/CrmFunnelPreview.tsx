import { useState } from 'react';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  CRM_STAGES,
  type CrmPatientCase,
  type CrmStage,
} from '../lib/clinicData';
import { getFunnelMetrics, verifyCrmAccessKey } from '../lib/clinicLogic';

interface CrmAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CrmPatientCase[];
  onAdvanceCase: (caseId: string) => void;
}

const STAGE_ICONS: Record<CrmStage, typeof Users> = {
  Lead: Users,
  Calificado: ClipboardList,
  'Cita Agendada': CalendarCheck2,
  Atendido: UserCheck,
  'Seguimiento domiciliario': Home,
};

export function CrmAccessModal({
  isOpen,
  onClose,
  cases,
  onAdvanceCase,
}: CrmAccessModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [authError, setAuthError] = useState('');
  const [stageFilter, setStageFilter] = useState<CrmStage | 'Todos'>('Todos');

  if (!isOpen) return null;

  const metrics = getFunnelMetrics(cases);
  const visibleCases =
    stageFilter === 'Todos'
      ? cases
      : cases.filter((item) => item.stage === stageFilter);

  const totalCount = cases.length;
  const scheduledAndActive =
    metrics['Cita Agendada'] + metrics.Atendido + metrics['Seguimiento domiciliario'];
  const continuityRate =
    totalCount > 0 ? Math.round((scheduledAndActive / totalCount) * 100) : 0;

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!verifyCrmAccessKey(accessKey)) {
      setAuthError('Clave de acceso incorrecta. Verifica con coordinación médica CAATH.');
      return;
    }
    setAuthError('');
    setIsUnlocked(true);
    setAccessKey('');
  }

  function handleLockOut() {
    setIsUnlocked(false);
    setAccessKey('');
    setAuthError('');
    setStageFilter('Todos');
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Integración CRM Médico y Trazabilidad CAATH"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#06172D]/80 backdrop-blur-md overflow-y-auto"
    >
      {!isUnlocked ? (
        <div className="w-full max-w-md rounded-3xl bg-[#0B2545] text-white border border-white/15 shadow-[0_32px_70px_-15px_rgba(0,0,0,0.65)] p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar acceso CRM"
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 border border-cyan-300/30 flex items-center justify-center mb-5">
            <Lock className="w-6 h-6 text-cyan-300" />
          </div>

          <p className="text-xs font-mono uppercase tracking-wider text-cyan-300">
            Integración CRM Médico & Trazabilidad
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">
            Acceso institucional al panel clínico
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Ingresa la clave de acceso del equipo asistencial para visualizar el estado de cada
            paciente y gestionar el embudo de seguimiento.
          </p>

          <form onSubmit={handleUnlockSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="crm-access-key"
                className="block text-sm font-medium text-slate-200 mb-1.5"
              >
                Clave de acceso
              </label>
              <div className="relative">
                <input
                  id="crm-access-key"
                  type={showKey ? 'text' : 'password'}
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Ingresa la clave institucional"
                  autoFocus
                  className="w-full pl-3.5 pr-11 py-3 rounded-xl bg-[#06172D] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  aria-label={showKey ? 'Ocultar clave' : 'Mostrar clave'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-300 hover:text-white inline-flex items-center justify-center cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p role="alert" className="mt-2 text-xs text-rose-300">
                  {authError}
                </p>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Clave de demostración clínica: <span className="font-mono text-cyan-300">CAATH2026</span>
            </p>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06172D] font-bold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Ingresar al Dashboard Clínico</span>
            </button>
          </form>
        </div>
      ) : (
        <div
          data-testid="crm-dashboard-unlocked"
          className="w-full max-w-6xl rounded-3xl bg-[#0B2545] text-white border border-white/15 shadow-[0_32px_70px_-15px_rgba(0,0,0,0.75)] p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300">
                <ShieldCheck className="w-4 h-4" />
                <span>PANEL CRM MÉDICO & TRAZABILIDAD · SESIÓN VERIFICADA</span>
              </div>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-white">
                Estado de pacientes y embudo clínico
              </h2>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleLockOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Bloquear acceso</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar dashboard CRM"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06172D] text-xs font-bold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Volver al sitio</span>
              </button>
            </div>
          </div>

          {/* 4-Column KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="bg-[#06172D]/90 border border-white/10 rounded-2xl p-4 sm:p-5">
              <p className="text-xs text-slate-300">Pacientes registrados</p>
              <p className="mt-2 font-mono text-3xl font-bold text-white tabular-nums">
                {totalCount}
              </p>
            </div>
            <div className="bg-[#06172D]/90 border border-white/10 rounded-2xl p-4 sm:p-5">
              <p className="text-xs text-slate-300">Citas agendadas</p>
              <p className="mt-2 font-mono text-3xl font-bold text-cyan-300 tabular-nums">
                {metrics['Cita Agendada']}
              </p>
            </div>
            <div className="bg-[#06172D]/90 border border-white/10 rounded-2xl p-4 sm:p-5">
              <p className="text-xs text-slate-300">Seguimiento en casa</p>
              <p className="mt-2 font-mono text-3xl font-bold text-white tabular-nums">
                {metrics['Seguimiento domiciliario']}
              </p>
            </div>
            <div className="bg-[#06172D]/90 border border-white/10 rounded-2xl p-4 sm:p-5">
              <p className="text-xs text-slate-300">Continuidad clínica</p>
              <p className="mt-2 font-mono text-3xl font-bold text-cyan-300 tabular-nums">
                {continuityRate}%
              </p>
            </div>
          </div>

          {/* Visual Stage Distribution Bars */}
          <div className="bg-[#06172D]/80 border border-white/10 rounded-2xl p-4 sm:p-5 mb-6">
            <p className="text-xs font-mono text-slate-300 mb-3">
              DISTRIBUCIÓN VISUAL DEL EMBUDO CLÍNICO
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {CRM_STAGES.map((stage, idx) => {
                const count = metrics[stage];
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div
                    key={stage}
                    className="rounded-xl bg-white/[0.04] border border-white/10 p-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium truncate">
                        {idx + 1}. {stage}
                      </span>
                      <span className="font-mono text-cyan-300 font-bold tabular-nums">
                        {count}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${Math.max(pct, count > 0 ? 12 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar & Patient Status Table */}
          <div className="bg-[#06172D] border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-white/10">
              <button
                type="button"
                onClick={() => setStageFilter('Todos')}
                aria-pressed={stageFilter === 'Todos'}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  stageFilter === 'Todos'
                    ? 'bg-cyan-400 text-[#06172D]'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                Todos ({totalCount})
              </button>

              {CRM_STAGES.map((stage, idx) => {
                const Icon = STAGE_ICONS[stage];
                const active = stageFilter === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setStageFilter(stage)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-cyan-400 text-[#06172D]'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>
                      {idx + 1}. {stage}
                    </span>
                    <span className="font-mono tabular-nums opacity-80">
                      ({metrics[stage]})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-mono text-slate-400">
                    <th className="py-3 pr-4 font-medium">ID Caso</th>
                    <th className="py-3 px-4 font-medium">Paciente & Lesión</th>
                    <th className="py-3 px-4 font-medium">Convenio</th>
                    <th className="py-3 px-4 font-medium">Estado Actual</th>
                    <th className="py-3 px-4 font-medium">Unidad / Horario</th>
                    <th className="py-3 pl-4 font-medium text-right">Gestión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {visibleCases.map((item) => {
                    const StageIcon = STAGE_ICONS[item.stage];
                    const stageNum = CRM_STAGES.indexOf(item.stage) + 1;
                    const isFinalStage = item.stage === 'Seguimiento domiciliario';
                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 pr-4 font-mono text-xs text-cyan-300 tabular-nums whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{item.patientName}</p>
                          <p className="text-xs text-slate-300">{item.condition}</p>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-200 whitespace-nowrap">
                          {item.coverage} ·{' '}
                          <span className="capitalize text-slate-300">{item.modality}</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-200">
                            <StageIcon className="w-3.5 h-3.5 text-cyan-300" />
                            <span>{item.stage}</span>
                            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                              ({stageNum}/5)
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-slate-200">{item.assignedUnit}</p>
                          <p className="text-xs font-mono text-slate-400 tabular-nums">
                            {item.scheduledLabel}
                          </p>
                        </td>
                        <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                          {isFinalStage ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>En seguimiento activo</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onAdvanceCase(item.id)}
                              aria-label={`Avanzar etapa de ${item.patientName}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-cyan-400 hover:text-[#06172D] text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>Avanzar etapa</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {visibleCases.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-400">
                        No hay pacientes en la etapa "{stageFilter}" actualmente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
