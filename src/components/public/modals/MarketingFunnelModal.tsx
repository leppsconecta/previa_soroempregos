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
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/20 min-h-[520px] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center">
              <div className="w-full aspect-video rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop" 
                  alt="Pessoa estressada no trabalho"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-black text-white mb-3 leading-none tracking-tighter">
                  seja dono do seu <br/>
                  <span className="text-orange-500">próprio negócio</span>
                </h2>
                <p className="text-white/90 text-lg font-bold italic tracking-tight">
                  "alimente seu sonho, e não do seu patrão"
                </p>
              </motion.div>

              <div className="mt-6 flex flex-col items-center gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('exclusive')}
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2"
                >
                  enviar currículo
                  <Send size={16} />
                </motion.button>
              </div>
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
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 min-h-[520px] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center">
              <div className="w-full aspect-video rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="/real_brasileiro.png" 
                  alt="Cédulas de Real brasileiro, notas de 100, 50 e 20"
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
                <h2 className="text-2xl font-black text-white leading-[1.1] tracking-tighter">
                  nós desenvolvemos um <span className="text-orange-500">curso pra você!</span>
                </h2>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  nosso curso é exclusivo, acessível, e sem dúvidas você vai sair da condição de funcionário para ser dono do seu próprio negócio.
                </p>
              </motion.div>

              <div className="mt-8 flex flex-col items-center gap-6 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('final')}
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2"
                >
                  enviar currículo
                  <Send size={16} />
                </motion.button>

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
            className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] z-10"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
                  <Briefcase className="text-white" size={18} />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">instruções da vaga</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative shrink-0">
                <Briefcase className="text-blue-600" size={28} />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 mb-1 tracking-tight leading-none">
                {jobTitle}
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                {jobLocation} • {jobPostedAt}
              </p>

              <div className="w-full space-y-4 mb-8">
                {/* Primary CTA: WhatsApp */}
                {hasPhone && (
                  <div className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-left flex items-center gap-4 shadow-sm">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                      <OfficialWhatsAppIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {checkVisible(ctaObservationsWhatsapp) && (
                        <p className="text-zinc-500 text-[10px] mb-1 italic leading-tight">{ctaObservationsWhatsapp}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <p className="text-zinc-900 font-black text-xl select-text tracking-tight flex-1 truncate">
                          {ctaContato}
                        </p>
                        <button
                          onClick={() => handleCopy(ctaContato || '')}
                          className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-all active:scale-90 shrink-0"
                          title="Copiar número"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondaries Action - Show More */}
                {(hasPhone && (hasEmail || hasLink || hasEndereco)) && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-center gap-2 w-full py-1 text-zinc-400 hover:text-blue-600 transition-colors text-[10px] font-bold tracking-widest"
                  >
                    {isExpanded ? (
                      <>ocultar outras formas <ChevronUp size={12} /></>
                    ) : (
                      <>mais formas de enviar <ChevronDown size={12} /></>
                    )}
                  </button>
                )}

                {/* Expanded Sections */}
                <AnimatePresence>
                  {(isExpanded || !hasPhone) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {hasEmail && (
                        <div className="w-full p-3 bg-zinc-50/50 border border-zinc-100 rounded-xl text-left">
                          <div className="flex items-center gap-2 mb-1.5 opacity-50">
                            <Mail size={12} className="text-blue-500" />
                            <span className="text-[8px] font-black tracking-widest">e-mail</span>
                          </div>
                          {checkVisible(ctaObservationsEmail) && (
                            <p className="text-zinc-500 text-[10px] mb-1 italic">{ctaObservationsEmail}</p>
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-zinc-900 font-bold text-xs select-text truncate flex-1">
                              {ctaEmail}
                            </p>
                            <button onClick={() => handleCopy(ctaEmail || '')} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 shrink-0">
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>
                      )}

                      {hasEndereco && (
                        <div className="w-full p-3 bg-zinc-50/50 border border-zinc-100 rounded-xl text-left">
                          <div className="flex items-center gap-2 mb-1.5 opacity-50">
                            <MapPin size={12} className="text-red-500" />
                            <span className="text-[8px] font-black tracking-widest">endereço</span>
                          </div>
                          {checkVisible(ctaObservationsEndereco) && (
                            <p className="text-zinc-500 text-[10px] mb-1 italic">{ctaObservationsEndereco}</p>
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-zinc-900 font-bold text-xs select-text truncate flex-1 leading-tight">
                              {ctaEndereco}
                            </p>
                            <button onClick={() => handleCopy(ctaEndereco || '')} className="p-1 hover:bg-zinc-200 rounded text-zinc-400 shrink-0">
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>
                      )}

                      {hasLink && (
                        <div className="w-full p-3 bg-zinc-50/50 border border-zinc-100 rounded-xl text-left">
                          <div className="flex items-center gap-2 mb-1.5 opacity-50">
                            <Rocket size={12} className="text-purple-500" />
                            <span className="text-[8px] font-black tracking-widest">link externo</span>
                          </div>
                          {checkVisible(ctaObservationsLink) && (
                            <p className="text-zinc-500 text-[10px] mb-1 italic">{ctaObservationsLink}</p>
                          )}
                          <button 
                            onClick={() => window.open(ctaLink, '_blank')}
                            className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-[10px] hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            abrir link de candidatura
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full flex flex-col gap-3 mt-auto">
                {hasPhone && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        const msg = `Olá, tudo bem ?
Vi esta vaga na SoroEmpregos.com.br
—————————————
Função: *${jobTitle}*
Código: *${jobCode || 'N/A'}*
--------------------------

posso enviar o currículo aqui mesmo ou tem outro canal para envio ?`;
                        
                        const encodedMsg = encodeURIComponent(msg);
                        const phone = normalizeWhatsAppNumber(ctaContato || '');
                        window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
                    }}
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-green-100 text-sm"
                  >
                    <OfficialWhatsAppIcon size={18} />
                    <span className="leading-tight">enviar currículo via whatsapp</span>
                  </motion.button>
                )}

                <div className="relative group w-full">
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1.4],
                      opacity: [0.5, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 bg-orange-400 rounded-xl"
                  />
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    onClick={handleMudarDeVida}
                    className="relative w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/40 text-sm z-10"
                  >
                    <TrendingUp size={18} />
                    <span className="leading-tight">quero mudar de vida agora</span>
                  </motion.button>
                </div>
              </div>

              {advertiserName && (
                <p className="mt-8 text-zinc-400 text-[8px] font-black uppercase tracking-widest select-none pointer-events-none opacity-40">
                  vaga anunciada por {cleanAdvertiserName}
                </p>
              )}
            </div>
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
};
