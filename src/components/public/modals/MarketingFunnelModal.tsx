import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Copy,
  Check,
  X,
  Mail,
  MapPin,
  Rocket,
  ChevronDown
} from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

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

  const cleanPhone = (phone?: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55')) {
      cleaned = cleaned.substring(2);
    }
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';
    const cleaned = cleanPhone(phone);
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  };

  const normalizeWhatsAppNumber = (num: string) => {
    const cleaned = cleanPhone(num);
    if (cleaned.length > 0) {
      return '55' + cleaned;
    }
    return '';
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
        <motion.div
          key="cta-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2 pl-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Candidatura Externa
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div ref={modalScrollRef} className="overflow-y-auto w-full p-6 md:p-8 flex flex-col items-center text-center">
            <div className="mb-6 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                <Briefcase size={12} />
                Informações da vaga
              </div>

              <h3 className="text-2xl font-black text-zinc-950 mb-2 leading-tight tracking-tight px-2">
                {jobTitle}
              </h3>

              <div className="flex items-center justify-center gap-3 text-zinc-500 text-xs font-medium">
                <span className="capitalize">{jobLocation}</span>
                {jobPostedAt && (
                  <>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>{jobPostedAt}</span>
                  </>
                )}
              </div>
            </div>

            <div className="w-full space-y-6 pt-6 border-t border-zinc-100">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Como se candidatar?</h4>
                <p className="text-xs text-zinc-400">Escolha um dos canais oficiais do anunciante abaixo:</p>
              </div>

              <div className="w-full space-y-4">
                {/* Primary CTA */}
                {primaryCTA === 'whatsapp' && (
                  <div className="w-full space-y-3">
                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 transition-all hover:border-blue-200">
                      {ctaObservationsWhatsapp && (
                        <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                          {ctaObservationsWhatsapp}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                          <OfficialWhatsAppIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                          <p className="text-zinc-900 font-black text-xl select-text tracking-tight truncate leading-none">
                            {formatPhoneNumber(ctaContato)}
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
                        className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-100 text-sm disabled:opacity-50 mt-2"
                      >
                        <OfficialWhatsAppIcon size={20} />
                        <span>Enviar currículo agora</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {primaryCTA === 'email' && (
                  <div className="w-full space-y-3">
                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 transition-all hover:border-blue-200">
                      {ctaObservationsEmail && (
                        <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                          {ctaObservationsEmail}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
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
                        className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10 disabled:opacity-50 mt-2"
                      >
                        {copied ? 'Copiado!' : 'Copiar e-mail'}
                        <Copy size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {primaryCTA === 'address' && (
                  <div className="w-full space-y-3">
                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 transition-all hover:border-blue-200">
                      {ctaObservationsEndereco && (
                        <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                          {ctaObservationsEndereco}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
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
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ctaEndereco || '')}`, '_blank');
                          setTimeout(() => setIsTransitioning(false), 2000);
                        }}
                        disabled={isTransitioning}
                        className="w-full h-14 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10 disabled:opacity-50 mt-2"
                      >
                        <MapPin size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Abrir mapa</span>
                      </button>
                    </div>
                  </div>
                )}

                {primaryCTA === 'link' && (
                  <div className="w-full space-y-3">
                    <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 hover:border-blue-200">
                      {ctaObservationsLink && (
                        <p className="text-[11px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                          {ctaObservationsLink}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          if (isTransitioning) return;
                          setIsTransitioning(true);
                          window.open(ctaLink, '_blank');
                          setTimeout(() => setIsTransitioning(false), 2000);
                        }}
                        disabled={isTransitioning}
                        className="w-full h-14 bg-zinc-900 text-white font-black px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl text-sm disabled:opacity-50"
                      >
                        <Rocket size={20} />
                        <span>Abrir link de candidatura</span>
                      </button>
                    </div>
                  </div>
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
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3">
                                    {ctaObservationsWhatsapp && (
                                      <p className="text-[10px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                                        {ctaObservationsWhatsapp}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 w-full">
                                      <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                                        <OfficialWhatsAppIcon size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                                        <p className="text-zinc-900 font-bold text-sm select-text truncate">
                                          {formatPhoneNumber(ctaContato)}
                                        </p>
                                      </div>
                                      <button onClick={() => handleCopy(ctaContato || '')} className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 shrink-0">
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cta.type === 'email' && (
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3">
                                    {ctaObservationsEmail && (
                                      <p className="text-[10px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                                        {ctaObservationsEmail}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 w-full">
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
                                  </div>
                                </div>
                              )}
                              {cta.type === 'address' && (
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3">
                                    {ctaObservationsEndereco && (
                                      <p className="text-[10px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                                        {ctaObservationsEndereco}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 w-full">
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
                                  </div>
                                </div>
                              )}
                              {cta.type === 'link' && (
                                <div className="flex flex-col gap-2 w-full">
                                  <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex flex-col gap-3 hover:border-blue-200">
                                    {ctaObservationsLink && (
                                      <p className="text-[10px] text-zinc-600 whitespace-pre-line leading-relaxed lowercase first-letter:uppercase pb-2 border-b border-zinc-200/50">
                                        {ctaObservationsLink}
                                      </p>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (isTransitioning) return;
                                        setIsTransitioning(true);
                                        window.open(ctaLink, '_blank');
                                        setTimeout(() => setIsTransitioning(false), 2000);
                                      }}
                                      disabled={isTransitioning}
                                      className="w-full h-12 bg-zinc-900 text-white font-bold rounded-xl text-xs hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                                    >
                                      <Rocket size={14} /> Abrir link de candidatura
                                    </button>
                                  </div>
                                </div>
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
              <p className="text-zinc-400 text-[10px] font-semibold tracking-widest pt-8">
                Vaga anunciada por {cleanAdvertiserName}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
