import { Clock, ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CLINIC_INFO } from '../lib/clinicData';
import { buildWhatsAppUrl } from '../lib/clinicLogic';

export function ContactLocationSection() {
  const whatsappDirect = buildWhatsAppUrl(
    'Hola CAATH Montería, deseo información sobre citas y horarios en la sede Cra 14 #37-7.'
  );
  const mapsDirectionsUrl =
    'https://www.google.com/maps/search/?api=1&query=Cra+14+%2337-7,+Monteria,+Cordoba,+Colombia';
  const mapsEmbedUrl =
    'https://maps.google.com/maps?q=Cra%2014%20%2337-7%2C%20Monteria%2C%20Cordoba%2C%20Colombia&t=&z=16&ie=UTF8&iwloc=&output=embed';

  return (
    <section
      id="ubicacion"
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-slate-100/90 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
            Contacto, Ubicación & Horarios
          </p>
          <h2
            className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Visítanos en nuestra sede de Montería
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Atención oportuna en instalaciones modernas y accesibles en el corazón de Montería,
            Córdoba, con cobertura de atención domiciliaria en toda la ciudad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left card: Layered tactile address, WhatsApp, Hours */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-8 shadow-[0_22px_50px_-16px_rgba(11,37,69,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col justify-between space-y-6">
            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 shadow-[inset_2px_2px_6px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Dirección Física</span>
              </div>
              <p className="mt-2 font-display text-lg font-bold text-[#0B2545]">
                {CLINIC_INFO.address}
              </p>
              <p className="mt-1 text-sm text-slate-600">{CLINIC_INFO.directorNote}</p>
            </div>

            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 shadow-[inset_2px_2px_6px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                <Phone className="w-4 h-4" />
                <span>Teléfono / WhatsApp de Contacto</span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-[#0B2545] tabular-nums">
                {CLINIC_INFO.phoneDisplay}
              </p>
              <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Escribir por WhatsApp</span>
                </a>
                <a
                  href="tel:+573244400883"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#0B2545] text-slate-800 text-sm font-medium transition-colors"
                >
                  <span>Llamar ahora</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/70 p-4 shadow-[inset_2px_2px_6px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Horarios de Atención</span>
              </div>
              <dl className="mt-3 space-y-3 text-sm">
                {CLINIC_INFO.hours.map((item) => (
                  <div
                    key={item.days}
                    className="flex flex-col gap-1 pb-2.5 border-b border-slate-200/70 last:border-0 last:pb-0"
                  >
                    <dt className="font-semibold text-[#0B2545]">{item.days}</dt>
                    <dd className="flex flex-col gap-1 font-mono text-xs text-slate-700 tabular-nums sm:flex-row sm:items-center sm:gap-0">
                      <span>{item.morning}</span>
                      {item.afternoon !== 'Cerrado en la tarde' ? (
                        <>
                          <span aria-hidden="true" className="hidden sm:inline mx-1.5 text-slate-400">·</span>
                          <span>{item.afternoon}</span>
                        </>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right card: Sculpted Google Maps bezel */}
          <div className="lg:col-span-7 p-2.5 bg-white border border-slate-200/90 rounded-3xl shadow-[0_22px_50px_-16px_rgba(11,37,69,0.12)] flex flex-col min-h-[360px] sm:min-h-[400px]">
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0B2545]">
                  Mapa de ubicación · Montería, Córdoba
                </p>
                <p className="text-xs text-slate-500">Cra 14 #37-7</p>
              </div>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0B2545] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] rounded-[18px] overflow-hidden bg-slate-100 border border-slate-200/70">
              <iframe
                title="Ubicación CAATH Montería en Google Maps"
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[300px] sm:min-h-[340px] border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
