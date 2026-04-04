import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Rocket, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { LeadCaptureModal } from './LeadCaptureModal';
import { OfficialWhatsAppIcon } from '../../ui/OfficialWhatsAppIcon';

interface GroupFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupLink: string;
  groupCity?: string;
  groupName?: string;
}

type ModalStep = 'question' | 'pitch';

export const GroupFunnelModal: React.FC<GroupFunnelModalProps> = ({ 
  isOpen, 
  onClose, 
  groupLink,
  groupCity,
  groupName
}) => {
  const [step, setStep] = useState<ModalStep>('question');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setStep('pitch');
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleJoinGroup = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    window.open(groupLink, '_blank');
    onClose();
  };

  const handleConhecerCurso = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsLeadModalOpen(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Background Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <AnimatePresence>
        {step === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-purple-950 rounded-[40px] overflow-hidden shadow-2xl border border-white/20 max-h-[85vh] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center overflow-y-auto pt-12">
              <div className="w-full aspect-[4/5] max-h-[300px] rounded-[24px] overflow-hidden mb-6 shadow-xl ring-1 ring-white/20">
                <img 
                  src="/pessoa_triste.png" 
                  alt="pessoa triste sem dinheiro"
                  className="w-full h-full object-cover grayscale brightness-75 contrast-110"
                />
              </div>

              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="space-y-4">
                  <p className="text-white/80 text-lg font-medium leading-relaxed">
                    Antes de você entrar no grupo, me responda uma coisa.
                  </p>
                  <h2 className="text-2xl font-bold text-white leading-tight tracking-tight px-4">
                    Onde você quer estar daqui <span className="text-orange-500">1 ano?</span>
                  </h2>
                </div>

                <div className="flex flex-col gap-3 w-full pt-4">
                    <button 
                        onClick={handleNextStep}
                        disabled={isTransitioning}
                        className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        Trabalhando pra alguém
                    </button>
                    <button 
                        onClick={handleNextStep}
                        disabled={isTransitioning}
                        className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <TrendingUp size={20} />
                        Trabalhando no meu negócio.
                    </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}

        {step === 'pitch' && (
          <motion.div
            key="pitch"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl border border-zinc-100 max-h-[85vh] flex flex-col z-10"
          >
            <div className="p-8 flex flex-col items-center text-center flex-1 justify-center overflow-y-auto py-12">
              <div className="w-20 h-20 bg-orange-50 rounded-[28px] flex items-center justify-center mb-8 shadow-sm ring-1 ring-orange-100">
                <Rocket className="text-orange-500" size={36} />
              </div>

              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-zinc-950 leading-tight tracking-tight">
                    Seja dono do seu <br/>
                    <span className="text-orange-500">próprio negócio.</span>
                  </h2>
                  <p className="text-zinc-600 text-base font-medium leading-relaxed">
                    Daqui 1 ano, queremos que você volte aqui na soroempregos para anunciar uma vaga do seu funcionário.
                  </p>

                  <p className="text-orange-500 text-lg font-bold italic pt-2">
                    A escolha é sua:
                  </p>
                  
                  <div className="pt-2">
                    <p className="text-zinc-500 text-xs mb-3 font-medium">
                      Temos um curso onde ensinamos você abrir o seu primeiro negócio.
                    </p>
                    <button 
                      onClick={handleConhecerCurso}
                      disabled={isTransitioning}
                      className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-black px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                    >
                      <Rocket size={18} />
                      <span>Conhecer o curso</span>
                    </button>
                  </div>
                </div>

                <div className="w-full pt-2">
                  <button 
                    onClick={handleJoinGroup}
                    disabled={isTransitioning}
                    className="w-full h-16 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <OfficialWhatsAppIcon size={24} />
                    <span>Entrar no grupo</span>
                  </button>
                  {groupCity && (
                    <p className="mt-3 text-[10px] text-zinc-400 font-medium tracking-tight">
                      Grupo exclusivo de {groupCity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-600 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
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
            onSuccess={() => {
              setIsLeadModalOpen(false);
              setIsTransitioning(false);
            }}
            fonte="grupo"
            tipo={(groupName || groupCity || 'grupo geral').toLowerCase()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
