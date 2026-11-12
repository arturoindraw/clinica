import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { CHATBOT_QUICK_TOPICS, CLINIC_INFO } from '../lib/clinicData';
import { buildWhatsAppUrl, matchClinicFaq } from '../lib/clinicLogic';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

function NurseAvatar({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Enfermera virtual CAATH con gorro azul oscuro"
    >
      <circle cx="32" cy="32" r="31" fill="#E0F2FE" stroke="#0B2545" strokeWidth="2" />
      {/* Uniform shoulders */}
      <path d="M13 58C15 47 22 43 32 43C42 43 49 47 51 58" fill="#0B2545" />
      <path d="M26 43L32 51L38 43" fill="#38BDF8" />
      {/* Face & hair */}
      <circle cx="32" cy="30" r="12" fill="#F6D0B1" />
      <path d="M20 29C20 20 25 16 32 16C39 16 44 20 44 29C42 25 38 22 32 22C26 22 22 25 20 29Z" fill="#1E293B" />
      {/* Dark blue nurse cap (#0B2545) */}
      <path d="M20 18L24 9H40L44 18Z" fill="#0B2545" stroke="#06172D" strokeWidth="1.2" />
      <rect x="30.5" y="11" width="3" height="6" rx="0.6" fill="#FFFFFF" />
      <rect x="29" y="12.5" width="6" height="3" rx="0.6" fill="#FFFFFF" />
      {/* Eyes & warm smile */}
      <circle cx="28" cy="30" r="1.4" fill="#0F172A" />
      <circle cx="36" cy="30" r="1.4" fill="#0F172A" />
      <path
        d="M28.5 34.5C30 36.5 34 36.5 35.5 34.5"
        fill="none"
        stroke="#0F172A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface FloatingWidgetsProps {
  onGoToBooking: () => void;
}

export function FloatingWidgets({ onGoToBooking }: FloatingWidgetsProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! Soy la Enfermera Virtual de CAATH Montería. Pregúntame sobre horarios, tipos de heridas, cámara hiperbárica, convenios EPS/FOMAG o atención en casa.',
    },
  ]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  function sendQuestion(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = matchClinicFaq(trimmed);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: trimmed },
      { id: `b-${Date.now() + 1}`, sender: 'bot', text: reply },
    ]);
    setInputValue('');
  }

  return (
    <>
      {/* Chatbot Dialog */}
      {chatOpen && (
        <div
          role="dialog"
          aria-label="Asesor Clínico Virtual CAATH"
          className="fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[75vh]"
        >
          {/* Header */}
          <div className="bg-[#0B2545] text-white px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <NurseAvatar className="w-10 h-10 shrink-0" />
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm truncate">
                  Enfermera Virtual CAATH
                </p>
                <p className="text-xs text-cyan-300 truncate">
                  Asesoría Clínica · Montería
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label="Cerrar chat clínico"
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0B2545] text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Topics + Input */}
          <div className="bg-white border-t border-slate-200 p-3 space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {CHATBOT_QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => sendQuestion(topic.question)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-cyan-600 text-[11px] font-medium text-[#0B2545] transition-colors cursor-pointer"
                >
                  {topic.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="chatbot-input" className="sr-only">
                Escribe tu consulta clínica
              </label>
              <input
                id="chatbot-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pregunta sobre horarios, EPS, domicilio..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
              <button
                type="submit"
                aria-label="Enviar pregunta"
                className="w-9 h-9 rounded-xl bg-[#0B2545] hover:bg-[#13355F] text-white inline-flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <button
                type="button"
                onClick={() => {
                  setChatOpen(false);
                  onGoToBooking();
                }}
                className="font-semibold text-cyan-700 hover:text-cyan-900 cursor-pointer"
              >
                Ir a agendar cita
              </button>
              <a
                href={buildWhatsAppUrl(
                  'Hola CAATH Montería, vengo desde el chat asesor clínico y requiero atención.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:text-emerald-900"
              >
                WhatsApp {CLINIC_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Floating Controls (WhatsApp + Nurse Chatbot) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5">
        <a
          href={buildWhatsAppUrl(
            'Hola CAATH Montería, quiero solicitar información o agendar una cita.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp CAATH"
          className="h-12 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2545]"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => setChatOpen((prev) => !prev)}
          aria-expanded={chatOpen}
          aria-label={chatOpen ? 'Cerrar asesor clínico virtual' : 'Abrir asesor clínico virtual'}
          className="h-12 pl-1.5 pr-3.5 rounded-full bg-[#0B2545] hover:bg-[#13355F] text-white border border-cyan-400/50 shadow-lg inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <NurseAvatar className="w-9 h-9 shrink-0" />
          <span>Asesor Clínico</span>
        </button>
      </div>
    </>
  );
}
