import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  TrendingUp,
  Rocket,
  MapPin,
  Copy,
  Check,
  X,
  Send,
  ChevronDown,
  ChevronUp,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { LeadCaptureModal } from './LeadCaptureModal';
import { OfficialWhatsAppIcon } from '../../ui/OfficialWhatsAppIcon';

interface MarketingFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobCode?: string;
  ctaContato?: string;
  ctaEmail?: string;
  ctaLink?: string;
  ctaEndereco?: string;
  ctaObservationsWhatsapp?: string;
  ctaObservationsEmail?: string;
  ctaObservationsLink?: string;
  ctaObservationsEndereco?: string;
  jobLocation?: string;
  jobPostedAt?: string;
  advertiserName?: string;
}

type ModalStep = 'intro' | 'exclusive' | 'final';

export const MarketingFunnelModal: React.FC<MarketingFunnelModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  jobCode,
  ctaContato,
  ctaEmail,
  ctaLink,
  ctaEndereco,
  ctaObservationsWhatsapp,
  ctaObservationsEmail,
  ctaObservationsLink,
  ctaObservationsEndereco,
  jobLocation,
  jobPostedAt,
  advertiserName
}) => {
  const [step, setStep] = useState<ModalStep>('intro');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const courseSectionRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Custom smooth scroll for controlled speed
  const customSmoothScroll = (target: HTMLElement, duration: number) => {
    const container = modalScrollRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const targetTop = target.offsetTop;
    const distance = targetTop - start;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeOutQuint(timeElapsed, start, distance, duration);
      container.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing function for a premium feel
    function easeOutQuint(t: number, b: number, c: number, d: number) {
      t /= d;
      t--;
      return c * (t * t * t * t * t + 1) + b;
    }

    requestAnimationFrame(animation);
  };

  // Auto-scroll to course section in final step (for mobile/whatsapp mode)
  useEffect(() => {
    if (step === 'final' && isOpen) {
      const timer = setTimeout(() => {
        if (courseSectionRef.current) {
          customSmoothScroll(courseSectionRef.current, 1000); // Faster scroll
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, isOpen]);

  // Timer logic
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          // Sub-trigger steps based on time (5s each)
          if (next >= 6) setStep('intro');
          else if (next >= 1) setStep('exclusive');
          else if (next === 0) setStep('final');
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Reset timer if reopened
  React.useEffect(() => {
    if (isOpen) {
      setTimeLeft(10);
      setStep('intro');
      setIsTransitioning(false);
    }
  }, [isOpen]);



  if (!isOpen) return null;

  const handleMudarDeVida = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsLeadModalOpen(true);
  };

  const handleLeadSuccess = () => {
    setIsLeadModalOpen(false);
    setIsTransitioning(false);
  };

  const checkVisible = (val?: string) => {
    if (!val) return false;
    const lower = val.toLowerCase().trim();
    return !['não mencionado', 'nao mencionado'].includes(lower);
  };

  const hasPhone = checkVisible(ctaContato);
  const hasEmail = checkVisible(ctaEmail);
  const hasLink = checkVisible(ctaLink);
  const hasEndereco = checkVisible(ctaEndereco);

  // CTA Priority Logic
  const allAvailable = [
    { type: 'whatsapp', exists: hasPhone },
    { type: 'email', exists: hasEmail },
    { type: 'address', exists: hasEndereco },
    { type: 'link', exists: hasLink },
  ].filter(c => c.exists);

  const primaryCTA = allAvailable[0]?.type || null;
  const secondaryCTAs = allAvailable.slice(1);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizeWhatsAppNumber = (num: string) => {
    let cleaned = num.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length > 0 && !cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    return cleaned;
  };

  const cleanAdvertiserName = advertiserName?.replace('@s.whatsapp.net', '') || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Immersive Background Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <AnimatePresence>
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/20 max-h-[85vh] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center overflow-y-auto">
              <div className="w-full aspect-[4/5] max-h-[350px] rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                  alt="pessoa estressada no trabalho"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
                    Seja dono do seu <br />
                    <span className="text-orange-500 text-4xl">próprio negócio</span>
                  </h2>
                  <p className="text-white/90 text-lg font-medium italic tracking-tight">
                    "Alimente seu sonho, e não do seu patrão"
                  </p>
                </div>

                <div className="pt-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">
                    {timeLeft}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'exclusive' && (
          <motion.div
            key="exclusive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 max-h-[85vh] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center overflow-y-auto">
              <div className="w-full aspect-[4/5] max-h-[350px] rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img
                  src="/real_brasileiro.png"
                  alt="cédulas de real brasileiro, notas de 100, 50 e 20"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white leading-[1.2] tracking-tight">
                    Preparamos um <span className="text-orange-500">curso exclusivo</span><br /> para quem quer mudar de vida.
                  </h2>
                  <p className="text-white/80 text-sm font-normal leading-relaxed">
                    Clique no botão "Quero mudar de vida."
                  </p>
                </div>

                <div className="pt-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">
                    {timeLeft}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] max-h-[90vh] flex flex-col z-10"
          >
            <div className="p-4 border-b border-zinc-100 flex items-center justify-end bg-zinc-50/50">
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div ref={modalScrollRef} className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
              {/* Container 1: Vaga */}
              <div className="p-6 md:p-10 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-zinc-100 bg-white">
                <div className="mb-4 md:mb-8 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4">
                    <Briefcase size={12} />
                    Informações da vaga
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-zinc-950 mb-2 leading-[1.1] tracking-tight">
                    {jobTitle}
                  </h3>

                  <div className="flex items-center justify-center gap-3 text-zinc-500 text-xs font-medium">
                    <span className="capitalize">{jobLocation}</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>{jobPostedAt}</span>
                  </div>
                </div>

                <div className="w-full space-y-4 md:space-y-6 pt-4 md:pt-8 border-t border-zinc-50">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-900">Como se candidatar?</h4>
                    <p className="text-xs text-zinc-400">Escolha um dos canais oficiais do anunciante abaixo:</p>
                  </div>

                  <div className="w-full space-y-4">
                    {/* Primary CTA */}
                    {primaryCTA === 'whatsapp' && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4 transition-all hover:border-blue-200">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                            <OfficialWhatsAppIcon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                            <p className="text-zinc-900 font-black text-xl select-text tracking-tight truncate leading-none">
                              {ctaContato}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopy(ctaContato || '')}
                            className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-all active:scale-90 shrink-0"
                          >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (isTransitioning) return;
                            setIsTransitioning(true);
                            const msg = `Olá, tudo bem ?\nvi esta vaga na soroempregos.com.br\n—————————————\nFunção: *${jobTitle}*\nCódigo: *${jobCode || '---'}*\n--------------------------\n\nPosso enviar o currículo aqui mesmo ou tem outro canal para envio ?`;
                            const encodedMsg = encodeURIComponent(msg);
                            const phone = normalizeWhatsAppNumber(ctaContato || '');
                            window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
                            setTimeout(() => setIsTransitioning(false), 2000);
                          }}
                          disabled={isTransitioning}
                          className="w-full h-16 bg-green-500 hover:bg-green-600 text-white font-black px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-100 text-sm disabled:opacity-50"
                        >
                          <OfficialWhatsAppIcon size={20} />
                          <span>Enviar currículo agora</span>
                        </motion.button>
                      </div>
                    )}

                    {primaryCTA === 'email' && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4 transition-all hover:border-blue-200">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                            <Mail className="text-blue-500" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">E-mail</p>
                            <p className="text-zinc-800 font-bold text-sm select-text truncate">
                              {ctaEmail}
                            </p>
                          </div>
                          <button onClick={() => handleCopy(ctaEmail || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            if (isTransitioning) return;
                            setIsTransitioning(true);
                            handleCopy(ctaEmail || '');
                            setTimeout(() => setIsTransitioning(false), 2000);
                          }}
                          disabled={isTransitioning}
                          className="w-full h-16 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10 disabled:opacity-50"
                        >
                          {copied ? 'Copiado!' : 'Copiar e-mail'}
                          <Copy size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    )}

                    {primaryCTA === 'address' && (
                      <div className="w-full space-y-3">
                        <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4 transition-all hover:border-blue-200">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                            <MapPin className="text-red-500" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Endereço</p>
                            <p className="text-zinc-800 font-bold text-[11px] select-text leading-tight line-clamp-2">
                              {ctaEndereco}
                            </p>
                          </div>
                          <button onClick={() => handleCopy(ctaEndereco || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            if (isTransitioning) return;
                            setIsTransitioning(true);
                            handleCopy(ctaEndereco || '');
                            setTimeout(() => setIsTransitioning(false), 2000);
                          }}
                          disabled={isTransitioning}
                          className="w-full h-16 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 group shadow-xl disabled:opacity-50"
                        >
                          {copied ? 'Copiado!' : 'Copiar endereço'}
                          <Copy size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    )}

                    {primaryCTA === 'link' && (
                      <button
                        onClick={() => {
                          if (isTransitioning) return;
                          setIsTransitioning(true);
                          window.open(ctaLink, '_blank');
                          setTimeout(() => setIsTransitioning(false), 2000);
                        }}
                        disabled={isTransitioning}
                        className="w-full h-16 bg-zinc-900 text-white font-black px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl text-sm disabled:opacity-50"
                      >
                        <Rocket size={20} />
                        <span>Abrir link de candidatura</span>
                      </button>
                    )}

                    {/* Secondary CTAs */}
                    {secondaryCTAs.length > 0 && (
                      <div className="pt-2">
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-600 transition-colors mx-auto"
                        >
                          {isExpanded ? 'Ocultar opções de envio' : 'Ver mais opções de envio'}
                          <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-3 pt-4"
                            >
                              {secondaryCTAs.map(cta => (
                                <React.Fragment key={cta.type}>
                                  {cta.type === 'whatsapp' && (
                                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4">
                                      <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                                        <OfficialWhatsAppIcon size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                                        <p className="text-zinc-900 font-bold text-sm select-text truncate">
                                          {ctaContato}
                                        </p>
                                      </div>
                                      <button onClick={() => handleCopy(ctaContato || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  )}
                                  {cta.type === 'email' && (
                                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4">
                                      <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                                        <Mail className="text-blue-500" size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">E-mail</p>
                                        <p className="text-zinc-800 font-bold text-sm select-text truncate">
                                          {ctaEmail}
                                        </p>
                                      </div>
                                      <button onClick={() => handleCopy(ctaEmail || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  )}
                                  {cta.type === 'address' && (
                                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4">
                                      <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                                        <MapPin className="text-red-500" size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Endereço</p>
                                        <p className="text-zinc-800 font-bold text-[11px] select-text line-clamp-1">
                                          {ctaEndereco}
                                        </p>
                                      </div>
                                      <button onClick={() => handleCopy(ctaEndereco || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  )}
                                  {cta.type === 'link' && (
                                    <button
                                      onClick={() => {
                                        if (isTransitioning) return;
                                        setIsTransitioning(true);
                                        window.open(ctaLink, '_blank');
                                        setTimeout(() => setIsTransitioning(false), 2000);
                                      }}
                                      disabled={isTransitioning}
                                      className="w-full h-12 bg-zinc-100 text-zinc-800 font-bold rounded-xl text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                      <Rocket size={14} /> Abrir link de candidatura
                                    </button>
                                  )}
                                </React.Fragment>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                {advertiserName && (
                  <p className="text-zinc-400 text-[10px] font-semibold tracking-widest mt-auto pt-8">
                    Vaga anunciada por {cleanAdvertiserName}
                  </p>
                )}
              </div>

              {/* Container 2: Mudar de Vida (Purple Theme) */}
              <div
                ref={courseSectionRef}
                className="p-8 flex flex-col items-center text-center bg-purple-950 text-white scroll-mt-4"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
                  <TrendingUp className="text-orange-500" size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight leading-tight">
                  Você teve 10 segundos para pensar!
                </h3>

                <div className="w-full space-y-4 mb-8 text-left">
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/80 font-medium">Dê o primeiro passo para abrir o seu próprio negócio.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/80 font-medium">Onde você quer estar daqui a um ano? A decisão que você toma hoje determina o seu futuro.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/80 font-medium">Conheça nosso curso de capacitação e transforme o sonho de ser empresário em realidade. A hora de começar é agora.</p>
                  </div>
                </div>

                <p className="text-orange-500 text-lg font-bold mb-8 italic">
                  A escolha é sua!
                </p>

                <div className="w-full mt-auto">
                  <div className="relative w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMudarDeVida}
                      disabled={isTransitioning}
                      className="relative w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xl shadow-orange-950/40 text-base z-10 disabled:opacity-50"
                    >
                      <Rocket size={20} />
                      <span className="leading-tight">quero mudar de vida.</span>
                    </motion.button>
                  </div>
                </div>

                <p className="mt-8 text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Soroempregos exclusivo
                </p>
              </div>
            </div>
          </motion.div>
        )}


      </AnimatePresence>

      <AnimatePresence>
        {isLeadModalOpen && (
          <LeadCaptureModal
            isOpen={isLeadModalOpen}
            onClose={() => {
              setIsLeadModalOpen(false);
              setIsTransitioning(false);
            }}
            onSuccess={handleLeadSuccess}
            fonte="vagas"
            tipo={jobTitle.toLowerCase()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
