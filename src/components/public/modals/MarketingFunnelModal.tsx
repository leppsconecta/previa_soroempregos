import React, { useState } from 'react';
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
  Mail
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
    }
  }, [isOpen]);



  if (!isOpen) return null;

  const handleMudarDeVida = () => {
    window.open('https://curso.soroempregos.com.br/', '_blank');
    onClose();
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

      {/* Immersive Background Effects (only active for intro and exclusive steps) */}
      {(step === 'intro' || step === 'exclusive') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-64 -left-64 w-[800px] h-[800px] bg-purple-900/40 rounded-full blur-[140px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -45, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-64 -right-64 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px]" 
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/20 max-h-[85vh] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center overflow-y-auto">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop" 
                  alt="pessoa estressada no trabalho"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-white mb-3 leading-none tracking-tight">
                  Seja dono do seu <br/>
                  <span className="text-orange-500">próprio negócio</span>
                </h2>
                <p className="text-white/90 text-lg font-medium italic tracking-tight">
                  "Alimente seu sonho, e não do seu patrão"
                </p>
                <div className="mt-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">
                        {timeLeft}
                    </div>
                </div>
              </motion.div>

              <div className="mt-6 flex flex-col items-center gap-4 w-full h-14" />
            </div>
          </motion.div>
        )}

        {step === 'exclusive' && (
          <motion.div
            key="exclusive"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 max-h-[85vh] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center overflow-y-auto">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="/real_brasileiro.png" 
                  alt="cédulas de real brasileiro, notas de 100, 50 e 20"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white leading-[1.1] tracking-tight">
                  Preparamos um <span className="text-orange-500">curso exclusivo</span><br/> para quem quer mudar de vida.
                </h2>
                <p className="text-white/80 text-sm font-normal leading-relaxed">
                  Clique no botão "Quero mudar de vida."
                </p>
                <div className="mt-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">
                        {timeLeft}
                    </div>
                </div>
              </motion.div>

              <div className="mt-8 flex flex-col items-center gap-6 w-full">
                <div className="h-14" /> {/* Spacer for delayed button */}

                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} 
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-orange-500 rounded-full" 
                  />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
              {/* Container 1: Vaga */}
              <div className="p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-zinc-100 bg-white">
                <span className="text-[10px] font-light text-zinc-400 uppercase tracking-[0.2em] mb-2">
                  Vaga
                </span>
                <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight leading-none">
                  {jobTitle}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mb-8">
                  {jobLocation} • {jobPostedAt}
                </p>

                <div className="w-full pt-4 border-t border-zinc-50">
                  <p className="text-[11px] font-semibold text-zinc-400 mb-6 uppercase tracking-wider">
                    Como enviar seu currículo
                  </p>
                  
                  <div className="w-full space-y-3 mb-4">
                    {hasPhone && (
                      <div className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-left flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                          <OfficialWhatsAppIcon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-900 font-bold text-lg select-text tracking-tight truncate">
                            {ctaContato}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(ctaContato || '')}
                          className="p-1.5 hover:bg-zinc-200 rounded text-zinc-400 transition-all active:scale-90 shrink-0"
                        >
                          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}

                    {hasEmail && (
                      <div className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-left flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                          <Mail className="text-blue-500" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-900 font-bold text-xs select-text truncate">
                            {ctaEmail}
                          </p>
                        </div>
                        <button onClick={() => handleCopy(ctaEmail || '')} className="p-1.5 hover:bg-zinc-200 rounded text-zinc-400 shrink-0">
                          <Copy size={12} />
                        </button>
                      </div>
                    )}

                    {hasEndereco && (
                      <div className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-left flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-zinc-100 shrink-0">
                          <MapPin className="text-red-500" size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-900 font-bold text-[10px] select-text truncate leading-tight">
                            {ctaEndereco}
                          </p>
                        </div>
                        <button onClick={() => handleCopy(ctaEndereco || '')} className="p-1.5 hover:bg-zinc-200 rounded text-zinc-400 shrink-0">
                          <Copy size={12} />
                        </button>
                      </div>
                    )}

                    {hasLink && (
                      <button 
                        onClick={() => window.open(ctaLink, '_blank')}
                        className="w-full py-3 bg-zinc-900 text-white font-semibold rounded-xl text-[10px] hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
                      >
                        <Rocket size={14} /> Abrir link de candidatura
                      </button>
                    )}

                    {hasPhone && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const msg = `Olá, tudo bem ?
Vivi esta vaga na SoroEmpregos.com.br
—————————————
Função: *${jobTitle}*
Código: *${jobCode || 'n/a'}*
--------------------------

Posso enviar o currículo aqui mesmo ou tem outro canal para envio ?`;
                            const encodedMsg = encodeURIComponent(msg);
                            const phone = normalizeWhatsAppNumber(ctaContato || '');
                            window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
                        }}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-100 text-xs"
                      >
                        <OfficialWhatsAppIcon size={16} />
                        <span>Contatar WhatsApp</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {advertiserName && (
                  <p className="text-zinc-400 text-[8px] font-semibold tracking-widest mt-auto pt-4 border-t border-zinc-50 w-full">
                    Vaga anunciada por {cleanAdvertiserName}
                  </p>
                )}
              </div>

              {/* Container 2: Mudar de Vida (Purple Theme) */}
              <div className="p-8 flex flex-col items-center text-center bg-purple-950 text-white">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
                  <TrendingUp className="text-orange-500" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight leading-tight">
                  Você teve 10 segundos para pensar!
                </h3>
                <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">
                  Mude de vida, nós ensinamos você a abrir seu próprio negócio.
                </p>

                <div className="w-full mt-auto">
                  <div className="relative w-full">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1.4], opacity: [0.3, 0.15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 bg-orange-400/50 rounded-xl"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMudarDeVida}
                      className="relative w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xl shadow-orange-950/40 text-base z-10"
                    >
                      <Rocket size={20} />
                      <span className="leading-tight">Quero mudar de vida.</span>
                    </motion.button>
                  </div>
                </div>
                
                <p className="mt-8 text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase">
                  SoroEmpregos exclusivo
                </p>
              </div>
            </div>
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
};
